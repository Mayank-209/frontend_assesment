import axios from "axios";
import React, { useState } from "react";
import { MdSend } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import FileUploadButton from "./FileUploadButton";

function SendInput() {
  const baseuri = process.env.REACT_APP_BASE_URL;
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.user);
  const { messages } = useSelector((store) => store.message);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Get token from localStorage
    if (!token) {
      console.error("No auth token found");
      return;
    }

    try {
      const res = await axios.post(
        `${baseuri}/message/send/${selectedUser?._id}`,
        { content: message },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        }
      );

      dispatch(setMessages([...messages, res?.data?.newMessage]));
    } catch (error) {
      console.log("Message send error:", error);
    }

    setMessage("");
  };

  return (
    <form onSubmit={onSubmitHandler} className="px-4 my-3">
      <div className="w-full relative flex items-center gap-2">
        <FileUploadButton />
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Send a Message..."
          className="border text-sm rounded-lg block p-3 flex-1 border-zinc-500 bg-gray-600 text-white"
        />
        <button type="submit" className="flex items-center pr-4">
          <MdSend className="text-white" />
        </button>
      </div>
    </form>
  );
}

export default SendInput;
