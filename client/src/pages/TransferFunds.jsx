import React, { useEffect, useState } from "react";
import { Modal , message} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fundTransfer, VerifyAccount } from "../apiCalls/transactions";
import { ShowLoading, HideLoading } from "../redux/loadersSlice";
import { SetReloadUser } from "../redux/usersSlice";

const TransferFunds = ({
  showTransferFunds,
  setShowTransferFunds,
  reloadData,
}) => {
  const { user } = useSelector((state) => state.users);
  const [isVerified, setIsVerified] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const transactionType = user._id === accountNumber ? "Credit": "Debit";

  const dispatch = useDispatch();
  const verifyAccount = async () => {
    try {
      dispatch(ShowLoading());
      const res = await VerifyAccount({
        receiver: accountNumber,
      });
      dispatch(HideLoading());
      if (res.success) {
        setIsVerified("true");
      } else {
        setIsVerified("false");
      }
    } catch (error) {
      dispatch(HideLoading());
      setIsVerified("false");
    }
  };

  const finishTransfer = async()=>{
    try {

        dispatch(ShowLoading())
        const payload = {
            sender: user._id,
            receiver: accountNumber, 
            type: transactionType,
            reference: description,
            amount,
            status: "success"
        };
        const response = await fundTransfer(payload)
        console.log("this is res:", response)
        if(response.success){
            reloadData();
            setShowTransferFunds(false);
            message.success(response.message)
            dispatch(SetReloadUser(true)) // this will reload the user details (see protected routes and redux)
        }
        else{
            message.error(response.message)
        }
        dispatch(HideLoading())
    } catch (error) {
        message.error(error.message)
        dispatch(HideLoading()) 
    }
  }

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsVerified("");
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [isVerified]);

  return (
    <>
      <Modal
        title="Transfer Funds"
        open={showTransferFunds}
        onCancel={() => setShowTransferFunds(false)}
        footer={null}
      >
        {/* form for transfer page */}
        <div className="p-3 border-2 shadow-md rounded-lg">
          <div className="mb-3">
            <h1 className="font-semibold">Account Number</h1>
            <div className="flex items-center justify-between gap-[20px]">
              <input
                className="px-2 py-1 w-full border-2 border-black rounded-[5px]"
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
              <button
                className="text-black py-[6.5px] px-5 rounded-[5px] bg-indigo-300 hover:bg-indigo-400"
                onClick={verifyAccount}
              >
                VERIFY
              </button>
            </div>
            {isVerified === "true" && (
              <div className="mt-2 bg-[#107010] text-white p-[10px] rounded-[3px]">
                <h1 className="text-sm">Account Verified Succesfully</h1>
              </div>
            )}

            {isVerified === "false" && (
              <div className="mt-2 bg-[#D3391B] text-white p-[10px] rounded-[3px]">
                <h1 className="text-sm">Invalid Account</h1>
              </div>
            )}
          </div>

          <div className="text-black">
            <h1 className="font-semibold">Amount</h1>
            <input
              className="px-2 py-1 w-full border-2 border-black rounded-[5px]"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </div>

          {user.balance < amount && (
            <h1 className="mt-[3px] text-sm text-[#D3391B]">
              Insufficient Balance
            </h1>
          )}

          <div className="mt-3">
            <h1 className="font-semibold">Description</h1>
            <textarea className="px-2 py-1 border-2 border-black rounded-[5px] w-full" value={description} onChange={(e)=>setDescription(e.target.value)} ></textarea>
          </div>

          <div className="mt-3 flex items-center justify-end gap-[10px]">
            <button className="text-black py-[6.5px] px-5 rounded-[5px] bg-indigo-300 hover:bg-indigo-400" onClick={() => setShowTransferFunds(false)}>
              Cancel
            </button>

            {user.balance >= amount && isVerified=="true" && amount>0 && (
              <button className="text-black py-[6.5px] px-5 rounded-[5px] bg-indigo-300 hover:bg-indigo-400"
              onClick={finishTransfer}
              >
                Transfer
              </button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TransferFunds;