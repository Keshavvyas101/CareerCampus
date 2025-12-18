import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {toast} from "react-hot-toast";
import { Link } from "react-router-dom";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;



const Login = () => {
  const navigate = useNavigate();
  const {setAuthenticated} = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const {name, value} = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const submitHandler = async (event) => {
    event.preventDefault();
    const {email, password} = formData;

    if (!email || !password) {
      toast.error("Both email and password are required.");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        formData,
        {withCredentials: true}
      );

      if (response.status === 200) {
        toast.success("Login successful!");
        setAuthenticated(true);
        setFormData({email: "", password: ""});
        navigate("/dashboard");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2 text-blue-900">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Log in to manage your applications
        </p>

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          

          <Link to="/signup" className="text-blue-700 hover:underline">
    Sign up
    </Link>
         

          
        </p>
      </div>
    </div>
  );
};

export default Login;
