import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const useGetRealTimeMsg = () => {
const { messages } = useSelector((store) => store.message);
const { socket } = useSelector((store) => store.socket);
const dispatch = useDispatch();

useEffect(() => {
   const handleNewMessage = (newMessage) => {
      console.log("🔔 New message received from socket:", newMessage);

      // ensure messages is always an array
      const updatedMessages = Array.isArray(messages) ? messages : [];

      dispatch(setMessages([...updatedMessages, newMessage]));
   };

   socket?.on("newMessage", handleNewMessage);

   return () => {
      socket?.off("newMessage", handleNewMessage);
   };
  }, [socket, messages, dispatch]); // 👈 include messages in deps
};

export default useGetRealTimeMsg;
