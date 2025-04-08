import { createSlice } from "@reduxjs/toolkit";

const dealSlice = createSlice({
  name: "deal",
  initialState: {
    currentDeal: null,  // The deal between authUser and selected user
    allDeals: [],       // Optional: if you want to show multiple deals somewhere
  },
  reducers: {
    setCurrentDeal: (state, action) => {
      state.currentDeal = action.payload;
    },
    clearCurrentDeal: (state) => {
      state.currentDeal = null;
    },
    setAllDeals: (state, action) => {
      state.allDeals = action.payload;
    },
  },
});

export const { setCurrentDeal, clearCurrentDeal, setAllDeals } = dealSlice.actions;
export default dealSlice.reducer;
