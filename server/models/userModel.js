import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    identificationType: {
      type: String,
      required: true,
    },
    identificationNumber: {
      type: String,
      required: true,
    },
    gender:{
      type:String,
      required:true
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    balance:{
      type: Number,
      default: 0, 
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    // only verified users can login

    isAdmin: {
      type: Boolean,
      default: false,
    },

    //   Only admin can verify the account of a user
  },
  {
    timestamps: true,
    // timestamps add two important fields 
    // 1. createdAt: stores the date and time when the document was firast created in DB
    // 2. updatedAt: stores the date and time when the documents was last updated 
  }
);

export default mongoose.model("users", userSchema)
