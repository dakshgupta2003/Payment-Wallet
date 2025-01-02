import express from "express";
import OTP from "../models/otpModel.js";
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

const router = express.Router();

// send otp
router.post("/send-otp", async (req, res) => {
  try {
    const generatedOTP = Math.floor(100000 + Math.random() * 900000);
    // console.log("this is otp: ",generatedOTP)
    const { phoneNumber } = req.body;
    // console.log(phoneNumber)
    const formattedPhoneNumber = phoneNumber.startsWith("+91")
      ? phoneNumber
      : `+91${phoneNumber}`;

    // console.log("format: ", formattedPhoneNumber)

    const otp = new OTP({
      phoneNumber: formattedPhoneNumber,
      otp: generatedOTP,
    });

    await otp.save();

    // console.log("otp document is: ", otp)
    const accountSID = process.env.ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSID, authToken);

    // console.log("client is:",client)

    const clientResponse = await client.messages.create({
      body: `Your DigiPay Verification Code is: ${generatedOTP}`,
      from: "+12315155144",
      to: formattedPhoneNumber,
    });

    // console.log("res is: ", clientResponse)

    res.send({
      data: clientResponse,
      message: "OTP sent succesfully",
      success: true,
    });
  } catch (error) {
    res.send({
      data: error.message,
      message: "Failed to send OTP",
      success: false,
    });
  }
});

// otp verfication

router.post("/verify-otp", async (req, res) => {
  const { phoneNumber, sentOTP } = req.body;
//   console.log(phoneNumber, sentOTP);
//   console.log(req.body);
  try {
    const formattedPhoneNumber = phoneNumber.startsWith("+91")
      ? phoneNumber
      : `+91${phoneNumber}`;
    // get otp from mongoDB document
    const otpDoc = await OTP.findOne({ phoneNumber:formattedPhoneNumber, otp: sentOTP });
    // console.log("otpDoc is:", otpDoc);
    if (!otpDoc) {
      return res.send({
        message: "Invalid OTP",
        success: false,
      });
    }

    console.log("hello ji")


    // check if OTp has expired
    const otpCreationTime = otpDoc.createdAt;
    const otpExpiryTime = 2 * 60 * 1000; // 2 min
    const currTime = Date.now();
    // console.log("hello ji1")

    // if (currTime - otpCreationTime > otpExpiryTime) {
    //   return res.send({
    //     message: "OTP Expired",
    //     success: false,
    //   });
    // }

    // console.log("hello ji2")


    // console.log("hello ji")

    res.send({
      success: true,
      message: "OTP Verified Succesfully",
      data: otpDoc,
    });
  } catch (error) {
    res.send({
      data: error.message,
      message: "OTP Verification Failed",
      success: false,
    });
  }
});

export default router;
