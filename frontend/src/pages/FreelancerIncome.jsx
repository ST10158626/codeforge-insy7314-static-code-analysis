import { useEffect, useState } from "react";
import apiRequest from "../services/api";

function formatMoney(value) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(Number(value || 0));
}

export default function FreelancerIncome() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/bookings/freelancer/income")
      .then((data) => { if (active) setSummary(data); })
      .catch((err) => { if (active) setError(err.message || "Could not load income."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <main className="page-container">
      <header className="dashboard-header">
        <div><p className="dashboard-eyebrow">Freelancer Area</p><h1>Income Summary</h1>
          <p className="dashboard-subtitle">Completed simulated transactions for your freelancer account.</p></div>
      </header>
      {loading && <p role="status">Loading income summary...</p>}
      {error && <div role="alert" className="booking-error-alert">{error}</div>}
      {!loading && !error && summary && <>
        <section className="dashboard-grid">
          <article className="dashboard-card"><h2>Total income</h2><p>{formatMoney(summary.totalIncome)}</p></article>
          <article className="dashboard-card"><h2>Transactions</h2><p>{summary.transactionCount}</p></article>
        </section>
        <h2>Transaction history</h2>
        {summary.transactions.length === 0 ? <p>No completed transactions yet.</p> :
          <div className="my-gigs-grid">{summary.transactions.map((transaction) => <article className="my-gig-card" key={transaction._id}>
            <h3>{transaction.gigId?.title || "Gig transaction"}</h3>
            <p>Amount: {formatMoney(transaction.amount)}</p>
            <p>Status: {transaction.status}</p>
            <p>Date: {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : "—"}</p>
            <p><small>Simulated transaction — no real payment was processed.</small></p>
          </article>)}</div>}
      </>}
    </main>
  );
}
