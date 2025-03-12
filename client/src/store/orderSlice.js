import {createSlice} from '@reduxjs/toolkit';

const initialState ={
    orderList: [],
}

const orderSlice=createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrderList: (state, action) => {
            state.orderList = [...action.payload]
        },
    },
})

export const {setOrderList} = orderSlice.actions;
export default orderSlice.reducer;
