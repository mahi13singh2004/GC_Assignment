import mongoose from "mongoose"

const bidSchema = new mongoose.Schema({
    rfq: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RFQ",
        required: true,
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    quoteValidity: {
        type: Date,
        required: true
    },
},
    { timestamps: true }
)

const Bid = mongoose.model("Bid", bidSchema)
export default Bid