import React from 'react'
import NoDataImage from '../assets/NoData.webp'

const NoData = ({text}) => {
  return (
    <div className='flex flex-col justify-center items-center p-2'>
        <img className='w-32' src={NoDataImage} alt="NoData Image" />
        <h2 className='text-neutral-500'>{`No Data Found ${text}`}</h2>
      
    </div>
  )
}

export default NoData
