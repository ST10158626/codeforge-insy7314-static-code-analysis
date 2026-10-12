/*
 * HustleHub - User Input Validation Middleware
 *
 * This middleware validates data received from users
 * before the request reaches the authentication controller.
 *
 * It helps prevent:
 * - Missing required fields
 * - Invalid email addresses
 * - Weak passwords
 * - Invalid names
 * - Invalid data types
 */


// Validate data submitted when registering a new user (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
function validateRegistration(req, res, next) {

    // Extract registration details from the request body
    const {
        name,
        surname,
        email,
        password,
        role
    } = req.body;


    // Check that all required registration fields have been provided
    if (!name || !surname || !email || !password || !role) {
        return res.status(400).json({
            success: false,
            error: "ValidationError",
            message: "Name, surname, email, password and role are required."
        });
    }


    // Check that the name is text and contains at least two characters
    if (
        typeof name !== "string" ||
        name.trim().length < 2 ||
        name.trim().length > 50
    ) {
        return res.status(400).json({
            success: false,
            error: "ValidationError",
            message: "Name must contain between 2 and 50 characters."
        });
    }


    // Check that the surname is text and contains at least two characters
    if (
        typeof surname !== "string" ||
        surname.trim().length < 2 ||
        surname.trim().length > 50
    ) {
        return res.status(400).json({
            success: false,
            error: "ValidationError",
            message: "Surname must contain between 2 and 50 characters."
        });
    }



    // Regular expression used to perform a basic email format check.    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Reject the request if the email format is invalid
    if (
        typeof email !== "string" ||
        email.trim().length > 254 ||
        !emailPattern.test(email.trim())
    ) {
        return res.status(400).json({
            success: false,
            error: "ValidationError",
            message: "Please provide a valid email address."
        });
    }


    
    //Check that the password is text and contains at least eight characters
    if (
        typeof password !== "string" ||
        password.length < 8 ||
        password.length > 128
    ) {
        return res.status(400).json({
            success: false,
            error: "ValidationError",
            message: "Password must contain between 8 and 128 characters."
        });
    }


    // Only client and freelancer roles can be selected during registration
    if (
        typeof role !== "string" ||
        !["client", "freelancer"].includes(role)
    ) {
        return res.status(400).json({
            success: false,
            error: "ValidationError",
            message: "Role must be either client or freelancer."
        });
    }


    // Normalise the email before passing it to the controller
    req.body.email = email.trim().toLowerCase();


    // Normalise the name and surname
    req.body.name = name.trim();
    req.body.surname = surname.trim();


    // Continue to the registration controller
    next();
}


// Validate data submitted when logging in (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
function validateLogin(req, res, next) {

    // Extract login details from the request body
    const {
        email,
        password
    } = req.body;


    // Check that both login fields have been provided
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: "ValidationError",
            message: "Email and password are required."
        });
    }


    // Regular expression used to perform a basic email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    // Reject the request if the email format is invalid
    if (
        typeof email !== "string" ||
        email.trim().length > 254 ||
        !emailPattern.test(email.trim())
    ) {
        return res.status(400).json({
            success: false,
            error: "ValidationError",
            message: "Please provide a valid email address."
        });
    }


    // Check that the password is supplied as a text value
    if (
        typeof password !== "string" ||
        password.length > 128
    ) {
        return res.status(400).json({
            success: false,
            error: "ValidationError",
            message: "Password must be a valid text value."
        });
    }


    // Normalise the email before passing it to the controller
    req.body.email = email.trim().toLowerCase();


    // Continue to the login controller
    next();
}


// Export the validation middleware functions
module.exports = {
    validateRegistration,
    validateLogin
};

/*
 * =======================================================================================================
 * REFERENCES
 * =======================================================================================================
 *
 * Express.js, 2026. Writing middleware for use in Express apps.
 * [online] Available at:
 * https://expressjs.com/en/guide/writing-middleware/
 *
 * Express.js, 2026. Using middleware.
 * [online] Available at:
 * https://expressjs.com/en/guide/using-middleware/
 *
 * [Accessed 1 September 2026].
 *
 * =======================================================================================================
 */