import express from "express"
import { createRFQ,getAllRFQ, placeBid } from "../controllers/rfq.controller.js"
import verifyToken from "../middlewares/verifyToken.js"
const router = express.Router()

router.post("/create", verifyToken, createRFQ)
router.get("/",getAllRFQ)
router.post("/bid",verifyToken,placeBid)

export default router