import exp from 'express'
import { config } from 'dotenv'
import { connect } from 'mongoose'
import { userapp } from './api/userapi.js' 
import { authorapp } from './api/authorapi.js'
import { commonapp } from './api/commonapi.js'
import { adminapp } from './api/adminapi.js'
import  cookieParser  from "cookie-parser"
import cors from "cors"
config()
const app=exp()
app.use(exp.json())
app.use(cookieParser())
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://my-blog-frontend-tan.vercel.app"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
const port=process.env.PORT||5000
app.use("/common-api",commonapp)
app.use("/admin-api",adminapp)
app.use("/author-api",authorapp)
app.use("/user-api",userapp)

const connectDb=async()=>{
    try{
        await connect(process.env.DB_URL)
        console.log(" db connected")
        app.listen(port,()=>console.log(`server listening to ${port}.....`))
        
    }
    catch (err){
        console.log("err in db connection",err)
    }
}
connectDb();

// handle invalid path
app.use((req,res,next)=>{
    console.log(req.url)
    res.status(404).json({message:`path ${req.url} is invalid path`})
})
//handle error
app.use((err,req,res,next)=>{
 console.log(err.name)
    console.log(err.message)
  //  console.log(err.callstack)
    // validatn error 
    if(err.name==='ValidationError'){
        return res.status(400).json({message:"error occured",error:err.message})
    }
    //cast error ,// mongodb error 
    if(err.name==='CastError'){
        return res.status(400).json({message:"error occured",error:err.message })
    }
     const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code
    const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue
    if(errCode===11000){
        const field=Object.keys(keyValue)[0]
        const value=keyValue[field]
        return res.status(409).json({message:"error occured",error:`${field} "${value}" already exists`})
    }
    // send server side error 
    res.status(500).json({message:"error ocured ",error:err.message});
})