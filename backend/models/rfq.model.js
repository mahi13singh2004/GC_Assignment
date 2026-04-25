import mongoose from "mongoose"

const rfqSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bidStartTime: {
        type: Date,
        required: true
    },
    bidCloseTime: {
        type: Date,
        required: true
    },
    forcedCloseTime: {
        type: Date,
        required: true
    },
    currentCloseTime: {
        type: Date,
        required: true
    },
    triggerWindow: {
        type: Number,
        required: true
    },
    extensionDuration: {
        type: Number,
        required: true
    },
    extensionTriggerType: {
        type: String,
        enum: ["bid_received", "any_rank_change", "l1_rank_change"],
        required: true
    },
    pickupServiceDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["upcoming", "active", "closed", "force_closed"],
        default: "upcoming"
    }
},
    { timestamps: true }
)

const RFQ = mongoose.model("RFQ", rfqSchema);
export default RFQ;