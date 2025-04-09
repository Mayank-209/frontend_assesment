import React, { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import OtherUsers from "./OtherUsers";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser, setOtherUsers } from "../redux/userSlice";

function SideBar() {
  const baseuri = process.env.REACT_APP_BASE_URL;
  const [search, setSearch] = useState("");
  const { otherUsers } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      // Send logout request to backend
      const res = await axios.post(
        `${baseuri}/user/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Remove token from localStorage
      localStorage.removeItem("token");

      // Clear Redux state
      dispatch(setAuthUser(null));
      dispatch(setOtherUsers(null));

      // Navigate to login
      navigate("/login");

      // Success toast
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  };

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    const otherUser = otherUsers?.find((user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase())
    );
    if (otherUser) {
      dispatch(setOtherUsers([otherUser]));
    } else {
      toast.error("User not found");
    }
  };

  return (
    <div className="border-r border-slate-500 p-4 flex flex-col">
      <form
        onSubmit={searchSubmitHandler}
        className="flex items-center gap-2"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered rounded-md"
          type="text"
          placeholder="Search..."
        />
        <button type="submit" className="btn bg-zinc-500 text-white">
          <IoSearchSharp className="w-6 h-6 outline-none" />
        </button>
      </form>
      <div className="divider px-3"></div>
      <OtherUsers />
      <div className="mt-2">
        <button onClick={logoutHandler} className="btn btn-sm btn-error text-white">
          Logout
        </button>
      </div>
    </div>
  );
}

export default SideBar;
