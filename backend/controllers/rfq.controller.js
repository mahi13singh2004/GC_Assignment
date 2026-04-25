import Bid from "../models/bid.model.js"
import RFQ from "../models/rfq.model.js"

export const createRFQ = async (req, res) => {
    try {
        const { title, bidStartTime, bidCloseTime, forcedCloseTime, triggerWindow, extensionDuration } = req.body
        if (!title || !bidStartTime || !bidCloseTime || !forcedCloseTime || !triggerWindow || !extensionDuration) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (new Date(forcedCloseTime) <= new Date(bidCloseTime)) {
            return res.status(400).json({ message: "Forced close time must be after bid close time" })
        }

        if (req.user.role !== "buyer") {
            return res.status(403).json({ message: "Only buyers can create RFQ" });
        }

        const rfq = await RFQ.create({
            title,
            buyer: req.user._id,
            bidStartTime,
            bidCloseTime,
            forcedCloseTime,
            currentCloseTime: bidCloseTime,
            triggerWindow,
            extensionDuration
        })

        return res.status(201).json({
            message: "RFQ created",
            rfq
        })
    }
    catch (error) {
        console.log("RFQ Create error", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getAllRFQ = async (req, res) => {
    try {
        const rfqs = await RFQ.find().populate("buyer", "name email")
        const now = new Date()

        const updatedRFQ = rfqs.map((rfq) => {
            let status = "upcoming"

            if (now >= rfq.bidStartTime && now <= rfq.currentCloseTime) {
                status = "active"
            }

            if (now >= rfq.currentCloseTime) {
                status = "closed"
            }

            if (now > rfq.forcedCloseTime) {
                status = "force_closed"
            }

            return {
                ...rfq._doc,
                status
            }
        })

        return res.status(200).json({
            message: "RFQ Fetched successfully",
            updatedRFQ
        })
    }
    catch (error) {
        console.log("RFQ Get error", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const placeBid = async (req, res) => {
    try {
        const { rfqId, amount } = req.body
        if (!rfqId || !amount) {
            return res.status(400).json({ message: "All fields required" });
        }
        if (req.user.role !== "supplier") {
            return res.status(403).json({ message: "Only suppliers can bid" });
        }
        const rfq = await RFQ.findById(rfqId)
        if (!rfq) {
            return res.status(400).json({ message: "Auction Not Yet Started" })
        }
        const now = new Date()
        if (now < rfq.bidStartTime) {
            return res.status(400).json({ message: "Auction not started" });
        }
        if (now > rfq.currentCloseTime || now > rfq.forcedCloseTime) {
            return res.status(400).json({ message: "Auction closed" });
        }

        const lowestBid = await Bid.findOne({ rfq: rfqId }).sort({ amount: 1 })
        if (lowestBid && amount >= lowestBid.amount) {
            return res.status(400).json({
                message: "Bid must be lower than current lowest bid",
            });
        }

        const bid = await Bid.create({
            rfq: rfqId,
            supplier: req.user._id,
            amount
        })

        const triggerTime = new Date(
            rfq.currentCloseTime.getTime() - rfq.triggerWindow * 60000
        )

        if (now >= triggerTime) {
            let newCloseTime = new Date(
                rfq.currentCloseTime.getTime() + rfq.extensionDuration * 60000
            )

            if (newCloseTime > rfq.forcedCloseTime) {
                newCloseTime = rfq.forcedCloseTime
            }

            rfq.currentCloseTime = newCloseTime;
            await rfq.save()
        }

        return res.status(201).json({
            message: "Bid Has been created",
            bid,
            newCloseTime: rfq.currentCloseTime
        })
    }
    catch (error) {
        console.log("RFQ Bid error", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}