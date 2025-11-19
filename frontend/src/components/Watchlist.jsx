import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Watchlist() {
  const [stocks, setStocks] = useState([]);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [error, setError] = useState("");
  const [refreshLoading, setRefreshLoading] = useState(false);

  const loadWatchlist = async () => {
    try {
      setLoadingWatchlist(true);
      const res = await fetch("http://localhost:8080/api/watchlist");
      if (!res.ok) throw new Error("Failed to load watchlist");
      const data = await res.json();
      setStocks(data);
    } catch (e) {
      console.error(e);
      setError("Error loading watchlist");
    } finally {
      setLoadingWatchlist(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError("");
    setSearchResults([]);

    if (!searchQuery.trim()) {
      setSearchError("Type at least one character to search.");
      return;
    }

    try {
      setSearchLoading(true);
      const params = new URLSearchParams({ query: searchQuery }).toString();
      const res = await fetch(
        `http://localhost:8080/api/stocks/search?${params}`
      );
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error(err);
      setSearchError("Error searching stocks");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddFromSearch = async (result) => {
    try {
      setError("");
      const res = await fetch("http://localhost:8080/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: result.symbol,
          name: result.name,
          sector: result.region, // temporary placeholder
          lastPrice: 0,
        }),
      });
      if (!res.ok) throw new Error("Failed to add to watchlist");
      await loadWatchlist();
    } catch (e) {
      console.error(e);
      setError("Error adding stock to watchlist");
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

  const handleRefreshPrices = async () => {
    try {
      setRefreshLoading(true);
      setError("");
      const res = await fetch(
        "http://localhost:8080/api/watchlist/refresh-prices",
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Failed to refresh prices");
      const data = await res.json();
      setStocks(data);
    } catch (e) {
      console.error(e);
      setError("Error refreshing prices");
    } finally {
      setRefreshLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Watchlist</h1>

        {/* Search section */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-3"
          >
            <input
              className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
              placeholder="Search stocks by symbol or name (e.g. INFY, TCS, Apple)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold text-sm px-4 py-2"
            >
              {searchLoading ? "Searching..." : "Search"}
            </button>
          </form>

          {searchError && (
            <p className="text-xs text-red-400 bg-red-950/60 border border-red-800 rounded-md px-3 py-2">
              {searchError}
            </p>
          )}

          <div className="max-h-64 overflow-y-auto border border-slate-800 rounded-lg">
            {searchLoading ? (
              <div className="px-4 py-3 text-sm text-slate-400">
                Searching...
              </div>
            ) : searchResults.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-500">
                No search results yet.
              </div>
            ) : (
              <table className="min-w-full text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-left">Symbol</th>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Region</th>
                    <th className="px-3 py-2 text-left">Currency</th>
                    <th className="px-3 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((r) => (
                    <tr
                      key={r.symbol}
                      className="border-t border-slate-800 hover:bg-slate-800/60"
                    >
                      <td className="px-3 py-2 font-semibold">{r.symbol}</td>
                      <td className="px-3 py-2">{r.name}</td>
                      <td className="px-3 py-2">{r.region}</td>
                      <td className="px-3 py-2">{r.currency}</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => handleAddFromSearch(r)}
                          className="text-[11px] text-emerald-300 hover:text-emerald-200"
                        >
                          + Add to watchlist
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {error && (
          <p className="text-sm text-red-400 bg-red-950/60 border border-red-800 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        {/* Watchlist table */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-sm font-semibold">Your watchlist</span>
            <button
              onClick={handleRefreshPrices}
              className="text-xs rounded-md border border-emerald-500 px-3 py-1 text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-50"
              disabled={refreshLoading}
            >
              {refreshLoading ? "Refreshing..." : "Refresh prices"}
            </button>
          </div>
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
              {loadingWatchlist ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-4 text-center text-slate-400"
                  >
                    Loading watchlist...
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
                    <td className="px-4 py-2 font-semibold">
                      <Link
                        to={`/stocks/${s.symbol}`}
                        className="text-emerald-300 hover:text-emerald-200"
                      >
                        {s.symbol}
                      </Link>
                    </td>
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
        </section>
      </div>
    </div>
  );
}

export default Watchlist;
