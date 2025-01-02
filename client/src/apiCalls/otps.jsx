import {axiosInstance} from "."

// sendOTP

export const sendUserOtp = async(payload)=>{
    try {
      const {data} = await axiosInstance.post("/api/otp/send-otp", payload)
      return data;
    } catch (error) {
      return error.response.data;
    }
  }

export const UserOTPVerify = async(payload)=>{
    try {
        const {data} = await axiosInstance.post("/api/otp/verify-otp", payload)
        return data;
      } catch (error) {
        return error.response.data;
      }
}

