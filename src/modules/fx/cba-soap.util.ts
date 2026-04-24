/**
 * CBA (Central Bank of Armenia) public SOAP API — used to extend the currency list
 * with official AMD-per-unit values, scaled to the same USD/AMD anchor as the bank aggregate.
 */
export type CbaExchangeEntry = {
  iso: string;
  amount: number;
  rate: number;
};

const SOAP_BODY = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
<ExchangeRatesLatest xmlns="http://www.cba.am/" />
</soap:Body>
</soap:Envelope>`;

export async function fetchCbaExchangeRatesLatest(): Promise<{
  currentDate: string;
  rates: CbaExchangeEntry[];
}> {
  const res = await fetch('https://api.cba.am/exchangerates.asmx', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'http://www.cba.am/ExchangeRatesLatest'
    },
    body: SOAP_BODY
  });

  if (!res.ok) {
    throw new Error(`CBA exchange rates HTTP ${res.status}`);
  }

  const xml = await res.text();
  const currentMatch = xml.match(/<CurrentDate>([^<]+)<\/CurrentDate>/);
  const currentDate = currentMatch?.[1] ?? new Date().toISOString();

  const rates: CbaExchangeEntry[] = [];
  const block = xml.match(/<Rates>([\s\S]*?)<\/Rates>/);
  if (!block?.[1]) {
    return { currentDate, rates: [] };
  }

  const rowRe = /<ExchangeRate>[\s\S]*?<\/ExchangeRate>/g;
  for (const row of block[1].match(rowRe) ?? []) {
    const iso = row.match(/<ISO>([^<]+)<\/ISO>/)?.[1];
    const am = row.match(/<Amount>([^<]+)<\/Amount>/)?.[1];
    const r = row.match(/<Rate>([^<]+)<\/Rate>/)?.[1];
    if (!iso || !am || !r) {
      continue;
    }
    const amount = Number(am);
    const rate = Number(r);
    if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(rate) || rate <= 0) {
      continue;
    }
    rates.push({ iso, amount, rate });
  }

  return { currentDate, rates };
}

/** AMD for one natural unit of `iso` (1 USD, 1 EUR, 10 JPY → per 1 JPY if Amount=10). */
export function cbaAmdPerOneUnit(e: CbaExchangeEntry): number {
  return e.rate / e.amount;
}

export function cbaAmdForUsd(cba: CbaExchangeEntry[]): number {
  const u = cba.find((r) => r.iso === 'USD');
  if (!u) {
    return 0;
  }
  return cbaAmdPerOneUnit(u);
}
