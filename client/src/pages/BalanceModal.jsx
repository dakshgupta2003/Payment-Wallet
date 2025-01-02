import { message, Modal } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/loadersSlice";
import { VerifyPassword } from "../apiCalls/users";
import { SetReloadUser } from "../redux/usersSlice";
import { Eye, EyeOff } from "lucide-react";

const BalanceModal = ({ showBalance, setShowBalance }) => {
  const { user } = useSelector((state) => state.users);
  const [isVerified, setIsVerified] = useState("");
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: user.email,
    password: "",
  });

  const dispatch = useDispatch();
  const verifyPassword = async () => {
    try {
      dispatch(ShowLoading());
      const res = await VerifyPassword(formData);
      dispatch(HideLoading());
      if (res.success) {
        setIsVerified("true");
        message.success(res.message);
        dispatch(SetReloadUser(true));
      } else {
        setIsVerified("false");
        message.error(res.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  return (
    <>
      <Modal
        title={isVerified === "true" ? "Balance Amount" : "Password"}
        open={showBalance}
        onCancel={() => setShowBalance(false)}
        footer={null}
      >
        {(isVerified === "false" || isVerified === "") && (
          <div className="flex items-center justify-between gap-[20px]">
            <div className="relative w-full">
              <input
                className="px-2 py-1 w-full border-2 border-black rounded-[5px]"
                type={showPassword ? "text": "password"}
                name="password"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [e.target.name]: e.target.value,
                  })
                }
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-black">
                {showPassword ? (
                  <Eye size={22} onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <EyeOff size={22} onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>
            </div>
            <button
              className="text-black py-[6.5px] px-5 rounded-[5px] bg-indigo-300 hover:bg-indigo-400"
              onClick={verifyPassword}
            >
              VERIFY
            </button>
          </div>
        )}

        {isVerified === "true" && <h1 className="text-lg">{user.balance}$</h1>}
      </Modal>
    </>
  );
};

export default BalanceModal;
