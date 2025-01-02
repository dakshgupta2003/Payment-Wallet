import { axiosInstance } from ".";

// get all requests for a user
export const getAllRequestsByUser = async () => {
  try {
    const { data } = await axiosInstance.post(
      "/api/requests/get-all-requests-by-user"
    );
    return data;
  } catch (error) {
    return error.response.message;
  }
};


// send request to another user
export const sendRequest = async(payload)=>{
    try {
        const {data} = await axiosInstance.post("/api/requests/send-request",payload)
        return data;
    } catch (error) {
        return error.response.message
    }
}

// update request status

export const updateRequestStatus = async(payload)=>{
    try {
        const {data} = await axiosInstance.post("/api/requests/update-request-status",payload)
        return data;
    } catch (error) {
        return error.response.message
    }
}