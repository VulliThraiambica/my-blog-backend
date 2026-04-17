import {Schema,model,Types} from 'mongoose'
const userSchema = new Schema({
firstname:
{
    type:String,
    required:[true,"first name is required"]
},
lastname:{
    type:String,
},
email:{
    type:String,
    required:[true,"email required"],
    unique:true
},
password:{
    type:String,
    required:[true,"password req"],
},
role:{
    type:String,
    enum:["user","author","admin"],
    required :[true,"{value} is an invalid role "]
},
profileImageurl:{
    type:String
},
isuseractive:{
    type:Boolean,
    default:true
}
},{ timestamps:true,
    versionKey:false,
    strict:"throw"

});
export const usermodel=model("user",userSchema)