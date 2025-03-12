import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './route'
import { Toaster } from "react-hot-toast";
import { Provider } from 'react-redux'
import { store } from './store/store'



createRoot(document.getElementById('root')).render(
  <StrictMode>
          <Provider store={store}>
          <Toaster position="top-center" reverseOrder={false} />
          <RouterProvider router={router} />
          </Provider>


  </StrictMode>,
)
