// Middleware used to validate gig input before it reaches the controller (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
function validateGig(req, res, next) {

    const {
        title,
        description,
        category,
        price,
        deliveryDays
    } = req.body;

    // Check that all required fields are provided
    if (
        title === undefined ||
        description === undefined ||
        category === undefined ||
        price === undefined ||
        deliveryDays === undefined
    ) {
        return res.status(400).json({
            success: false,
            error: "ValidationError",
            message: "Title, description, category, price and delivery days are required."
        });
    }

    // Validate title
    if (
        typeof title !== "string" ||
        title.trim().length < 3 ||
        title.trim().length > 100
    ) {
        return res.status(400).json({
            success: false,
            error: "ValidationError",
            message: "Title must contain between 3 and 100 characters."
        });
    }

    // Validate description
    if (
        typeof description !== "string" ||
        description.trim().length < 10 ||
        description.trim().length > 2000
    ) {
        return res.status(400).json({
            success: false,
            error: "ValidationError",
            message: "Description must contain between 10 and 2000 characters."
        });
    }

    // Validate category
    if (
        typeof category !== "string" ||
        category.trim().length < 2 ||
        category.trim().length > 50
    ) {
        return res.status(400).json({
            success: false,
            error: "ValidationError",
            message: "Category must contain between 2 and 50 characters."
        });
    }

    // Validate price
    if (
        typeof price !== "number" ||
        !Number.isFinite(price) ||
        price < 1
    ) {
        return res.status(400).json({
            success: false,
            error: "ValidationError",
            message: "Price must be a valid number greater than or equal to 1."
        });
    }

    // Validate delivery days
    if (
        typeof deliveryDays !== "number" ||
        !Number.isInteger(deliveryDays) ||
        deliveryDays < 1 ||
        deliveryDays > 365
    ) {
        return res.status(400).json({
            success: false,
            error: "ValidationError",
            message: "Delivery days must be a whole number between 1 and 365."
        });
    }

    // Normalize text input before it reaches the controller
    req.body.title = title.trim();
    req.body.description = description.trim();
    req.body.category = category.trim();

    next();
}

module.exports = validateGig;

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