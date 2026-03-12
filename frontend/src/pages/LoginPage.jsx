import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const user = await login(form);
      navigate(`/dashboard/${user.role}`);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to login");
    }
  };

  return (
    <div className="theme-surface min-h-screen theme-text dark:bg-[radial-gradient(circle_at_top,rgba(20,184,126,0.2),transparent_28%),linear-gradient(160deg,#020617,#071411,#0f172a)]">
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6">
        <div className="theme-panel w-full max-w-md rounded-[2rem] p-8 backdrop-blur-xl">
          <BackButton fallback="/" />
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Welcome Back</p>
          <h1 className="mt-4 font-display text-4xl font-bold">Login</h1>
          <p className="theme-subtext mt-3 text-sm leading-7">
            Access your collector workflow, resident profile, or RWA analytics dashboard.
          </p>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error ? <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}
            <label className="block">
              <span className="theme-subtext mb-2 block text-sm">Email</span>
              <input className="theme-input w-full rounded-2xl px-4 py-3 outline-none transition focus:border-brand-400" name="email" onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} type="email" value={form.email} />
            </label>
            <label className="block">
              <span className="theme-subtext mb-2 block text-sm">Password</span>
              <input className="theme-input w-full rounded-2xl px-4 py-3 outline-none transition focus:border-brand-400" name="password" onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} type="password" value={form.password} />
            </label>
            <button className="w-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-6 py-3 font-semibold text-white shadow-glow transition hover:scale-[1.01]" disabled={loading} type="submit">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="theme-subtext mt-6 text-sm">
            Don&apos;t have an account?{" "}
            <Link className="font-semibold text-brand-100" to="/signup">
              Sign up
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
