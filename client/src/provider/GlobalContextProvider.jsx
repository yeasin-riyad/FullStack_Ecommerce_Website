import { createContext,useContext, useState  } from 'react'
import { fetchUserCartItems } from '../tools/fetchUserCartItems';
import { useDispatch, useSelector } from 'react-redux';
import { handleAddItemCart } from '../store/cartProduct';
import { useEffect } from 'react';
import { fetchOrderData } from '../tools/fetchOrderData';
import { setOrderList } from '../store/orderSlice';


export const GlobalContext=createContext(null)

export const useGlobalContext= ()=>useContext(GlobalContext)

const GlobalContextProvider = ({children}) => {
  const [totalQnty,setTotalQnty] = useState(0);
  const [totalPrice,setTotalPrice] = useState(0);
  const [totalPriceWithoutDiscount,setTotalPriceWithoutDiscount] = useState(0);
    const dispatch=useDispatch()
    const cartItems = useSelector((state) => state?.cartItem?.cart);
    

    const fetchCartItems=async()=>{
        try{
          const cartItems=await fetchUserCartItems();
          dispatch(handleAddItemCart(cartItems))
        }catch(err){
          console.error(err)
        }
      }

      const fetchUserOrderData=async()=>{
        try{
          const orderData= await fetchOrderData()
          dispatch(setOrderList(orderData))
        }catch(err){
          console.error(err)
        }
      }

      useEffect(()=>{
        fetchCartItems()
        fetchUserOrderData()
      },[])
      useEffect(() => {
        if(cartItems){
          let totalQnty = 0;
          let totalPrice = 0;
          let TotalPriceWithoutDiscount=0;
          // calculate total quantity and total price of all cart items
          cartItems.forEach((item) => {
            totalQnty += item.quantity;
            TotalPriceWithoutDiscount+=item.quantity * item.product_id.price;
                    if(item.product_id.discount){
                      const discountPrice=item.product_id.price-(item.product_id.price*(item.product_id.discount/100))
                      totalPrice += item.quantity * discountPrice;
                    }else{
                      totalPrice += item.quantity *item.product_id.price
                    }
    
            // totalPrice += item.quantity * item.product_id.price;
          });
          setTotalQnty(totalQnty);
          setTotalPrice(totalPrice);
          setTotalPriceWithoutDiscount(TotalPriceWithoutDiscount);
        }
      },[cartItems])
  return (
    <GlobalContext.Provider value={{fetchCartItems,fetchUserOrderData,totalQnty,totalPrice,cartItems,totalPriceWithoutDiscount}}>
        {children}
      
    </GlobalContext.Provider>
  )
}

export default GlobalContextProvider
