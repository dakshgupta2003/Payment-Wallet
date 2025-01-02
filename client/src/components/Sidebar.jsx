import React, { createContext, useContext, useState } from "react";
import InitialsAvatar from "react-initials-avatar";
import "react-initials-avatar/lib/ReactInitialsAvatar.css";
import { ExternalLink, X } from "lucide-react";
import logo from "/images/logo1.png";
import logoText from "/images/logo2.png";
import { useSelector } from "react-redux";

// SidebarContext to convey the expanded and active states
const SidebarContext = createContext();
const Sidebar = ({ children }) => {
  const { user } = useSelector((state) => state.users);
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      <div className="h-full rounded-lg shadow-xl border-2 border-gray-200">
        <nav className="h-full flex flex-col bg-white border-r shadow-sm transition-all duration-200 ease-in-out">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              src={logo}
              className={`overflow-hidden transition-all duration-200 ease-in-out ${
                expanded ? "w-22 h-[40px]" : "w-0 h-0"
              }`}
            />
            <img
              src={logoText}
              className={`overflow-hidden transition-all duration-200 ease-in-out ${
                expanded ? "w-24 h-[35px]" : "w-0 h-0"
              }`}
            />
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 ml-1 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? <X size={21} /> : <ExternalLink size={21} />}
            </button>
          </div>

          {/* Pass expanded and active state via Context as expanded will not be accessible to SideBarItem component*/}
          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>

          <div className="border-t flex p-3 mb-3">
            <InitialsAvatar
              name={user.name}
              className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-indigo-400 text-white text-[17px] font-bold"
            />
            <div
              className={`flex justify-center items-center overflow-hidden transition-all duration-200 ease-in-out ${
                expanded ? "w-22 ml-3" : "w-0"
              }`}
            >
              <div className="leading-4">
                <h4 className="font-semibold">{user.name}</h4>
                <span className="text-xs text-gray-600">{user.email}</span>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

// Sidebar Item Component
export const SideBarItem = ({ icon, text, isActive, onClick, alert }) => {
  const { expanded } = useContext(SidebarContext);
  return (
    <>
      <div
        className={`relative flex items-center py-2 px-3 my-1 gap-3 font-medium rounded-md cursor-pointer transition-colors group ${
          isActive
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100"
            : "hover:bg-indigo-50 hover:text-gray-600"
        }`}
        onClick={onClick}
      >
        {icon}
        {expanded && (
          <span
            className={`overflow-hidden transition-all duration-200 ease-in-out ${
              expanded ? "w-40 ml-2" : "w-0"
            }`}
          >
            {text}
          </span>
        )}

        {!isActive && expanded && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
              expanded ? "" : "top-2 left-9"
            }`}
          />
        )}

        {!expanded && (
          <div className="absolute left-full rounded-md px-2 py-1 ml-5 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-20">
            {text}
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
