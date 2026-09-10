import { useEffect, useState } from "react";
import {
  getStudyPlans,
  createStudyPlan,
  updateStudyPlan,
  deleteStudyPlan,
} from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

function StudyPlanner() {
  const { user } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    topic: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = user?.token;

  // ==================== GET STUDY PLANS ====================

  useEffect(() => {
    const loadStudyPlans = async () => {
      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      try {
        const data = await getStudyPlans(token);
        setSessions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStudyPlans();
  }, [token]);

  // ==================== CREATE STUDY PLAN ====================

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.subject.trim() || !form.date) {
      setError("Subject and date are required.");
      return;
    }

    try {
      const newPlan = await createStudyPlan(form, token);

      setSessions((prev) => [newPlan, ...prev]);

      setForm({
        subject: "",
        topic: "",
        date: "",
        startTime: "",
        endTime: "",
      });

      setShowForm(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  // ==================== COMPLETE / UNCOMPLETE ====================

  const toggleComplete = async (session) => {
    try {
      const updatedPlan = await updateStudyPlan(
        session._id,
        {
          completed: !session.completed,
        },
        token
      );

      setSessions((prev) =>
        prev.map((item) =>
          item._id === updatedPlan._id ? updatedPlan : item
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // ==================== DELETE ====================

  const handleRemove = async (id) => {
    try {
      await deleteStudyPlan(id, token);

      setSessions((prev) =>
        prev.filter((session) => session._id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // ==================== LOADING ====================

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <p className="text-slate-400">
          Loading study planner...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <h2 className="text-4xl font-bold text-white">
        Study Planner 📅
      </h2>

      <p className="mt-3 text-slate-400">
        Plan your study schedule and stay organized.
      </p>

      {/* Error */}
      {error && (
        <p className="mt-5 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {/* Create Study Plan Button */}
      <button
        onClick={() => setShowForm((s) => !s)}
        className="mt-8 rounded-lg bg-indigo-500 px-6 py-3 font-semibold text-white hover:bg-indigo-600"
      >
        {showForm ? "Cancel" : "+ Create Study Plan"}
      </button>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="mt-6 grid gap-3 rounded-xl border border-slate-800 bg-slate-900 p-6 md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                subject: e.target.value,
              }))
            }
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />

          <input
            type="text"
            placeholder="Topic"
            value={form.topic}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                topic: e.target.value,
              }))
            }
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />

          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                date: e.target.value,
              }))
            }
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />

          <input
            type="time"
            value={form.startTime}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                startTime: e.target.value,
              }))
            }
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />

          <input
            type="time"
            value={form.endTime}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                endTime: e.target.value,
              }))
            }
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            className="rounded-lg bg-indigo-500 px-6 py-3 font-semibold text-white hover:bg-indigo-600 md:col-span-2"
          >
            Save Study Plan
          </button>
        </form>
      )}

      {/* Today's Schedule */}
      <section className="mt-10">
        <h3 className="text-2xl font-bold text-white">
          Study Schedule
        </h3>

        <div className="mt-5 space-y-4">
          {sessions.length === 0 && (
            <p className="text-slate-400">
              Abhi koi study plan nahi hai.
            </p>
          )}

          {sessions.map((session) => (
            <div
              key={session._id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    {session.subject}
                  </h4>

                  {session.topic && (
                    <p className="mt-1 text-sm text-slate-400">
                      Topic: {session.topic}
                    </p>
                  )}

                  <p className="mt-2 text-sm text-slate-400">
                    Date:{" "}
                    {new Date(session.date).toLocaleDateString()}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Time:{" "}
                    {session.startTime || "Not set"}{" "}
                    {session.endTime
                      ? `- ${session.endTime}`
                      : ""}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleComplete(session)}
                    className={`rounded-full px-4 py-2 text-sm ${
                      session.completed
                        ? "bg-green-500/10 text-green-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {session.completed
                      ? "Completed"
                      : "Pending"}
                  </button>

                  <button
                    onClick={() =>
                      handleRemove(session._id)
                    }
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default StudyPlanner;
