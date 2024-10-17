import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { LuEye, LuEyeOff } from "react-icons/lu";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formValues);
    if (formValues.password !== formValues.confirmPassword) {
      toast.error("Confirm password must match with Password!");
      return;
    }

    try {
      setLoading(true);
      const url = `${import.meta.env.VITE_BACKEND_URL}/auth/register`;
      let response = await axios.post(url, formValues);

      if (response?.status === 201) {
        toast.success(response.data.message);
        navigate("/auth/login", { replace: true });
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data.message.replace(/"/g, ""));
      }
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="flex justify-center min-h-screen">
      <div className="px-4 rounded-lg w-full max-w-md ">
        <h2 className="text-2xl mt-4 mb-4 font-bold text-gray-800">
          Create an account
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block text-gray-700 font-semibold mb-1"
            >
              First name
            </label>
            <div className="relative">
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formValues.firstName}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none ${
                  error.firstName
                    ? "border-red-500"
                    : "border-gray-400 focus:ring-1 focus:ring-blue-600"
                }`}
                placeholder="Enter your first name"
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="block text-gray-700 font-semibold mb-1"
            >
              Last name
            </label>
            <div className="relative">
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formValues.lastName}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none ${
                  error.lastName
                    ? "border-red-500"
                    : "border-gray-400 focus:ring-1 focus:ring-blue-600"
                }`}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-1"
            >
              Email address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none ${
                  error.email
                    ? "border-red-500"
                    : "border-gray-400 focus:ring-1 focus:ring-blue-600"
                }`}
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-1"
            >
              Password
            </label>
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
                placeholder="Enter a password"
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
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-semibold mb-1"
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                type={`${showConfirmPassword ? "text" : "password"}`}
                id="confirmPassword"
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none ${
                  error.confirmPassword
                    ? "border-red-500"
                    : "border-gray-400 focus:ring-1 focus:ring-blue-600"
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                id="toggleConfirmPassword"
                className="absolute inset-y-0 right-0 p-3 text-gray-600 focus:outline-none"
                onClick={handleToggleConfirmPassword}
              >
                {showConfirmPassword ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={loading}
          >
            <div>
              <p>Create account</p>
            </div>
          </button>

          <div className="flex justify-between mt-2">
            <Link to="/auth/login" className="text-blue-600">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
