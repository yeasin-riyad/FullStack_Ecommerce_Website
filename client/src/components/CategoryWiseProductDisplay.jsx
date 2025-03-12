import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosSecure from '../tools/axiosSecure'
import CardLoading from './CardLoading'
import CartProduct from './CartProduct'
import { IoIosArrowDropleftCircle,IoIosArrowDroprightCircle } from "react-icons/io";
import { validUrlConvert } from '../tools/validUrlConvert'
import { useSelector } from 'react-redux'

const CategoryWiseProductDisplay = ({id,name}) => {
    const [loading,setLoading]=useState(false)
    const [products,setProducts]=useState([])
    const containerRef=useRef()

    // const categories = useSelector(state=>state?.products.categories);
  const subCategories = useSelector(state=>state?.products.subCategories);
  const navigate=useNavigate()
  const handleRedirectProductListPage=(id,catName)=>{
    // const subCategory = subCategories.find(subC=>{
    //   const filterData= subC?.category.some(c=>{
    //     return c._id=== id
    //   })
    //   return filterData ?true :null
      
    // });

    const subCategory = subCategories.find(subC =>
      subC?.category.some(c => c._id === id)
    );
    if(subCategory){
      const url= `/${validUrlConvert(catName)}-${id}/${validUrlConvert(subCategory.name)}-${subCategory._id}`;
        navigate(url)
    }
    
  }

    const fetchProductByCategoryId= async () => {
       try{
        setLoading(true)
        const response= await axiosSecure.post('/product/get-product-by-id',{categoryId:id})
        setProducts(response?.data?.data)

        
       }catch(err){
        console.log(err);
       }finally{
        setLoading(false)
       }
                    
    }
    useEffect(()=>{
        fetchProductByCategoryId()
    },[])

    const moveRight = ()=>{
        containerRef.current.scrollLeft+=200

    }
    const moveLeft = ()=>{
        containerRef.current.scrollLeft-=200
    }


    const loadingCardArray= new Array(6).fill(null);
  return (
    <section>
                <div>
          <div className="container mx-auto p-4 flex items-start justify-between gap-4">
            <h3 className="font-semibold text-lg md:text-xl">{name}</h3>
            <button onClick={()=>handleRedirectProductListPage(id,name)} className='text-primary-200 hover:text-primary-100'>See All</button>
          </div>

    
            <div className="grid px-4 grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-8">
                { loading && 
                    loadingCardArray?.map((_,index)=><CardLoading key={index}/>)
                }
              
            </div>
            {/* Arrow Button */}
             {
                products?.length>0 &&  <div className='px-4  gap-3 my-1 hidden lg:flex justify-end'>
                <button onClick={moveLeft} className='hover:scale-125 duration-200 text-primary-200 rounded-full'><IoIosArrowDropleftCircle size={25}/></button>
                <button  onClick={moveRight}  className='hover:scale-125 duration-200 text-primary-200  rounded-full'><IoIosArrowDroprightCircle size={25}/></button>

            </div>
             }

            <div ref={containerRef}  className='flex gap-3 lg:gap-5 px-6 overflow-x-scroll  lg:overflow-hidden scroll-smooth items-center'>
            {
                    products?.map((product,index)=>{
                        return (
                            <CartProduct data={product} key={index}/>
                        )
                    })
                }
               
            </div>

            
         
      
        </div>
    </section>
  )
}

export default CategoryWiseProductDisplay
