import React, {useState} from 'react'
import {message} from "antd"
import { Link, useNavigate } from 'react-router-dom'
import work from "/images/log.svg";
import { LoginUser } from '../apiCalls/users';
import {Eye, EyeOff} from "lucide-react"

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const handleSubmit = async(e)=>{
    e.preventDefault();
    // console.log("Form Data: ",formData);
    try {
      const res = await LoginUser(formData)
      if(res.success){
        message.success(res.message)
        localStorage.setItem("token", res.data) // store the data in local storage after succesful login
        // navigate('/')
        window.location.href = "/"; // as sometimes navigate() loads the homepage before putting the data in localstorage
      }
      else{
        message.error(res.message)
      }
      
    } catch (error) {
      message.error(error.message)
    }
  }
  const [formData, setFormData] = useState({
    email:"",
    password:"",
  });

  const handleInputChange = (e)=>{
    setFormData({...formData, [e.target.name]:e.target.value});
  }
  return (
    <div className='flex items-center justify-center h-[100vh]'>
      <section className="px-5 lg:px-0">
        <div className="w-full md:max-w-[1170px] mx-auto rounded-lg p-5 shadow-md md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="hidden lg:block rounded-lg">
              <figure className="rounded-lg">
                <img src={work} alt="" className="w-full rounded-lg" />
              </figure>
            </div>

            <div className="sm:w-[500px] rounded-lg lg:pl-16">
              <h3 className='text-headingColor text-[25px] sm:text-[35px] font-bold mb-10'>
                Hello! <span className='text-primaryColor'>Welcome</span> Back
              </h3>

              <form className='py-4 md:py-0' onSubmit={handleSubmit}>
                
                <div className="mb-5">
                  <input
                    type="email"
                    name='email'
                    onChange={handleInputChange}
                    placeholder="Email"
                    required
                    className="w-full pr-4 py-3 border-b border-solid border-black focus:outline-none focus:border-b-primaryColor text-[18px] sm:text-[20px] placeholder:text-textColor cursor-pointer"
                  />
                </div>

                <div className="mb-2 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name='password'
                    onChange={handleInputChange}
                    placeholder="Password"
                    required
                    className="w-full pr-4 py-3 border-b border-solid border-black focus:outline-none focus:border-b-primaryColor text-[18px] sm:text-[20px] placeholder:text-textColor cursor-pointer"
                  />
                  <div className='absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-black'>
                    {showPassword ? <Eye size={22} onClick={()=>setShowPassword(!showPassword)}/> : <EyeOff size={22} onClick={()=>setShowPassword(!showPassword)}/>}
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-primaryColor text-white text-[18px] sm:text-[20px] rounded-lg"
                  >
                    Login
                  </button>
                </div>

                <p className="mt-5 text-textColor text-center text-[18px] sm:text-[20px]">
                  Don't have an account ?
                  <Link
                    to="/register"
                    className="text-primaryColor font-medium ml-1"
                  >
                    Signup
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
    
  )
}

export default Login