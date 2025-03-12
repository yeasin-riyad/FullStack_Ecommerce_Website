import React from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'

const MyOrder = () => {
  const orderList=useSelector((state)=>state?.orders.orderList)
  console.log(orderList,"OrderList.....")

  return (
    <div>
      <div className='bg-white shadow-md p-3 font-semibold'>
        <h1>Order</h1>
      </div>
      {
        !orderList[0] && <NoData/>
      }

      {
        orderList.map((order,index)=>{
          return (
            <div key={index} className='order-1 rounded p-4 text-sm'>
              <p>Order No : {order?.orderId}</p>
              <div className="flex gap-2 items-center">
                <img src={order.product_details.image[0]} alt="" className='w-14 h-14' />
                <p>{order.product_details.name}</p>
              </div>


            </div>
          )
        })
      }
    </div>
  )
}

export default MyOrder
