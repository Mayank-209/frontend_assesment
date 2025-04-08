import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/userSlice";
function AuthPage() {
  const { semiAuthUser } = useSelector((store) => store.user);
  const dispatch=useDispatch()
  const navigate = useNavigate();
  const user = {
    email: semiAuthUser?.userEmail,
    subject: "Email Verification",
    message: "Verify",
    duration: "1",
  };
  const [otp, setOTP] = useState({
    otp: "",
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      console.log(user.email, otp.otp);
      const res = await axios.post("http://localhost:5000/api/v1/otp/verify", {
        email: user.email,
        otp: otp.otp,
      });
      
      
      if (!res.data.vali) {
        alert("Wrong OTP");
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/v1/user/register",
          semiAuthUser,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (res.data.success) {
          navigate("/login");
          
          toast.success(res.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      
    }
  };

  const handleResendOTP = async (e) => {
    console.log(user)
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/otp/otps",
        user,
        {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }

      );
      console.log(res)
      if (res.data.success) {
        alert("OTP has been sent to you Email address");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-w-96 mx-auto">
      <div className="w-full p-6 bg-gray-400 rounded-lg shadow-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100">
        <h1 className="text-3xl font-bold text-center">Authentication</h1>
        <form onSubmit={onSubmitHandler} action="">
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Enter OTP</span>
            </label>
            <input
              value={otp.otp}
              onChange={(e) => setOTP({ ...otp, otp: e.target.value })}
              className="w-full input input-bordered h-10"
              type="text"
              placeholder="Enter OTP"
            />
          </div>

          <div>
            <button
              type="submit"
              className="btn btn-block btn-sm mt-2 border border-slate-700"
            >
              Submit
            </button>
            <button
              onClick={handleResendOTP}
              className="btn btn-block btn-sm mt-2 border border-slate-700"
            >
              Send OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
