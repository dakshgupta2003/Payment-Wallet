import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice"
import loadersReducer from "./loadersSlice"

// store is the combination of all reducers data
const store =  configureStore({
    reducer:{
        users: usersReducer,
        loaders: loadersReducer,
    }
})

export default store