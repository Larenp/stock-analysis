import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-[calc(100vh-112px)] bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold text-slate-50">
            Welcome to MiniGrow
          </h1>
          <p className="text-slate-300 max-w-2xl text-sm">
            Track stocks, estimate returns, and build a simple watchlist using
            live market data. This is your mini version of Groww for learning
            full‑stack development.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Link
            to="/returns"
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 hover:border-emerald-500 transition"
          >
            <h2 className="text-sm font-semibold mb-2">Returns Calculator</h2>
            <p className="text-xs text-slate-300">
              See what your investments could grow to over time with simple
              compound‑interest projections.
            </p>
          </Link>

          <Link
            to="/watchlist"
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 hover:border-emerald-500 transition"
          >
            <h2 className="text-sm font-semibold mb-2">Stock Watchlist</h2>
            <p className="text-xs text-slate-300">
              Search for stocks and keep track of the ones you care about in
              one place.
            </p>
          </Link>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 opacity-70">
            <h2 className="text-sm font-semibold mb-2">AI Assistant (coming)</h2>
            <p className="text-xs text-slate-300">
              Soon you&apos;ll be able to chat with an AI about your portfolio,
              goals, and stock ideas.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
