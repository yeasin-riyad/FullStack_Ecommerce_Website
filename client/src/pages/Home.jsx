import banner from '../assets/banner.jpg';
import mobileBanner from '../assets/banner-mobile.jpg';
import { useSelector } from 'react-redux';
import { validUrlConvert } from '../tools/validUrlConvert';
import { useNavigate } from 'react-router-dom';
import CategoryWiseProductDisplay from '../components/categoryWiseProductDisplay';
const Home = () => {
  const loadingCategory=useSelector(state=>state?.products.loadingCategories)
  const categories = useSelector(state=>state?.products.categories);
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
  return (
    <section className='mx-auto container bg-white'>
      <div className="container mx-auto  ">
        <div className={`w-full h-full min-h-48 bg-blue-200 rounded ${!banner && "animate-pulse"}`}>
          <img className="w-full h-full object-cover hidden lg:block" src={banner} alt="Banner" />
          <img className="w-full h-full object-cover block lg:hidden" src={mobileBanner} alt="Banner" />

        </div>
       
      </div>
      <div className='px-6 my-2 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-3'>
       {loadingCategory ? ( 
          new Array(20).fill(null).map((c,index)=>{
            return (
              <div key={index} className="bg-white p-4 grid gap-2  shadow min-h-32 animate-pulse">
                <div className="bg-blue-100 min-h-24 rounded"></div>
                <div className="bg-blue-100 h-8 rounded"></div>
              </div>
            )
          })
        ):(categories?.map((cat,index)=>{
          return (
            <div onClick={()=>handleRedirectProductListPage(cat?._id,cat?.name)} key={index}>
              <div>
                <img className='w-full h-full object-scale-down' src={cat?.image} alt={cat?.name} />
              </div>
              <div></div>
            </div>
          )
        }))}
        </div>

        {/* display category Product */}

        {
          categories?.map((cat,index)=>{
            return (
              <CategoryWiseProductDisplay key={index} id={cat?._id} name={cat?.name}/>
            )
          })
        }

    </section>
  )
}

export default Home
