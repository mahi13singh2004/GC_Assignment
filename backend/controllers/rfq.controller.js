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
        const rfqs=await RFQ.find().populate("buyer","name email")
        const now=new Date()

        const updatedRFQ=rfqs.map((rfq)=>{
            let status="upcoming"

            if(now>=rfq.bidStartTime && now<=rfq.currentCloseTime){
                status="active"
            }

            if(now>=rfq.currentCloseTime){
                status="closed"
            }

            if(now>rfq.forcedCloseTime){
                status="force_closed"
            }

            return{
                ...rfq._doc,
                status
            }
        })

        return res.status(200).json({
            message:"RFQ Fetched successfully",
            updatedRFQ
        })
    }
    catch (error) {
        console.log("RFQ Get error", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}