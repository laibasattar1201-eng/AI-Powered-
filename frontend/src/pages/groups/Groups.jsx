import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const API_URL = "http://localhost:5000/api";

const icons = ["🤖", "💻", "📚", "🧪", "🎨", "📐", "🌍", "🎯"];

function Groups() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [groups, setGroups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = user?.token;

  // ==================== GET GROUPS ====================

  useEffect(() => {
    const loadGroups = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/groups`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load groups");
        }

        setGroups(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, [token]);

  // ==================== CREATE GROUP ====================

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      const response = await fetch(`${API_URL}/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create group");
      }

      setGroups((prev) => [data, ...prev]);

      setName("");
      setDescription("");
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // ==================== DELETE GROUP ====================

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/groups/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete group");
      }

      setGroups((prev) =>
        prev.filter((group) => group._id !== id)
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // ==================== LOADING ====================

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <p className="text-slate-400">Loading groups...</p>
      </div>
    );
  }

  // ==================== UI ====================

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">

      <h2 className="text-4xl font-bold text-white">
        Study Groups 👥
      </h2>

      <p className="mt-3 text-slate-400">
        Collaborate and learn together with your classmates.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-red-400">
          {error}
        </p>
      )}

      {/* CREATE GROUP BUTTON */}

      <button
        onClick={() => setShowForm((s) => !s)}
        className="mt-8 rounded-lg bg-indigo-500 px-6 py-3 font-semibold text-white hover:bg-indigo-600"
      >
        {showForm ? "Cancel" : "+ Create New Group"}
      </button>

      {/* CREATE GROUP FORM */}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mt-6 space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-6"
        >

          <input
            type="text"
            placeholder="Group name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />

          <textarea
            placeholder="Group description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            className="rounded-lg bg-indigo-500 px-6 py-3 font-semibold text-white hover:bg-indigo-600"
          >
            Create Group
          </button>

        </form>
      )}

      {/* GROUPS */}

      {groups.length === 0 ? (
        <p className="mt-10 text-slate-400">
          No groups found. Create your first study group.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {groups.map((group, index) => (

            <div
              key={group._id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-6"
            >

              {/* ICON */}

              <div className="text-4xl">
                {icons[index % icons.length]}
              </div>

              {/* GROUP NAME */}

              <h3 className="mt-4 text-xl font-bold text-white">
                {group.name}
              </h3>

              {/* DESCRIPTION */}

              <p className="mt-3 text-slate-400">
                {group.description ||
                  "Study and collaborate together."}
              </p>

              {/* MEMBERS */}

              <p className="mt-5 text-sm text-slate-400">
                👥 {group.members?.length || 0} Members
              </p>

              {/* BUTTONS */}

              <div className="mt-5 flex items-center justify-between gap-3">

                <span className="text-sm text-green-400">
                  ✓ Joined
                </span>

                <div className="flex items-center gap-3">

                  {/* OPEN CHAT */}

                  <button
                    onClick={() =>
                      navigate(`/chat/${group._id}`)
                    }
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    Open Chat →
                  </button>

                  {/* DELETE */}

                  <button
                    onClick={() =>
                      handleDelete(group._id)
                    }
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default Groups;