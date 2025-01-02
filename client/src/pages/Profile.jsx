import React, { useEffect, useState } from "react";
import profilePicFemale from "/images/female_pic.jpg";
import profilePicMale from "/images/male_pic.jpg";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserProfile, userDetailsUpdate } from "../apiCalls/users";
import { HideLoading, ShowLoading } from "../redux/loadersSlice";
import {SetReloadUser} from "../redux/usersSlice"
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import SureDeletionModal from "./SureDeletionModal";
import { Eye, EyeOff } from "lucide-react";
const Profile = () => {
  const { user} = useSelector((state) => state.users);
  const [showDelete, setShowDelete] = useState(false);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  // useEffect(() => {
  //   console.log(user);
  // }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: user.email,
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    gender: "",
  });

  const updateUserDetails = async (e) => {
    // console.log("formData is:", formData);
    e.preventDefault();
    if (formData.password && formData.password != formData.confirmPassword) {
      message.error("Passwords do not match");
      return;
    }
    try {
      dispatch(ShowLoading());
      const response = await userDetailsUpdate(formData);
      dispatch(HideLoading());

      if (response.success) {
        // console.log(response)
        message.success(response.message);
        dispatch(SetReloadUser(true)) // trigget the reload
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="max-w-[1170px] p-5 mx-auto overflow-y-auto sm:max-h-[600px] lg:max-h-screen scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-thumb-rounded lg:scrollbar-none">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="flex flex-col gap-5 items-start">
            <div className="w-22 h-[118px] border-2 border-black mb-6 p-2">
              {user.gender === "female" && (
                <img
                  src={profilePicFemale}
                  key={`female-${user.gender}`}
                  className="rounded-full w-24"
                  alt=""
                />
              )}
              {user.gender === "male" && (
                <img src={profilePicMale} key={`male-${user.gender}`} className="w-24" alt="" />
              )}
            </div>
            <button
              className="py-3 px-5 rounded-lg bg-red-500 hover:bg-red-600"
              onClick={() => setShowDelete(true)}
            >
              Delete Profile
            </button>

            {showDelete && (
              <SureDeletionModal
                showDelete={showDelete}
                setShowDelete={setShowDelete}
              />
            )}
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-center gap-[10px]">
            <h1 className="font-bold text-[20px]">UPDATE DETAILS</h1>
            <h3 className="text-[13px] text-red-500">* leave the field blank if you don't want to update it</h3>
            </div>
            <div className="mt-5 border-2 shadow-md border-gray-200 rounded-lg p-[15px] md:p-[30px]">
              <form onSubmit={updateUserDetails}>
                <div className="mb-5">
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pr-4 py-3 border-b border-solid border-black focus:outline-none focus:border-b-primaryColor text-[16px] leading-7  placeholder:text-textColor cursor-pointer"
                  />
                </div>

                <div className="mb-5">
                  <input
                    type="email"
                    placeholder={user.email}
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pr-4 py-3 border-b border-solid border-black focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 cursor-pointer"
                    aria-readonly
                    readOnly
                  />
                </div>

                <div className="mb-5 relative">
                  <div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pr-4 py-3 border-b border-solid border-black focus:outline-none focus:border-b-primaryColor text-[16px] leading-7  placeholder:text-textColor cursor-pointer"
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
                    className="w-full pr-4 py-3 border-b border-solid border-black focus:outline-none focus:border-b-primaryColor text-[16px] placeholder:text-textColor cursor-pointer"
                  />
                </div>

                <div className="mb-5">
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full pr-4 py-3 border-b border-solid border-black focus:outline-none focus:border-b-primaryColor text-[16px] leading-7  placeholder:text-textColor cursor-pointer"
                  />
                </div>

                <div className="mb-5 flex items-center justify-between">
                  <label className=" font-bold text-[16px] leading-7">
                    Gender:
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 rounded-none focus:outline-none"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </label>
                </div>

                <div className="mt-7">
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-indigo-300 hover:bg-indigo-400 text-white text-[18px] leading-[30px] rounded-lg"
                  >
                    Update Details
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
