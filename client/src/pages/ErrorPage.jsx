import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-lime-200 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl text-center max-w-md">
        <div className="text-red-500 text-6xl">⚠️</div>
        <h1 className="text-4xl font-bold mt-4">Oops!</h1>
        <p className="text-lg mt-2">The page you're looking for doesn't exist.</p>
        
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-md hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            🔙 Previous Page
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 bg-primary-200 text-white rounded-lg shadow-md transition"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
