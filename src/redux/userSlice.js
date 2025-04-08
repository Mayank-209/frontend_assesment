import {createSlice} from "@reduxjs/toolkit"
const storedUser = localStorage.getItem("authUser");
const userSlice=createSlice({
  name:"user",
  initialState:{
    authUser:storedUser ? JSON.parse(storedUser) : null,
    otherUsers:null,
    selectedUser:null,
    onlineUsers:null,
    semiAuthUser:null,
  },
  reducers:{
    setAuthUser:(state,action)=>{
      state.authUser=action.payload;
      localStorage.setItem("authUser", JSON.stringify(action.payload));
    },
    setOtherUsers:(state,action)=>{
      state.otherUsers=action.payload;
    },
    setSeletedUser:(state,action)=>{
    state.selectedUser=action.payload;
    },
    setOnlineUsers:(state,action)=>{
      state.onlineUsers=action.payload
    },
    

}
})
export const {setAuthUser,setOtherUsers,setSeletedUser,setOnlineUsers}=userSlice.actions;
export default userSlice.reducer;