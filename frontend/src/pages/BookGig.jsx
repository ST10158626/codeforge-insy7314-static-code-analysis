import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import apiRequest from "../services/api";

// Book gig (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
function BookGig() {

    const { id } = useParams();

    const navigate = useNavigate();

    // Stores the selected gig
    const [gig, setGig] = useState(null);

    // Tracks loading of the gig information
    const [loading, setLoading] = useState(true);

    // Tracks the booking request
    const [booking, setBooking] = useState(false);

    // Stores any error message
    const [error, setError] = useState("");

    // Stores the successful booking response
    const [bookingResult, setBookingResult] = useState(null);


    /*
     * Load the gig before displaying the
     * booking confirmation page.
     */
    useEffect(() => {

        async function loadGig() {

            try {

                setLoading(true);
                setError("");

                const data = await apiRequest(
                    `/gigs/${id}`
                );

                setGig(data.gig);

            } catch (err) {

                console.error(
                    "Failed to load gig:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load this gig."
                );

            } finally {

                setLoading(false);

            }
        }

        loadGig();

    }, [id]);


    /*
     * Send the booking request to the API.
     *
     * Only gigId is sent.
     *
     * The backend determines:
     * - clientId from the JWT
     * - freelancerId from the Gig
     * - amount from the Gig price
     */
    async function handleBooking() {

        try {

            setBooking(true);
            setError("");

            const data = await apiRequest(
                "/bookings",
                {
                    method: "POST",

                    body: JSON.stringify({
                        gigId: id
                    })
                }
            );

            setBookingResult(data);

        } catch (err) {

            console.error(
                "Failed to create booking:",
                err
            );

            setError(
                err.message ||
                "Unable to complete the booking."
            );

        } finally {

            setBooking(false);

        }
    }


    // Loading state
    if (loading) {

        return (
            <div className="page-container">

                <div className="gigs-state">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading booking details...
                    </p>

                </div>

            </div>
        );
    }


    // Error loading the gig
    if (error && !gig) {

        return (
            <div className="page-container">

                <div className="gig-details-error">

                    <h1>
                        Unable to load booking
                    </h1>

                    <p>
                        {error}
                    </p>

                    <Link
                        to="/gigs"
                        className="gig-details-back"
                    >
                        Back to Browse Gigs
                    </Link>

                </div>

            </div>
        );
    }


    // Safety check
    if (!gig) {

        return (
            <div className="page-container">

                <div className="gig-details-error">

                    <h1>
                        Gig not found
                    </h1>

                    <p>
                        The selected gig could not be found.
                    </p>

                    <Link
                        to="/gigs"
                        className="gig-details-back"
                    >
                        Back to Browse Gigs
                    </Link>

                </div>

            </div>
        );
    }


    /*
     * Display the successful booking state.
     */
    if (bookingResult) {

        return (
            <div className="page-container">

                <div className="booking-success-card">

                    <div className="booking-success-icon">
                        ✓
                    </div>

                    <p className="booking-eyebrow">
                        Booking Confirmed
                    </p>

                    <h1>
                        Your booking has been confirmed!
                    </h1>

                    <p className="booking-success-message">
                        Your booking for{" "}
                        <strong>
                            {gig.title}
                        </strong>{" "}
                        has been successfully created.
                    </p>

                    <div className="booking-success-details">

                        <div>
                            <span>
                                Booking ID
                            </span>

                            <strong>
                                {bookingResult.booking?._id}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Transaction
                            </span>

                            <strong>
                                Simulated payment completed
                            </strong>
                        </div>

                    </div>

                    <div className="booking-success-actions">

                        <button
                            type="button"
                            className="booking-primary-button"
                            onClick={() =>
                                navigate("/bookings")
                            }
                        >
                            View My Bookings
                        </button>

                        <Link
                            to="/gigs"
                            className="booking-secondary-button"
                        >
                            Browse More Gigs
                        </Link>

                    </div>

                </div>

            </div>
        );
    }


    return (
        <div className="page-container">

            {/* Back to gig details */}
            <Link
                to={`/gigs/${id}`}
                className="gig-details-back"
            >
                ← Back to Gig
            </Link>

            <div className="booking-page-header">

                <p className="booking-eyebrow">
                    Confirm Booking
                </p>

                <h1>
                    Book This Gig
                </h1>

                <p>
                    Review the service details below before
                    confirming your booking.
                </p>

            </div>


            <div className="booking-layout">

                {/* Booking information */}
                <main className="booking-main-card">

                    <div className="booking-gig-category">
                        {gig.category}
                    </div>

                    <h2>
                        {gig.title}
                    </h2>

                    <div className="booking-freelancer">

                        <span>
                            Freelancer
                        </span>

                        <strong>
                            {gig.freelancerId?.name}{" "}
                            {gig.freelancerId?.surname}
                        </strong>

                    </div>

                    <div className="booking-description">

                        <h3>
                            Service Description
                        </h3>

                        <p>
                            {gig.description}
                        </p>

                    </div>

                </main>


                {/* Booking confirmation card */}
                <aside className="booking-sidebar">

                    <div className="booking-summary-card">

                        <h2>
                            Booking Summary
                        </h2>

                        <div className="booking-summary-row">

                            <span>
                                Service
                            </span>

                            <strong>
                                {gig.title}
                            </strong>

                        </div>

                        <div className="booking-summary-row">

                            <span>
                                Delivery
                            </span>

                            <strong>
                                {gig.deliveryDays}{" "}
                                {gig.deliveryDays === 1
                                    ? "day"
                                    : "days"}
                            </strong>

                        </div>

                        <div className="booking-summary-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                R {Number(gig.price).toFixed(2)}
                            </strong>

                        </div>


                        {/* Booking error */}
                        {error && (
                            <div className="booking-error">
                                {error}
                            </div>
                        )}


                        <button
                            type="button"
                            className="booking-primary-button"
                            onClick={handleBooking}
                            disabled={booking}
                        >
                            {booking
                                ? "Confirming Booking..."
                                : "Confirm Booking"}
                        </button>


                        <p className="booking-note">
                            This university project uses simulated
                            transactions. No real payment will be
                            processed.
                        </p>

                    </div>

                </aside>

            </div>

        </div>
    );
}

export default BookGig;

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