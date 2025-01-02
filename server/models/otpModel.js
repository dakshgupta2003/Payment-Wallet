import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
    phoneNumber:{
        type:String,
        required:true,
    },
    otp:{
        type: String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

export default mongoose.model("otp", otpSchema)