import React from 'react'
import SingleMessage from './SingleMessage'
import useGetMessages from '../hooks/useGetMessages';
import { useSelector } from 'react-redux';
import useGetRealTimeMsg from '../hooks/useGetRealTimeMsg';

function Messages() {
  useGetMessages();
  useGetRealTimeMsg();
  const {messages}=useSelector(store=>store.message)
  
  
  return (
    <div className='px-4 flex-1 overflow-auto'>
      {
        messages && messages?.map((message)=>{
          return (
            <SingleMessage key={message._id} message={message}/>
          )
        })
      }
      
    </div>

  )
}

export default Messages
