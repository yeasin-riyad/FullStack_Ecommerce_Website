import React from 'react'
import { Link } from 'react-router-dom'

const OrderCancel = () => {
  return (
     <div className="m-2 w-full max-w-md bg-red-200 p-4 rounded mx-auto flex flex-col justify-center gap-y-3 items-center">
            <p className="text-red-500 font-bold text-lg text-center">Failed !!</p>
          <Link to={"/"} className="border text-red-500 hover:text-red-600 border-green-900 px-4 py-1">Go To Home</Link>
        </div>
  )
}

export default OrderCancel
