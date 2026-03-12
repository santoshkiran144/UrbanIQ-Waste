import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import HouseholdCard from "../components/HouseholdCard";
import ViolationCard from "../components/ViolationCard";
import api from "../api/client";
import { sampleHouseholds, sampleViolations } from "../data/sampleData";

const ResidentDashboard = () => {
  const [household, setHousehold] = useState(null);
  const [violations, setViolations] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await api.get("/resident/dashboard");
        setHousehold(data.household);
        setViolations(data.violations);
      } catch (_error) {
        setHousehold(sampleHouseholds[0]);
        setViolations(sampleViolations.filter((item) => item.householdId === sampleHouseholds[0].householdId));
      }
    };

    loadDashboard();
  }, []);

  if (!household) {
    return <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-white shadow-glass">Loading resident dashboard...</section>;
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-brand-500/20 to-slate-950/80 p-8 shadow-glow">
          <BackButton fallback="/dashboard" />
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Resident Dashboard</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white">Understand and improve your waste segregation score.</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
            Every household starts at 100. Verified mixed-waste violations deduct 10 points and stay visible for transparency.
          </p>
        </article>
        <HouseholdCard household={household} />
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Your Violation History</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Evidence linked to your household</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {violations.map((violation) => (
            <ViolationCard detailBasePath={null} key={violation._id} violation={violation} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResidentDashboard;
