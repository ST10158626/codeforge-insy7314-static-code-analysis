const Gig = require("../models/Gig");


// Create a new gig for the authenticated freelancer (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
async function createGig(req, res, next) {

    try {

        // Extract gig information from the request
        const {
            title,
            description,
            category,
            price,
            deliveryDays
        } = req.body;


        // Create the gig using the authenticated user's ID
        const gig = await Gig.create({
            freelancerId: req.user.userId,
            title,
            description,
            category,
            price,
            deliveryDays
        });


        // Return the newly created gig
        return res.status(201).json({
            success: true,
            message: "Gig created successfully.",
            gig
        });

    } catch (error) {

        // Pass unexpected errors to the global error handler
        next(error);
    }
}

// Retrieve all available gigs (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
async function getAllGigs(req, res, next) {
    try {
        const gigs = await Gig.find()
            .populate("freelancerId", "name surname")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: gigs.length,
            gigs
        });
    } catch (error) {
        next(error);
    }
}

// Retrieve a single gig by its ID (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
async function getGigById(req, res, next) {
    try {
        const { id } = req.params;

        const gig = await Gig.findById(id)
            .populate("freelancerId", "name surname");

        if (!gig) {
            return res.status(404).json({
                success: false,
                error: "NotFound",
                message: "Gig not found."
            });
        }

        return res.status(200).json({
            success: true,
            gig
        });
    } catch (error) {
        next(error);
    }
}

// Retrieve gigs belonging to the authenticated freelancer (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
async function getMyGigs(req, res, next) {
    try {
        const gigs = await Gig.find({
            freelancerId: req.user.userId
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: gigs.length,
            gigs
        });
    } catch (error) {
        next(error);
    }
}

// Update a gig belonging to the authenticated freelancer (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
async function updateGig(req, res, next) {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            category,
            price,
            deliveryDays
        } = req.body;

        // Find the gig by ID
        const gig = await Gig.findOne({
            _id: id,
            freelancerId: req.user.userId
        });

        // Do not allow users to update gigs they do not own
        if (!gig) {
            return res.status(404).json({
                success: false,
                error: "NotFound",
                message: "Gig not found."
            });
        }

        // Update the gig fields
        gig.title = title;
        gig.description = description;
        gig.category = category;
        gig.price = price;
        gig.deliveryDays = deliveryDays;

        // Save the updated document
        await gig.save();

        return res.status(200).json({
            success: true,
            message: "Gig updated successfully.",
            gig
        });
    } catch (error) {
        next(error);
    }
}

// Delete a gig belonging to the authenticated freelancer (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
async function deleteGig(req, res, next) {
    try {
        const { id } = req.params;

        // Find and delete the gig only if it belongs
        // to the authenticated freelancer.
        const gig = await Gig.findOneAndDelete({
            _id: id,
            freelancerId: req.user.userId
        });

        // If no matching gig was found, the gig either
        // does not exist or belongs to another freelancer.
        if (!gig) {
            return res.status(404).json({
                success: false,
                error: "NotFound",
                message: "Gig not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Gig deleted successfully."
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createGig,
    getAllGigs,
    getGigById,
    getMyGigs,
    updateGig,
    deleteGig
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