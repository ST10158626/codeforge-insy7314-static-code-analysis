import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import apiRequest from "../services/api";

// My booking (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
function MyBookings() {

    // Stores the bookings returned by the API
    const [bookings, setBookings] = useState([]);

    // Tracks the initial API request
    const [loading, setLoading] = useState(true);

    // Tracks the booking currently being cancelled
    const [cancellingId, setCancellingId] = useState(null);

    // Stores an error message
    const [error, setError] = useState("");

    // Stores a successful cancellation message
    const [successMessage, setSuccessMessage] = useState("");


    /*
     * Load the authenticated client's bookings.
     */
    async function loadBookings() {

        try {

            setLoading(true);
            setError("");

            const data = await apiRequest(
                "/bookings/my"
            );

            setBookings(data.bookings || []);

        } catch (err) {

            console.error(
                "Failed to load bookings:",
                err
            );

            setError(
                err.message ||
                "Unable to load your bookings."
            );

        } finally {

            setLoading(false);

        }
    }


    /*
     * Load bookings when the page first opens.
     */
useEffect(() => {
    let ignore = false;

    async function fetchBookings() {
        try {
            const data = await apiRequest("/bookings/my");

            if (!ignore) {
                setBookings(data.bookings || []);
            }
        } catch (err) {
            console.error("Failed to load bookings:", err);

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


    /*
     * Cancel a confirmed booking.
     */
    async function handleCancelBooking(bookingId) {

        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setCancellingId(bookingId);
            setError("");
            setSuccessMessage("");

            await apiRequest(
                `/bookings/${bookingId}/cancel`,
                {
                    method: "PATCH"
                }
            );

            setSuccessMessage(
                "Booking cancelled successfully."
            );

            // Refresh the booking list after cancellation
            await loadBookings();

        } catch (err) {

            console.error(
                "Failed to cancel booking:",
                err
            );

            setError(
                err.message ||
                "Unable to cancel this booking."
            );

        } finally {

            setCancellingId(null);

        }
    }


    return (
        <div className="page-container">

            {/* Page heading */}
            <div className="bookings-header">

                <p className="bookings-eyebrow">
                    Client Area
                </p>

                <h1>
                    My Bookings
                </h1>

                <p className="bookings-subtitle">
                    View and manage the gigs you have booked.
                </p>

            </div>


            {/* Success message */}
            {successMessage && (
                <div className="booking-success-alert">
                    {successMessage}
                </div>
            )}


            {/* Error message */}
            {error && (
                <div className="booking-error-alert">
                    {error}
                </div>
            )}


            {/* Loading state */}
            {loading && (
                <div className="gigs-state">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading your bookings...
                    </p>

                </div>
            )}


            {/* Empty state */}
            {!loading && !error && bookings.length === 0 && (
                <div className="bookings-empty-state">

                    <div className="bookings-empty-icon">
                        📅
                    </div>

                    <h2>
                        No bookings yet
                    </h2>

                    <p>
                        You have not booked any gigs yet.
                        Browse the marketplace to find a
                        service that suits your needs.
                    </p>

                    <Link
                        to="/gigs"
                        className="booking-primary-button"
                    >
                        Browse Gigs
                    </Link>

                </div>
            )}


            {/* Booking list */}
            {!loading && bookings.length > 0 && (
                <div className="bookings-list">

                    {bookings.map((booking) => {

                        const gig = booking.gigId;

                        const freelancer =
                            booking.freelancerId;

                        const isConfirmed =
                            booking.status === "confirmed";

                        const isCancelling =
                            cancellingId === booking._id;

                        return (
                            <article
                                key={booking._id}
                                className="booking-card"
                            >

                                {/* Main booking information */}
                                <div className="booking-card-main">

                                    <div className="booking-card-heading">

                                        <div>

                                            <span className="booking-category">
                                                {gig?.category ||
                                                    "Service"}
                                            </span>

                                            <h2>
                                                {gig?.title ||
                                                    "Gig unavailable"}
                                            </h2>

                                        </div>

                                        <span
                                            className={
                                                `booking-status booking-status-${booking.status}`
                                            }
                                        >
                                            {booking.status}
                                        </span>

                                    </div>


                                    <div className="booking-card-details">

                                        <div>
                                            <span>
                                                Freelancer
                                            </span>

                                            <strong>
                                                {freelancer?.name}{" "}
                                                {freelancer?.surname}
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Price
                                            </span>

                                            <strong>
                                                R{" "}
                                                {Number(
                                                    gig?.price || 0
                                                ).toFixed(2)}
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Delivery
                                            </span>

                                            <strong>
                                                {gig?.deliveryDays}{" "}
                                                {gig?.deliveryDays === 1
                                                    ? "day"
                                                    : "days"}
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Booked
                                            </span>

                                            <strong>
                                                {new Date(
                                                    booking.createdAt
                                                ).toLocaleDateString(
                                                    "en-ZA",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric"
                                                    }
                                                )}
                                            </strong>
                                        </div>

                                    </div>


                                    {/* Gig description */}
                                    {gig?.description && (
                                        <p className="booking-card-description">
                                            {gig.description}
                                        </p>
                                    )}

                                </div>


                                {/* Booking actions */}
                                <div className="booking-card-actions">

                                    <Link
                                        to={`/gigs/${gig?._id}`}
                                        className="booking-view-button"
                                    >
                                        View Gig
                                    </Link>


                                    {isConfirmed && (
                                        <button
                                            type="button"
                                            className="booking-cancel-button"
                                            onClick={() =>
                                                handleCancelBooking(
                                                    booking._id
                                                )
                                            }
                                            disabled={isCancelling}
                                        >
                                            {isCancelling
                                                ? "Cancelling..."
                                                : "Cancel Booking"}
                                        </button>
                                    )}

                                </div>

                            </article>
                        );
                    })}

                </div>
            )}

        </div>
    );
}

export default MyBookings;

/*
 * =======================================================================================================
 * REFERENCES
 * =======================================================================================================
 *
 * Coding2GO, 2025. All the Express.js You Need — Explained in 24 Minutes.
 * [video online] Available at:
 * https://youtu.be/ha_leEpnT30
 * [Accessed 21 August 2026].
 *
 * NPM, 2025. bcrypt.js.
 * [online] Available at:
 * https://www.npmjs.com/package/bcryptjs
 * [Accessed 21 August 2026].
 *
 * Dave Gray, 2021. User Password Authentication | Node.js & Express Tutorials for Beginners.
 * [video online] Available at:
 * https://youtu.be/Nlg0JrUt0qg
 * [Accessed 21 August 2026].
 *
 * Dave Gray, 2021. JWT Authentication | Node JS and Express Tutorials for Beginners.
 * [video online] Available at:
 * https://youtu.be/favjC6EKFgw
 * [Accessed 23 August 2026].
 *
 * Web Dev Simplified, 2019. JWT Authentication Tutorial - Node.js.
 * [video online] Available at:
 * https://youtu.be/mbsmsi7l3r4
 * [Accessed 23 August 2026].
 *
 * The Independent Institute of Education (IIE), 2026.
 * Information Systems 3D [INSY7314/w Module Manual 2026].
 * The Independent Institute of Education.
 * [online via internal VLE] Available at:
 * https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/IIE%20Student%20Materials/Student%20Materials/INSY7314/2026/Term%202/INSY7314MM.docx?d=w58b815c8d5924d47bda04f6761924e1b&csf=1&web=1&e=xcnarK
 * [Accessed 23 August 2026].
 * 
 * Net Ninja, 2022. MERN Stack Tutorial #8 - Making a React App.
 * [video online] Available at:
 * https://youtu.be/bx4nk7kBS10?si=DJABJs8sT4RtJf_Q
 * [Accessed 24 September 2026].
 * 
 * DesiCoderPankaja, 2026. React Installation and Setup | Create React App using Vite | React Tutorial for Beginners #3.
 * [video online] Available at:
 * https://youtu.be/6I4kPKM_GS8?si=fkKFTtkizIhD0zR3
 * [Accessed 24 September 2026].
 * 
 * Code With Yousaf, 2023. MERN Stack CRUD Operations | Full Stack CRUD Operations | React, Node, Express & MongoDB.
 * [video online] Available at:
 * https://youtu.be/enOsPhp2Z6Q?si=Z24vkN26TDJMyOCQ
 * [Accessed 25 September 2026].
 * 
 * OnlineITtuts Tutorials, 2025. MERN Stack CRUD App for Beginners | Complete Full Stack Project.
 * [video online] Available at:
 * https://youtu.be/2ARIweIiNhs?si=j_WG_86iv5rMgSXl
 * [Accessed 25 September 2026].
 * 
 * Traversy Media, 2022. Learn The MERN Stack - JWT Authentication.
 * [video online] Available at:
 * https://youtu.be/enopDSs3DRw?si=9I4p9hlpT6SIB0aN
 * [Accessed 28 September 2026].
 * 
 * Medium, 2025. JWT Authentication in MERN Apps: A Beginner-Friendly Guide.
 * [online] Available at: https://medium.com/@adityamohiteakm/jwt-authentication-in-mern-apps-a-beginner-friendly-guide-00ed6b6405fc
 * [Accessed 28 September 2026].
 *
 * =======================================================================================================
 */