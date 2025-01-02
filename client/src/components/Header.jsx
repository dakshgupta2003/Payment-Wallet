import React from 'react'
import { useSelector } from 'react-redux'

const Header = () => {
  const { user } = useSelector((state) => state.users);
  const role = user.isAdmin ? "Admin" : "User"
  return (
    <div className="p-[15px] w-full rounded-md bg-indigo-400 border-2 text-white flex items-center relative">

      <h1 className="text-xl font-bold absolute left-1/2 transform -translate-x-1/2" style={{fontFamily: "Playwrite AU SA, serif"}}>
      {/* setting the text at 50% of parent's width (left-1/2) and then translating it left by 50% of its own width */}
        DIGIPAY
      </h1>
      {/* Right Aligned User Name */}
      <h1 className="text-sm ml-auto">Role: {role}</h1>
    </div>
  );
};

export default Header;
