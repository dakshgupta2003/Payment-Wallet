import express, { request } from 'express'
import Request from "../models/requestsModel.js"
import User from "../models/userModel.js"
import Transaction from "../models/transactionModel.js"
import authMiddleware from '../middlewares/authMiddleware.js';



const router = express.Router();

// get all requests for a user

router.post("/get-all-requests-by-user", authMiddleware ,async(req,res)=>{
    try {
        const requests = await Request.find({
            $or: [{sender:req.body.userId},{receiver:req.body.userId}],
        }).sort({ createdAt: -1 }).populate("sender").populate("receiver")

        res.send({
            message:"Request Fetched Succesfully",
            data:requests,
            success:true,
        })
    } catch (error) {
        res.send({
            message: error.message,
            success:false,
        })
    }
})


// send a req to another user

router.post("/send-request", authMiddleware ,async(req,res)=>{
    try {
        const {receiver,amount,description} = req.body;

        const request = new Request({
            sender:req.body.userId,
            receiver,
            amount,
            description,
        })

        await request.save();

        res.send({
            message:"Request Sent Succesfully",
            data:request,
            success:true,
        })

    } catch (error) {
        res.send({
            message:error.messsage,
            success:false,
        })
    }
})

// update request status

router.post("/update-request-status", authMiddleware, async(req,res)=>{
    try {

        console.log("payload is: ", req.body);

        if(req.body.status==="accepted"){
            // add this to transactions as well
            const transaction = new Transaction({
                sender: req.body.receiver._id, // as receiver is the one who accepted the request and sent money
                receiver: req.body.sender._id,
                amount : req.body.amount,
                type:"Request",
                reference: req.body.description,
                status:"success"
            })

            await transaction.save();

            // update the balance of both users
            // 1. deduct the amount from receiver
            await User.findByIdAndUpdate(req.body.receiver._id,{
                $inc: {balance: -req.body.amount},
            });
            // 2. add the amount to the sender
            await User.findByIdAndUpdate(req.body.sender._id,{
                $inc: {balance: req.body.amount},
            });
            // 3. update the request status
            await Request.findByIdAndUpdate(req.body._id,{
                status: req.body.status,
            })
        }
        else{
            // update the request status
            await Request.findByIdAndUpdate(req.body._id,{
                status: req.body.status,
            })
        }

        res.send({
            data:null,
            message:"Request Status Updated",
            success:true,
        })
    } catch (error) {
        res.send({
            data:error,
            message:error.message
        })
    }
})

export default router; 
