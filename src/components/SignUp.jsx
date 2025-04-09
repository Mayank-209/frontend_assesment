import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const baseuri=process.env.REACT_APP_BASE_URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ""
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword, role } = user;

    // if (!name || !email || !password || !confirmPassword || !role) {
    //   alert("All fields are mandatory");
    //   return;
    // }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        `${baseuri}/user/register`,
        user,
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );
      
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      console.log(error);
    }
  };

  return (
    <div className="min-w-96 mx-auto">
      <div className="w-full p-6 bg-gray-400 rounded-lg shadow-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100">
        <h1 className="text-3xl font-bold text-center">Signup</h1>
        <form onSubmit={onSubmitHandler}>
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Full Name</span>
            </label>
            <input
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full input input-bordered h-10"
              type="text"
              placeholder="Enter Your Name"
            />
          </div>

          <div>
            <label className="label p-2">
              <span className="text-base label-text">Email</span>
            </label>
            <input
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full input input-bordered h-10"
              type="email"
              placeholder="Enter Your Email"
            />
          </div>

          <div>
            <label className="label p-2">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full input input-bordered h-10"
              type="password"
              placeholder="Enter Your Password"
            />
          </div>

          <div>
            <label className="label p-2">
              <span className="text-base label-text">Confirm Password</span>
            </label>
            <input
              value={user.confirmPassword}
              onChange={(e) =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
              className="w-full input input-bordered h-10"
              type="password"
              placeholder="Re-enter Your Password"
            />
          </div>

          <div className="flex items-center my-4 gap-4">
            <label className="label cursor-pointer">
              <input
                type="radio"
                name="role"
                value="buyer"
                checked={user.role === "buyer"}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
                className="radio radio-sm mr-2"
              />
              <span className="label-text">Buyer</span>
            </label>

            <label className="label cursor-pointer">
              <input
                type="radio"
                name="role"
                value="seller"
                checked={user.role === "seller"}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
                className="radio radio-sm mr-2"
              />
              <span className="label-text">Seller</span>
            </label>
          </div>

          <p className="text-center my-2">
            Already have an account?
            <Link className="text-blue-300 ml-1" to="/login">
              Sign In
            </Link>
          </p>

          <div>
            <button
              type="submit"
              className="btn btn-block btn-sm mt-2 border border-slate-700"
            >
              Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
