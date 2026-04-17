import exp from 'express'
import { usermodel } from '../models/usermodel.js'
import { articlemodel } from '../models/articlemodel.js'
import { verifytoken } from '../verifytoken.js'
export const adminapp=exp.Router()
//read all users
adminapp.get("/user",verifytoken("admin"),async(req,res)=>{
    const users=await usermodel.find()
    res.status(200).json({message:"users",payload:users})
})
// read all articles
adminapp.get("/article",verifytoken("admin"),async(req,res)=>{
    const articles=await articlemodel.find()
    res.status(200).json({message:"articles",payload:articles})
})


// user active or not 
adminapp.put("/user/:id",verifytoken("admin"),async(req,res)=>{
    try{
const {isuseractive}=req.body
const user=await usermodel.findByIdAndUpdate(req.params.id,{$set:{isuseractive}},{new:true})

if(!user)
{
    return res.status(400).json({message:"user not found"})
}

const status=isuseractive?"activated":"blocked"
res.status(200).json({message:`user ${status}`,payload:user})
    }catch(err)
{
res.status(500).json({message:"erro occured",error:err.message})
}

})


//is article active yes or no
// user active or not 
adminapp.put("/article/:id",verifytoken("admin"),async(req,res)=>{
    try{

const {isarticleactive}=req.body
const article =await articlemodel.findByIdAndUpdate(req.params.id,{$set:{isarticleactive}},{new:true})
if(!article)
{
    return res.status(400).json({message:"article not found"})
}

const status=isarticleactive?"activated":"blocked"
res.status(200).json({message:`article ${status}`,payload:article})
    }catch(err)
{
res.status(500).json({message:"erro occured",error:err.message})
}

})

adminapp.delete("/user/:id",verifytoken("admin"),async(req,res)=>{
    try{
        const user = await usermodel.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        res.status(200).json({message:"user deleted permanently"})
    }
    catch(err){
        res.status(500).json({message:"error occured",error:err.message})
}
})


adminapp.delete("/article/:id",verifytoken("admin"),async(req,res)=>{
    try{
        const article = await articlemodel.findByIdAndDelete(req.params.id)
        if(!article){
            return res.status(404).json({message:"article not found"})
        }
        res.status(200).json({message:"article deleted permanently"})
    }
    catch(err){
        res.status(500).json({message:"error occured",error:err.message})
    }
})
