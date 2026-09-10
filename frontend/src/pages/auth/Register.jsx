import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { registerUser } from "../../services/api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const data = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      login(data);
      navigate("/dashboard");
    } catch (error) {
      setErrors({
        general: error.message || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter your full name",
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter your email",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Create a password",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Confirm your password",
    },
  ];

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">
          Study<span className="text-indigo-400">AI</span>
        </h1>

        <p className="mt-2 text-slate-400">
          Create your account and start learning smarter.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h2 className="text-2xl font-bold">Create Account</h2>

        <p className="mt-2 text-sm text-slate-400">
          Join our collaborative learning platform.
        </p>

        <form
          className="mt-6 space-y-5"
          onSubmit={handleSubmit}
          noValidate
        >
          {errors.general && (
            <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {errors.general}
            </p>
          )}

          {fields.map((field) => (
            <div key={field.name}>
              <label className="mb-2 block text-sm font-medium">
                {field.label}
              </label>

              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className={`w-full rounded-lg border bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 ${
                  errors[field.name]
                    ? "border-red-500"
                    : "border-slate-700"
                }`}
              />

              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-400">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-500 py-3 font-semibold hover:bg-indigo-600 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Login
          </Link>
        </p>
      </div>

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

export default Register;
