import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { HideLoading, ShowLoading } from '../redux/loadersSlice'
import { getAllUsers, updateVerifiedStatus } from '../apiCalls/users'
import { message, Table } from 'antd'
import { SetReloadUser } from '../redux/usersSlice'

const Users = () => {
  const [users,setUsers] = useState([])
  const dispatch = useDispatch()

  const getData = async()=>{
    try {
        dispatch(ShowLoading());
        const response = await getAllUsers();
        dispatch(HideLoading())

        if(response.success){
            // filter user to exclude admin details
            const filteredUsers = response.data.filter((user)=> user.isAdmin===false)
            setUsers(filteredUsers);
            message.success(response.message);
        }else{
            message.error(response.message);
        }
    } catch (error) {
        dispatch(HideLoading())
        message.error(error.message)
    }
  };

  const updateStatus = async(record,isVerified)=>{
    try {
        dispatch(ShowLoading())
        const response = await updateVerifiedStatus({
            selectedUser : record._id,
            isVerified,
        })
        dispatch(HideLoading())

        if(response.success){
            message.success(response.message)
            getData();
            dispatch(SetReloadUser(true))
        } else{
            message.error(response.message)
        }
    } catch (error) {
        dispatch(HideLoading())
        message.error(error.message)
    }
  }

  useEffect(()=>{
    getData()
  },[])

  const columns = [
    {
        title: "Name",
        dataIndex:"name",
    },
    {
        title: "Email",
        dataIndex:"email",
    },
    {
        title: "Phone",
        dataIndex:"phoneNumber",
    },
    {
        title: "Balance",
        dataIndex:"balance",
    },
    {
        title:"Verified",
        dataIndex: "isVerified",
        render:(text,record)=>{
            return text ? "Yes" : "No"
            // text = true or false (verified or not verified)
            // if verified then show Yes otherwize No
        }
    },
    {
        title: "Actions",
        dataIndex: "actions",
        render: (text,record)=>{
            return <div className='flex gap-2'>
                {record.isVerified ? (
                    <button className="py-2 px-5 rounded-lg bg-indigo-200 hover:bg-indigo-400"
                    onClick={()=>updateStatus(record,false)}
                    >Suspend</button>
                    // record contains the details of that row in the table from the details in columns array

                ): (<button className="py-2 px-5 rounded-lg bg-indigo-200 hover:bg-indigo-400"
                 onClick={()=>updateStatus(record,true)}
                >Activate</button>)}
            </div>
        }
    }
  ]

  return (
    <>
    <div>
        <h1 className='text-[20px]'>USERS</h1>
        <div className="mt-5 overflow-auto max-h-[519px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-thumb-rounded">
            <Table columns={columns} dataSource={users} rowKey="_id" />
        </div>
    </div>
    </>
  )
}

export default Users