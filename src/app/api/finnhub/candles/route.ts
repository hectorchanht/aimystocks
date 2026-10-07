import { NextRequest, NextResponse } from 'next/server';

// Cache route responses for 1h (upstream rate-limits aggressive clients)
export const revalidate = 3600;

// Free, keyless candle source: Yahoo Finance chart API.
// (Finnhub's free API keys no longer include /stock/candle — 403 "no access".)
// Returns the same { s, t, o, h, l, c, v } shape as Finnhub /stock/candle,
// so the frontend needs no changes.
const YAHOO_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

const INTERVAL: Record<string, string> = { D: '1d', W: '1wk', M: '1mo' };

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const resolution = (searchParams.get('resolution') || 'D').toUpperCase();
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!symbol || !from || !to) {
      return NextResponse.json(
        { error: 'Missing required parameters: symbol, from, to' },
        { status: 400 }
      );
    }

    const interval = INTERVAL[resolution] ?? '1d';
    const url = `${YAHOO_URL}/${encodeURIComponent(symbol)}?interval=${interval}&period1=${from}&period2=${to}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Chart data unavailable (upstream ${response.status})` },
        { status: 502 }
      );
    }

    const json = await response.json();
    const result = json?.chart?.result?.[0];
    const quote = result?.indicators?.quote?.[0];

    if (!result || !quote || !Array.isArray(result.timestamp)) {
      return NextResponse.json(
        {
          error:
            json?.chart?.error?.description ||
            'No candle data available for this symbol',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      s: 'ok',
      t: result.timestamp,
      o: quote.open ?? [],
      h: quote.high ?? [],
      l: quote.low ?? [],
      c: quote.close ?? [],
      v: quote.volume ?? [],
    });
  } catch (error) {
    console.error('Candles API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
