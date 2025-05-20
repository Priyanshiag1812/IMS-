import { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/register",
        formData,
        {
          withCredentials: true,
        }
      );
      setMessage(res.data.message);
      setFormData({ fname: "", lname: "", email: "", password: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center">Register</h2>
        {message && <p className="text-center text-red-500 mt-2">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fname"
            placeholder="First Name"
            value={formData.fname}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="lname"
            placeholder="Last Name"
            value={formData.lname}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
