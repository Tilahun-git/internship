import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import exampleImage from "../../assets/download.jpg";

const backendUrl = "http://localhost:1221";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Try Admin login
    try {
      const adminRes = await axios.post(`${backendUrl}/api/admin/login`, {
        email,
        password,
      });

      const adminData = adminRes.data;

      if (adminData.success) {
        localStorage.setItem("aToken", adminData.token);
        localStorage.setItem("admin", JSON.stringify(adminData.user));
        toast.success("Admin login successful!");
        navigate("/admin");
        return;
      }
    } catch (err) {
      console.error("Admin login failed:", err);
    }

    // Try User login
    try {
      const userRes = await axios.post(`${backendUrl}/api/user/login`, {
        email,
        password,
      });

      const userData = userRes.data;

      if (userData.success) {
        localStorage.setItem("uToken", userData.token);
        localStorage.setItem("user", JSON.stringify(userData.user));
        toast.success("User login successful!");

        const role = userData.user?.role?.toLowerCase();

        switch (role) {
          case "admin":
            navigate("/admin");
            break;
          case "strategic":
            navigate("/strategic");
            break;
          case "minister":
            navigate("/minister");
            break;
          case "executive":
            navigate("/executive");
            break;
          case "workunit":
            navigate("/workunit");
            break;
          default:
            toast.error("Unknown role. Access denied.");
            navigate("/unauthorized");
        }

        return;
      } else {
        setError(userData.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("User login failed:", err);
      setError("An error occurred. Please try again later.");
      toast.error("Login error. Check credentials.");
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 bg-cover bg-center h-screen"
      style={{ backgroundImage: `url('/bg.jpg')` }}
    >
      <div className="w-full max-w-md rounded-xl bg-gradient-to-b from-purple-100/80 to-white p-8 shadow-sm backdrop-blur-md">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex h-15 w-15 items-center justify-center rounded-full bg-purple-50 overflow-hidden">
            <img src={exampleImage} alt="logo" />
          </div>

          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500">Please enter your details to sign in</p>
          </div>

          <div className="flex w-full items-center gap-2">
            <div className="h-px flex-1 bg-gray-800"></div>
            <span className="text-xs text-gray-800">or</span>
            <div className="h-px flex-1 bg-gray-800"></div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full border px-3 py-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full border px-3 py-2 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Remember for 30 days
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-500">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 cursor-pointer rounded"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
