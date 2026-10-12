import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiRequest from "../services/api";

// My gig (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
function MyGigs() {
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    async function loadMyGigs() {
        try {
            setLoading(true);
            setError("");

            const data = await apiRequest("/gigs/my");

            setGigs(data.gigs || []);
        } catch (err) {
            console.error(
                "Failed to load gigs:",
                err
            );

            setError(
                err.message ||
                "Unable to load your gigs."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMyGigs();
    }, []);

    async function handleDeleteGig(gig) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${gig.title}"?\n\nThis action cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(gig._id);
            setError("");
            setSuccessMessage("");

            await apiRequest(
                `/gigs/${gig._id}`,
                {
                    method: "DELETE"
                }
            );

            setSuccessMessage(
                `"${gig.title}" was deleted successfully.`
            );

            await loadMyGigs();
        } catch (err) {
            console.error(
                "Failed to delete gig:",
                err
            );

            setError(
                err.message ||
                "Unable to delete this gig."
            );
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="page-container">

            <div className="my-gigs-header">

                <div>

                    <p className="my-gigs-eyebrow">
                        Freelancer Area
                    </p>

                    <h1>My Gigs</h1>

                    <p className="my-gigs-subtitle">
                        Create and manage the services you
                        offer on HustleHub+.
                    </p>

                </div>

                <Link
                    to="/my-gigs/create"
                    className="my-gigs-create-button"
                >
                    + Create Gig
                </Link>

            </div>

            {successMessage && (
                <div className="my-gigs-success">
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="my-gigs-error">
                    <strong>
                        Unable to complete request
                    </strong>

                    <p>{error}</p>

                    <button
                        type="button"
                        className="my-gigs-retry-button"
                        onClick={loadMyGigs}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {loading && (
                <div className="gigs-state">

                    <div className="loading-spinner"></div>

                    <p>Loading your gigs...</p>

                </div>
            )}

            {!loading &&
                !error &&
                gigs.length === 0 && (
                    <div className="my-gigs-empty-state">

                        <div className="my-gigs-empty-icon">
                            
                        </div>

                        <h2>No gigs yet</h2>

                        <p>
                            You have not created any gigs yet.
                            Create your first gig to start
                            offering your services to clients.
                        </p>

                        <Link
                            to="/my-gigs/create"
                            className="my-gigs-create-button"
                        >
                            Create Your First Gig
                        </Link>

                    </div>
                )}

            {!loading &&
                !error &&
                gigs.length > 0 && (
                    <div className="my-gigs-grid">

                        {gigs.map((gig) => {

                            const isDeleting =
                                deletingId === gig._id;

                            return (
                                <article
                                    key={gig._id}
                                    className="my-gig-card"
                                >

                                    <div className="my-gig-card-content">

                                        <span className="my-gig-category">
                                            {gig.category}
                                        </span>

                                        <h2 className="my-gig-title">
                                            {gig.title}
                                        </h2>

                                        <p className="my-gig-description">
                                            {gig.description}
                                        </p>

                                        <div className="my-gig-details">

                                            <div>

                                                <span>
                                                    Price
                                                </span>

                                                <strong>
                                                    R{" "}
                                                    {Number(
                                                        gig.price
                                                    ).toFixed(2)}
                                                </strong>

                                            </div>

                                            <div>

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

                                        </div>

                                    </div>

                                    <div className="my-gig-actions">

                                        <Link
                                            to={`/gigs/${gig._id}`}
                                            className="my-gig-view-button"
                                        >
                                            View
                                        </Link>

                                        <Link
                                            to={`/my-gigs/${gig._id}/edit`}
                                            className="my-gig-edit-button"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            type="button"
                                            className="my-gig-delete-button"
                                            onClick={() =>
                                                handleDeleteGig(
                                                    gig
                                                )
                                            }
                                            disabled={isDeleting}
                                        >
                                            {isDeleting
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>

                                    </div>

                                </article>
                            );
                        })}

                    </div>
                )}

        </div>
    );
}

export default MyGigs;

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