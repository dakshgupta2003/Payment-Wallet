import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from 'cors'
import userRoute from "./routes/userRoute.js"
import transactionRoute from "./routes/transactionRoute.js"
import requestsRoute from "./routes/requestsRoute.js"
import otpRoute from "./routes/otpRoute.js"

dotenv.config();

const app = express()
const PORT = process.env.PORT || 8000

const corsOptions={
  origin: true,
}

app.get('/',(req,res)=>{
    res.send("Api is working")
})

//database connection 
mongoose.set('strictQuery',false)
const connectedDB = async () => {
    try { 
      await mongoose.connect(process.env.MONGO_URL);
      // const res = await User.updateMany({
      //   gender:{$exists:false}},
      //   {$set:{gender:"male"}} 
      // )
      // as we have added "gender" field in userModel so this code will update the previos documents in MongoDB to include the "gender" field
      console.log("MongoDB is connected");
    } catch (error) {
      console.error("Connection to MongoDB failed: ", error.message); 
    }
  };


// middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

//routes
app.use('/api/users', userRoute)
app.use('/api/transactions', transactionRoute)
app.use("/api/requests",requestsRoute)
app.use("/api/otp", otpRoute)

// add "proxy": "http://localhost:5000" in frontend (package.json file)
// this is the backend end point for the frontend

app.listen(PORT,()=>{
    connectedDB()
    console.log(`Server is listening on port ${PORT}`)
})

