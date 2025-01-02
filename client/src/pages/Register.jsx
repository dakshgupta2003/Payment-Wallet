import React, { useEffect, useState } from "react";
import { message, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import register from "/images/register.svg";
import { RegisterUser } from "../apiCalls/users";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/loadersSlice";
import { sendUserOtp, UserOTPVerify } from "../apiCalls/otps";
const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [verified, setVerified] = useState(false);
  const [sentOTP, setSentOTP] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log("Form Data: ", formData);

    // to signUp only after OTP verification --> but sadly Twilio sends OTP to numbers that are verified by Twilio
    
    // if(!verified){  
    //   message.error("Complete OTP Verification to SignUp");
    //   return;
    // }
    for (const [key, value] of Object.entries(formData)) {
      if (!value.trim()) {
        message.error(`Please fill the ${key} field.`);
        return;
      }

      if (formData.password != formData.confirmPassword) {
        message.error("Passwords do not match");
        return;
      }
    }
    try {
      dispatch(ShowLoading());
      const res = await RegisterUser(formData);
      dispatch(HideLoading());
      if (res.success) {
        // console.log("all ok")
        message.success(res.message);
        navigate("/login");
      } else {
        message.error(res.message);
        // console.log("not ok")
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(res.message);
      // console.log(error,"error caught")
    }
  };

  const sendOTP = async () => {
    // console.log("hello")
    if (!formData.phoneNumber && !formData.phoneNumber.trim()) {
      message.error("Mobile Number Field Empty");
      return;
    }

    // console.log(formData.phoneNumber)

    try {
      dispatch(ShowLoading());
      // console.log(formData.phoneNumber)
      const otp = await sendUserOtp({ phoneNumber: formData.phoneNumber });
      dispatch(HideLoading());

      if (otp.success) {
        message.success(otp.message);
        setShowOtpModal(true);
        // console.log("the otp response is:", otp)
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const verifyOTP = async () => {
    if (!sentOTP && !sentOTP.trim()) {
      message.error("Enter OTP Sent on Mobile");
      return;
    }
    // console.log(sentOTP)
    try {
      dispatch(ShowLoading());
      const response = await UserOTPVerify({
        phoneNumber: formData.phoneNumber,
        sentOTP,
      });
      dispatch(HideLoading());
      
      if (response.success) {
        message.success("OTP Verified Succesfully");
        setShowOtpModal(false)
        setVerified(true);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phoneNumber: "",
    identificationType: "",
    identificationNumber: "",
    gender: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="flex items-center justify-center px-5 lg:px-0 h-[100vh]">
        <section className="px-5 xl:px-0">
          <div className="max-w-[1170px] mt-16 lg:mt-0 mx-auto rounded-lg p-5 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="hidden lg:block rounded-lg">
                <figure className="rounded-lg">
                  <img src={register} alt="" className="w-full rounded-lg" />
                </figure>
              </div>

              <div className="rounded-lg lg:pl-16">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[22px] font-bold">
                      Create an
                      <span className="ml-2 text-primaryColor text-[22px]">
                        account
                      </span>
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 pr-3">
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleInputChange}
                      required
                    />{" "}
                    <label htmlFor="male" className="cursor-pointer">
                      Male
                    </label>
                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={handleInputChange}
                      required
                    />{" "}
                    <label htmlFor="female" className="cursor-pointer">
                      Female
                    </label>
                  </div>
                </div>

                <form onSubmit={submitHandler}>
                  <div className="mb-2">
                    <input
                      type="text"
                      placeholder="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pr-4 py-3 border-b border-solid border-black focus:outline-none focus:border-b-primaryColor text-[16px] placeholder:text-textColor cursor-pointer"
                    />
                  </div>

                  <div className="mb-2">
                    <textarea
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Address"
                      rows="2"
                      className="w-full pr-4 py-3 border-b border-solid border-black focus:outline-none focus:border-b-primaryColor text-[16px] placeholder:text-textColor cursor-pointer"
                    />
                  </div>

                  <div className="mb-2">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      required
                      className="w-full pr-4 py-3 border-b border-solid border-black focus:outline-none focus:border-b-primaryColor text-[16px] placeholder:text-textColor cursor-pointer"
                    />
                  </div>

                  <div className="mb-2 relative">
                    <div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        required
                        className="w-full pr-4 py-3 border-b border-solid border-black focus:outline-none focus:border-b-primaryColor text-[16px] placeholder:text-textColor cursor-pointer"
                      />
                    </div>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-black">
                      {showPassword ? (
                        <Eye
                          size={22}
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      ) : (
                        <EyeOff
                          size={22}
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      )}
                    </div>
                  </div>

                  <div className="mb-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm Password"
                      required
                      className="w-full pr-4 py-3 border-b border-solid border-black focus:outline-none focus:border-b-primaryColor text-[16px] placeholder:text-textColor cursor-pointer"
                    />
                  </div>

                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Mobile Number"
                        required
                        className="w-full pr-4 py-3 border-b border-solid border-black focus:outline-none focus:border-b-primaryColor text-[16px] placeholder:text-textColor cursor-pointer"
                      />
                    </div>

                    <div className="mr-2">
                      <button
                        className="px-4 py-2 bg-indigo-300 hover:bg-indigo-400 text-white rounded-lg"
                        onClick={() => {
                          // {formData.phoneNumber && setShowOtpModal(true)}
                          sendOTP();
                        }}
                      >
                        Send OTP
                      </button>
                    </div>

                    {showOtpModal && (
                      <Modal
                        title="VERIFY OTP"
                        open={showOtpModal}
                        onCancel={() => setShowOtpModal(false)}
                        footer={false}
                      >
                        <h1 className="font-bold mb-2">
                          Enter OTP Sent on +91 {formData.phoneNumber}
                        </h1>
                        <div className="flex items-center justify-between gap-[20px]">
                          <div className="relative w-full">
                            <input
                              className="px-2 py-1 w-full border-2 border-black rounded-[5px]"
                              type="text"
                              value={sentOTP}
                              onChange={(e) => setSentOTP(e.target.value)}
                            />
                          </div>
                          <button
                            className="text-black py-[6.5px] px-5 rounded-[5px] bg-indigo-300 hover:bg-indigo-400"
                            onClick={verifyOTP}
                          >
                            VERIFY
                          </button>
                        </div>
                      </Modal>
                    )}
                  </div>

                  <div className="flex items-center gap-[30px] justify-between">
                    <select
                      name="identificationType"
                      value={formData.identificationType}
                      onChange={handleInputChange}
                      id=""
                      className="text-textColor font-semibold text-[15px] px-4 py-3 rounded-none focus:outline-none"
                    >
                      <option value="Identity">Identity</option>
                      <option value="Aadhar">Aadhar</option>
                      <option value="PanCard">Pan Card</option>
                      <option value="Passport">Passport</option>
                      <option value="License">Driving License</option>
                    </select>

                    <div className="mb-5">
                      <input
                        type="text"
                        name="identificationNumber"
                        value={formData.identificationNumber}
                        onChange={handleInputChange}
                        placeholder="Identity Number"
                        required
                        className="w-full pr-4 py-3 border-b border-solid border-black focus:outline-none focus:border-b-primaryColor text-[16px] placeholder:text-textColor cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="w-full px-4 py-3 bg-primaryColor text-white text-[18px] rounded-lg"
                    >
                      Sign Up
                    </button>
                  </div>

                  <p className="mt-5 text-textColor text-center">
                    Already have an account ?
                    <Link
                      to="/login"
                      className="text-primaryColor font-medium ml-1"
                    >
                      Login
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Register;
