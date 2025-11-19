import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const [limit, setLimit] = useState(60);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const params = new URLSearchParams({ limit: String(limit) }).toString();
        const res = await fetch(
          `http://localhost:8080/api/stocks/${symbol}/daily?${params}`
        );
        if (!res.ok) throw new Error("Failed to load price history");
        const json = await res.json();

        // Transform date to a shorter label if needed
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
  }, [symbol, limit]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-2xl font-semibold">
            {symbol.toUpperCase()} – Price chart
          </h1>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Range:</span>
            <button
              onClick={() => setLimit(30)}
              className={`px-2 py-1 rounded-md border text-xs ${
                limit === 30
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                  : "border-slate-700 bg-slate-900 text-slate-300"
              }`}
            >
              30 days
            </button>
            <button
              onClick={() => setLimit(60)}
              className={`px-2 py-1 rounded-md border text-xs ${
                limit === 60
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                  : "border-slate-700 bg-slate-900 text-slate-300"
              }`}
            >
              60 days
            </button>
            <button
              onClick={() => setLimit(120)}
              className={`px-2 py-1 rounded-md border text-xs ${
                limit === 120
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                  : "border-slate-700 bg-slate-900 text-slate-300"
              }`}
            >
              120 days
            </button>
          </div>
        </header>

        {error && (
          <p className="text-sm text-red-400 bg-red-950/60 border border-red-800 rounded-md px-3 py-2">
            {error}
          </p>
        )}

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
                />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#34d399"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </section>
      </div>
    </div>
  );
}

export default StockDetails;
