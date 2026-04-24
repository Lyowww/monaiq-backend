export type TripletMid = {
    buy: number;
    sell: number;
    mid: number;
};
export type RateAmBanksRow = {
    usd: TripletMid;
    eur: TripletMid;
    rub: TripletMid;
};
/**
 * Parses the public Armenian "banks" FX page HTML. Uses the first table row with ≥3 "font-bold"
 * markers: market-middle buy/sell for USD, EUR, RUB. Fetch URL is the standard `/hy/.../banks` path.
 */
export declare function parseRateAmBanksAveragesFromHtml(html: string): RateAmBanksRow | null;
export declare function fetchRateAmBanksPageHtml(path?: string): Promise<string>;
export declare function fetchRateAmBanksAverages(): Promise<RateAmBanksRow | null>;
