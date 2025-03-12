import { createSlice } from '@reduxjs/toolkit'

const initialValue={
    _id:"",
    name:"",
    email:"",
    avatar:"",
    address_details:[],
    createdAt:"",
    last_logit_date:"",
    mobile:"",
    role:"",
    status:"",
    verified:"",
    orderHistory:[],
    shopping_cart:[]
}

export const userSlice = createSlice({
    name: 'user',
    initialState:initialValue,
    reducers: {
        setUser: (state, action) => {
            state.name=action.payload?.name;
            state.email=action.payload?.email;
            state._id=action.payload?._id;
            state.avatar=action.payload?.avatar;
            state.address_details=action.payload?.address_details;
            state.createdAt=action.payload?.createdAt;
            state.last_logit_date=action.payload?.last_logit_date;
            state.mobile=action.payload?.mobile;
            state.role=action.payload?.role;
            state.status=action.payload?.status;
            state.verified=action.payload?.verified;
            state.orderHistory=action.payload?.orderHistory;
            state.shopping_cart=action.payload?.shopping_cart;     
        },
        updateAvatar:(state, action)=>{
            state.avatar=action.payload
        },

        logout: (state) => {
            state._id=""
            state.name=""
            state.email=""
            state.avatar=""
            state.address_details=[]
            state.createdAt=""
            state.last_logit_date=""
            state.mobile=""
            state.role=""
            state.status=""
            state.verified=""
            state.orderHistory=[]
            state.shopping_cart=[]
        },
       
    },
})

export const { setUser,logout,updateAvatar } = userSlice.actions

export default userSlice.reducer