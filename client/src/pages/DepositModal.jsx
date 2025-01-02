import { message, Modal } from "antd";
import React, { useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/loadersSlice";
import { depositFunds } from "../apiCalls/transactions";

const DepositModal = ({
  showDepositModal,
  setShowDepositModal,
  reloadData,
}) => {
  const [amount, setAmount] = useState(10);
  const dispatch = useDispatch();
  const onToken = async (token) => {
    // after entering correct card details, we'll get the token which we'll have to send to backend
    // console.log(token)
    try {
      // console.log(token)
      // console.log("email is:",token.email)
      dispatch(ShowLoading());
      const res = await depositFunds({ token, amount });
      // console.log("hello the res is",res)
      dispatch(HideLoading());
      if (res.success) {
        // console.log("succesfull transactions of response")
        reloadData();
        setShowDepositModal(false);
        message.success(res.message);
      } else {
        // console.log("failed transaction")
        message.error(res.message);
      }
    } catch (error) {
      message.error(error.message);
      // console.log("error is:", error)
    }
  };
  return (
    <>
      <Modal
        title="Deposit Amount"
        open={showDepositModal}
        onCancel={() => setShowDepositModal(false)}
        footer={false}
      >
        <div className="flex flex-col">
          <input
            className="px-2 py-1 w-full border-2 border-black rounded-[5px]"
            type="number"
            value={amount} // be default in stripe you get in centts, convert it to dollars
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />

          {amount <= 0 && (
            <h1 className="mt-[3px] text-sm text-[#D3391B]">
              Please Enter a Valid Amount
            </h1>
          )}

          <div className="mt-3 flex items-center justify-end gap-3">
            <button
              className="text-black py-[6.5px] px-5 rounded-[5px] bg-indigo-300 hover:bg-indigo-400"
              onClick={() => setShowDepositModal(false)}
            >
              Cancel
            </button>

            <StripeCheckout
              token={onToken}
              currency="USD"
              amount={amount * 100}
              shippingAddress
              stripeKey="pk_test_51PUXO4EmyyaxUA9OwoxRAWOnX4CxyZLNkzOSkpzXMm9vWbS5YVkblPEnQe3d8VHVERCwGNjPsoPCbhGM8lJW3O8i00pQR3hrQ9"
            >
              <button className="text-black py-[6.5px] px-5 rounded-[5px] bg-indigo-300 hover:bg-indigo-400">
                Deposit
              </button>
              {/* when the Deposit button is clicked, onToken is executed */}
            </StripeCheckout>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DepositModal;
