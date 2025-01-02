import {createSlice} from "@reduxjs/toolkit"

const loaderSlice = createSlice({
    name: "loaders",
    initialState: {
        loading: false,
    },
    reducers:{
        // show and hide loader
        ShowLoading: (state)=>{
            state.loading = true;
        },
        HideLoading: (state)=>{
            state.loading = false;
        }
    }
})

export const {ShowLoading, HideLoading} = loaderSlice.actions
export default loaderSlice.reducer

// now integrate this slice into the store for global access