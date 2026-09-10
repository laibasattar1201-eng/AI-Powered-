import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

const icons = ["🤖", "💻", "📚", "🧪", "🎨", "📐", "🌍", "🎯"];

function Chat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState("");

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  const token = user?.token;

  // =========================
  // LOAD GROUPS
  // =========================

  useEffect(() => {
    const loadGroups = async () => {
      if (!token) {
        setLoadingGroups(false);
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
          throw new Error(
            data.message || "Failed to load groups"
          );
        }

        setGroups(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingGroups(false);
      }
    };

    loadGroups();
  }, [token]);

  // =========================
  // FIND SELECTED GROUP
  // =========================

  useEffect(() => {
    if (!groupId || groups.length === 0) {
      return;
    }

    const foundGroup = groups.find(
      (group) => group._id === groupId
    );

    if (!foundGroup) {
      setError("Group not found.");
      setCurrentGroup(null);
      return;
    }

    setCurrentGroup(foundGroup);
    setError("");
  }, [groupId, groups]);

  // =========================
  // LOAD OLD MESSAGES
  // =========================

  useEffect(() => {
    const loadMessages = async () => {
      if (!token || !groupId) {
        return;
      }

      setLoadingMessages(true);
      setMessages([]);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/messages/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load messages"
          );
        }

        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [token, groupId]);

  // =========================
  // SOCKET CONNECTION
  // =========================

  useEffect(() => {
    if (!token || !groupId) {
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: {
        token,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Chat connected");

      socket.emit("joinGroup", groupId);
    });

    socket.on("newMessage", (message) => {
      setMessages((prev) => {
        // Duplicate message avoid
        if (
          message._id &&
          prev.some((item) => item._id === message._id)
        ) {
          return prev;
        }

        return [...prev, message];
      });
    });

    socket.on("errorMessage", (error) => {
      console.error("Chat error:", error);

      setError(
        error?.message || "Failed to send message"
      );
    });

    socket.on("connect_error", (error) => {
      console.error(
        "Socket connection error:",
        error.message
      );
    });

    return () => {
      socket.emit("leaveGroup", groupId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, groupId]);

  // =========================
  // AUTO SCROLL
  // =========================

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =========================
  // SEND MESSAGE
  // =========================

  const handleSend = (e) => {
    e.preventDefault();

    if (!text.trim()) {
      return;
    }

    if (!socketRef.current) {
      setError("Chat is not connected.");
      return;
    }

    socketRef.current.emit("sendMessage", {
      groupId,
      text: text.trim(),
    });

    setText("");
    setError("");
  };

  // =========================
  // OPEN GROUP CHAT
  // =========================

  const openGroup = (id) => {
    navigate(`/chat/${id}`);
  };

  // =========================
  // LOADING GROUPS
  // =========================

  if (loadingGroups) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <p className="text-slate-400">
          Loading groups...
        </p>
      </div>
    );
  }

  // =========================
  // NO GROUP SELECTED
  // =========================

  if (!groupId) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <h2 className="text-4xl font-bold text-white">
          Study Group Chat 💬
        </h2>

        <p className="mt-3 text-slate-400">
          Select a study group to start chatting.
        </p>

        {error && (
          <p className="mt-5 rounded-lg bg-red-500/10 p-3 text-red-400">
            {error}
          </p>
        )}

        {groups.length === 0 ? (
          <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-slate-400">
              No study groups found.
            </p>

            <button
              onClick={() => navigate("/groups")}
              className="mt-5 rounded-lg bg-indigo-500 px-5 py-3 font-semibold text-white hover:bg-indigo-600"
            >
              Create a Study Group
            </button>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group, index) => (
              <div
                key={group._id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="text-4xl">
                  {icons[index % icons.length]}
                </div>

                <h3 className="mt-4 text-xl font-bold text-white">
                  {group.name}
                </h3>

                <p className="mt-3 text-slate-400">
                  {group.description ||
                    "Study and collaborate together."}
                </p>

                <p className="mt-5 text-sm text-slate-400">
                  👥 {group.members?.length || 0} Members
                </p>

                <button
                  onClick={() => openGroup(group._id)}
                  className="mt-5 w-full rounded-lg bg-indigo-500 px-5 py-3 font-semibold text-white hover:bg-indigo-600"
                >
                  Open Chat →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // =========================
  // SELECTED GROUP NOT FOUND
  // =========================

  if (!currentGroup) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <p className="rounded-lg bg-red-500/10 p-4 text-red-400">
          Group not found.
        </p>

        <button
          onClick={() => navigate("/chat")}
          className="mt-5 rounded-lg bg-indigo-500 px-5 py-3 font-semibold text-white"
        >
          Back to Groups
        </button>
      </div>
    );
  }

  // =========================
  // ACTUAL CHAT
  // =========================

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <button
        onClick={() => navigate("/chat")}
        className="mb-5 text-sm text-indigo-400 hover:text-indigo-300"
      >
        ← Back to Groups
      </button>

      <h2 className="text-4xl font-bold text-white">
        Study Group Chat 💬
      </h2>

      <p className="mt-3 text-slate-400">
        Communicate and collaborate with your study group.
      </p>

      <div className="mt-10 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

        {/* HEADER */}

        <div className="border-b border-slate-800 p-5">
          <h3 className="text-xl font-bold text-white">
            {currentGroup.name}
          </h3>

          <p className="mt-1 text-sm text-green-400">
            ● Real-time Chat
          </p>
        </div>

        {/* MESSAGES */}

        <div className="h-96 space-y-5 overflow-y-auto p-6">

          {loadingMessages && (
            <p className="text-sm text-slate-400">
              Loading messages...
            </p>
          )}

          {!loadingMessages &&
            messages.length === 0 && (
              <p className="text-slate-400">
                No messages yet. Start the conversation!
              </p>
            )}

          {messages.map((message, index) => {
            const senderName =
              message.sender?.name || "User";

            const mine =
              String(message.sender?._id) ===
              String(user?._id);

            const initial =
              senderName.charAt(0).toUpperCase();

            return (
              <div
                key={message._id || index}
                className={`flex gap-3 ${
                  mine ? "justify-end" : ""
                }`}
              >
                {!mine && (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
                    {initial}
                  </div>
                )}

                <div
                  className={
                    mine ? "text-right" : ""
                  }
                >
                  <p className="font-semibold text-white">
                    {mine ? "You" : senderName}
                  </p>

                  <div
                    className={`mt-1 max-w-xs rounded-lg px-4 py-3 text-white ${
                      mine
                        ? "bg-indigo-500"
                        : "bg-slate-800"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>

                {mine && (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
                    {initial}
                  </div>
                )}
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* ERROR */}

        {error && (
          <p className="border-t border-slate-800 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {/* SEND */}

        <form
          onSubmit={handleSend}
          className="border-t border-slate-800 p-5"
        >
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              value={text}
              onChange={(e) =>
                setText(e.target.value)
              }
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />

            <button
              type="submit"
              className="rounded-lg bg-indigo-500 px-6 py-3 font-semibold text-white hover:bg-indigo-600"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;