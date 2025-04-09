import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

function useGetMessages() {
  const baseuri = process.env.REACT_APP_BASE_URL;
  const { selectedUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${baseuri}/message/${selectedUser?._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        dispatch(setMessages(res.data));
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedUser?._id) {
      fetchMessages();
    }
  }, [selectedUser, dispatch, baseuri]);
}

export default useGetMessages;
