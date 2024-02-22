export type history = {
  Close: number;
  High: number;
  Low: number;
  Open: number;
  Time: number;
  Volume: string;
};

export type getHistoryPairsResponse = history[];

export type getHistoryPairsRequest = {
  selectedCurrency: string;
};
export const getHistoryPairs: (
  req: getHistoryPairsRequest,
) => Promise<getHistoryPairsResponse> = async (req) => {
  try {
    const now = Date.now();
    const unixTimeNow = Math.floor(now / 1000);
    const threeDaysAgo = unixTimeNow - 1 * 24 * 60 * 60;
    const response = await fetch(
      `https://indodax.com/tradingview/history_v2?symbol=${req.selectedCurrency}&tf=15&from=${threeDaysAgo}&to=${unixTimeNow}`,
    );
    if (!response.ok) throw new Error('Network response was not ok');

    return response.json();
  } catch (error) {
    console.error('Failed to fetch currency pairs:', error);
  }
};
