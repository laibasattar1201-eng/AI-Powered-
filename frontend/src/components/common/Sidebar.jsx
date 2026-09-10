import { NavLink } from "react-router-dom";

const links = [
  { name: "Dashboard", path: "/dashboard", icon: "🏠" },
  { name: "Notes", path: "/notes", icon: "📚" },
  { name: "Tasks", path: "/tasks", icon: "📝" },
  { name: "Study Planner", path: "/study-planner", icon: "📅" },
  { name: "Groups", path: "/groups", icon: "👥" },
  { name: "Chat", path: "/chat", icon: "💬" },
  { name: "AI Assistant", path: "/ai", icon: "🤖" },
  { name: "Quiz", path: "/quiz", icon: "🧠" },
  { name: "Profile", path: "/profile", icon: "👤" },
];

function Sidebar({ isOpen = false, onClose = () => {} }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 transform bg-slate-900 p-5 text-white transition-transform duration-200 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Study<span className="text-indigo-400">AI</span>
          </h1>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 md:hidden"
          >
            ✕
          </button>
        </div>

        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                  isActive
                    ? "bg-indigo-500 text-white"
                    : "text-slate-400 hover:bg-slate-800"
                }`
              }
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
