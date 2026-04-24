"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FxService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FxService = void 0;
const common_1 = require("@nestjs/common");
const cba_soap_util_1 = require("./cba-soap.util");
const rate_am_banks_util_1 = require("./rate-am-banks.util");
const CACHE_MS = 5 * 60 * 1000;
let cache = null;
/** Display order: common bank pairs + AMD. */
const DISPLAY = [
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
let FxService = FxService_1 = class FxService {
    log = new common_1.Logger(FxService_1.name);
    async getBankFxRates() {
        if (cache && Date.now() - cache.at < CACHE_MS) {
            return cache.data;
        }
        const data = await this.build();
        cache = { at: Date.now(), data };
        return data;
    }
    async build() {
        const cba = await (0, cba_soap_util_1.fetchCbaExchangeRatesLatest)();
        const cbaByIso = new Map(cba.rates.map((r) => [r.iso, r]));
        const cbaUsd = (0, cba_soap_util_1.cbaAmdForUsd)(cba.rates);
        let rateAm = null;
        try {
            rateAm = await (0, rate_am_banks_util_1.fetchRateAmBanksAverages)();
        }
        catch (e) {
            this.log.warn(`Bank rates page: ${e.message}`);
        }
        const usdMid = rateAm?.usd.mid ?? null;
        const scale = usdMid && cbaUsd > 0 ? usdMid / cbaUsd : 1;
        const rates = [];
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
            const per = (0, cba_soap_util_1.cbaAmdPerOneUnit)(cbaE) * scale;
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
                        midAmdPerUnit: (0, cba_soap_util_1.cbaAmdPerOneUnit)(u)
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
                        midAmdPerUnit: (0, cba_soap_util_1.cbaAmdPerOneUnit)(e)
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
                        midAmdPerUnit: (0, cba_soap_util_1.cbaAmdPerOneUnit)(r)
                    };
                }
            }
        }
        const sourceNote = rateAm != null
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
};
exports.FxService = FxService;
exports.FxService = FxService = FxService_1 = __decorate([
    (0, common_1.Injectable)()
], FxService);
//# sourceMappingURL=fx.service.js.map