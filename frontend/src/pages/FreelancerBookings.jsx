import { useEffect, useState } from "react";
import apiRequest from "../services/api";

export default function FreelancerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");

async function loadBookings() {
  setLoading(true);
  setError("");

  try {
    const data = await apiRequest("/bookings/freelancer");
    setBookings(data.bookings || []);
  } catch (err) {
    setError(err.message || "Unable to load bookings.");
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  let ignore = false;

  async function fetchBookings() {
    try {
      const data = await apiRequest("/bookings/freelancer");

      if (!ignore) {
        setBookings(data.bookings || []);
      }
    } catch (err) {
      if (!ignore) {
        setError(err.message || "Unable to load bookings.");
      }
    } finally {
      if (!ignore) {
        setLoading(false);
      }
    }
  }

  fetchBookings();

  return () => {
    ignore = true;
  };
}, []);

  async function completeBooking(id) {
    setBusyId(id); setError(""); setMessage("");
    try {
      const data = await apiRequest(`/bookings/${id}/complete`, { method: "PATCH" });
      setMessage(data.message || "Booking marked as completed.");
      await loadBookings();
    } catch (err) { setError(err.message || "Unable to complete booking."); }
    finally { setBusyId(null); }
  }

  return <main className="page-container">
    <header className="dashboard-header"><div><p className="dashboard-eyebrow">Freelancer Area</p><h1>Client Bookings</h1><p className="dashboard-subtitle">Review bookings for your gigs and mark finished work as completed.</p></div></header>
    {message && <div className="booking-success-alert" role="status">{message}</div>}
    {error && <div className="booking-error-alert" role="alert">{error} <button type="button" onClick={loadBookings}>Try again</button></div>}
    {loading && <p role="status">Loading bookings...</p>}
    {!loading && !error && bookings.length === 0 && <section className="bookings-empty-state"><h2>No bookings yet</h2><p>Bookings for your gigs will appear here.</p></section>}
    {!loading && bookings.length > 0 && <div className="my-gigs-grid">{bookings.map((booking) => <article className="my-gig-card" key={booking._id}>
      <h2>{booking.gigId?.title || "Gig"}</h2>
      <p>Client: {booking.clientId ? `${booking.clientId.name || ""} ${booking.clientId.surname || ""}`.trim() || booking.clientId.email : "—"}</p>
      <p>Price: {new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(Number(booking.gigId?.price || 0))}</p>
      <p>Status: <strong>{booking.status}</strong></p>
      {booking.status === "confirmed" && <button type="button" className="dashboard-card-link dashboard-card-button" disabled={busyId === booking._id} onClick={() => completeBooking(booking._id)}>{busyId === booking._id ? "Updating..." : "Mark Completed"}</button>}
    </article>)}</div>}
  </main>;
}
