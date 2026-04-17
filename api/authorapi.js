import exp from 'express'
import { usermodel } from '../models/usermodel.js'
import { articlemodel } from '../models/articlemodel.js'
import { verifytoken } from '../verifytoken.js'
export const authorapp=exp.Router()
//write article
authorapp.post ("/article",verifytoken("author"),async(req,res)=>{
//get articl obj
const articleobj=req.body
let author = await usermodel.findById(articleobj.author)
if(!author){ // authorixatn checks on authnticated 
    return res.status(404).json({message:"invalid author "})
}
//check role
if(author.role !== "author" ){
    return res.status(403).json({message:"only author can publish "})
}
const articledoc= new articlemodel(articleobj);
//save
await articledoc.save();
res.status(201).json({message:"article published successfully"})

} )
//read own article
authorapp.get("/article",verifytoken("author"),async(req,res)=>{
    const authoridoftoken=req.user?.id;
    const articlelist=await articlemodel.find({author:authoridoftoken})
        res.status(200).json({message:"articles",payload:articlelist})

})

//edit article
authorapp.put("/article",verifytoken("author"),async(req,res)=>{
//get author id
const authoridoftoken=req.user?.id;
const {articleid,title,category,content}=req.body
const modifiedarticle= await articlemodel.findOneAndUpdate({_id:articleid,author:authoridoftoken},{
    $set:{title,category,content}},{new :true},)

if(!modifiedarticle){
    return res.status(403).json({message:"not authorized to edit article"})
}

res.status(200).json({message:"article modified",payload:modifiedarticle})

})

//delete 
authorapp.patch("/article",verifytoken("author"),async(req,res)=>{
    const authoridoftoken=req.user?.id;
 
const {articleid,isarticleactive}=req.body;
const articleofdb= await articlemodel.findOne({_id:articleid,author:authoridoftoken})
   //null check
if(!articleofdb){
    return res.status(404).json({message:"article not found"})
}
if(isarticleactive===articleofdb.isarticleactive){
    return res.status(200).json({message:" article is already in same state"})
}
articleofdb.isarticleactive=isarticleactive;
await articleofdb.save()
res.status(200).json({message:"article modified",payload:articleofdb})


})