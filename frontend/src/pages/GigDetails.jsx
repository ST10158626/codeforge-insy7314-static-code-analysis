import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import apiRequest from "../services/api";
import { useAuth } from "../context/AuthContextDefinition";

// Gig details (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
function GigDetails() {

    // Gets the gig ID from the URL
    const { id } = useParams();

    const navigate = useNavigate();

    const { user } = useAuth();

    // Stores the gig returned by the API
    const [gig, setGig] = useState(null);

    // Tracks whether the request is still running
    const [loading, setLoading] = useState(true);

    // Stores an API error message
    const [error, setError] = useState("");

    useEffect(() => {

        async function loadGig() {

            try {

                setLoading(true);
                setError("");

                // Request the selected gig from the API
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

    // Loading state
    if (loading) {
        return (
            <div className="page-container">

                <div className="gigs-state">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading gig...
                    </p>

                </div>

            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="page-container">

                <div className="gig-details-error">

                    <h1>
                        Unable to load gig
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

    // Safety check in case the API returned no gig
    if (!gig) {
        return (
            <div className="page-container">

                <div className="gig-details-error">

                    <h1>
                        Gig not found
                    </h1>

                    <p>
                        The gig you are looking for could not
                        be found.
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

    // Determine whether the logged-in user owns this gig
    const isGigOwner =
        user?.role === "freelancer" &&
        gig.freelancerId?._id === user.id;

    return (
        <div className="page-container">

            {/* Back navigation */}
            <Link
                to="/gigs"
                className="gig-details-back"
            >
                ← Back to Browse Gigs
            </Link>

            <div className="gig-details-layout">

                {/* Main gig information */}
                <main className="gig-details-main">

                    <span className="gig-category">
                        {gig.category}
                    </span>

                    <h1 className="gig-details-title">
                        {gig.title}
                    </h1>

                    <div className="gig-details-freelancer">

                        <span className="gig-details-label">
                            Offered by
                        </span>

                        <strong>
                            {gig.freelancerId?.name}{" "}
                            {gig.freelancerId?.surname}
                        </strong>

                    </div>

                    <section className="gig-details-section">

                        <h2>
                            About this service
                        </h2>

                        <p>
                            {gig.description}
                        </p>

                    </section>

                </main>

                {/* Booking / gig summary card */}
                <aside className="gig-details-sidebar">

                    <div className="gig-summary-card">

                        <div className="gig-summary-row">

                            <span>
                                Price
                            </span>

                            <strong className="gig-summary-price">
                                R {Number(gig.price).toFixed(2)}
                            </strong>

                        </div>

                        <div className="gig-summary-row">

                            <span>
                                Delivery time
                            </span>

                            <strong>
                                {gig.deliveryDays}{" "}
                                {gig.deliveryDays === 1
                                    ? "day"
                                    : "days"}
                            </strong>

                        </div>

                        {/* Clients can start the booking process */}
                        {user?.role === "client" && (
                            <button
                                type="button"
                                className="gig-details-book-button"
                                onClick={() =>
                                    navigate(
                                        `/gigs/${gig._id}/book`
                                    )
                                }
                            >
                                Book This Gig
                            </button>
                        )}

                        {/* A freelancer cannot book their own service */}
                        {isGigOwner && (
                            <div className="gig-owner-message">
                                This is your gig.
                            </div>
                        )}

                        {/* Other freelancers can view the gig */}
                        {user?.role === "freelancer" &&
                            !isGigOwner && (
                                <div className="gig-owner-message">
                                    You are viewing this gig
                                    as a freelancer.
                                </div>
                            )}

                    </div>

                </aside>

            </div>

        </div>
    );
}

export default GigDetails;

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