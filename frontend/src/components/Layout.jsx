import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold">
            MiniGrow
          </Link>
          <nav className="flex gap-4 text-sm">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `hover:text-emerald-400 ${
                  isActive ? "text-emerald-400" : "text-slate-300"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/returns"
              className={({ isActive }) =>
                `hover:text-emerald-400 ${
                  isActive ? "text-emerald-400" : "text-slate-300"
                }`
              }
            >
              Returns
            </NavLink>
            <NavLink
              to="/watchlist"
              className={({ isActive }) =>
                `hover:text-emerald-400 ${
                  isActive ? "text-emerald-400" : "text-slate-300"
                }`
              }
            >
              Watchlist
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/90 text-xs text-slate-400">
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} MiniGrow. All rights reserved.</span>
          <span className="text-slate-500">
            Built with Spring Boot, React & Tailwind.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
