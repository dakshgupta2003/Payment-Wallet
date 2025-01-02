import { axiosInstance } from ".";

// verify reveiver account

export const VerifyAccount = async(payload)=>{
    // payload is the JWT token
    try {
        const {data} = await axiosInstance.post("/api/transactions/verify-account", payload);
        return data;
    } catch (error) {
        return error.response.data;
    }
}

// transfer funds

export const fundTransfer = async(payload)=>{
    try {
        const {data} = await axiosInstance.post("/api/transactions/transfer-fund", payload)
        return data;
    } catch (error) {
        return error.response.data;
    }
}

// get all transactions for a user

export const getAllTransactionsOfUser = async()=>{
    try {
        const {data} = await axiosInstance.post("/api/transactions/get-all-transactions-by-user")
        return data;
    } catch (error) {
        return error.response.data;
    }
}

// deposit funds using stripe

export const depositFunds = async(payload)=>{
    try {
        const {data} = await axiosInstance.post("/api/transactions/deposit-funds",payload)
        return data;
    } catch (error) {
        return error.response.message
    }
}
