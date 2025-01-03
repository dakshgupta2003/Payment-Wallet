import React, { useEffect, useState } from "react";
import { message, Table, Tabs, Tooltip } from "antd";
import RequestModal from "./RequestModal";
import {
  getAllRequestsByUser,
  updateRequestStatus,
} from "../apiCalls/requests";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/loadersSlice";
import moment from "moment";
import { SetReloadUser } from "../redux/usersSlice";
const Requests = () => {
  const [data, setData] = useState([]);
  const [tabKey, setTabKey] = useState("1");
  const [showRequestModel, setShowRequestModel] = useState(false);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllRequestsByUser();
      if (response.success) {
        const sentData = response.data
          .filter((item) => item.sender._id === user._id)
          .map((item) => ({ ...item, key: item._id })); // .map adds a key prop to each item
        const receivedData = response.data
          .filter((item) => item.receiver._id === user._id)
          .map((item) => ({ ...item, key: item._id }));
        setData({
          sent: sentData,
          received: receivedData,
        });
        // console.log("this is the data:", data);
        // this data should be in "Sent" tab for the sender and "Received" tab for the receiver
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const updateStatus = async (record, status) => {
    try {
      if(status === "accepted" && record.amount>user.balance){
        message.error("Insufficient Funds")
        return;
      }
      dispatch(ShowLoading());
      const response = await updateRequestStatus({ ...record, status });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getData();
        dispatch(SetReloadUser(true))
        
      } else {
        message.error(response.message);
      }
      
      
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  const baseColumn = [
    {
      title: "Req Id",
      dataIndex: "_id", // random id
    },
    {
      title: "Sender",
      dataIndex: "sender",
      render(text, record) {
        const senderAcc = record.sender._id;
        const senderName = record.sender.name;
        return (
          <Tooltip title={senderName}>
            <h1 className="text-sm">{senderAcc}</h1>
          </Tooltip>
        );
      },
    },
    {
      title: "Receiver",
      dataIndex: "receiver",
      render(text, record) {
        const receiverAcc = record.receiver._id;
        const receiverName = record.receiver.name;
        return (
          <Tooltip title={receiverName}>
            <h1 className="text-sm">{receiverAcc}</h1>
          </Tooltip>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Date",
      dataIndex: "date",
      render(text, record) {
        return moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss A");
      },
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  const actionsColumn = {
    title: "Action",
    dataIndex: "action",
    render: (text, record) => {
      if (record.status === "pending" && record.receiver._id === user._id) {
        return (
          <div className="flex gap-2">
            <h1
              className="text-sm underline hover:no-underline cursor-pointer"
              onClick={() => updateStatus(record, "rejected")}
            >
              Reject
            </h1>
            <h1
              className="text-sm underline hover:no-underline cursor-pointer"
              onClick={() => updateStatus(record, "accepted")}
            >
              Accept
            </h1>
          </div>
        );
      } else if (record.status === "accepted" || record.status === "rejected") {
        return <h1 className="text-sm">Completed</h1>;
      }
    },
  };

  const columns = tabKey === "2" ? [...baseColumn, actionsColumn] : baseColumn;

  const tabItems = [
    {
      key: "1",
      label: "Sent",
      children: (
        <div className="overflow-auto max-h-[470px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-thumb-rounded">
          <Table columns={columns} dataSource={data.sent}></Table>
        </div>
      ),
    },
    {
      key: "2",
      label: "Received",
      children: (
        <div className="overflow-auto max-h-[570px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-thumb-rounded">
          <Table columns={columns} dataSource={data.received}></Table>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row items-start gap-4 justify-between mb-4">
        <h1 className="text-[20px]">REQUESTS</h1>
        <button
          className="py-2 px-5 rounded-lg bg-indigo-300 hover:bg-indigo-400 text-white"
          onClick={() => setShowRequestModel(true)}
        >
          Request Funds
        </button>
      </div>

      <Tabs
        className="flex"
        size="large"
        defaultActiveKey="1"
        items={tabItems}
        onChange={(key) => setTabKey(key)}
      />

      {showRequestModel && (
        <RequestModal
          showRequestModal={showRequestModel}
          setShowRequestModal={setShowRequestModel}
          reloadData = {getData}
        />
      )}
    </>
  );
};

export default Requests;
