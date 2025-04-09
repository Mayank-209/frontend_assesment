import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/userSlice";

function Login() {
  const baseuri = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${baseuri}/user/login`,
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token, ...userData } = res.data;

      // Save token and user data to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("authUser", JSON.stringify(userData));

      // Set token as default Authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log('====================================');
      console.log();
      console.log('====================================');
      dispatch(setAuthUser(userData));

      // Navigate based on role
      if (userData.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      toast.success("Logged in successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    }

    setUser({
      email: "",
      password: "",
    });
  };

  return (
    <div className="min-w-96 mx-auto">
      <div className="w-full p-6 bg-gray-400 rounded-lg shadow-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100">
        <h1 className="text-3xl font-bold text-center">Login</h1>
        <form onSubmit={onSubmitHandler}>
          <div>
            <label className="label p-2">
              <span className="text-base label-text">User Email</span>
            </label>
            <input
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full input input-bordered h-10"
              type="email"
              placeholder="Enter Your Email"
              required
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
              required
            />
          </div>

          <p className="text-center my-2">
            Don’t have an account?{" "}
            <Link className="text-blue-300" to="/register">
              Sign Up
            </Link>
          </p>

          <div>
            <button
              type="submit"
              className="btn btn-block btn-sm mt-2 border border-slate-700"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
