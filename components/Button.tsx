import React from 'react'
import Link from 'next/link'

const Button:React.FC<any> = ({ label, href }) => {
  return (
    <Link 
        className='block px-5 py-2 mt-3 bg-cyan-900 
        hover:bg-cyan-800 cursor-pointer rounded-lg'
        href={href}
    >

        {label}
    </Link>
  )
}

export default Button