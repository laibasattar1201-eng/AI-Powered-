import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../redux/slices/authSlice";

const stats = [
  { label: "Study Hours", value: "24h" },
  { label: "Quizzes", value: "12" },
  { label: "Notes", value: "28" },
];

function Profile() {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    university: user?.university || "",
    field: user?.field || "",
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setSaved(false);
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      setError("Please login first.");
      return;
    }

    setLoading(true);
    setSaved(false);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },

          body: JSON.stringify({
            name: form.name,
            email: form.email,
            university: form.university,
            field: form.field,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      // Update Redux + localStorage
      dispatch(updateProfile(data));

      // Update form with latest backend data
      setForm({
        name: data.name || "",
        email: data.email || "",
        university: data.university || "",
        field: data.field || "",
      });

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const initial =
    form.name?.charAt(0)?.toUpperCase() || "S";

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">

      {/* HEADER */}

      <h2 className="text-4xl font-bold text-white">
        My Profile 👤
      </h2>

      <p className="mt-3 text-slate-400">
        Manage your account and learning preferences.
      </p>

      {/* PROFILE CARD */}

      <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900 p-8">

        <div className="flex flex-col items-center gap-5 md:flex-row">

          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-indigo-500 text-4xl font-bold text-white">
            {initial}
          </div>

          <div>

            <h3 className="text-2xl font-bold text-white">
              {form.name || "Student Name"}
            </h3>

            <p className="mt-2 text-slate-400">
              {form.email || "student@example.com"}
            </p>

            <p className="mt-2 text-sm text-indigo-400">
              Student
            </p>

          </div>

        </div>

      </div>

      {/* PERSONAL INFORMATION */}

      <form
        onSubmit={handleSave}
        className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-8"
      >

        <h3 className="text-2xl font-bold text-white">
          Personal Information
        </h3>

        {/* ERROR */}

        {error && (
          <div className="mt-5 rounded-lg bg-red-500/10 p-3 text-red-400">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {saved && (
          <div className="mt-5 rounded-lg bg-green-500/10 p-3 text-green-400">
            ✓ Profile saved successfully!
          </div>
        )}

        <div className="mt-6 grid gap-5 md:grid-cols-2">

          {/* NAME */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-200">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Student Name"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />

          </div>

          {/* EMAIL */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-200">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="student@example.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />

          </div>

          {/* UNIVERSITY */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-200">
              University
            </label>

            <input
              type="text"
              name="university"
              value={form.university}
              onChange={handleChange}
              placeholder="Your University"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />

          </div>

          {/* FIELD */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-200">
              Field of Study
            </label>

            <input
              type="text"
              name="field"
              value={form.field}
              onChange={handleChange}
              placeholder="Computer Science"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />

          </div>

        </div>

        {/* SAVE BUTTON */}

        <div className="mt-6 flex items-center gap-4">

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-500 px-6 py-3 font-semibold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </form>

      {/* LEARNING STATISTICS */}

      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-8">

        <h3 className="text-2xl font-bold text-white">
          Learning Statistics
        </h3>

        <div className="mt-6 grid gap-5 md:grid-cols-3">

          {stats.map((s) => (

            <div
              key={s.label}
              className="rounded-lg bg-slate-950 p-5"
            >

              <p className="text-slate-400">
                {s.label}
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {s.value}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Profile;
