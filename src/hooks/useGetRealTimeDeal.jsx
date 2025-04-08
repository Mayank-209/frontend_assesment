import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentDeal } from "../redux/dealSlice";

const useGetRealTimeDeal = () => {
  const { socket } = useSelector((store) => store.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    const handleNewDeal = (dealData) => {
      console.log("📦 New deal received:", dealData);
      dispatch(setCurrentDeal(dealData));
    };

    const handleUpdatedDeal = (dealData) => {
      console.log("🛠️ Deal updated:", dealData);
      dispatch(setCurrentDeal(dealData));
    };
    const handleStatusUpdate=(dealData)=>{
      console.log("🛠️ Deal updated:", dealData);
      dispatch(setCurrentDeal(dealData))
    }

    socket.on("newDeal", handleNewDeal);
    socket.on("price-negotiated", handleUpdatedDeal);
    socket.on("deal-status-updated",handleStatusUpdate)

    return () => {
      socket.off("newDeal", handleNewDeal);
      socket.off("price-negotiated", handleUpdatedDeal);
      socket.on("deal-status-updated",handleStatusUpdate)
    };
  }, [socket, dispatch]);
};

export default useGetRealTimeDeal;
