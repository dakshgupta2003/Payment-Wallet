// for every api call you have to send JWT token in headers
// instead of sending in every axios.post or axios.get, better create an instance of axios 
// so by default headers will be sent in axios function 

// axios is a JS library used for making HTTP requests 
import axios from 'axios'

export const axiosInstance = axios.create({
    headers:{
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
})
