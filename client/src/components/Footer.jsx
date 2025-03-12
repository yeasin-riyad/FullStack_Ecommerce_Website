import React from 'react'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { Link } from 'react-router-dom';
const Footer = () => {
    const linkStyle = 'rounded-full  hover:bg-primary-100'

  return (
    <footer className='px-2 container mx-auto text-center flex flex-col gap-2  lg:flex-row justify-between lg:px-4'>
      <div className=" " >
      <p>© All Right Reserved 2024</p>
      </div>

      <div className='flex items-center justify-center gap-x-2 text-xl'>
        <Link className={`${linkStyle}`}>
        <FaFacebook />
        </Link>
        <Link className={`${linkStyle}`}>
        <FaInstagram />
        </Link>
        <Link className={`${linkStyle}`}>
        <FaLinkedin />
        </Link>
        

      </div>
    </footer>
  )
}

export default Footer
