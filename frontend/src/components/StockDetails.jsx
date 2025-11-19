// src/components/StockDetails.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function StockDetails() {
  const { symbol } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [range, setRange] = useState(60); // days

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({ limit: String(range) }).toString();
        const res = await fetch(
          `http://localhost:8080/api/stocks/${symbol}/daily?${params}`
        );
        if (!res.ok) throw new Error("Failed to load price history");
        const json = await res.json();

        const transformed = json.map((p) => ({
          date: p.date,
          close: p.close,
        }));

        setData(transformed);
      } catch (e) {
        console.error(e);
        setError("Error loading price history");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, range]);

  // basic stats derived from data
  const stats = useMemo(() => {
    if (data.length < 2) {
      return null;
    }

    const closes = data.map((d) => d.close);
    const firstClose = closes[0];
    const lastClose = closes[closes.length - 1];

    const changeAbs = lastClose - firstClose;
    const changePct = (changeAbs / firstClose) * 100;

    // daily returns for simple volatility proxy
    const returns = [];
    for (let i = 1; i < closes.length; i++) {
      const r = (closes[i] - closes[i - 1]) / closes[i - 1];
      returns.push(r);
    }
    const mean =
      returns.reduce((sum, r) => sum + r, 0) / (returns.length || 1);
    const variance =
      returns.reduce((sum, r) => sum + (r - mean) * (r - mean), 0) /
      (returns.length || 1);
    const stdDev = Math.sqrt(variance);

    let volatilityLabel = "Low";
    if (stdDev > 0.03) {
      volatilityLabel = "High";
    } else if (stdDev > 0.015) {
      volatilityLabel = "Medium";
    }

    // min/max
    const minClose = Math.min(...closes);
    const maxClose = Math.max(...closes);

    return {
      firstClose,
      lastClose,
      changeAbs,
      changePct,
      volatilityLabel,
      minClose,
      maxClose,
    };
  }, [data]);

  const lastPoint = data.length > 0 ? data[data.length - 1] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/watchlist"
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              ← Back to watchlist
            </Link>
            <div>
              <div className="text-lg font-semibold">
                {symbol.toUpperCase()}
              </div>
              <div className="text-xs text-slate-400">
                NSE • Demo data via Alpha Vantage
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-semibold">
              {lastPoint ? lastPoint.close.toFixed(2) : "--"}
            </div>
            <div className="text-xs text-emerald-400">
              End of day close (demo)
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-950/60 border border-red-800 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        {/* Range buttons */}
        <div className="flex gap-2 text-xs">
          {[30, 60, 120, 250].map((days) => (
            <button
              key={days}
              onClick={() => setRange(days)}
              className={`px-3 py-1 rounded-full border ${
                range === days
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                  : "border-slate-700 bg-slate-900 text-slate-300"
              }`}
            >
              {days === 30 && "1M"}
              {days === 60 && "2M"}
              {days === 120 && "6M"}
              {days === 250 && "1Y"}
            </button>
          ))}
        </div>

        {/* Chart */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 h-[380px]">
          {loading ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              Loading chart...
            </div>
          ) : data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              No data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1f2937"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={{ stroke: "#4b5563" }}
                  minTickGap={20}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={{ stroke: "#4b5563" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #1f2937",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                    color: "#e5e7eb",
                  }}
                  labelStyle={{ color: "#9ca3af" }}
                  formatter={(value) => [value.toFixed(2), "Close"]}
                />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#fb923c"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </section>

        {/* Demo analysis section */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
          <h2 className="text-sm font-semibold">Price behaviour (demo)</h2>

          {stats ? (
            <>
              <p className="text-xs text-slate-300">
                Over the last {range} trading days this stock moved from{" "}
                {stats.firstClose.toFixed(2)} to{" "}
                {stats.lastClose.toFixed(2)}, a change of{" "}
                {stats.changeAbs >= 0 ? "+" : ""}
                {stats.changeAbs.toFixed(2)} (
                {stats.changePct >= 0 ? "+" : ""}
                {stats.changePct.toFixed(2)}%).
              </p>
              <p className="text-xs text-slate-300">
                The lowest close in this period was{" "}
                {stats.minClose.toFixed(2)} and the highest close was{" "}
                {stats.maxClose.toFixed(2)}. Volatility based on daily
                percentage changes is classified as{" "}
                <span className="text-emerald-300">
                  {stats.volatilityLabel}
                </span>
                .
              </p>
            </>
          ) : (
            <p className="text-xs text-slate-400">
              Not enough data points to summarise recent price behaviour.
            </p>
          )}

          <p className="text-[11px] text-slate-500">
            This section is for learning only and does not tell you whether to
            buy or sell. Always consider fundamentals, news, and your own risk
            tolerance before making investment decisions.
          </p>
        </section>
      </div>
    </div>
  );
}

export default StockDetails;
