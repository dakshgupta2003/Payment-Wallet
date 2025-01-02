import {createSlice} from '@reduxjs/toolkit'

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        user:null,
        reloadUser:false
    },
    reducers:{
        SetUser(state, action){
            state.user = action.payload;
        },
        SetReloadUser(state,action){
            state.reloadUser = action.payload
        }
        // whenever the reloadUser is true, the user will be reloaded
    }
})

export const {SetUser, SetReloadUser} = usersSlice.actions
export default usersSlice.reducer