import exp from 'express'
import { verifytoken } from '../verifytoken.js'
import { articlemodel } from '../models/articlemodel.js'
export const userapp=exp.Router()

// read article of all author
userapp.get("/article",verifytoken("user"),async(req,res)=>{
// read article
const articlelist= await articlemodel.find({isarticleactive:true})
//send res(xss,  csrf attack )
res.status(200).json({message:'articles',payload:articlelist})

})

// add comment to an article 
userapp.put("/article",verifytoken("user"),async(req,res)=>{

//get body from req
const {articleid,comment}=req.body
// check article 
const articledoc=await articlemodel.findOne({_id:articleid,isarticleactive:true}).populate("comments.user");
//if article not found
if(!articledoc){

    return res.status(404).json({message:"article not found"})
}
//get user id
const userid=req.user?.id;
articledoc.comments.push({user:userid,comment:comment})
//save
await articledoc.save()

//send res
res.status(200).json({message:"article",payload:articledoc})
})