import React, { useEffect, useState } from "react";
import { message } from "antd";
import { getUserInfo } from "../apiCalls/users";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetUser, SetReloadUser} from "../redux/usersSlice";
import DefaultLayout from "./DefaultLayout";

  // we need to check validity of token everytime when page refreshes and in every page
  // so we need to implement a global solution --> this is called "protected routes" concept


// whatever pages are protected, we'll wrap them in this component

const ProtectedRoute = (props) => {
  // the props are the pages that this component takes   

  // const [userData, setUserData] = useState(null) --> don't need anymore as we are using redux for global implementation

  const {user, reloadUser} = useSelector(state=>state.users)
  const dispatch = useDispatch();

  const navigate = useNavigate()

  const getData = async () => {
    try {
      const response = await getUserInfo();
      // console.log("got the data: ",response);
      if (response.success) {
        // setUserData(response.data);
        dispatch(SetUser(response.data))
        // console.log("user data has been set: ", userData);
      }
      else{
        message.error(response.message)
        navigate("/login")
      }
      dispatch(SetReloadUser(false))
    } catch (error) {
      message.error(error.message);
      navigate("/login")
    }
  };

  // this getData() should be called only when the token is present in localStorage
  useEffect(() => {
    if (localStorage.getItem("token")){
        if(!user){
            getData();
        }  
    }
    else{
        navigate("/login") // if token not present or valid then navigate the user to login page
    }
  }, []);

  useEffect(()=>{
    if(reloadUser) getData();

  },[reloadUser])

  return (user && (<div>
    <DefaultLayout>
      {props.children}
    </DefaultLayout>
    </div>));
};

export default ProtectedRoute;
