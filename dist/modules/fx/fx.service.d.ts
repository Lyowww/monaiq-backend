import { type RateAmBanksRow } from './rate-am-banks.util';
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
export declare class FxService {
    private readonly log;
    getBankFxRates(): Promise<BankFxRatesResponse>;
    private build;
}
