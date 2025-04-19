import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { setUserAuth } from "../../slice/userSlice";

const Signin = () => {
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState({
    username: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    setError((prev) => ({ ...prev, [name]: false }));
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formValues.password === "") {
      setError((prev) => ({ ...prev, ["password"]: true }));
    }
    if (formValues.username === "") {
      setError((prev) => ({ ...prev, ["username"]: true }));
    }
    if (formValues.password === "" || formValues.username === "") {
      return; // Stop form submission if there are errors
    }

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/auth/login`;
      let response = await axios.post(url, formValues);

      if (response?.status === 200) {
        toast.success("You have successfully logged in.");
        Cookies.set("auth-token", response.data.body.token, { expires: 30 });
        dispatch(setUserAuth(true));
        localStorage.setItem("isAuthorizedUser", true);
        navigate("/dashboard/home");
      }
    } catch (err) {
      // TODO: error message setup
      console.error(err);
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data.message.replace(/"/g, ""));
      }
    }
  };

  return (
    <div className="flex justify-center min-h-screen">
      <div className="px-4 rounded-lg w-full max-w-md ">
        <h2 className="text-2xl mt-4 font-bold mb-4 text-gray-800">
          Login to your account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-semibold mb-1"
            >
              Email address
            </label>
            <div className="relative">
              <input
                type="email"
                id="username"
                name="username"
                value={formValues.username}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none ${
                  error.username
                    ? "border-red-500"
                    : "border-gray-400 focus:ring-1 focus:ring-blue-600"
                }`}
                placeholder="Enter your email address"
              />
            </div>
            {error.username && (
              <p className="text-red-500">Please enter your email address</p>
            )}
          </div>

          <div className="mb-4">
            <div className="flex gap-1 items-center">
              <label
                htmlFor="password"
                className="block text-gray-700 font-semibold mb-1"
              >
                Password
              </label>
              {/* <span className="relative group">
                <FaInfoCircle /> */}
              {/* <div className="absolute w-80  bottom-full mb-2 px-2 py-1 bg-gray-100 text-black text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Use a minimum of 8 characters, including uppercase letters,
                  lowercase letters, symbols and numbers.
                </div> */}
              {/* </span> */}
            </div>
            <div className="relative">
              <input
                type={`${showPassword ? "text" : "password"}`}
                id="password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none ${
                  error.password
                    ? "border-red-500"
                    : "border-gray-400 focus:ring-1 focus:ring-blue-600"
                }`}
                placeholder="Enter your account password"
              />
              <button
                type="button"
                id="togglePassword"
                className="absolute inset-y-0 right-0 p-3 text-gray-600 focus:outline-none"
                onClick={handleTogglePassword}
              >
                {showPassword ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>
            {error.password && (
              <p className="text-red-500">Please enter your password</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            Login
          </button>

          <div className="flex justify-between mt-2">
            <Link to="/auth/register" className="text-blue-600">
              Don&apos;t have an account? Create account
            </Link>
            {/* <Link to="/sign-in/forgot-password" className="text-blue-600">
              Forgotten your password?
            </Link> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
