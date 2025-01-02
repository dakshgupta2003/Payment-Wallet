import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// if user is already logged in and tries to go to login or registration page through URL change then we must prevent that

const PublicRoute = (props) => {
  
  const navigate = useNavigate()

  useEffect(()=>{
    // if token is present then navigate to home page 
    if(localStorage.getItem("token")){
        navigate("/")
    }
  },[])

  return (
    // show child component (login,register)
    <div>{props.children}</div>
  )
}

export default PublicRoute