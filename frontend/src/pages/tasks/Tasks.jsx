import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const statusStyles = {
  pending: "bg-yellow-500/10 text-yellow-400",
  "in-progress": "bg-blue-500/10 text-blue-400",
  completed: "bg-green-500/10 text-green-400",
};

function Tasks() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get token from logged-in user
  const token = user?.token;

  // ==================== GET TASKS ====================

  useEffect(() => {
    const loadTasks = async () => {
      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      try {
        const data = await getTasks(token);
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [token]);

  // ==================== CREATE TASK ====================

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const newTask = await createTask(
        {
          title,
          dueDate: dueDate || undefined,
          priority,
          status: "pending",
        },
        token
      );

      setTasks((prev) => [newTask, ...prev]);

      setTitle("");
      setDueDate("");
      setPriority("medium");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  // ==================== TOGGLE STATUS ====================

  const toggleStatus = async (task) => {
    const newStatus =
      task.status === "completed" ? "pending" : "completed";

    try {
      const updatedTask = await updateTask(
        task._id,
        {
          status: newStatus,
        },
        token
      );

      setTasks((prev) =>
        prev.map((t) =>
          t._id === updatedTask._id ? updatedTask : t
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // ==================== DELETE TASK ====================

  const handleDelete = async (id) => {
    try {
      await deleteTask(id, token);

      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // ==================== LOADING ====================

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <p className="text-slate-400">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <h2 className="text-4xl font-bold text-white">
        My Tasks 📝
      </h2>

      <p className="mt-3 text-slate-400">
        Create and manage your study tasks.
      </p>

      {/* Error */}
      {error && (
        <p className="mt-5 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {/* Add Task Form */}
      <form
        onSubmit={handleAdd}
        className="mt-8 flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-5 md:flex-row"
      >
        <input
          type="text"
          placeholder="New task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 md:w-52"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button
          type="submit"
          className="rounded-lg bg-indigo-500 px-6 py-3 font-semibold text-white hover:bg-indigo-600"
        >
          + Add Task
        </button>
      </form>

      {/* Tasks */}
      <div className="mt-10 space-y-4">
        {tasks.length === 0 && (
          <p className="text-slate-400">
            Koi task nahi hai. Naya task add karein.
          </p>
        )}

        {tasks.map((task) => (
          <div
            key={task._id}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-5"
          >
            <div>
              <h3 className="text-lg font-semibold text-white">
                {task.title}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Due:{" "}
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No due date"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Priority: {task.priority}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleStatus(task)}
                className={`rounded-full px-4 py-2 text-sm ${
                  statusStyles[task.status]
                }`}
              >
                {task.status}
              </button>

              <button
                onClick={() => handleDelete(task._id)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;
