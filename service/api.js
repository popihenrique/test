export const api = {
  url: "../data.json",
  fetchData: async () => {
    const r = await fetch(api.url);
    return await r.json();
  },
};
