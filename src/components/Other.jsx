import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSeletedUser } from "../redux/userSlice";

function Other(props) {
  const dispatch = useDispatch();
  const { selectedUser,onlineUsers} = useSelector((store) => store.user);
  const user = props.user;
  const isOnline = (onlineUsers || []).includes(user._id);
  
  const selectedUserHandler = (user) => {
    console.log(user);

    dispatch(setSeletedUser(user));
  };
  return (
    <>
      <div
        onClick={() => selectedUserHandler(user)}
        className={`${
          selectedUser?._id === user?._id ? "bg-zinc-300 text-black" : ""
        } flex gap-2 items-center text-white hover:bg-zinc-300 rounded-smcp-2 cursor-pointer`}
      >
        <div className={`avatar ${isOnline?'online':''}`}>
          <div className="w-12 rounded-full ">
            <img src={user?.profilePic} alt="user-profile" />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex justify-between gap-2">
            <p>{user?.name}</p>
          </div>
        </div>
      </div>
      <div className="divider my-0 py-0"></div>
    </>
  );
}

export default Other;
