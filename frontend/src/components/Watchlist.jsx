import React, { useEffect, useState } from "react";

function Watchlist() {
  const [stocks, setStocks] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadWatchlist = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/watchlist");
      if (!res.ok) throw new Error("Failed to load watchlist");
      const data = await res.json();
      setStocks(data);
    } catch (e) {
      console.error(e);
      setError("Error loading watchlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");

    if (!symbol || !name) {
      setError("Symbol and name are required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol,
          name,
          sector,
          lastPrice: price ? parseFloat(price) : 0,
        }),
      });
      if (!res.ok) throw new Error("Failed to add stock");
      setSymbol("");
      setName("");
      setSector("");
      setPrice("");
      await loadWatchlist();
    } catch (e) {
      console.error(e);
      setError("Error adding stock");
    }
  };

  const handleRemove = async (sym) => {
    try {
      await fetch(`http://localhost:8080/api/watchlist/${sym}`, {
        method: "DELETE",
      });
      await loadWatchlist();
    } catch (e) {
      console.error(e);
      setError("Error removing stock");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Watchlist</h1>

        <form
          onSubmit={handleAdd}
          className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 grid grid-cols-1 md:grid-cols-5 gap-3"
        >
          <input
            className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
            placeholder="Symbol (e.g. TCS)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
          <input
            className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
            placeholder="Sector"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          />
          <input
            type="number"
            className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
            placeholder="Last price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold text-sm"
          >
            Add / Update
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-400 bg-red-950/60 border border-red-800 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-200">
              <tr>
                <th className="px-4 py-2 text-left">Symbol</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Sector</th>
                <th className="px-4 py-2 text-right">Last Price</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-4 text-center text-slate-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : stocks.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-4 text-center text-slate-400"
                  >
                    No stocks in watchlist yet.
                  </td>
                </tr>
              ) : (
                stocks.map((s) => (
                  <tr
                    key={s.symbol}
                    className="border-t border-slate-800 hover:bg-slate-800/60"
                  >
                    <td className="px-4 py-2 font-semibold">{s.symbol}</td>
                    <td className="px-4 py-2">{s.name}</td>
                    <td className="px-4 py-2">{s.sector}</td>
                    <td className="px-4 py-2 text-right">
                      {s.lastPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => handleRemove(s.symbol)}
                        className="text-xs text-red-300 hover:text-red-200"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Watchlist;
