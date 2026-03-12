import { Menu, Recycle } from "./Icons";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onMenuToggle }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link className="flex items-center gap-3 text-white" to="/">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-100 shadow-glow">
            <Recycle size={20} />
          </span>
          <div>
            <p className="font-display text-lg font-bold tracking-tight">UrbanIQ Waste</p>
            <p className="text-xs text-slate-400">AI-verified compliance monitoring</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <NavLink className="transition hover:text-white" to="/">
            Home
          </NavLink>
          <a className="transition hover:text-white" href="#features">
            Features
          </a>
          <a className="transition hover:text-white" href="#workflow">
            How It Works
          </a>
          {user ? (
            <NavLink className="rounded-full border border-white/10 px-4 py-2 text-white transition hover:border-brand-400/50" to={`/dashboard/${user.role}`}>
              Dashboard
            </NavLink>
          ) : (
            <>
              <NavLink className="transition hover:text-white" to="/login">
                Login
              </NavLink>
              <NavLink className="rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-4 py-2 font-medium text-white shadow-glow transition hover:scale-[1.02]" to="/signup">
                Start Monitoring
              </NavLink>
            </>
          )}
        </nav>

        <button className="rounded-xl border border-white/10 p-2 text-slate-200 md:hidden" onClick={onMenuToggle} type="button">
          <Menu size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
