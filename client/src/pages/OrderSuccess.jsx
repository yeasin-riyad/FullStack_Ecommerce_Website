import { Link, useLocation } from "react-router-dom"

const OrderSuccess = () => {
    const location=useLocation()

  return (
    <div className="m-2 w-full max-w-md bg-primary-200 p-4 rounded mx-auto flex flex-col justify-center gap-y-3 items-center">
        <p className="text-gray-100 font-bold text-lg text-center">{location?.state?.text?location?.state?.text :"Payment"} successfully</p>
      <Link to={"/"} className="border text-gray-100 hover:text-gray-300 border-green-900 px-4 py-1">Go To Home</Link>
    </div>
  )
}

export default OrderSuccess
