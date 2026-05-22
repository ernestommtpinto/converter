const CurrencyAPI = {
  async getRate(from, to, amount = 1) {
    const endpoints = [
      {
        name: "ExchangeRate.host",
        url: `https://api.exchangerate.host/convert?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${encodeURIComponent(amount)}`,
        parse: data => {
          if (typeof data.result === "number") {
            return {
              result: data.result,
              rate: data.info && typeof data.info.quote === "number" ? data.info.quote : data.result / amount
            };
          }
          return null;
        }
      },
      {
        name: "Open ER API",
        url: `https://open.er-api.com/v6/latest/${encodeURIComponent(from)}`,
        parse: data => {
          const rate = data.rates && data.rates[to];
          if (typeof rate === "number") {
            return {
              result: amount * rate,
              rate
            };
          }
          return null;
        }
      }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url, { cache: "no-store" });
        if (!response.ok) throw new Error(endpoint.name);

        const data = await response.json();
        const parsed = endpoint.parse(data);

        if (parsed && typeof parsed.result === "number") {
          return { ...parsed, source: endpoint.name };
        }
      } catch (error) {
        console.warn(error);
      }
    }

    throw new Error("Currency API unavailable");
  }
};
