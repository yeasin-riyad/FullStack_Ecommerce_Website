const DisplaySubCatSkeleton = () => {
  return (
    <div>
      {
        new Array(10).fill(null).map((__,i)=>{
            return (
                <div key={i} className='w-full lg:h-14  bg-white p-2 flex flex-col gap-1  border border-b items-center justify-center lg:flex-row  lg:items-center lg:justify-start'>
                  <div className='w-1/3 h-full flex items-center bg-gray-300 justify-center  lg:ml-2'>
                    {/* <img className='w-14   object-scale-down h-full lg:h-14' src={""} alt="subCategoryImg" /> */}
                  
                </div>
                <p className=' h-full w-2/3  bg-gray-200 text-xs lg:text-sm text-center lg:text-left '>
                 
                </p>
                </div>
              )
        })
      }
    </div>
  )
}

export default DisplaySubCatSkeleton
