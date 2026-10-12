// Import bcryptjs - securely hash passwords and compare passwords
const bcrypt = require("bcryptjs");

// Import user model
const User = require("../models/User");

// Import jsonwebtoken - generate JWTs for authenticated users
const jwt = require("jsonwebtoken");


// Register a new user account (NPM, 2025) (Dave Gray, 2021) (Web Dev Simplified, 2019) (IIE, 2026)
async function register(req, res, next) {
    try {
        const {
            name,
            surname,
            email,
            password,
            role
        } = req.body;

        // Only allow client or freelancer registration
        if (!["client", "freelancer"].includes(role)) {
            return res.status(400).json({
                success: false,
                error: "ValidationError",
                message: "Role must be either client or freelancer."
            });
        }

        // Find an existing account using the email address
        const existingUser = await User.findOne({ email });

        // Reject registration if the email is already registered
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: "Conflict",
                message: "An account with this email already exists."
            });
        }

        // Hash the password before storing it
        const passwordHash = await bcrypt.hash(password, 12);

        // Create the new user in MongoDB
        const user = await User.create({
            name,
            surname,
            email,
            passwordHash,
            role
        });

        // Return non-sensitive user information
        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user: {
                id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        // Pass unexpected errors to the global error handler
        next(error);
    }
}


// Authenticate an existing user and issue a JWT (NPM, 2025) (Dave Gray, 2021) (Web Dev Simplified, 2019) (IIE, 2026)
async function login(req, res, next) {

    try {

        // Extract the validated login details from the request body
        const {
            email,
            password
        } = req.body;


        // Find the user in MongoDB using their email address
        const user = await User
            .findOne({ email })
            .select("+passwordHash");


        // Check if the email does not exist
        if (!user) {
            return res.status(401).json({
                success: false,
                error: "AuthenticationError",
                message: "Invalid email or password."
            });
        }


        // Compare the entered password against the stored password hash
        const passwordValid = await bcrypt.compare(
            password,
            user.passwordHash
        );


        // Reject the login if the password does not match
        if (!passwordValid) {
            return res.status(401).json({
                success: false,
                error: "AuthenticationError",
                message: "Invalid email or password."
            });
        }


        // Generate a signed JWT containing the user's MongoDB ID and role
        const token = jwt.sign(
            {
                userId: user._id.toString(),
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                // Token expires after one hour
                expiresIn: "1h"
            }
        );


        // Return the JWT and non-sensitive user information
        return res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        // Pass unexpected errors to the global error handler
        next(error);
    }
}


// Export authentication functions so they can be used by authRoutes.js (Dave Gray, 2021) (Web Dev Simplified, 2019) (IIE, 2026)
module.exports = {
    register,
    login
};


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