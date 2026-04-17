import { Schema,model,Types } from "mongoose";

const commentschema= new Schema(
    {
    user:{
        type:Types.ObjectId,
        ref:"user",
        required:[true,"user id required "]
    },
comment:{
    type:String,
},
})
const articleSchema=new Schema({

author:{
    type:Types.ObjectId,
    ref:"user",
    required:[true," author id is required"]
,
}, 
title:{
    type:String,
    required:[true,'title is required']
},
category:{
    type:String,
    required:[true,"category is required"]
},
content:{
    type:String,
    required:[true,"content is writ"]
}, 
isarticleactive:{
    type:Boolean,
    default:true
},
comments:[{
    type:commentschema,
    default:[true," req comment"]  }]
},

{
versionKey:false,
timestamps:true,
strict:"throw",
})

export const articlemodel=model("article",articleSchema)