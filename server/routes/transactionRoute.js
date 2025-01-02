import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Transaction from "../models/transactionModel.js";
import User from "../models/userModel.js";
import stripe from "stripe";
import dotenv from "dotenv";
import { uuid } from "uuidv4";
dotenv.config();

const router = express.Router();

// transfer money from one accout to another account
router.post("/transfer-fund", authMiddleware, async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save(); // transaction got saved with receiver ID and sender ID

    // decrease the senders balance
    await User.findByIdAndUpdate(req.body.sender, {
      $inc: { balance: -req.body.amount }, // inc = increment
    });

    // increase the receiver's balance
    await User.findByIdAndUpdate(req.body.receiver, {
      $inc: { balance: req.body.amount },
    });

    res.send({
      message: "Transaction Succesful",
      data: newTransaction,
      success: true,
    });
  } catch (error) {
    res.send({
      message: "Transaction Failed",
      data: error.message,
      success: false,
    });
  }
});

// to trigger the transfer fund, forst we need to verify the receiver's account

// verify receiver account number

router.post("/verify-account", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.receiver });
    if (user) {
      res.send({
        message: "Account Verified",
        data: user,
        success: true,
      });
    } else {
      res.send({
        message: "Account Not Found",
        data: null,
        success: false,
      });
    }
  } catch (error) {
    res.send({
      message: "Account Not Found",
      data: null,
      success: false,
    });
  }
});

// get all transactions for a user

router.post(
  "/get-all-transactions-by-user",
  authMiddleware,
  async (req, res) => {
    try {
      const transactions = await Transaction.find({
        $or: [{ sender: req.body.userId }, { receiver: req.body.userId }],
        // we get userId from authMiddleware
      })
        .sort({ createdAt: -1 })
        .populate("sender")
        .populate("receiver");
      // sort the transactions in reverse order so that latest on appears at top

      // populate is used to replace a field in MOngoDB (that contains a ref to another Doc) with the actual document it references
      // populate("sender") replaces the sender field (ObjectId) with the full user document from User Collection

      res.send({
        message: "Transactions fetched",
        data: transactions,
        success: true,
      });
    } catch (error) {
      res.send({
        message: "Transactions not fetched",
        data: error.message,
        success: false,
      });
    }
  }
);

// deposit funds via stripe

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

router.post("/deposit-funds", authMiddleware, async (req, res) => {
  try {
    const { token, amount } = req.body;
    // create customer

    const customer = await stripeInstance.customers.create({
      email: token.email,
      source: token.id,
    });

    // create a charge
    const charge = await stripeInstance.charges.create(
      {
        amount: (amount*100),
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: "Deposited to Digi-Pay Wallet",
      },
      {
        idempotencyKey: uuid(), // it is a unique key attached to an API request that ensures that request processed only once in case if the request is sent multiple times
        // duplicate charge requests can result in multiple charges
      }
    );

    // save the transaction
    if (charge.status === "succeeded") {
      const newTransaction = new Transaction({
        sender: req.body.userId,
        receiver: req.body.userId,
        amount: amount,
        type: "deposit",
        reference: "stripe deposit",
        status: "success",
      });

      await newTransaction.save();

      // increase user's balance
      await User.findByIdAndUpdate(req.body.userId, {
        $inc: { balance: amount },
      });

      res.send({
        message: "Tranaction Succesful",
        data: newTransaction,
        success: "true",
      });
    } else {
      res.send({
        message: "Transaction Failed",
        data: charge,
        success: "false",
      });
    }
  } catch (error) {
    res.send({
      message: "Transaction Failure",
      data: error.message,
      success: "false",
    });
  }
});

export default router;
