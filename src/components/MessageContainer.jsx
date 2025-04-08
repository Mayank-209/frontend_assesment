import React, { useEffect, useState } from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";
import { useDispatch, useSelector } from "react-redux";
import { setSeletedUser } from "../redux/userSlice";
import axios from "axios";
import useFetchDealBetweenUsers from "../util/getDeal";
import useGetRealTimeDeal from "../hooks/useGetRealTimeDeal";

function MessageContainer() {
  const { selectedUser, authUser } = useSelector((store) => store.user);
  const { currentDeal: deal } = useSelector((store) => store.deal);
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [newAmount, setNewAmount] = useState("");
  const [newTitle, setNewTitle] = useState("");  // Added title state
  const [newDescription, setNewDescription] = useState("");  // Added description state
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // Custom hooks
  useFetchDealBetweenUsers(authUser?._id, selectedUser?._id, refreshTrigger);
  useGetRealTimeDeal();

  const isBuyer = authUser?.role === "buyer";
  const isSeller = authUser?.role === "seller";

  const handleCreateDeal = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/deal/create",
        {
          title: newTitle,  // Sending title
          description: newDescription,  // Sending description
          price: newAmount,
          sellerId: selectedUser._id,
        },
        { withCredentials: true }
      );
      setShowModal(false);
      setRefreshTrigger((prev) => !prev);
    } catch (error) {
      console.error("Create Deal Error:", error);
    }
  };

  const handleUpdateDeal = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/deal/${deal._id}/negotiate`,
        {
          newPrice: newAmount,
          title: newTitle,  // Sending title
          description: newDescription,  // Sending description
        },
        { withCredentials: true }
      );
      setShowModal(false);
      setRefreshTrigger((prev) => !prev);
    } catch (error) {
      console.error("Negotiation Error:", error);
    }
  };

  const handleDealStatusUpdate = async (status) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/v1/deal/${deal._id}/status`,
        { status },
        { withCredentials: true }
      );
      console.log(`Deal ${status}:`, res.data);
      setRefreshTrigger((prev) => !prev);
    } catch (error) {
      console.error("Status Update Error:", error);
    }
  };

  useEffect(() => {
    return () => dispatch(setSeletedUser(null));
  }, [dispatch]);

  return (
    <>
      {selectedUser !== null ? (
        <div className="md:min-w-[550px] flex flex-col bg-zinc-900 text-white">
          {/* Header */}
          <div className="flex gap-2 items-center bg-zinc-800 px-4 py-2">
            <div className="avatar online">
              <div className="w-12 rounded-full">
                <img src={selectedUser?.profilePic} alt="user-profile" />
              </div>
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex justify-between gap-2">
                <p className="font-semibold">{selectedUser?.fullName}</p>
              </div>
            </div>
          </div>

          {/* Deal Info Section */}
          <div className="bg-zinc-700 px-4 py-3 border-b border-zinc-600">
            {deal && (
              <>
                <div className="flex justify-between items-center text-sm">
                  <p>
                    <span className="font-medium">Deal Title:</span> 
                    <span className="text-white"> {deal.title}</span>
                  </p>
                </div>
                <div className="mt-2">
                  <p>
                    <span className="font-medium">Deal Description:</span>
                    <span className="text-zinc-300 font-medium"> {deal.description}</span>
                  </p>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <p>
                    <span className="font-medium">Deal Status:</span> 
                    <span className="text-yellow-400 font-medium"> {deal.status}</span>
                  </p>
                  <p>
                    <span className="font-medium">Price:</span> 
                    <span className="text-green-400 font-medium"> ${deal.price}</span>
                  </p>
                </div>
              </>
            )}

            {/* Action Buttons */}
            {deal ? (
              <div className="mt-3">
                {deal.status === "Pending" && (
                  <>
                    <button
                      className="btn btn-sm btn-accent"
                      onClick={() => setShowModal(true)}
                    >
                      Negotiate
                    </button>
                  </>
                )}
              </div>
            ) : (
              isBuyer && (
                <div className="mt-3">
                  <button
                    className="btn btn-sm btn-accent"
                    onClick={() => setShowModal(true)}
                  >
                    Create Deal
                  </button>
                </div>
              )
            )}

            {/* Accept/Reject for Seller */}
            {isSeller && deal && deal.status === "Pending" && (
              <div className="mt-3 flex gap-2">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleDealStatusUpdate("Accepted")}
                >
                  Accept
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => handleDealStatusUpdate("Rejected")}
                >
                  Reject
                </button>
              </div>
            )}

            {/* Complete button for Buyer */}
            {isBuyer && deal && deal.status === "In Progress" && (
              <div className="mt-3">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleDealStatusUpdate("Completed")}
                >
                  Complete Deal
                </button>
              </div>
            )}

            {/* Congratulation message */}
            {deal?.status === "Completed" && (
              <div className="mt-4 text-green-400 font-semibold">
                🎉 Congratulations on making the deal!
              </div>
            )}
          </div>

          {/* Messages & Input */}
          <Messages />
          <SendInput />

          {/* Modal */}
          {showModal && (
            <dialog className="modal modal-open">
              <div className="modal-box bg-zinc-800 text-white">
                <h3 className="font-bold text-lg">
                  {deal ? "Update Deal Amount" : "Create New Deal"}
                </h3>
                <input
                  type="text"
                  placeholder="Enter deal title"
                  className="input input-bordered w-full mt-4 text-white"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <textarea
                  placeholder="Enter deal description"
                  className="input input-bordered w-full mt-4 text-white"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Enter deal amount"
                  className="input input-bordered w-full mt-4 text-white"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                />
                <div className="modal-action">
                  <button
                    className="btn btn-accent"
                    onClick={deal ? handleUpdateDeal : handleCreateDeal}
                  >
                    Submit
                  </button>
                  <button className="btn" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </dialog>
          )}
        </div>
      ) : (
        <div className="md:min-w-[450px] flex flex-col justify-center items-center">
          <h1 className="text-4xl text-white">Hello, {authUser?.fullName}</h1>
          <h1 className="text-2xl text-white">Let's Start a conversation</h1>
        </div>
      )}
    </>
  );
}

export default MessageContainer;
