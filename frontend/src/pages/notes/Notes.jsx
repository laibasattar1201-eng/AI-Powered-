import { useEffect, useState } from "react";
import { createNote, deleteNote, getNotes } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

function Notes() {
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    desc: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // EDIT
  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const token = user?.token;

  // =========================
  // LOAD NOTES
  // =========================

  useEffect(() => {
    const loadNotes = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getNotes(token);
        setNotes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [token]);

  // =========================
  // ADD NOTE
  // =========================

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter note title");
      return;
    }

    try {
      const newNote = await createNote(
        {
          title: form.title,
          content: form.desc,
        },
        token
      );

      setNotes((prev) => [newNote, ...prev]);

      setForm({
        title: "",
        desc: "",
      });

      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================
  // DELETE NOTE
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) return;

    try {
      await deleteNote(id, token);

      setNotes((prev) =>
        prev.filter((note) => note._id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================
  // START EDIT
  // =========================

  const startEdit = (note) => {
    setEditingNote(note);
    setEditTitle(note.title || "");
    setEditContent(note.content || "");
  };

  // =========================
  // UPDATE NOTE
  // =========================

  const handleUpdate = async () => {
    if (!editTitle.trim()) {
      alert("Please enter note title");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${editingNote._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editTitle,
            content: editContent,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update note"
        );
      }

      setNotes((prev) =>
        prev.map((note) =>
          note._id === editingNote._id ? data : note
        )
      );

      setEditingNote(null);
      setEditTitle("");
      setEditContent("");
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <p className="text-slate-400">
          Loading notes...
        </p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">

      <h2 className="text-4xl font-bold text-white">
        My Notes 📚
      </h2>

      <p className="mt-3 text-slate-400">
        Create, organize and manage your study notes.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-red-400">
          {error}
        </p>
      )}

      {/* CREATE BUTTON */}

      <button
        onClick={() => setShowForm((s) => !s)}
        className="mt-8 rounded-lg bg-indigo-500 px-6 py-3 font-semibold text-white hover:bg-indigo-600"
      >
        {showForm ? "Cancel" : "+ Create New Note"}
      </button>

      {/* CREATE FORM */}

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="mt-6 space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6"
        >

          <input
            type="text"
            placeholder="Note title"
            value={form.title}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                title: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />

          <textarea
            placeholder="Write your note..."
            value={form.desc}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                desc: e.target.value,
              }))
            }
            rows={5}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            className="rounded-lg bg-indigo-500 px-6 py-2 font-semibold text-white hover:bg-indigo-600"
          >
            Save Note
          </button>

        </form>
      )}

      {/* NOTES */}

      {notes.length === 0 ? (
        <p className="mt-10 text-slate-400">
          Koi note nahi hai. Ek naya note banayein.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {notes.map((note) => (
            <div
              key={note._id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-6"
            >

              <h3 className="text-xl font-bold text-white">
                {note.title}
              </h3>

              <p className="mt-3 text-slate-400">
                {note.content}
              </p>

              <div className="mt-5 flex gap-2">

                {/* EDIT */}

                <button
                  onClick={() => startEdit(note)}
                  className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600"
                >
                  Edit
                </button>

                {/* DELETE */}

                <button
                  onClick={() => handleDelete(note._id)}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* EDIT MODAL */}

      {editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5">

          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6">

            <h3 className="text-2xl font-bold text-white">
              Edit Note
            </h3>

            <input
              type="text"
              value={editTitle}
              onChange={(e) =>
                setEditTitle(e.target.value)
              }
              className="mt-5 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              placeholder="Note title"
            />

            <textarea
              value={editContent}
              onChange={(e) =>
                setEditContent(e.target.value)
              }
              rows={5}
              className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              placeholder="Note content"
            />

            <div className="mt-5 flex gap-3">

              <button
                onClick={handleUpdate}
                className="rounded-lg bg-indigo-500 px-5 py-2 font-semibold text-white hover:bg-indigo-600"
              >
                Save Changes
              </button>

              <button
                onClick={() => {
                  setEditingNote(null);
                  setEditTitle("");
                  setEditContent("");
                }}
                className="rounded-lg bg-slate-700 px-5 py-2 font-semibold text-white hover:bg-slate-600"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Notes;