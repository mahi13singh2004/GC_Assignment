import Bid from "../models/bid.model.js"
import RFQ from "../models/rfq.model.js"
import AuctionActivity from "../models/auctionActivity.model.js"

export const createRFQ = async (req, res) => {
    try {
        const { title, bidStartTime, bidCloseTime, forcedCloseTime, triggerWindow, extensionDuration, extensionTriggerType, pickupServiceDate } = req.body
        if (!title || !bidStartTime || !bidCloseTime || !forcedCloseTime || !triggerWindow || !extensionDuration || !extensionTriggerType || !pickupServiceDate) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (!["bid_received", "any_rank_change", "l1_rank_change"].includes(extensionTriggerType)) {
            return res.status(400).json({ message: "Invalid extension trigger type" })
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
            extensionDuration,
            extensionTriggerType,
            pickupServiceDate
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

        const updatedRFQ = await Promise.all(rfqs.map(async (rfq) => {
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

            const lowestBid = await Bid.findOne({ rfq: rfq._id }).sort({ amount: 1 })

            return {
                ...rfq._doc,
                status,
                currentLowestBid: lowestBid ? lowestBid.amount : null
            }
        }))

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
        const { rfqId, amount, quoteValidity } = req.body
        if (!rfqId || !amount || !quoteValidity) {
            return res.status(400).json({ message: "All fields required" });
        }
        if (req.user.role !== "supplier") {
            return res.status(403).json({ message: "Only suppliers can bid" });
        }
        const rfq = await RFQ.findById(rfqId)
        if (!rfq) {
            return res.status(400).json({ message: "RFQ not found" })
        }
        const now = new Date()
        if (now < rfq.bidStartTime) {
            return res.status(400).json({ message: "Auction not started" });
        }
        if (now > rfq.currentCloseTime || now > rfq.forcedCloseTime) {
            return res.status(400).json({ message: "Auction closed" });
        }

        const previousLowestBid = await Bid.findOne({ rfq: rfqId }).sort({ amount: 1 })
        if (previousLowestBid && amount >= previousLowestBid.amount) {
            return res.status(400).json({
                message: "Bid must be lower than current lowest bid",
            });
        }

        const previousBids = await Bid.find({ rfq: rfqId }).sort({ amount: 1 })
        const previousRankings = previousBids.map(b => b.supplier.toString())

        const bid = await Bid.create({
            rfq: rfqId,
            supplier: req.user._id,
            amount,
            quoteValidity
        })

        await AuctionActivity.create({
            rfq: rfqId,
            activityType: "bid_placed",
            performedBy: req.user._id,
            details: {
                bidAmount: amount,
                previousLowestBid: previousLowestBid ? previousLowestBid.amount : null
            }
        })

        const triggerTime = new Date(
            rfq.currentCloseTime.getTime() - rfq.triggerWindow * 60000
        )

        let shouldExtend = false
        let extensionReason = ""

        if (now >= triggerTime) {
            if (rfq.extensionTriggerType === "bid_received") {
                shouldExtend = true
                extensionReason = "Bid received in trigger window"
            }
            else if (rfq.extensionTriggerType === "any_rank_change") {
                const currentBids = await Bid.find({ rfq: rfqId }).sort({ amount: 1 })
                const currentRankings = currentBids.map(b => b.supplier.toString())

                let rankChanged = false
                for (let i = 0; i < Math.min(previousRankings.length, currentRankings.length); i++) {
                    if (previousRankings[i] !== currentRankings[i]) {
                        rankChanged = true
                        break
                    }
                }

                if (rankChanged || currentRankings.length !== previousRankings.length) {
                    shouldExtend = true
                    extensionReason = "Supplier ranking changed"
                }
            }
            else if (rfq.extensionTriggerType === "l1_rank_change") {
                const newLowestBid = await Bid.findOne({ rfq: rfqId }).sort({ amount: 1 })
                if (!previousLowestBid || previousLowestBid.supplier.toString() !== newLowestBid.supplier.toString()) {
                    shouldExtend = true
                    extensionReason = "Lowest bidder (L1) changed"
                }
            }
        }

        if (shouldExtend) {
            const previousCloseTime = new Date(rfq.currentCloseTime)
            let newCloseTime = new Date(
                rfq.currentCloseTime.getTime() + rfq.extensionDuration * 60000
            )

            if (newCloseTime > rfq.forcedCloseTime) {
                newCloseTime = rfq.forcedCloseTime
            }

            rfq.currentCloseTime = newCloseTime
            await rfq.save()

            await AuctionActivity.create({
                rfq: rfqId,
                activityType: "time_extended",
                performedBy: req.user._id,
                details: {
                    previousCloseTime,
                    newCloseTime,
                    extensionReason,
                    extensionMinutes: rfq.extensionDuration
                }
            })
        }

        return res.status(201).json({
            message: "Bid has been created",
            bid,
            newCloseTime: rfq.currentCloseTime,
            extended: shouldExtend
        })
    }
    catch (error) {
        console.log("RFQ Bid error", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getRFQDetails = async (req, res) => {
    try {
        const { id } = req.params
        const rfq = await RFQ.findById(id).populate("buyer", "name email")

        if (!rfq) {
            return res.status(400).json({ message: "RFQ not found" })
        }

        const bids = await Bid.find({ rfq: id }).populate("supplier", "name email").sort({ amount: 1 })

        const rankedBids = bids.map((bid, idx) => ({
            ...bid._doc,
            rank: `L${idx + 1}`
        }))

        const activityLog = await AuctionActivity.find({ rfq: id })
            .populate("performedBy", "name email")
            .sort({ createdAt: 1 })

        return res.status(200).json({
            rfq,
            totalsBids: bids.length,
            lowestBid: bids[0] || null,
            bids: rankedBids,
            activityLog
        })
    }
    catch (error) {
        console.log("RFQ Details error", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}