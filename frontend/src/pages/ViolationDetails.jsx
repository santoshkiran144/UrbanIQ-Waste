import { ThumbsDown, ThumbsUp } from "../components/Icons";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import api from "../api/client";
import { sampleViolations } from "../data/sampleData";

const uploadBase = import.meta.env.VITE_UPLOADS_URL || "http://localhost:5000";

const ViolationDetails = () => {
  const { violationId } = useParams();
  const location = useLocation();
  const [violation, setViolation] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadViolation = async () => {
      try {
        if (location.pathname.includes("/dashboard/admin/")) {
          const { data } = await api.get("/admin/violations");
          setViolation(data.violations.find((item) => item._id === violationId) || sampleViolations[0]);
          return;
        }

        const { data } = await api.get("/violations/my-reports");
        setViolation(data.violations.find((item) => item._id === violationId) || sampleViolations[0]);
      } catch (_error) {
        setViolation(sampleViolations.find((item) => item._id === violationId) || sampleViolations[0]);
      }
    };

    loadViolation();
  }, [location.pathname, violationId]);

  const updateStatus = async (status) => {
    if (!violation) {
      return;
    }

    try {
      await api.put(`/admin/violations/${violation._id}`, { ...violation, status });
      setViolation((current) => ({ ...current, status }));
      setMessage(`Violation marked as ${status}.`);
    } catch (_error) {
      setViolation((current) => ({ ...current, status }));
      setMessage(`Demo mode: status set to ${status}.`);
    }
  };

  if (!violation) {
    return <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-white shadow-glass">Loading violation details...</section>;
  }

  const imageSrc = violation.imageUrl?.startsWith("/uploads") ? `${uploadBase}${violation.imageUrl}` : violation.imageUrl;

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-glass backdrop-blur-xl">
        <img alt="Violation evidence" className="h-[420px] w-full object-cover" src={imageSrc} />
      </article>
      <article className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glass backdrop-blur-xl">
        <BackButton fallback={location.pathname.includes("/dashboard/admin/") ? "/dashboard/admin" : "/dashboard/collector"} />
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Violation Details</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">{violation.householdId}</h1>
        <div className="mt-6 space-y-4 text-sm text-slate-300">
          <p>Collector: {violation.collector?.name || "Collector"}</p>
          <p>Date: {new Date(violation.date).toLocaleString()}</p>
          <p>Status: <span className="capitalize text-white">{violation.status}</span></p>
          <p>Location: {violation.location}</p>
          <p>Notes: {violation.notes || "No additional notes provided."}</p>
        </div>

        {message ? <div className="mt-5 rounded-2xl border border-brand-400/20 bg-brand-400/10 px-4 py-3 text-sm text-brand-100">{message}</div> : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <button className="rounded-full bg-brand-500 px-5 py-3 font-semibold text-white transition hover:bg-brand-400" onClick={() => updateStatus("verified")} type="button">
            Mark Verified
          </button>
          <button className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/10" onClick={() => updateStatus("dismissed")} type="button">
            Dismiss Violation
          </button>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Feedback</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className={`rounded-full px-5 py-3 font-semibold transition ${feedback === "valid" ? "bg-brand-500 text-white" : "border border-white/15 text-white hover:bg-white/10"}`} onClick={() => setFeedback("valid")} type="button">
              <span className="inline-flex items-center gap-2">
                <ThumbsUp size={18} />
                Valid Violation
              </span>
            </button>
            <button className={`rounded-full px-5 py-3 font-semibold transition ${feedback === "incorrect" ? "bg-rose-500 text-white" : "border border-white/15 text-white hover:bg-white/10"}`} onClick={() => setFeedback("incorrect")} type="button">
              <span className="inline-flex items-center gap-2">
                <ThumbsDown size={18} />
                Incorrect Report
              </span>
            </button>
          </div>
        </div>
      </article>
    </section>
  );
};

export default ViolationDetails;
