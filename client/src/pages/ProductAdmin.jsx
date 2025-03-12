import React, { useEffect, useState } from 'react'
import { axiosToastError } from '../tools/axiosToastError'
import axiosSecure from '../tools/axiosSecure'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import NoData from '../components/NoData'
import { debounce } from "lodash"; // Import lodash for debouncing


const ProductAdmin = () => {
  const [products,setProducts]=useState([])
  const [loading,setLoading]=useState(false)
  const [search,setSearch]=useState('')
  const [page,setPage]=useState(1)
  const [totalPages,setTotalPages]=useState(1)

  const getProducts=async()=>{
    try{
      setLoading(true)
      const response= await axiosSecure.post('product/get-all-products',{
          page,
          limit:12,
          search,
      })
      if(response?.data?.success){
        // toast.success(response?.data.message)
        setProducts(response?.data?.data)
        setTotalPages(response?.data?.totalPages)
      }

    }catch(err){
      axiosToastError(err)
      console.log(err)
    }finally{
      setLoading(false)
    }
  }

  const handleNext = () =>{
    if(page<totalPages){
      setPage(page+1)
    }
  }

  const handlePrevious = () =>{
    if(page>1){
      setPage(page-1)
    }
  }
  useEffect(()=>{
    getProducts()
  },[page,totalPages])



  useEffect(()=>{
    if(search){
      const delaySearch= debounce(()=>{
        getProducts()
      },3000)
      delaySearch()
      return ()=>{
        delaySearch.cancel();
      }
    }else{
      getProducts() // when search is empty get all products again
    }
  },[search])

  if(loading) return <Loading/>
  // if(!products?.length) return <NoData/>
  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Products:-</h2>
        <div >
          <input type='text' 
          autoFocus
          value={search} 
          onChange={(e)=>{
            setSearch(e.target.value )
            setPage(1) // reset page when search change
          }} 
          className='border rounded focus-within:border-primary-200 p-2 w-full outline-none' 
          placeholder='Search product...'/>
        </div>
      
      </div>
      {!products.length && <NoData/>}
      <div className='p-4 bg-blue-50'>
      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
        {
          products?.map((product,index) =>{
            return <div key={index}><ProductCardAdmin data={product} fetchProducts={getProducts}/></div>
          })
        }
      </div>
      </div>
      {Boolean(products?.length) && <div className='flex justify-center gap-3 mt-2 '>
        {/* pagination */}
        <button disabled={page===1} onClick={handlePrevious} className='disabled:cursor-not-allowed disabled:bg-blue-50 border rounded border-primary-200 px-4 py-1 hover:bg-primary-200'>Previous</button>
        <button className='px-4 py-1 hover:bg-blue-100 rounded'>{page}/{totalPages}</button>
        <button disabled={page===totalPages} onClick={handleNext} className='disabled:cursor-not-allowed disabled:bg-blue-50 border rounded border-primary-200 px-8 py-1 hover:bg-primary-200'>Next</button>

        </div>}
    </section>
  )
}

export default ProductAdmin
