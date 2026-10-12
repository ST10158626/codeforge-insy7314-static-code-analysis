import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiRequest from "../services/api";

// Edit gig (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
function EditGig() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        price: "",
        deliveryDays: ""
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    async function loadGig() {
        try {
            setLoading(true);
            setError("");

            const data = await apiRequest(`/gigs/${id}`);
            const gig = data.gig;

            if (!gig) {
                setError("Gig could not be found.");
                return;
            }

            setFormData({
                title: gig.title || "",
                description: gig.description || "",
                category: gig.category || "",
                price: gig.price ?? "",
                deliveryDays: gig.deliveryDays ?? ""
            });
        } catch (err) {
            console.error("Failed to load gig:", err);

            setError(
                err.message ||
                "Unable to load this gig."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadGig();
    }, [id]);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setFieldErrors((previous) => ({
            ...previous,
            [name]: ""
        }));

        setError("");
    }

    function validateForm() {
        const errors = {};

        const title = formData.title.trim();
        const description = formData.description.trim();
        const category = formData.category.trim();
        const price = Number(formData.price);
        const deliveryDays = Number(formData.deliveryDays);

        if (!title) {
            errors.title = "Gig title is required.";
        } else if (title.length < 3) {
            errors.title =
                "Gig title must be at least 3 characters.";
        } else if (title.length > 100) {
            errors.title =
                "Gig title cannot exceed 100 characters.";
        }

        if (!description) {
            errors.description =
                "Gig description is required.";
        } else if (description.length < 10) {
            errors.description =
                "Description must be at least 10 characters.";
        } else if (description.length > 2000) {
            errors.description =
                "Description cannot exceed 2000 characters.";
        }

        if (!category) {
            errors.category = "Category is required.";
        } else if (category.length > 50) {
            errors.category =
                "Category cannot exceed 50 characters.";
        }

        if (!formData.price) {
            errors.price = "Price is required.";
        } else if (
            !Number.isFinite(price) ||
            price < 1
        ) {
            errors.price =
                "Price must be at least R1.00.";
        }

        if (!formData.deliveryDays) {
            errors.deliveryDays =
                "Delivery time is required.";
        } else if (
            !Number.isInteger(deliveryDays) ||
            deliveryDays < 1 ||
            deliveryDays > 365
        ) {
            errors.deliveryDays =
                "Delivery time must be between 1 and 365 days.";
        }

        return errors;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        const errors = validateForm();

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        try {
            setSubmitting(true);

            const data = await apiRequest(
                `/gigs/${id}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        title: formData.title.trim(),
                        description: formData.description.trim(),
                        category: formData.category.trim(),
                        price: Number(formData.price),
                        deliveryDays: Number(
                            formData.deliveryDays
                        )
                    })
                }
            );

            console.log("Gig updated:", data);

            navigate("/my-gigs");
        } catch (err) {
            console.error(
                "Failed to update gig:",
                err
            );

            setError(
                err.message ||
                "Unable to update the gig."
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="page-container">

                <div className="gigs-state">

                    <div className="loading-spinner"></div>

                    <p>Loading gig...</p>

                </div>

            </div>
        );
    }

    if (error && !formData.title) {
        return (
            <div className="page-container">

                <div className="create-gig-error">

                    <strong>
                        Unable to load gig
                    </strong>

                    <p>{error}</p>

                    <Link
                        to="/my-gigs"
                        className="create-gig-back"
                    >
                        ← Back to My Gigs
                    </Link>

                </div>

            </div>
        );
    }

    return (
        <div className="page-container">

            <div className="create-gig-header">

                <Link
                    to="/my-gigs"
                    className="create-gig-back"
                >
                    ← Back to My Gigs
                </Link>

                <p className="create-gig-eyebrow">
                    Freelancer Area
                </p>

                <h1>Edit Gig</h1>

                <p className="create-gig-subtitle">
                    Update the details of your service.
                </p>

            </div>

            <div className="create-gig-card">

                {error && (
                    <div className="create-gig-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label htmlFor="title">
                            Gig Title
                        </label>

                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Professional React Website Development"
                            maxLength={100}
                            disabled={submitting}
                        />

                        {fieldErrors.title && (
                            <p className="form-field-error">
                                {fieldErrors.title}
                            </p>
                        )}

                    </div>

                    <div className="form-group">

                        <label htmlFor="description">
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe what you will provide to the client..."
                            rows="7"
                            maxLength={2000}
                            disabled={submitting}
                        />

                        <div className="form-character-count">
                            {formData.description.length}/2000
                        </div>

                        {fieldErrors.description && (
                            <p className="form-field-error">
                                {fieldErrors.description}
                            </p>
                        )}

                    </div>

                    <div className="form-group">

                        <label htmlFor="category">
                            Category
                        </label>

                        <input
                            id="category"
                            name="category"
                            type="text"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="e.g. Web Development"
                            maxLength={50}
                            disabled={submitting}
                        />

                        {fieldErrors.category && (
                            <p className="form-field-error">
                                {fieldErrors.category}
                            </p>
                        )}

                    </div>

                    <div className="create-gig-form-row">

                        <div className="form-group">

                            <label htmlFor="price">
                                Price (ZAR)
                            </label>

                            <div className="price-input-wrapper">

                                <span>R</span>

                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="500.00"
                                    min="1"
                                    step="0.01"
                                    disabled={submitting}
                                />

                            </div>

                            {fieldErrors.price && (
                                <p className="form-field-error">
                                    {fieldErrors.price}
                                </p>
                            )}

                        </div>

                        <div className="form-group">

                            <label htmlFor="deliveryDays">
                                Delivery Time
                            </label>

                            <div className="delivery-input-wrapper">

                                <input
                                    id="deliveryDays"
                                    name="deliveryDays"
                                    type="number"
                                    value={formData.deliveryDays}
                                    onChange={handleChange}
                                    placeholder="7"
                                    min="1"
                                    max="365"
                                    step="1"
                                    disabled={submitting}
                                />

                                <span>days</span>

                            </div>

                            {fieldErrors.deliveryDays && (
                                <p className="form-field-error">
                                    {fieldErrors.deliveryDays}
                                </p>
                            )}

                        </div>

                    </div>

                    <div className="create-gig-actions">

                        <Link
                            to="/my-gigs"
                            className="create-gig-cancel-button"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            className="create-gig-submit-button"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Saving Changes..."
                                : "Save Changes"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditGig;

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