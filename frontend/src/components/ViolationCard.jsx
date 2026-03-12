import { CheckCircle2, Clock3, MapPin } from "./Icons";
import { Link } from "react-router-dom";

const ViolationCard = ({ violation, detailBasePath = "/dashboard/admin/violations" }) => (
  <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-glass backdrop-blur-xl">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{violation.householdId}</p>
        <h3 className="mt-2 text-lg font-semibold text-white">{violation.location}</h3>
      </div>
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
          violation.status === "verified" ? "bg-brand-400/15 text-brand-100" : "bg-amber-400/15 text-amber-200"
        }`}
      >
        {violation.status === "verified" ? <CheckCircle2 size={14} /> : <Clock3 size={14} />}
        {violation.status}
      </span>
    </div>
    <p className="mt-4 line-clamp-2 text-sm leading-7 text-slate-300">{violation.notes || "Evidence captured for mixed-waste observation."}</p>
    <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
      <MapPin size={14} />
      {new Date(violation.date).toLocaleDateString()}
    </div>
    <div className="mt-5 flex items-center justify-between">
      <span className="text-sm text-slate-300">{violation.pointsDeducted} points deducted</span>
      {detailBasePath ? (
        <Link className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-brand-400/50" to={`${detailBasePath}/${violation._id}`}>
          View details
        </Link>
      ) : (
        <span className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-300">Evidence logged</span>
      )}
    </div>
  </article>
);

export default ViolationCard;
