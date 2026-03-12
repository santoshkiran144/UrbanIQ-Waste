import { BarChart3, Camera, QrCode, ShieldCheck, Sparkles, Users } from "./Icons";

const items = [
  {
    icon: QrCode,
    title: "QR-Based Household Identification",
    body: "Collectors can scan or enter a household ID to log violations without searching through resident lists."
  },
  {
    icon: Camera,
    title: "Photo-Based Violation Reporting",
    body: "Mixed waste evidence is captured on the spot, giving RWAs visual proof during review."
  },
  {
    icon: BarChart3,
    title: "Compliance Tracking Dashboards",
    body: "See compliance percentage, repeat offenders, monthly trends, and building-level performance."
  },
  {
    icon: Sparkles,
    title: "Behavioral Incentive Scoring",
    body: "Every household begins at 100 and loses points for verified violations to encourage sustained behavior change."
  },
  {
    icon: ShieldCheck,
    title: "AI-Verified Reporting Experience",
    body: "The collector interface simulates an AI verification layer to make the workflow feel credible and modern."
  },
  {
    icon: Users,
    title: "Built for 10-User MVP Testing",
    body: "The product is shaped for user testing with collectors, residents, and RWA stakeholders in one flow."
  }
];

const FeatureSection = () => (
  <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6" id="features">
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Features</p>
      <h2 className="mt-4 font-display text-4xl font-bold text-white">Modern compliance monitoring designed like a startup product, not a municipal tool.</h2>
    </div>
    <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map(({ icon: Icon, title, body }) => (
        <article key={title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-brand-400/40">
          <span className="inline-flex rounded-2xl bg-brand-400/10 p-3 text-brand-100">
            <Icon size={22} />
          </span>
          <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">{body}</p>
        </article>
      ))}
    </div>
  </section>
);

export default FeatureSection;
