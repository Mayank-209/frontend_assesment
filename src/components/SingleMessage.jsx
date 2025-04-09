import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

function SingleMessage({ message }) {
  const scroll = useRef();
  const { authUser } = useSelector((store) => store.user);
  const {selectedUser}=useSelector((store) => store.user)

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // Determine which user's profile picture to use
  const senderProfilePic = message?.senderId === authUser?.user?._id ? authUser?.user?.profilePic : selectedUser?.profilePic
  
  
  
  return (
    <div
      ref={scroll}
      className={`chat ${
        authUser?.user?._id === message?.senderId ? "chat-end" : "chat-start"
      }`}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Profile"
            src={senderProfilePic || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} // Default image in case profilePic is missing
          />
        </div>
      </div>
      <div className="chat-header">
        <time className="text-xs opacity-50 text-red-400">12:45</time>
      </div>
      <div className="chat-bubble">
        {message.type === "document" ? (
          <div className="text-sm text-blue-300">
            <p className="mb-1 font-semibold">
              📄 {message?.fileType?.toUpperCase()} File
            </p>
            <a
              href={message.content}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              View Document
            </a>
          </div>
        ) : (
          <>{message?.content}</>
        )}
      </div>
    </div>
  );
}

export default SingleMessage;
