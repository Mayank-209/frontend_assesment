import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./userSlice";
import messageReducer from "./messageSlice"
import socketReducer from "./socketSlice"
import dealReducer from "./dealSlice"


const store=configureStore({
  reducer:{
    user:userSlice,
    message:messageReducer,
    socket:socketReducer,
    deal: dealReducer,
  }
}
)
export default store;