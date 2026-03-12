import { Bell, Home, LayoutDashboard, LogOut, Moon, ShieldCheck, Sun } from "../components/Icons";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showComplianceInfo, setShowComplianceInfo] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="theme-surface min-h-screen text-white dark:bg-[radial-gradient(circle_at_top,rgba(20,184,126,0.16),transparent_24%),linear-gradient(180deg,#020617,#071411_50%,#020617)]">
      <Navbar />
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr]">
        <aside className="theme-panel rounded-[2rem] p-6 backdrop-blur-xl">
          <div className="theme-hero rounded-[1.5rem] p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-100">Signed in as</p>
            <h2 className="mt-3 font-display text-2xl font-bold theme-text">{user?.name}</h2>
            <p className="mt-2 text-sm capitalize theme-subtext">{user?.role}</p>
          </div>

          <nav className="mt-6 space-y-2">
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
              to={`/dashboard/${user?.role}`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
            <Link className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white" to="/">
              <Home size={18} />
              Home
            </Link>
            <button
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              onClick={() => setShowComplianceInfo((current) => !current)}
              type="button"
            >
              <ShieldCheck size={18} />
              Compliance secure
            </button>
            <button
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              onClick={toggleTheme}
              type="button"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </nav>

          {showComplianceInfo ? (
            <div className="mt-4 rounded-[1.5rem] border border-brand-400/20 bg-brand-500/10 p-4 text-sm theme-subtext">
              <p className="font-semibold theme-text">Compliance secure</p>
              <p className="mt-2 leading-6">
                UrbanIQ Waste uses JWT auth, image evidence uploads, household score tracking, and admin verification controls to keep reports accountable.
              </p>
            </div>
          ) : null}

          <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10" onClick={logout} type="button">
            <LogOut size={16} />
            Logout
          </button>
        </aside>

        <div>
          <div className="theme-panel relative mb-6 flex items-center justify-between rounded-[1.5rem] px-5 py-4 backdrop-blur-xl">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-100">UrbanIQ Waste</p>
              <p className="mt-1 text-sm theme-subtext">AI-verified compliance monitoring for apartment communities</p>
            </div>
            <button
              className="rounded-2xl border border-white/10 p-3 theme-text transition hover:bg-white/10"
              onClick={() => setShowNotifications((current) => !current)}
              type="button"
            >
              <Bell size={18} />
            </button>
            {showNotifications ? (
              <div className="theme-popup absolute right-5 top-[calc(100%+0.75rem)] z-20 w-80 rounded-[1.5rem] p-4 shadow-glass">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">Notifications</p>
                <div className="mt-4 space-y-3 text-sm theme-subtext">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="font-medium theme-text">Collector report activity</p>
                    <p className="mt-1">New waste violations will appear here after submission and review.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="font-medium theme-text">Compliance reminder</p>
                    <p className="mt-1">Use the admin dashboard to review repeat offenders and verify pending reports.</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
