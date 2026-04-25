import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js"
export const signup = async (req, res) => {
  try {
    const {name,email,password,role}=req.body
    if(!name || !email || !password || !role){
      return res.status(400).json({"message":"All fields are required"})
    }

    const userExist=await User.findOne({email})
    if(userExist){
      return res.status(400).json({"message":"User already exists"})
    }

    const hashedPassword=await bcrypt.hash(password,10)

    const user=await User.create({
        name,
        email,
        password:hashedPassword,
        role
    })

    generateTokenAndSetCookie(user._id,res)

    return res.status(201).json({
        message:"User Created Successfully",
        user:{
            ...user._doc,
            password:undefined
        }
    })
  } 
  catch (error) {
    console.log("Error in signup backend auth",error)
    return res.status(500).json({"message":"Internal Server Error"})  
  }
};

export const login = async (req, res) => {
    try {
        const {email,password}=req.body
        if(!email || !password){
            return res.status(400).json({"message":"All fields are required"})
        }
        
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({"message":"User does not exist"})
        }

        const passwordMatch=await bcrypt.compare(password,user.password)
        if(!passwordMatch){
            return res.status(400).json({"message":"Invalid Credentials"})
        }

        generateTokenAndSetCookie(user._id,res)

        return res.status(200).json({
            message:"Logged in successfully",
            user:{
                ...user._doc,
                password:undefined
            }
        })
    } 
    catch (error) {
      console.log("Error in login backend auth")
      return res.status(500).json({"message":"Internal Server Error"})  
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({
            message:"Logged out successfully",
        })
    } 
    catch (error) {
      console.log("Error in logout backend auth")
      return res.status(500).json({"message":"Internal Server Error"})  
    }
};

export const checkAuth = async (req, res) => {
    try {
        const user=req.user
        if(!user){
            return res.status(401).json({"message":"Unauthorized"})
        }
        return res.status(200).json({
            message:"User is authenticated",
            user:{
                ...user._doc,
                password:undefined
            }
        })
    } 
    catch (error) {
      console.log("Error in checkAuth backend auth")
      return res.status(500).json({"message":"Internal Server Error"})  
    }
};