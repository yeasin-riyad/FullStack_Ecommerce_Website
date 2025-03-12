import React from 'react'
import { displayPriceInTaka } from '../tools/displayPriceInTaka'
import { Link } from 'react-router-dom'
import { validUrlConvert } from '../tools/validUrlConvert'
import { priceAfterDiscount } from '../tools/priceAfterDiscount'

const CartProduct = ({data}) => {
  const url=`/product/${validUrlConvert(data?.name)}-${validUrlConvert(data?._id)}`
  // const handleAddtoCart = (e) =>{
  //   e.preventDefault()
  //   e.stopPropagation()
  //   // add to cart logic
  // }
  return (
    <Link to={url} className='lg:min-w-48 border my-1 p-4 flex flex-col gap-x-2 gap-y-1 max-w-52 rounded shadow-lg  items-start bg-white hover:shadow-inherit '>
        <div className="min-h-20 max-h-36 w-full rounded">
            <img className="w-full h-full object-scale-down lg:scale-110 rounded" src={data?.image[0]} alt="" />
        </div>
        <div className="p-1 w-fit bg-green-100 text-green-600 rounded px-2 mt-10 text-sm"> 10 min</div>
        <div className="font-medium text-ellipsis line-clamp-2 p-1 w-full">{data?.name}</div>
        <div className="w-fit">{data?.unit}</div>


        <div className="flex items-center justify-between gap-x-3">
          <div className='flex justify-between items-center w-full gap-x-2'> 
          <div className="font-semibold text-primary-200">{displayPriceInTaka(priceAfterDiscount(data?.price,data?.discount))  
             
            }
           </div>
          
                     
           
           
          </div>
           
        </div>

        <div className='flex items-center gap-x-2'>
        {
            Boolean(data?.discount) && <p className='line-through font-extralight text-gray-500'>({displayPriceInTaka(data?.price)})</p>
           }

                      { Boolean(data?.discount) && <p className=' font-bold'>-{data?.discount}%</p>}

        </div>
        <div className="w-full">
          {
            data?.stock==0 ?<button className='text-red-500'>Out of Stock</button> :""
          }

{/* <button onClick={handleAddtoCart} className='bg-primary-200 w-full text-white px-4 py-1 rounded hover:bg-lime-900'>Add To Cart</button> */}

            </div>

     
    </Link>
  )
}

export default CartProduct
