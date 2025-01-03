import React, { useEffect, useState } from "react";
import { message, Table, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import BalanceModal from "./BalanceModal";
import moment from "moment";
import { getAllTransactionsOfUser } from "../apiCalls/transactions";
import { HideLoading, ShowLoading } from "../redux/loadersSlice";
import { SetReloadUser } from "../redux/usersSlice";

const Home = () => {
  const { user } = useSelector((state) => state.users);
  const [showBalance, setShowBalance] = useState(false);
  const [data, setData] = useState([]);
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => {
        return moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss A");
      },
    },
    {
      // autogeneratedID by mongoDB
      title: "Transaction ID",
      dataIndex: "_id",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (text, record) => {
        const senderId = record.sender?._id || record.sender;
        const receiverId = record.receiver?._id || record.receiver;
        // return record.sender === user._id ? "Debit" : "Credit"
        // console.log("sender id is: ", senderId)
        // console.log("receiver id is:", receiverId)
        if (senderId === user._id) return "Debit";
        else if (receiverId === user._id) return "Credit";
      },
    },
    {
      // if type is debit then ref account will be receivers account
      // if type is credit then ref account will be senders account
      title: "Reference Account",
      dataIndex: "",
      render: (text, record) => {
        const refAccount = user._id ? record.receiver : record.sender;
        // console.log("here is:",refAccount)
        
        if (!refAccount) {
          return (
            <Tooltip title="Unknown">
              <h1 className="text-sm">Unknown</h1>
            </Tooltip>
          );
        }

        // console.log("name is: ",refAccount.name)
        const refName = refAccount.name || "unknown";

        return (
          <Tooltip title={refName}>
            <h1 className="text-sm">{refAccount._id}</h1>
          </Tooltip>
        );
      },
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllTransactionsOfUser();
      if (response.success) {

        // sort transactions by data (newest first)
        const sortedData = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setData(sortedData.slice(0, 3)); // get the first 3 transactions
        dispatch(SetReloadUser(true))
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-md font-bold">
            Name: <span className="font-normal">{user.name}</span>
          </h1>
          <h1 className="text-md font-bold">
            Account Number: <span className="font-normal">{user._id}</span>
          </h1>
          <h1 className="text-md font-bold">
            Email: <span className="font-normal">{user.email}</span>
          </h1>
          <h1 className="text-md font-bold">
            Phone: <span className="font-normal">+91 {user.phoneNumber}</span>
          </h1>
          <h1 className="text-md font-bold">
            Identity:{" "}
            <span className="font-normal">{user.identificationType}</span>
          </h1>

          <h1 className="text-md font-bold">
            ID Number:{" "}
            <span className="font-normal">{user.identificationNumber}</span>
          </h1>
        </div>

        <div>
          <button
            className="py-3 px-5 border-2 rounded-xl text-white bg-indigo-300 hover:bg-indigo-400"
            onClick={() => setShowBalance(true)}
          >
            Check Balance
          </button>

          {showBalance && (
            <BalanceModal
              showBalance={showBalance}
              setShowBalance={setShowBalance}
            />
          )}
        </div>
      </div>

      {/* Dsiplay last 5 transactions */}
      <div className="mt-10">
        <h1 className="font-bold text-lg mb-5">Latest Transactions</h1>
        <div className="overflow-auto max-h-[345px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-thumb-rounded">
          <Table
            columns={columns}
            dataSource={data}
            rowKey="_id"
            pagination={false}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
