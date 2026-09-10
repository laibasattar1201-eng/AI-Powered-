import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Navbar({ title, onMenuClick }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || "S";

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-5 py-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 md:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>

        <h1 className="text-xl font-bold text-white md:text-2xl">{title}</h1>
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-bold text-white"
        >
          {initial}
        </button>

        {menuOpen && (
          <div
            onMouseLeave={() => setMenuOpen(false)}
            className="absolute right-0 mt-3 w-48 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl"
          >
            <div className="border-b border-slate-800 px-4 py-3">
              <p className="truncate font-semibold text-white">
                {user?.name || "Student"}
              </p>
              <p className="truncate text-xs text-slate-400">
                {user?.email || "student@example.com"}
              </p>
            </div>

            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/profile");
              }}
              className="block w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-800"
            >
              👤 My Profile
            </button>

            <button
              onClick={handleLogout}
              className="block w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-slate-800"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
