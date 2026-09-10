import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const quickActions = [
  {
    icon: "📚",
    title: "Notes",
    desc: "Manage your study notes.",
    path: "/notes",
  },
  {
    icon: "🤖",
    title: "AI Assistant",
    desc: "Ask AI for study help.",
    path: "/ai",
  },
  {
    icon: "📝",
    title: "Quiz",
    desc: "Test your knowledge.",
    path: "/quiz",
  },
  {
    icon: "👥",
    title: "Study Groups",
    desc: "Collaborate with classmates.",
    path: "/groups",
  },
];

function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState([
    { label: "Study Hours", value: "0h" },
    { label: "Tasks Completed", value: "0" },
    { label: "Notes", value: "0" },
    { label: "Study Groups", value: "0" },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = user?.token;

  const firstName = user?.name
    ? user.name.split(" ")[0]
    : "Student";

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Get Notes
        const notesResponse = await fetch(
          "http://localhost:5000/api/notes",
          {
            headers,
          }
        );

        const notesData = await notesResponse.json();

        if (!notesResponse.ok) {
          throw new Error(
            notesData.message || "Failed to load notes"
          );
        }

        // Get Tasks
        const tasksResponse = await fetch(
          "http://localhost:5000/api/tasks",
          {
            headers,
          }
        );

        const tasksData = await tasksResponse.json();

        if (!tasksResponse.ok) {
          throw new Error(
            tasksData.message || "Failed to load tasks"
          );
        }

        // Get Study Groups
        const groupsResponse = await fetch(
          "http://localhost:5000/api/groups",
          {
            headers,
          }
        );

        const groupsData = await groupsResponse.json();

        if (!groupsResponse.ok) {
          throw new Error(
            groupsData.message || "Failed to load groups"
          );
        }

        // Count completed tasks
        const completedTasks = tasksData.filter(
          (task) => task.status === "completed"
        ).length;

        // Update dashboard
        setStats([
          {
            label: "Study Hours",
            value: "0h",
          },
          {
            label: "Tasks Completed",
            value: completedTasks,
          },
          {
            label: "Notes",
            value: notesData.length,
          },
          {
            label: "Study Groups",
            value: groupsData.length,
          },
        ]);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [token]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">

      {/* Header */}
      <h2 className="text-4xl font-bold text-white">
        Welcome Back, {firstName}! 👋
      </h2>

      <p className="mt-3 text-slate-400">
        Manage your learning, tasks, notes and study activities.
      </p>

      {/* Error */}
      {error && (
        <p className="mt-5 rounded-lg bg-red-500/10 p-3 text-red-400">
          {error}
        </p>
      )}

      {/* Loading */}
      {loading ? (
        <p className="mt-10 text-slate-400">
          Loading dashboard...
        </p>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6"
              >
                <p className="text-slate-400">
                  {s.label}
                </p>

                <h3 className="mt-3 text-3xl font-bold text-white">
                  {s.value}
                </h3>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <section className="mt-10">
            <h3 className="text-2xl font-bold text-white">
              Quick Actions
            </h3>

            <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((a) => (
                <Link
                  key={a.title}
                  to={a.path}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition-colors hover:border-indigo-500/50"
                >
                  <div className="text-3xl">
                    {a.icon}
                  </div>

                  <h4 className="mt-4 font-semibold text-white">
                    {a.title}
                  </h4>

                  <p className="mt-2 text-sm text-slate-400">
                    {a.desc}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Dashboard;