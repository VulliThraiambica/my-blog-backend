import exp from 'express'
import {usermodel} from '../models/usermodel.js'
import {hash,compare} from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from 'dotenv' 
import { verifytoken } from '../verifytoken.js'
import {uploadToCloudinary} from "../config/cloudinaryupload.js" 
import cloudinary from '../config/cloudinary.js'
import { upload } from '../config/multer.js'
export const commonapp=exp.Router()
const {sign}=jwt
//route for register
commonapp.post("/users", upload.single("profileImageUrl"), async(req, res, next) => {
    let allowedrole=['author','user']
    //get user from req
    const newuser=req.body
//check role
if(!allowedrole.includes(newuser.role)){
    return res.status(400 ).json({message:"invalid role"})
}
// run validators manually 
    //hash the password and replace plain with hash
    newuser.password=await hash(newuser.password,12)
    //create new user document
    const newuserdoc=new usermodel(newuser)
    await newuserdoc.save()// validator runs, when there is save method
    res.status(201).json({message:"user has registered"})
    
})


//route for login
commonapp.post("/login",async(req,res) => {
//roles accepted tologin 

    //console.log(req.body)
    //get user cred obj
    const { email,password} =req.body;
    //find user by email
    const user = await usermodel.findOne({email:email})
    //if user not foun
    if (!user){
        return res.status(400).json({message:"invalid email"})
    }
    const ismatched= await compare(password,user.password)
    if(!ismatched){
        return res.status(400).json({message:"invlid password"})
    }
    //create jwt
    const signedtoken =sign({id: user._id, email:email,role:user.role,firstname:user.firstname,lastname:user.lastname,profileImageurl:user.profileImageurl},
        process.env.Secret_key,{expiresIn:"1d"})
res.cookie("token", signedtoken, {
  httpOnly: true,
  sameSite: "none",
  secure: true
});

let userobj=user.toObject()
delete userobj.password
res.status(200).json({message:"login success", payload:userobj})})

//route for logout 
commonapp.get("/logout",(req,res)=>{

res.clearCookie("token", {
  httpOnly: true,
  sameSite: "none",
  secure: true
});
res.status(200).json({message:"logout success"})

})

//page refrsh
commonapp.get("/check-auth",verifytoken("user","author","admin"),(req,res)=>{
    res.status(200).json({
        message:"authenticated",
        payload:req.user,
    });
})

// change password
commonapp.put("/password",verifytoken("user","author","admin"),async(req,res)=> {

// check current password and new password are same
//get current password of user/admin/author
//check current password of req and user aren't same 
//hash new password
//replace current password of user with hashed new password
//save 
//send res
}) 