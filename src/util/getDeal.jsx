import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCurrentDeal } from "../redux/dealSlice";

const useFetchDealBetweenUsers = (authUserId, selectedUserId, triggerRefresh) => {
  const dispatch = useDispatch();
  const [deal, setDeal] = useState(null);

  useEffect(() => {
    const fetchDeal = async () => {
      if (!authUserId || !selectedUserId) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/deal/user/${selectedUserId}`,
          { withCredentials: true }
        );
        dispatch(setCurrentDeal(res.data));
        setDeal(res.data);
      } catch (err) {
        console.error("Error fetching deal:", err);
        dispatch(setCurrentDeal(null));
        setDeal(null);
      }
    };

    fetchDeal();
  }, [authUserId, selectedUserId, triggerRefresh, dispatch]);

  return deal;
};

export default useFetchDealBetweenUsers;
