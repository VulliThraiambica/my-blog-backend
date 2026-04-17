import jwt from 'jsonwebtoken'
import { config } from 'dotenv';
const {verify}=jwt
config();
export const verifytoken=(...allowedrole)=>{
return(req,res,next)=>{
    try{
        const token=req.cookies?.token;
        if(!token){
            return res.status(401).json({
                message:"please login first"
            });}
            //validate token
            let decodedtoken=verify(token,process.env.Secret_key);
    if(!allowedrole.includes(decodedtoken.role))
        return res.status(403).json({message:"you are nott authorized from middleware"})

// add dedcoded token 
req.user= decodedtoken;
next ()
// validate token(decode the token)
}
 catch(err){
    res.status(401).json({message:"session expired .please login"})
}
}}