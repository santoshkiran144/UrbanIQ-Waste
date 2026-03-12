import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "collector",
  buildingName: "",
  unitNumber: ""
};

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.buildingName) {
      setError("Please fill all required fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const { confirmPassword, ...payload } = form;
      void confirmPassword;
      const user = await signup(payload);
      navigate(`/dashboard/${user.role}`);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to create account");
    }
  };

  return (
    <div className="theme-surface min-h-screen theme-text dark:bg-[radial-gradient(circle_at_top_right,rgba(255,125,77,0.18),transparent_24%),linear-gradient(160deg,#020617,#071411,#0f172a)]">
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6">
        <div className="theme-panel w-full max-w-2xl rounded-[2rem] p-8 backdrop-blur-xl">
          <BackButton fallback="/" />
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Create Account</p>
          <h1 className="mt-4 font-display text-4xl font-bold">Signup</h1>
          <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
            {error ? <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 md:col-span-2">{error}</div> : null}
            {[
              ["name", "Name", "text"],
              ["email", "Email", "email"],
              ["password", "Password", "password"],
              ["confirmPassword", "Confirm Password", "password"],
              ["buildingName", "Building Name", "text"],
              ["unitNumber", "Unit / Flat Number", "text"]
            ].map(([name, label, type]) => (
              <label className="block" key={name}>
                <span className="theme-subtext mb-2 block text-sm">{label}</span>
                <input className="theme-input w-full rounded-2xl px-4 py-3 outline-none transition focus:border-brand-400" name={name} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} type={type} value={form[name]} />
              </label>
            ))}
            <label className="block md:col-span-2">
              <span className="theme-subtext mb-2 block text-sm">Role Selection</span>
              <select className="theme-input w-full rounded-2xl px-4 py-3 outline-none transition focus:border-brand-400" name="role" onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} value={form.role}>
                <option value="collector">Collector</option>
                <option value="admin">RWA Admin</option>
                <option value="resident">Resident</option>
              </select>
            </label>
            <button className="rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-6 py-3 font-semibold text-white shadow-glow transition hover:scale-[1.01] md:col-span-2" disabled={loading} type="submit">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="theme-subtext mt-6 text-sm">
            Already have an account?{" "}
            <Link className="font-semibold text-brand-100" to="/login">
              Login
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignupPage;
