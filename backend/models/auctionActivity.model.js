import mongoose from "mongoose"

const auctionActivitySchema = new mongoose.Schema({
    rfq: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RFQ",
        required: true
    },
    activityType: {
        type: String,
        enum: ["bid_placed", "time_extended", "auction_started", "auction_closed"],
        required: true
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    details: {
        type: mongoose.Schema.Types.Mixed
    }
}, { timestamps: true })

const AuctionActivity = mongoose.model("AuctionActivity", auctionActivitySchema)
export default AuctionActivity
