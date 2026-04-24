import { Injectable, Logger } from '@nestjs/common';
import {
  cbaAmdForUsd,
  cbaAmdPerOneUnit,
  fetchCbaExchangeRatesLatest
} from './cba-soap.util';
import { fetchRateAmBanksAverages, type RateAmBanksRow } from './rate-am-banks.util';

export type BankFxRateItem = {
  code: string;
  fromRateAm: boolean;
  buyAmd: number | null;
  sellAmd: number | null;
  midAmdPerUnit: number;
};

export type BankFxRatesResponse = {
  asOf: string;
  usdAmdFromCba: number;
  usdAmdFromRateAmMid: number | null;
  rateAm: RateAmBanksRow | null;
  rates: BankFxRateItem[];
  sourceNote: string;
};

const CACHE_MS = 5 * 60 * 1000;
let cache: { at: number; data: BankFxRatesResponse } | null = null;

/** Display order: common bank pairs + AMD. */
const DISPLAY: Array<{ code: string; cbaIso: string }> = [
  { code: 'AMD', cbaIso: '' },
  { code: 'USD', cbaIso: 'USD' },
  { code: 'EUR', cbaIso: 'EUR' },
  { code: 'GBP', cbaIso: 'GBP' },
  { code: 'RUB', cbaIso: 'RUB' },
  { code: 'CHF', cbaIso: 'CHF' },
  { code: 'JPY', cbaIso: 'JPY' },
  { code: 'AED', cbaIso: 'AED' },
  { code: 'CNY', cbaIso: 'CNY' }
];

@Injectable()
export class FxService {
  private readonly log = new Logger(FxService.name);

  async getBankFxRates(): Promise<BankFxRatesResponse> {
    if (cache && Date.now() - cache.at < CACHE_MS) {
      return cache.data;
    }
    const data = await this.build();
    cache = { at: Date.now(), data };
    return data;
  }

  private async build(): Promise<BankFxRatesResponse> {
    const cba = await fetchCbaExchangeRatesLatest();
    const cbaByIso = new Map(cba.rates.map((r) => [r.iso, r] as const));
    const cbaUsd = cbaAmdForUsd(cba.rates);

    let rateAm: RateAmBanksRow | null = null;
    try {
      rateAm = await fetchRateAmBanksAverages();
    } catch (e) {
      this.log.warn(`Bank rates page: ${(e as Error).message}`);
    }

    const usdMid = rateAm?.usd.mid ?? null;
    const scale = usdMid && cbaUsd > 0 ? usdMid / cbaUsd : 1;

    const rates: BankFxRateItem[] = [];

    for (const row of DISPLAY) {
      if (row.code === 'AMD') {
        rates.push({
          code: 'AMD',
          fromRateAm: false,
          buyAmd: 1,
          sellAmd: 1,
          midAmdPerUnit: 1
        });
        continue;
      }

      const cbaE = cbaByIso.get(row.cbaIso);
      if (!cbaE) {
        continue;
      }

      if (row.code === 'USD' && rateAm) {
        rates.push({
          code: 'USD',
          fromRateAm: true,
          buyAmd: rateAm.usd.buy,
          sellAmd: rateAm.usd.sell,
          midAmdPerUnit: rateAm.usd.mid
        });
        continue;
      }
      if (row.code === 'EUR' && rateAm) {
        rates.push({
          code: 'EUR',
          fromRateAm: true,
          buyAmd: rateAm.eur.buy,
          sellAmd: rateAm.eur.sell,
          midAmdPerUnit: rateAm.eur.mid
        });
        continue;
      }
      if (row.code === 'RUB' && rateAm) {
        rates.push({
          code: 'RUB',
          fromRateAm: true,
          buyAmd: rateAm.rub.buy,
          sellAmd: rateAm.rub.sell,
          midAmdPerUnit: rateAm.rub.mid
        });
        continue;
      }

      const per = cbaAmdPerOneUnit(cbaE) * scale;
      rates.push({
        code: row.code,
        fromRateAm: false,
        buyAmd: null,
        sellAmd: null,
        midAmdPerUnit: per
      });
    }

    if (!rateAm) {
      const u = cbaByIso.get('USD');
      if (u) {
        const i = rates.findIndex((r) => r.code === 'USD');
        if (i >= 0) {
          rates[i] = {
            code: 'USD',
            fromRateAm: false,
            buyAmd: null,
            sellAmd: null,
            midAmdPerUnit: cbaAmdPerOneUnit(u)
          };
        }
      }
      const e = cbaByIso.get('EUR');
      if (e) {
        const i = rates.findIndex((r) => r.code === 'EUR');
        if (i >= 0) {
          rates[i] = {
            code: 'EUR',
            fromRateAm: false,
            buyAmd: null,
            sellAmd: null,
            midAmdPerUnit: cbaAmdPerOneUnit(e)
          };
        }
      }
      const r = cbaByIso.get('RUB');
      if (r) {
        const i = rates.findIndex((x) => x.code === 'RUB');
        if (i >= 0) {
          rates[i] = {
            code: 'RUB',
            fromRateAm: false,
            buyAmd: null,
            sellAmd: null,
            midAmdPerUnit: cbaAmdPerOneUnit(r)
          };
        }
      }
    }

    const sourceNote =
      rateAm != null
        ? 'USD, EUR, RUB: aggregated bank market middle. Other pairs: official reference rates, scaled to the same USD/AMD level.'
        : 'Aggregated bank middle unavailable; all values use official reference (CBA) rates.';

    return {
      asOf: cba.currentDate,
      usdAmdFromCba: cbaUsd,
      usdAmdFromRateAmMid: usdMid,
      rateAm,
      rates,
      sourceNote
    };
  }
}
