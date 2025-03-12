import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../provider/GlobalContextProvider";
import { displayPriceInTaka } from "../tools/displayPriceInTaka";
import { FaCaretRight } from "react-icons/fa";
import { BsPlus } from "react-icons/bs";
import { LuMinus } from "react-icons/lu";
import axiosSecure from "../tools/axiosSecure";
import toast from "react-hot-toast";
import { axiosToastError } from "../tools/axiosToastError";
import { priceAfterDiscount } from "../tools/priceAfterDiscount";
import imageEmpty from "../assets/empty_cart.webp";
const DisplayCartItem = ({ close }) => {
  const { totalPriceWithoutDiscount, totalPrice, cartItems, fetchCartItems ,totalQnty} =
    useGlobalContext();
    const navigate=useNavigate()
  const changeCartQuantity = async (id, quantity) => {
    try {
      const response = await axiosSecure.post("cart/update-cart-items", {
        id,
        quantity,
      });
      fetchCartItems();
      toast.success(response.data.message);
    } catch (e) {
      axiosToastError(e);
    }
  };
 
  return (
    <div className="bg-neutral-900 top-0 left-0 right-0 bottom-0 fixed bg-opacity-60 flex flex-row-reverse z-50 text-base">
      <div className="bg-white w-full lg:max-w-sm h-screen ">
        <div className="flex items-centern p-4 shadow-md gap-3 justify-between">
          <h2 className="font-semibold">Cart</h2>
          <Link to="/" className="lg:hidden">
            <IoClose size={25} />
          </Link>
          <button onClick={close} className="hidden lg:inline-block">
            <IoClose size={25} />
          </button>
        </div>
          {cartItems[0] ? (
            <>
                    <div className="min-h-[50vh] lg:min-h-[50vh] h-full  max-h-[calc(100vh-300px)] bg-blue-50 flex flex-col gap-2 py-2 overflow-auto">

              {/* Display Cart Items */}
              <div className="flex items-center justify-between gap-x-4 bg-blue-100 rounded-full px-4 py-2 text-primary-200">
                <p>Your Total Savings: </p>
                <p>
                  {displayPriceInTaka(totalPriceWithoutDiscount - totalPrice)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-2 grid gap-2">
                {
                  // Display Cart Items
                  cartItems[0] &&
                    cartItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-x-4 bg-white rounded-md px-4 py-2"
                      >
                        <img
                          src={item.product_id.image[0]}
                          alt={item.product_id.name}
                          className="w-16 h-16 object-scale-down rounded"
                        />
                        <div className="text-xs lg:text-sm">
                          <p>{item?.product_id?.name}</p>
                          <p>{item?.product_id?.unit}</p>
                          <p className="font-semibold">
                            {displayPriceInTaka(
                              priceAfterDiscount(
                                item?.product_id?.price,
                                item?.product_id?.discount
                              )
                            )}
                          </p>
                          <p className="flex items-center gap-x-1">
                            Quantity:
                            <div className="text-primary-200 font-bold">
                              <LuMinus
                                size={16}
                                className="cursor-pointer "
                                onClick={() =>
                                  changeCartQuantity(
                                    item?._id,
                                    item.quantity - 1
                                  )
                                }
                              />
                            </div>
                            <span className="mx-1">{item.quantity}</span>
                            <div className="text-primary-200">
                              <BsPlus
                                size={16}
                                className="cursor-pointer"
                                onClick={() =>
                                  changeCartQuantity(
                                    item?._id,
                                    item?.quantity + 1
                                  )
                                }
                              />
                            </div>
                          </p>
                        </div>
                      </div>
                    ))
                }
              </div>
              
              </div>

              <div className="bg-white p-4">
                <h3 className="font-semibold">Bill Details</h3>
                <div className="flex gap-4 justify-between">
                  <p>Items Total:</p>
                  <p className="flex gap-2 items-center">
                    <span className="line-through text-neutral-400">
                      {displayPriceInTaka(totalPriceWithoutDiscount)}
                    </span>
                    <span>{displayPriceInTaka(totalPrice)}</span>
                  </p>
                </div>

                <div className="flex gap-4 my-1 justify-between">
                  <p>Total Quantity:</p>
                  <p className="flex gap-2 items-center">
                    {totalQnty}
                  </p>
                </div>
                <div className="flex gap-4 my-1 justify-between">
                  <p>Delivery Charge:</p>
                  <p className="flex gap-2 items-center">
                    Free
                  </p>
                </div>

                <div className="font-semibold flex gap-2 items-center justify-between">
                    <p>Grand Total:</p>
                    <p className="">
                      {displayPriceInTaka(totalPrice)}
                    </p>
  

                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center ">
                <img
                  src={imageEmpty}
                  alt="No Items in Cart"
                  className="object-scale-down w-64 h-64 lg:w-80 lg:h-80"
                />
                <p className="text-center text-sm">No items in your cart</p>
                <Link
                  className="block my-2 bg-primary-200 px-4 py-2 text-white rounded"
                  onClick={() => close()}
                >
                  Shop Now
                </Link>
              </div>
            </>
          )}
        {cartItems[0] && (
          <div className="md:px-2">
            <div className="bg-primary-200  text-base  text-neutral-100 p-2 sticky bottom-3 rounded flex items-center justify-between">
              <p>Subtotal: {displayPriceInTaka(totalPrice)}</p>
              <button
                onClick={() => {
                  navigate("/checkout", { replace: true });
                  close();
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm "
              >
                <div className="flex gap-x-2 items-center justify-between">
                  Checkout
                  <FaCaretRight />
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayCartItem;
