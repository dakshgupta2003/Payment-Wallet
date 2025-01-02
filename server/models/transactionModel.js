import mongoose from "mongoose"


const transactionSchema = new mongoose.Schema({
    amount:{
        type: Number,
        required: true
    },
    sender:{ // it will be the userId
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", // as it will be present in users collection
        required: true
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true, 
    },
    type:{
        type: String,
        required: true
    },
    reference:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
},{
    timestamps: true,
});

export default mongoose.model("transactions", transactionSchema);