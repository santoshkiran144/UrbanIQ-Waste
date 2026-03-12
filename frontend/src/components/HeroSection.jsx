import { ArrowRight, PlayCircle } from "./Icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const HeroSection = () => {
  const { user } = useAuth();
  const primaryPath = user ? `/dashboard/${user.role}` : "/signup";
  const secondaryPath = user ? `/dashboard/${user.role}` : "/login";
  const [overview, setOverview] = useState({
    compliancePercentage: 84,
    totalViolations: 128
  });

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const { data } = await api.get("/public/overview");
        setOverview({
          compliancePercentage: data.compliancePercentage,
          totalViolations: data.totalViolations
        });
      } catch (_error) {
        setOverview({
          compliancePercentage: 84,
          totalViolations: 128
        });
      }
    };

    loadOverview();
  }, []);

  return (
    <section className="relative overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center opacity-25" />
    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950/80 to-slate-900" />
    <div className="relative mx-auto grid min-h-[88vh] max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <div>
        <span className="inline-flex rounded-full border border-brand-400/30 bg-brand-400/10 px-4 py-2 text-sm font-medium text-brand-100">
          Smart-city waste compliance for apartment communities
        </span>
        <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold tracking-tight text-white sm:text-6xl">
          UrbanIQ Waste
        </h1>
        <p className="mt-3 text-xl font-medium text-brand-100">
          Track. Verify. Improve Waste Compliance in Smart Cities
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Waste collectors capture violations in seconds, AI-assisted evidence makes reports more credible, and RWAs
          get real-time compliance dashboards to improve segregation behavior across buildings.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-6 py-3 font-medium text-white shadow-glow transition hover:scale-[1.02]" to={primaryPath}>
            Start Monitoring
            <ArrowRight size={18} />
          </Link>
          <Link className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10" to={secondaryPath}>
            <PlayCircle size={18} />
            {user ? "Open Dashboard" : "Explore Demo"}
          </Link>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-glass backdrop-blur-xl">
        <div className="grid gap-4">
          <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
            <p className="text-sm text-slate-400">Live Snapshot</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Compliance</p>
                <p className="mt-2 font-display text-4xl text-white">{overview.compliancePercentage}%</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Violations</p>
                <p className="mt-2 font-display text-4xl text-white">{overview.totalViolations}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-brand-400/20 bg-gradient-to-br from-brand-500/10 to-accent-500/10 p-5">
            <p className="text-sm text-slate-300">What the MVP demonstrates</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li>QR-style household lookup and route-friendly reporting</li>
              <li>Photo-based evidence capture with AI-verification messaging</li>
              <li>Gamified 100-point compliance score per household</li>
              <li>RWA analytics for trends, repeat offenders, and building performance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
};

export default HeroSection;
