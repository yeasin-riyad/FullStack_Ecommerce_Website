import Spinner from './Spinner'

const ButtonSpinner = () => {
  return (
    <button
            type="submit"
            className="w-full flex items-center justify-center text-secondary-200 px-4 py-2 rounded mt-2 bg-primary-200"
          >
            <Spinner/>
          </button>
  )
}

export default ButtonSpinner
