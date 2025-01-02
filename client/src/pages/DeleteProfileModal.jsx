import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserProfile, VerifyPassword } from "../apiCalls/users";
import { HideLoading, ShowLoading } from "../redux/loadersSlice";
import { message, Modal } from "antd";
import { useNavigate } from "react-router-dom";

const DeleteProfileModal = ({ sureDelete, setSureDelete }) => {
  const { user } = useSelector((state) => state.users);
  const [isVerified, setIsVerified] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: user.email,
    password: "",
  });

  const deleteProfile = async () => {
      try {
        dispatch(ShowLoading());
        const response = await deleteUserProfile(user);
        dispatch(HideLoading());
  
        if (response.success) {
          localStorage.removeItem("token");
          message.success("User Account Deleted Succesfully");
          navigate("/register");
        }
      } catch (error) {
        dispatch(HideLoading());
        message.error(error.message);
      }
    };

  const verifyPassword = async () => {
    try {
      dispatch(ShowLoading());
      const res = await VerifyPassword(formData);
      dispatch(HideLoading());
      if (res.success) {
        setIsVerified("true");
        deleteProfile()
        message.success(res.message);
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
        title="Password"
        open={sureDelete}
        onCancel={() => setSureDelete(false)}
        footer={null}
      >
        {(isVerified === "false" || isVerified === "") && (
          <div className="flex items-center justify-between gap-[20px]">
            <input
              className="px-2 py-1 w-full border-2 border-black rounded-[5px]"
              type="password"
              name="password"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [e.target.name]: e.target.value,
                })
              }
            />
            <button
              className="text-black py-[6.5px] px-5 rounded-[5px] bg-indigo-300 hover:bg-indigo-400"
              onClick={verifyPassword}
            >
              VERIFY
            </button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default DeleteProfileModal;
