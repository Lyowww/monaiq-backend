import { Logger } from '@nestjs/common';

const RATE_TABLE_MARKER = 'rateTable';
const ROW_SPLIT = 'border-b border-b-N40 ';
const CELL_RE =
  /<div class="relative (?:flex z-1|z-1 flex) items-center h-full">([0-9.]+)<\/div>/g;

const logger = new Logger('RateAmBanksUtil');

export type TripletMid = { buy: number; sell: number; mid: number };

export type RateAmBanksRow = {
  usd: TripletMid;
  eur: TripletMid;
  rub: TripletMid;
};

function parseNumber(s: string): number {
  return Number(s.replace(/,/g, ''));
}

/** Maps six cells (USD, EUR, RUR buy/sell) to three triplets. */
function tripletsFromRow(nums: string[]): RateAmBanksRow | null {
  if (nums.length < 6) {
    return null;
  }
  const n = nums.map((x) => parseNumber(x));
  if (n.slice(0, 6).some((x) => !Number.isFinite(x) || x <= 0)) {
    return null;
  }
  const usd: TripletMid = { buy: n[0]!, sell: n[1]!, mid: (n[0]! + n[1]!) / 2 };
  const eur: TripletMid = { buy: n[2]!, sell: n[3]!, mid: (n[2]! + n[3]!) / 2 };
  const rub: TripletMid = { buy: n[4]!, sell: n[5]!, mid: (n[4]! + n[5]!) / 2 };
  if (usd.buy < 200 || usd.buy > 800) {
    return null;
  }
  if (eur.buy < 200 || eur.buy > 800) {
    return null;
  }
  if (rub.mid > 30) {
    return null;
  }
  return { usd, eur, rub };
}

/**
 * Parses the public Armenian "banks" FX page HTML. Uses the first table row with ≥3 "font-bold"
 * markers: market-middle buy/sell for USD, EUR, RUB. Fetch URL is the standard `/hy/.../banks` path.
 */
export function parseRateAmBanksAveragesFromHtml(html: string): RateAmBanksRow | null {
  const i = html.indexOf(RATE_TABLE_MARKER);
  if (i < 0) {
    return null;
  }
  const sub = html.slice(i, i + 400_000);
  const parts = sub.split(ROW_SPLIT);
  for (const p of parts) {
    const bolds = p.match(/font-bold/g);
    if (!bolds || bolds.length < 3) {
      continue;
    }
    const nums: string[] = [];
    for (const m of p.matchAll(CELL_RE)) {
      nums.push(m[1]!);
    }
    if (nums.length < 6) {
      continue;
    }
    const t = tripletsFromRow(nums.slice(0, 6));
    if (t) {
      return t;
    }
  }
  return null;
}

export async function fetchRateAmBanksPageHtml(
  path = '/hy/armenian-dram-exchange-rates/banks'
): Promise<string> {
  const base = 'https://www.rate.am';
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; AIFinanceHelper/1.0; +https://github.com) AppleWebKit/537.36',
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'hy,en;q=0.9'
    }
  });
  if (!res.ok) {
    throw new Error(`Bank rates page fetch HTTP ${res.status}`);
  }
  return res.text();
}

export async function fetchRateAmBanksAverages(): Promise<RateAmBanksRow | null> {
  try {
    const html = await fetchRateAmBanksPageHtml();
    return parseRateAmBanksAveragesFromHtml(html);
  } catch (e) {
    logger.warn(`Bank rates parse/fetch: ${(e as Error).message}`);
    return null;
  }
}
