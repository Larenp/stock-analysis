import React, { useState } from "react";

function StockChatbot({ symbol }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      setLoading(true);
      setError("");
      setAnswer("");

      const res = await fetch("http://localhost:8080/api/chat/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, question }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();
      setAnswer(data.answer || "");
    } catch (err) {
      console.error(err);
      setError("Error contacting AI analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 mt-4">
      <h2 className="text-sm font-semibold">
        AI stock explainer (educational)
      </h2>

      <form onSubmit={handleAsk} className="flex flex-col gap-2">
        <textarea
          className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs resize-y min-h-[60px]"
          placeholder={`Ask something about ${symbol} (e.g. "What risks should I check before investing?")`}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="self-end rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold text-xs px-3 py-1 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </form>

      {error && (
        <p className="text-xs text-red-400 bg-red-950/60 border border-red-800 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {answer && (
        <div className="text-xs text-slate-200 bg-slate-950/60 border border-slate-800 rounded-md px-3 py-2 whitespace-pre-wrap">
          {answer}
        </div>
      )}

      <p className="text-[10px] text-slate-500">
        This AI answer is for education only and is not investment advice.
      </p>
    </section>
  );
}

export default StockChatbot;
