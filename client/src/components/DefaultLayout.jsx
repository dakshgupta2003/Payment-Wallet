import React, { useState } from 'react'
import Sidebar, { SideBarItem } from './Sidebar'
import { ArrowRightLeft, GitPullRequest, House, LogOut, UserCog, UserRound} from 'lucide-react'
import Header from './Header'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Modal } from 'antd'

// this default layput is made because sidebar and header will be common to all \
// only the content section will change (Hoe Page, Transaction Page, etc...)
// these pages are taken as children

const DefaultLayout = ({children}) => {
  const { user } = useSelector((state) => state.users);
  const [logout, setLogout] = useState(false);
  const navigate = useNavigate()
  
  const userMenu = [
    {
        text: "Home",
        icon: <House size={20}/>,
        onClick: ()=> navigate("/"),
        path: "/",
    },

    {
        text: "Transactions",
        icon: <ArrowRightLeft size={20} />,
        onClick: ()=> navigate("/transactions"),
        path: "/transactions",
    },

    {
        text: "Requests",
        icon: <GitPullRequest size={20} />,
        onClick: ()=> navigate("/requests"),
        path: "/requests",
    },

    {
        text: "Profile",
        icon: <UserRound size={20} />,
        onClick: ()=> navigate("/profile"),
        path: "/profile",
    },
    {
        text: "Logout",
        icon: <LogOut size={20} />,
        onClick: ()=>{setLogout(true)},
        path: "/logout"
    },

  ]

  const adminMenu = [
    {
        text: "Home",
        icon: <House size={20}/>,
        onClick: ()=> navigate("/"),
        path: "/",
    },

    {
        text: "Users",
        icon: <UserCog size={20} />,
        onClick: ()=>navigate("/users"),
        path:"/users"
    },

    {
        text: "Transactions",
        icon: <ArrowRightLeft size={20} />,
        onClick: ()=> navigate("/transactions"),
        path: "/transactions",
    },

    {
        text: "Requests",
        icon: <GitPullRequest size={20} />,
        onClick: ()=> navigate("/requests"),
        path: "/requests",
    },

    {
        text: "Profile",
        icon: <UserRound size={20} />,
        onClick: ()=> navigate("/profile"),
        path: "/profile",
    },
    {
        text: "Logout",
        icon: <LogOut size={20} />,
        onClick: ()=>{
            setLogout(true);
        },
        path: "/logout"
    },

  ]

  const menuToRender = user?.isAdmin ? adminMenu : userMenu
  
  return (

    <>

    {logout && (
                <Modal
                title="Leaving so soon ?"
                open={logout}
                onCancel={()=>setLogout(false)}
                footer={false}
                >
                <div className='flex justify-end gap-3 text-white'>
                <button className='px-5 py-2 rounded-lg bg-indigo-300 hover:bg-indigo-400'
                 onClick={()=>setLogout(false)}
                >No, Cancel</button>
                <button className='px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600'
                 onClick={()=>{
                    localStorage.removeItem("token")
                    navigate("/login")
                 }}
                >Yes, Logout</button>
                </div>
                </Modal>
            )}

    <div className='flex h-screen w-screen p-3 gap-[12px]' >
        {/* <div className='sideBar'>sidebar</div> */}
        <Sidebar className="sidebar">
            {menuToRender.map((item,index)=>{
                const isActive = window.location.pathname === item.path
                return <SideBarItem 
                key = {index}
                icon={item.icon}
                text={item.text}
                isActive = {isActive}
                onClick={()=>{
                    item.onClick ? item.onClick() : navigate(item.path)
                }}
                alert
                
                />
            })}
        </Sidebar>
        <div className="w-full flex flex-col overflow-hidden">
            <Header/>
            <div className="content p-2 overflow-auto">{children}</div>
        </div>
    </div>
    </>
  )
}

export default DefaultLayout