import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { loginUser } from "../../services/api";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      // Real backend login
      const data = await loginUser({
        email: form.email,
        password: form.password,
      });

      // Save user + JWT token in Redux/localStorage
      login(data);

      // Go to dashboard
      navigate(location.state?.from || "/dashboard");
    } catch (error) {
      setErrors({
        general: error.message || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">
          Study<span className="text-indigo-400">AI</span>
        </h1>

        <p className="mt-2 text-slate-400">
          Welcome back! Continue your learning journey.
        </p>
      </div>

      {/* Login Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h2 className="text-2xl font-bold">Welcome Back</h2>

        <p className="mt-2 text-sm text-slate-400">
          Login to your account.
        </p>

        <form
          className="mt-6 space-y-5"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* General Error */}
          {errors.general && (
            <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {errors.general}
            </p>
          )}

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full rounded-lg border bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 ${
                errors.email ? "border-red-500" : "border-slate-700"
              }`}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium">
                Password
              </label>

              <button
                type="button"
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                Forgot Password?
              </button>
            </div>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full rounded-lg border bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 ${
                errors.password
                  ? "border-red-500"
                  : "border-slate-700"
              }`}
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-400">
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              className="h-4 w-4"
            />

            <label className="text-sm text-slate-400">
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-500 py-3 font-semibold hover:bg-indigo-600 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}

          <Link
            to="/register"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Create Account
          </Link>
        </p>
      </div>

      {/* Back Home */}
      <div className="mt-6 text-center">
        <Link
          to="/"
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Back to Home
        </Link>
      </div>
    </>
  );
}

export default Login;
