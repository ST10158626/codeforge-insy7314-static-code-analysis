import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import apiRequest from "../services/api";

// Gig (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
function Gigs() {

    // Stores the gigs returned by the API
    const [gigs, setGigs] = useState([]);

    // Tracks whether the API request is still running
    const [loading, setLoading] = useState(true);

    // Stores an error message if the API request fails
    const [error, setError] = useState("");

    useEffect(() => {

        async function loadGigs() {

            try {

                setLoading(true);
                setError("");

                // Request all available gigs from the API
                const data = await apiRequest("/gigs");

                setGigs(data.gigs || []);

            } catch (err) {

                console.error("Failed to load gigs:", err);

                setError(
                    err.message ||
                    "Unable to load gigs. Please try again later."
                );

            } finally {

                setLoading(false);

            }
        }

        loadGigs();

    }, []);

    return (
        <div className="page-container">

            {/* Page heading */}
            <div className="gigs-header">

                <div>
                    <p className="gigs-eyebrow">
                        Marketplace
                    </p>

                    <h1>
                        Browse Gigs
                    </h1>

                    <p className="gigs-subtitle">
                        Explore services offered by freelancers
                        on HustleHub+.
                    </p>
                </div>

            </div>

            {/* Loading state */}
            {loading && (
                <div className="gigs-state">
                    <div className="loading-spinner"></div>

                    <p>
                        Loading gigs...
                    </p>
                </div>
            )}

            {/* Error state */}
            {!loading && error && (
                <div className="gigs-error">

                    <h2>
                        Unable to load gigs
                    </h2>

                    <p>
                        {error}
                    </p>

                </div>
            )}

            {/* Empty state */}
            {!loading && !error && gigs.length === 0 && (
                <div className="gigs-state">

                    <div className="gigs-empty-icon">
                        💼
                    </div>

                    <h2>
                        No gigs available
                    </h2>

                    <p>
                        There are currently no gigs available.
                        Please check again later.
                    </p>

                </div>
            )}

            {/* Gig list */}
            {!loading && !error && gigs.length > 0 && (
                <div className="gigs-grid">

                    {gigs.map((gig) => (

                        <article
                            key={gig._id}
                            className="gig-card"
                        >

                            <div className="gig-card-top">

                                <span className="gig-category">
                                    {gig.category}
                                </span>

                            </div>

                            <h2 className="gig-title">
                                {gig.title}
                            </h2>

                            <p className="gig-description">
                                {gig.description}
                            </p>

                            <div className="gig-freelancer">

                                <span className="gig-freelancer-label">
                                    Freelancer
                                </span>

                                <span className="gig-freelancer-name">
                                    {gig.freelancerId?.name}{" "}
                                    {gig.freelancerId?.surname}
                                </span>

                            </div>

                            <div className="gig-card-footer">

                                <div>
                                    <span className="gig-price-label">
                                        Starting at
                                    </span>

                                    <strong className="gig-price">
                                        R {Number(gig.price).toFixed(2)}
                                    </strong>
                                </div>

                                <div className="gig-delivery">

                                    <span className="gig-price-label">
                                        Delivery
                                    </span>

                                    <strong>
                                        {gig.deliveryDays}{" "}
                                        {gig.deliveryDays === 1
                                            ? "day"
                                            : "days"}
                                    </strong>

                                </div>

                            </div>

                            <Link
                                to={`/gigs/${gig._id}`}
                                className="gig-book-button"
                            >
                                View Gig
                            </Link>

                        </article>

                    ))}

                </div>
            )}

        </div>
    );
}

export default Gigs;

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