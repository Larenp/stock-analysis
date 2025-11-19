// frontend/src/components/ReturnsCalculator.jsx
import React, { useState } from "react";

function ReturnsCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!principal || !rate || !years) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({
        principal,
        annualRate: rate,
        years,
      }).toString();

      const res = await fetch(
        `http://localhost:8080/api/returns/calculate?${params}`
      );

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Error calling backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-semibold mb-4 text-slate-50">
          Stock Analysis – Returns Calculator
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Amount to invest (₹)
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. 50000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">
                Expected annual return (%)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. 12"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">
                Years to invest
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. 10"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-950/60 border border-red-800 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold py-2.5 transition disabled:opacity-60"
          >
            {loading ? "Calculating..." : "Calculate"}
          </button>
        </form>

        {result && (
          <div className="mt-6 border-t border-slate-800 pt-4 space-y-1">
            <p className="text-sm text-slate-300">
              Invested: <span className="font-semibold">₹{result.principal.toFixed(2)}</span>
            </p>
            <p className="text-sm text-slate-300">
              Years: <span className="font-semibold">{result.years}</span> at{" "}
              <span className="font-semibold">{result.annualRate}%</span> p.a.
            </p>
            <p className="text-sm text-emerald-400">
              Future value:{" "}
              <span className="font-semibold">
                ₹{result.futureValue.toFixed(2)}
              </span>
            </p>
            <p className="text-sm text-emerald-300">
              Total gain:{" "}
              <span className="font-semibold">
                ₹{result.totalGain.toFixed(2)}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReturnsCalculator;
