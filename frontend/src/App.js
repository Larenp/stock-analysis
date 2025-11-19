import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import ReturnsCalculator from "./components/ReturnsCalculator";
import Watchlist from "./components/Watchlist";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="returns" element={<ReturnsCalculator />} />
        <Route path="watchlist" element={<Watchlist />} />
      </Route>
    </Routes>
  );
}

export default App;
