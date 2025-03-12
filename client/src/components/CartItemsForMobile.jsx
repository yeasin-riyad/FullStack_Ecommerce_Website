import { FaCaretRight, FaCartShopping } from "react-icons/fa6";
import { useGlobalContext } from "../provider/GlobalContextProvider";
import { displayPriceInTaka } from "../tools/displayPriceInTaka";
import { Link } from "react-router-dom";
const CartItemsForMobile = () => {
    const {totalQnty,totalPrice,cartItems}=useGlobalContext()
  return (
    <>
    {
        cartItems[0] && <div className='sticky bottom-4 p-2 lg:hidden'>
        <div className='bg-primary-200 px-2 py-1 rounded text-neutral-100 text-sm flex items-center justify-between gap-3'>
            <div className="flex items-center gap-2">
                <div>  
                <FaCartShopping/>
                </div>
                <div className="text-xs">
                    <p>{totalQnty} items</p>
                    <p>${displayPriceInTaka(totalPrice)}</p>
                </div>
                
            </div>
            <Link to={"/cart"} className="flex items-center gap-1">
            <span className="text-sm">View Cart</span>
            <FaCaretRight/>
            </Link>
       

        </div>
      
    </div>
    }
    </>
  )
}

export default CartItemsForMobile
