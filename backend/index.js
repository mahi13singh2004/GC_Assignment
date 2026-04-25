import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/connectDB.js"
import authRoutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser"

const app=express()
dotenv.config()
app.use(express.json())
app.use(cookieParser())
const PORT=process.env.PORT || 5000

app.use("/api/auth",authRoutes)

app.listen(PORT,()=>{
    connectDB()
    console.log(`Server is running on ${PORT}`)
})