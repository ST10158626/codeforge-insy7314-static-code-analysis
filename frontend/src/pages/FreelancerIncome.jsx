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

  const gross = Number(summary?.totalIncome || 0);
  const tax = Number(summary?.estimatedTax || 0);
  const net = Number(summary?.afterTaxIncome || 0);
  const rate = Number(summary?.taxRate || 0);
  const taxWidth = gross > 0 ? `${Math.min((tax / gross) * 100, 100)}%` : "0%";
  const netWidth = gross > 0 ? `${Math.min((net / gross) * 100, 100)}%` : "0%";

  return (
    <main className="page-container income-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Freelancer Area</p>
          <h1>Income &amp; Tax Overview</h1>
          <p className="dashboard-subtitle">Track completed gig income and plan for an estimated tax reserve.</p>
        </div>
      </header>
      {loading && <p role="status">Loading income summary...</p>}
      {error && <div role="alert" className="booking-error-alert">{error}</div>}
      {!loading && !error && summary && <>
        <section className="income-summary-grid" aria-label="Income summary">
          <article className="income-stat-card income-gross">
            <span>Total income</span><strong>{formatMoney(gross)}</strong>
            <small>{summary.transactionCount} completed transactions</small>
          </article>
          <article className="income-stat-card income-tax">
            <span>Estimated tax reserve</span><strong>{formatMoney(tax)}</strong>
            <small>{(rate * 100).toFixed(1)}% planning rate</small>
          </article>
          <article className="income-stat-card income-net">
            <span>Estimated after-tax income</span><strong>{formatMoney(net)}</strong>
            <small>Income less estimated tax</small>
          </article>
        </section>

        <section className="income-visual-card">
          <div className="income-section-heading">
            <div><p className="dashboard-eyebrow">Your breakdown</p><h2>Income allocation</h2></div>
            <span className="income-period-tag">All completed gigs</span>
          </div>
          <div className="income-bar-row">
            <div className="income-bar-label"><span>Estimated tax</span><strong>{formatMoney(tax)}</strong></div>
            <div className="income-bar-track"><div className="income-bar-fill tax-fill" style={{ width: taxWidth }} /></div>
          </div>
          <div className="income-bar-row">
            <div className="income-bar-label"><span>After-tax income</span><strong>{formatMoney(net)}</strong></div>
            <div className="income-bar-track"><div className="income-bar-fill net-fill" style={{ width: netWidth }} /></div>
          </div>
          <p className="income-tax-explanation">
            <strong>How the estimate is calculated:</strong> HustleHub+ adds the value of your completed,
            non-cancelled simulated transactions, then multiplies that income by the configured
            estimate rate ({(rate * 100).toFixed(1)}%). For example, at 15%, R10,000 income gives
            an estimated R1,500 tax reserve and R8,500 after-tax income.
          </p>
          <p className="income-disclaimer">
            This is an illustrative planning estimate only, not an official SARS calculation or tax advice.
            Actual tax depends on your taxable income, deductions, rebates and current tax rules.
          </p>
        </section>

        <section className="income-history-section">
          <div className="income-section-heading"><h2>Transaction history</h2></div>
          {summary.transactions.length === 0 ? <p>No completed transactions yet.</p> :
            <div className="my-gigs-grid">{summary.transactions.map((transaction) => <article className="my-gig-card" key={transaction._id}>
              <h3>{transaction.gigId?.title || "Gig transaction"}</h3>
              <p>Amount: {formatMoney(transaction.amount)}</p>
              <p>Status: {transaction.status}</p>
              <p>Date: {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : "—"}</p>
              <p><small>Simulated transaction — no real payment was processed.</small></p>
            </article>)}</div>}
        </section>
      </>}
    </main>
  );
}
