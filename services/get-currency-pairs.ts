export type  pair = {
  id:string,
  url_logo_png:string,
  description:string
}

export type getCurrencyPairsResponse = pair[]
export const getCurrencyPairs:() => Promise<getCurrencyPairsResponse> = async () => {
  try {
    const response = await fetch('https://indodax.com/api/pairs');
    if (!response.ok) throw new Error('Network response was not ok');

    return response.json();
  } catch (error) {
    console.error('Failed to fetch currency pairs:', error);
  }
};