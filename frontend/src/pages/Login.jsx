import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import apiRequest from "../services/api";
import { useAuth } from "../context/AuthContext";

// Login (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
function Login() {

    const navigate = useNavigate();
    const location = useLocation();

    const { login } = useAuth();

    // Store the values entered into the login form
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    // Store validation and API error messages
    const [error, setError] = useState("");

    // Used to display a loading state while login is processing
    const [loading, setLoading] = useState(false);

    // Update the relevant form field whenever the user types
    function handleChange(event) {

        const {
            name,
            value
        } = event.target;

        setFormData(previousData => ({
            ...previousData,
            [name]: value
        }));

        // Clear the previous error when the user changes the form
        if (error) {
            setError("");
        }
    }

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");

        // Frontend validation
        if (
            !formData.email.trim() ||
            !formData.password
        ) {
            setError("Please enter your email and password.");
            return;
        }

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email
            )
        ) {
            setError("Please enter a valid email address.");
            return;
        }

        if (
            formData.password.length < 8 ||
            formData.password.length > 128
        ) {
            setError("Password must contain between 8 and 128 characters.");
            return;
        }

        try {

            setLoading(true);

            // Send login credentials to the backend API
            const data = await apiRequest(
                "/auth/login",
                {
                    method: "POST",
                    body: JSON.stringify({
                        email: formData.email
                            .trim()
                            .toLowerCase(),
                        password: formData.password
                    })
                }
            );

            // Store the JWT and user information
            // using the authentication context
            login(
                data.token,
                data.user
            );

            /*
             * If the user was redirected to login from a
             * protected page, return them there.
             *
             * Otherwise, send them to the home page.
             */
            const destination =
                location.state?.from?.pathname || "/";

            navigate(destination, {
                replace: true
            });

        } catch (error) {

            // Display the API error without exposing
            // sensitive authentication information
            setError(
                error.message ||
                "Login failed. Please try again."
            );

        } finally {

            setLoading(false);
        }
    }

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1>Welcome Back</h1>

                <p className="auth-subtitle">
                    Login to your HustleHub+ account.
                </p>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            disabled={loading}
                            autoComplete="email"
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            disabled={loading}
                            autoComplete="current-password"
                        />

                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging In..."
                            : "Login"}
                    </button>

                </form>

                <p className="auth-footer">

                    Don't have an account?{" "}

                    <Link to="/register">
                        Create an account
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Login;

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