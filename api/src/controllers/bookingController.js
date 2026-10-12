const mongoose = require("mongoose");

const Gig = require("../models/Gig");
const Booking = require("../models/Booking");
const Transaction = require("../models/Transaction");

// Create a booking and its simulated transaction (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
async function createBooking(req, res, next) {

    // Start a MongoDB session
    const session = await mongoose.startSession();

    try {

        const { gigId } = req.body;

        // Find the selected gig.
        const gig = await Gig.findById(gigId).session(session);

        if (!gig) {
            return res.status(404).json({
                success: false,
                error: "NotFound",
                message: "Gig not found."
            });
        }

        let booking;
        let transaction;

        // Create the booking and transaction as one atomic MongoDB transaction.
        await session.withTransaction(async () => {

            // Create the booking
            const bookingDocuments = await Booking.create(
                [
                    {
                        gigId: gig._id,

                        // Client comes from the authenticated JWT
                        clientId: req.user.userId,

                        // Freelancer comes from the gig
                        freelancerId: gig.freelancerId,

                        status: "confirmed"
                    }
                ],
                {
                    session
                }
            );

            booking = bookingDocuments[0];

            // Create the simulated transaction
            const transactionDocuments = await Transaction.create(
                [
                    {
                        bookingId: booking._id,
                        gigId: gig._id,

                        // Client comes from the authenticated JWT
                        clientId: req.user.userId,

                        // Freelancer comes from the gig
                        freelancerId: gig.freelancerId,

                        // Price comes directly from the gig
                        amount: gig.price,

                        status: "completed",
                        type: "simulated"
                    }
                ],
                {
                    session
                }
            );

            transaction = transactionDocuments[0];
        });

        return res.status(201).json({
            success: true,
            message: "Booking confirmed successfully.",
            booking,
            transaction
        });

    } catch (error) {
        next(error);

    } finally {

        // Always close the MongoDB session
        await session.endSession();
    }
}

// Retrieve bookings belonging to the authenticated client (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
async function getMyBookings(req, res, next) {
    try {
        const bookings = await Booking.find({
            clientId: req.user.userId
        })
            .populate("gigId", "title description category price deliveryDays")
            .populate("freelancerId", "name surname email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        next(error);
    }
}

// Retrieve bookings associated with gigs owned by the authenticated freelancer (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
async function getFreelancerBookings(req, res, next) {
    try {
        const bookings = await Booking.find({
            freelancerId: req.user.userId
        })
            .populate("gigId", "title description category price deliveryDays")
            .populate("clientId", "name surname email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        next(error);
    }
}

// Retrieve a specific booking if the authenticated user is the client or freelancer involved in the booking (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
async function getBookingById(req, res, next) {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id)
            .populate(
                "gigId",
                "title description category price deliveryDays"
            )
            .populate(
                "clientId",
                "name surname email"
            )
            .populate(
                "freelancerId",
                "name surname email"
            );

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: "NotFound",
                message: "Booking not found."
            });
        }

        // Check whether the authenticated user is involved in this booking
        const isClient =
            booking.clientId._id.toString() === req.user.userId;

        const isFreelancer =
            booking.freelancerId._id.toString() === req.user.userId;

        if (!isClient && !isFreelancer) {
            return res.status(403).json({
                success: false,
                error: "AuthorizationError",
                message: "You do not have permission to view this booking."
            });
        }

        return res.status(200).json({
            success: true,
            booking
        });
    } catch (error) {
        next(error);
    }
}

// Cancel a booking belonging to the authenticated client (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
async function cancelBooking(req, res, next) {
    try {
        const { id } = req.params;

        const booking = await Booking.findOne({
            _id: id,
            clientId: req.user.userId
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: "NotFound",
                message: "Booking not found."
            });
        }

        // Only confirmed bookings can be cancelled
        if (booking.status !== "confirmed") {
            return res.status(400).json({
                success: false,
                error: "ValidationError",
                message: "Only confirmed bookings can be cancelled."
            });
        }

        booking.status = "cancelled";

        await booking.save();

        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully.",
            booking
        });
    } catch (error) {
        next(error);
    }
}

// Mark a booking as completed by the freelancer associated with the booking (Net Ninja, 2022) (DesiCoderPankaja, 2026) (Code With Yousaf, 2023) (OnlineITtuts Tutorials, 2025) (Traversy Media, 2022) (Medium, 2025)
async function completeBooking(req, res, next) {
    try {
        const { id } = req.params;

        const booking = await Booking.findOne({
            _id: id,
            freelancerId: req.user.userId
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: "NotFound",
                message: "Booking not found."
            });
        }

        // Only confirmed bookings can be completed
        if (booking.status !== "confirmed") {
            return res.status(400).json({
                success: false,
                error: "ValidationError",
                message: "Only confirmed bookings can be completed."
            });
        }

        booking.status = "completed";

        await booking.save();

        return res.status(200).json({
            success: true,
            message: "Booking marked as completed.",
            booking
        });
    } catch (error) {
        next(error);
    }
}


// Return income records belonging only to the authenticated freelancer.
// Transactions are simulated records; this endpoint does not process real payments.
async function getFreelancerIncome(req, res, next) {
    try {
        const transactions = await Transaction.find({
            freelancerId: req.user.userId,
            status: "completed"
        })
            .populate("bookingId", "status")
            .populate("gigId", "title")
            .sort({ createdAt: -1 });

        // Do not count transactions whose booking was subsequently cancelled.
        const payableTransactions = transactions.filter((transaction) =>
            transaction.bookingId && transaction.bookingId.status !== "cancelled"
        );

        const totalIncome = payableTransactions.reduce(
            (total, transaction) => total + Number(transaction.amount || 0),
            0
        );

        return res.status(200).json({
            success: true,
            currency: "configured-by-your-app",
            transactionCount: payableTransactions.length,
            totalIncome: Number(totalIncome.toFixed(2)),
            transactions: payableTransactions
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createBooking,
    getMyBookings,
    getFreelancerBookings,
    getBookingById,
    cancelBooking,
    completeBooking,
    getFreelancerIncome
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