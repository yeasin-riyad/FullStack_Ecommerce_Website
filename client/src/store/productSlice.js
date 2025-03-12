import { createSlice } from '@reduxjs/toolkit'

const initialValue={
    categories:[],
    loadingCategories:true,
    subCategories:[],
    loadingSubCategories:true,
    loadingProducts:true,
    products:[],
}

const productsSlice = createSlice({
    name: 'products',
    initialState: initialValue,
    reducers: {
        setLoadingCategories: (state, action) => {
            state.loadingCategories = action.payload
        },
        setCategories: (state, action) => {
            state.categories = action.payload
        },
        removeCategory: (state, action) => {

            // console.log(action.payload,"Redux.......")
           const newCategories= state?.categories?.filter(singleCategory => singleCategory?._id !== action.payload)
            state.categories = newCategories || []
        },
        addCategory:(state, action) =>{
            if(action?.payload){
                state.categories.push(action.payload)
            }
        },
        editCategory: (state, action) => {
            state.categories = state?.categories?.map(singleCategory => 
                singleCategory._id === action.payload._id ? action.payload : singleCategory
            );
        },
        setSubcategories: (state, action) => {
            state.subCategories = action.payload
        },
        setLoadingSubCategories: (state, action) => {
            state.loadingSubCategories = action.payload
        },
        addSubCategory: (state, action) => {
            if(action?.payload){
                state.subCategories.push(action.payload)
            }
        },
        removeSubCategory: (state, action) => {
            const newSubCategories= state?.subCategories?.filter(singleSubCategory => singleSubCategory?._id!== action.payload)
            state.subCategories = newSubCategories || []
        },
        setProducts: (state, action) => {
            state.products = action.payload
        },
      

    },
})

export const { setLoadingCategories,setCategories, setLoadingSubCategories,setSubcategories, setProducts,removeCategory,addCategory,editCategory,addSubCategory,removeSubCategory } = productsSlice.actions
export default productsSlice.reducer;
