import React from 'react'
import SideBar from './SideBar'
import MessageContainer from './MessageContainer'

function HomePage() {
  return (
    <div className='flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10'>
      <SideBar/>
      <MessageContainer/>
    </div>
  )
}

export default HomePage
