import { ArrowRight, BadgeCheck, Building2, Recycle, Shield } from "../components/Icons";
import { Link } from "react-router-dom";
import FeatureSection from "../components/FeatureSection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const steps = [
  "Collectors identify a household with QR-style lookup or manual ID entry.",
  "They upload photo evidence when mixed waste is detected.",
  "RWAs review violations, verify reports, and track compliance scores over time."
];

const users = [
  { icon: Recycle, title: "Waste Collectors", body: "Fast reporting with minimal friction during morning collection routes." },
  { icon: Building2, title: "RWA Admins", body: "Analytics to monitor repeat offenders, building performance, and monthly trends." },
  { icon: Shield, title: "Residents", body: "Transparent scoring and report history to support behavior change." }
];

const HomePage = () => {
  const { user } = useAuth();
  const startMonitoringPath = user ? `/dashboard/${user.role}` : "/signup";
  const loginPath = user ? `/dashboard/${user.role}` : "/login";

  return (
    <div className="theme-surface min-h-screen theme-text">
      <Navbar />
      <HeroSection />
    <FeatureSection />

    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6" id="workflow">
      <div className="grid gap-10 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glass backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">How It Works</p>
          <h2 className="mt-4 font-display text-4xl font-bold">Three steps from evidence to accountability.</h2>
          <div className="mt-8 space-y-4">
            {steps.map((step, index) => (
              <div className="flex gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4" key={step}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-500/15 font-semibold text-brand-100">
                  0{index + 1}
                </span>
                <p className="text-sm leading-7 text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {users.map(({ icon: Icon, title, body }) => (
            <article className="rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-glass" key={title}>
              <span className="inline-flex rounded-2xl bg-accent-500/15 p-3 text-accent-400">
                <Icon size={20} />
              </span>
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <div className="overflow-hidden rounded-[2rem] border border-brand-400/20 bg-gradient-to-r from-brand-500/15 via-brand-500/5 to-accent-500/15 p-8 shadow-glow">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Call to Action</p>
            <h2 className="mt-3 font-display text-4xl font-bold text-white">Ready for V1.0 demonstration and 10-user testing?</h2>
            <p className="mt-4 max-w-2xl text-slate-300">
              Run the collector and RWA workflows, capture screenshots, and validate how UrbanIQ Waste improves visibility into segregation compliance.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]" to={startMonitoringPath}>
              Start Monitoring
              <ArrowRight size={18} />
            </Link>
            <Link className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10" to={loginPath}>
              <BadgeCheck size={18} />
              {user ? "Dashboard" : "Login"}
            </Link>
          </div>
        </div>
      </div>
    </section>
    <Footer />
    </div>
  );
};

export default HomePage;
