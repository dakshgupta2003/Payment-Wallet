import { axiosInstance } from ".";

// login user

export const LoginUser = async (payload) => {
  // payload is the data from the loginPage content user has typed
  try {
    const { data } = await axiosInstance.post("/api/users/login", payload);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

// register user

export const RegisterUser = async (payload) => {
  try {
    const { data } = await axiosInstance.post("/api/users/register", payload);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

// get user info

export const getUserInfo = async ()=>{
  try {
    const {data} = await axiosInstance.post("/api/users/get-user-info");
    return data;
  } catch (error) {
    return error.response.data
  }
}

// verify password

export const VerifyPassword = async (payload)=>{
  try {
    const {data} = await axiosInstance.post("/api/users/verify-password", payload);
    return data;
  } catch (error) {
     return error.response.data;
  }
}


// get all users

export const getAllUsers = async()=>{
  try {
    const {data} = await axiosInstance.get("/api/users/get-all-users");
    return data;
  } catch (error) {
     return error.message.data
  }
}

// update user verified status

export const updateVerifiedStatus = async (payload)=>{
  try {
    const {data} = await axiosInstance.post("/api/users/update-user-verified-status", payload)
    return data;
  } catch (error) {
    return error.response.data
  }
}

// delete user account

export const deleteUserProfile = async(payload)=>{
  try {
    const {data} = await axiosInstance.post("/api/users/delete-user-profile", payload)
    return data;
  } catch (error) {
    return error.resonse.data;
  }
}

// update user details

export const userDetailsUpdate = async(payload)=>{
  try {
    const {data} = await axiosInstance.post("/api/users/update-user-details", payload)
    return data;
  } catch (error) {
    return error.resonse.data;
  }
}

