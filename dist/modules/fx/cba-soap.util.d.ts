/**
 * CBA (Central Bank of Armenia) public SOAP API — used to extend the currency list
 * with official AMD-per-unit values, scaled to the same USD/AMD anchor as the bank aggregate.
 */
export type CbaExchangeEntry = {
    iso: string;
    amount: number;
    rate: number;
};
export declare function fetchCbaExchangeRatesLatest(): Promise<{
    currentDate: string;
    rates: CbaExchangeEntry[];
}>;
/** AMD for one natural unit of `iso` (1 USD, 1 EUR, 10 JPY → per 1 JPY if Amount=10). */
export declare function cbaAmdPerOneUnit(e: CbaExchangeEntry): number;
export declare function cbaAmdForUsd(cba: CbaExchangeEntry[]): number;
