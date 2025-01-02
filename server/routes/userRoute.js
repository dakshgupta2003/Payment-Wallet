import express from "express";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/authMiddleware.js";
// res.send() doesn't explicitly set an HTTP status code while res.status().json({}) allws control; over HTTP status code
const router = express.Router();

//  Register user account
router.post("/register", async (req, res) => {
  try {
    // check if user already exists
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.send({
        success: false,
        message: "User Already Exists",
      });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    // req.body.password is the password entered by user
    req.body.password = hashPassword;
    const newUser = new User(req.body); // all user details in req.body remains intact just the password field has been modified
    // console.log("new user is: ", newUser)
    await newUser.save();

    res.send({
      message: "User created succesfully",
      data: null,
      success: true,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

// login to user account
router.post("/login", async (req, res) => {
  try {
    //check if user exists
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.send({
        success: false,
        message: "User Not Found",
      });
    }

    //check if password is correct
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    // order matters: 1st parameter: entered plain text password, 2nd parameter: the hashed password
    // req.body.passwrod contains the password entered by user
    // user.password is the actual correct password

    if (!validPassword) {
      return res.send({
        success: false,
        message: "Wrong Password",
      });
    }

    // before generating token check if user is verified (there is a field in userModel "isVerified")
    if(!user.isVerified){
      return res.send({
        seccess:false,
        message:"User suspended or not verified by admin"
      })
    }

    //generate token for the user (important for authorization)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    // in jwt.sign, 1st parameter is the content you want to encrypt
    // expiry date is another parameter

    // after 1d, the server will not allow access to protexcted routes so user will have to re-login

    res.send({
      message: "User Succesfully Logged In",
      data: token,
      success: true,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

// get user info
router.post("/get-user-info", authMiddleware, async (req, res) => {
  // console.log('user id from middleware: ', req.body.userId)
  try {
    // the try catch block is the next method after the authmiddleWare
    const user = await User.findById(req.body.userId).select("-password");
    // select method will ommit the password and will not store it in user variable
    // console.log('fetched user: ', user)
    // user.password = "###" --> to not show actual password
    res.send({
      message: "User Info Fetched Succesfully",
      data: user,
      success: true,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

// verify password

router.post("/verify-password", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    //check if password is correct
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.send({
        success: false,
        message: "Invalid Password",
      });
    } else {
      res.send({
        success: true,
        message: "User Verified",
      });
    }
  } catch (error) {
    res.send({
      success:false,
      message: error.message,
    })
  }
});

// get all users
router.get("/get-all-users", authMiddleware, async(req,res)=>{
  try {
    const users = await User.find();
    res.send({
      message: "Users Fetched Succesfully",
      data: users,
      success:true,
    })
  } catch (error) {
    res.send({
      message: error.message,
      success:false,
    })
  }
})

// update user verified status
router.post("/update-user-verified-status", authMiddleware, async(req,res)=>{
  try {
    // we are not updating the current user (req.body.userId is the Id of curr user)
    // we are updating the status of user selected by admin
    await User.findByIdAndUpdate(req.body.selectedUser,{
      isVerified: req.body.isVerified
    })

    res.send({
      data:null,
      message:"User Verified Status Updated Succesfully",
      success:true,
    })
  } catch (error) {
    res.send({
      data:error,
      message:error.message,
      success:false,
    })
  }
})


// delete user profile
router.post("/delete-user-profile", authMiddleware, async(req,res)=>{
  try {
    
    await User.findByIdAndDelete(req.body.userId)

    res.send({
      data:null,
      message:"User Deleted Succesfully",
      success:true,
    })

  } catch (error) {
      res.send({
        data:error,
        message:error.message,
        success:false,
      })
  }
});

// update user details
router.post("/update-user-details", async(req,res)=>{
  try {
    const user = await User.findOne({email:req.body.email});

    for(const [key,value] of Object.entries(req.body)){
      if(key==="password" || key==="confirmPassword") continue;
      if(value && value.trim()){
        user[key] = value;
      }
    }

    console.log(req.body)

    if(req.body.password){
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashPassword
    }

    await user.save();

    res.send({
      data:user,
      message:"User Details Updated Succesfullt",
      success:true,
    })
    
  } catch (error) {
    res.send({
      data:error,
      message:error.message,
      success:false,
    })
  }
})

export default router;
