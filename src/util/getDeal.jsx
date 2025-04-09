import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCurrentDeal } from "../redux/dealSlice";

const useFetchDealBetweenUsers = (authUserId, selectedUserId, triggerRefresh) => {
  const baseuri = process.env.REACT_APP_BASE_URL;
  const dispatch = useDispatch();
  const [deal, setDeal] = useState(null);

  useEffect(() => {
    const fetchDeal = async () => {
      if (!authUserId || !selectedUserId) return;

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${baseuri}/deal/user/${selectedUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        dispatch(setCurrentDeal(res.data));
        setDeal(res.data);
      } catch (err) {
        console.error("Error fetching deal:", err);
        dispatch(setCurrentDeal(null));
        setDeal(null);
      }
    };

    fetchDeal();
  }, [authUserId, selectedUserId, triggerRefresh, dispatch, baseuri]);

  return deal;
};

export default useFetchDealBetweenUsers;
