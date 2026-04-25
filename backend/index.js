import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/connectDB.js"
import authRoutes from "./routes/auth.route.js"
import rfqRoutes from "./routes/rfq.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()
dotenv.config()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
const PORT = process.env.PORT || 5000

app.use("/api/auth", authRoutes)
app.use("/api/rfq", rfqRoutes)

app.listen(PORT, () => {
    connectDB()
    console.log(`Server is running on ${PORT}`)
})