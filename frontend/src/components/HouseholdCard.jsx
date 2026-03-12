import { Home, Trophy } from "./Icons";

const HouseholdCard = ({ household, interactive = false }) => (
  <article
    className={`rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-5 shadow-glass ${
      interactive ? "transition hover:border-brand-400/40 hover:bg-slate-950/70" : ""
    }`}
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-slate-400">{household.buildingName}</p>
        <h3 className="mt-1 text-lg font-semibold text-white">{household.householdId}</h3>
      </div>
      <span className="rounded-2xl bg-white/5 p-3 text-brand-100">
        <Home size={18} />
      </span>
    </div>
    <div className="mt-5 space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-400">Compliance score</span>
          <span className="font-semibold text-white">{household.complianceScore}/100</span>
        </div>
        <div className="h-2.5 rounded-full bg-white/10">
          <div
            className={`h-2.5 rounded-full ${
              household.complianceScore >= 90 ? "bg-brand-400" : household.complianceScore >= 75 ? "bg-amber-400" : "bg-rose-400"
            }`}
            style={{ width: `${household.complianceScore}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span className="inline-flex items-center gap-2">
          <Trophy size={16} className="text-accent-400" />
          Behavior score
        </span>
        <span>{household.violationCount} violations</span>
      </div>
    </div>
  </article>
);

export default HouseholdCard;
