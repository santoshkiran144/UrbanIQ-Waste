import { Camera, QrCode, Route, UploadCloud } from "../components/Icons";
import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import ViolationCard from "../components/ViolationCard";
import ScannerModal from "../components/ScannerModal";
import api from "../api/client";
import { sampleCollectorHouseholds, sampleViolations } from "../data/sampleData";

const initialForm = {
  householdId: "",
  location: "",
  notes: "",
  image: null
};

const CollectorDashboard = () => {
  const [form, setForm] = useState(initialForm);
  const [reports, setReports] = useState([]);
  const [routeStarted, setRouteStarted] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [households, setHouseholds] = useState([]);
  const [householdSearch, setHouseholdSearch] = useState("");
  const [selectedHouseholdId, setSelectedHouseholdId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadReports = async () => {
    try {
      const { data } = await api.get("/violations/my-reports");
      setReports(data.violations);
    } catch (_error) {
      setReports(sampleViolations);
    }
  };

  const loadHouseholds = async (search = "") => {
    try {
      const { data } = await api.get(`/violations/households${search ? `?search=${encodeURIComponent(search)}` : ""}`);
      setHouseholds(data.households);
    } catch (_error) {
      const filtered = sampleCollectorHouseholds.filter((household) =>
        [household.householdId, household.buildingName, household.unitNumber]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
      setHouseholds(filtered);
    }
  };

  useEffect(() => {
    loadReports();
    loadHouseholds();
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadHouseholds(householdSearch);
    }, 200);

    return () => window.clearTimeout(timeoutId);
  }, [householdSearch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.householdId || !form.location || !form.image) {
      setError("Household ID, route location, and image evidence are required.");
      return;
    }

    const payload = new FormData();
    payload.append("householdId", form.householdId);
    payload.append("location", form.location);
    payload.append("notes", form.notes);
    payload.append("image", form.image);

    try {
      setSubmitting(true);
      const { data } = await api.post("/violations", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage(`Violation captured for ${data.household.householdId}. New score: ${data.household.complianceScore}`);
      setForm(initialForm);
      setSelectedHouseholdId("");
      setScannerOpen(false);
      loadReports();
      loadHouseholds(householdSearch);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to submit violation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-brand-500/20 to-slate-950/80 p-8 shadow-glow">
          <BackButton fallback="/dashboard" />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Collector Dashboard</p>
              <h1 className="mt-3 font-display text-4xl font-bold text-white">Capture violations during route collection.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Start the route, enter or scan a household ID, upload mixed waste evidence, and log the report for RWA review.
              </p>
            </div>
            <button
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${routeStarted ? "bg-white/10 text-white" : "bg-white text-slate-950"}`}
              onClick={() => setRouteStarted((current) => !current)}
              type="button"
            >
              <span className="inline-flex items-center gap-2">
                <Route size={16} />
                {routeStarted ? "Route In Progress" : "Start Route"}
              </span>
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
              <p className="text-sm text-slate-400">Violations logged</p>
              <p className="mt-2 font-display text-4xl text-white">{reports.length}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
              <p className="text-sm text-slate-400">AI verification</p>
              <p className="mt-2 text-lg font-semibold text-brand-100">Enabled for evidence capture</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
              <p className="text-sm text-slate-400">Household scan</p>
              <button
                className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                onClick={() => {
                  const targetHousehold =
                    households.find((household) => household.householdId === selectedHouseholdId) || households[0];
                  if (!targetHousehold) {
                    setError("No household records found for QR scan.");
                    return;
                  }
                  setForm((current) => ({ ...current, householdId: targetHousehold.householdId }));
                  setSelectedHouseholdId(targetHousehold.householdId);
                  setMessage(`QR scan simulated for ${targetHousehold.householdId}.`);
                }}
                type="button"
              >
                <QrCode size={18} />
                Simulate QR Scan
              </button>
            </div>
          </div>
        </article>

        <form className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glass backdrop-blur-xl" onSubmit={handleSubmit}>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Violation Reporting</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Collector workflow</h2>
          <div className="mt-6 space-y-4">
            {message ? <div className="rounded-2xl border border-brand-400/20 bg-brand-400/10 px-4 py-3 text-sm text-brand-100">{message}</div> : null}
            {error ? <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}
            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-brand-400"
              onChange={(event) => setHouseholdSearch(event.target.value)}
              placeholder="Search building / unit for QR assist"
              value={householdSearch}
            />
            <select
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-brand-400"
              onChange={(event) => {
                setSelectedHouseholdId(event.target.value);
                setForm((current) => ({ ...current, householdId: event.target.value }));
              }}
              value={selectedHouseholdId}
            >
              <option value="">Select household from QR scan list</option>
              {households.map((household) => (
                <option key={household.householdId} value={household.householdId}>
                  {household.householdId} | {household.buildingName} | {household.unitNumber}
                </option>
              ))}
            </select>
            <input className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-brand-400" name="householdId" onChange={(event) => setForm((current) => ({ ...current, householdId: event.target.value }))} placeholder="Household ID or QR token" value={form.householdId} />
            <input className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-brand-400" name="location" onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} placeholder="Collection point / location" value={form.location} />
            <textarea className="h-28 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-brand-400" name="notes" onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} placeholder="Observation notes for admin review" value={form.notes} />

            <div className="rounded-[1.5rem] border border-dashed border-brand-400/30 bg-brand-400/5 p-5">
              <p className="text-sm text-slate-300">Evidence</p>
              <p className="mt-2 text-white">{form.image?.name || "No image selected"}</p>
              <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-5 py-3 font-semibold text-white shadow-glow transition hover:scale-[1.02]" onClick={() => setScannerOpen(true)} type="button">
                <Camera size={18} />
                Capture Violation
              </button>
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.01]" disabled={submitting} type="submit">
              <UploadCloud size={18} />
              {submitting ? "Submitting..." : "Submit Violation"}
            </button>
          </div>
        </form>
      </section>

      <section className="mt-8">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Recent Reports</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Latest collector activity</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {reports.map((violation) => (
            <ViolationCard detailBasePath="/dashboard/collector/violations" key={violation._id} violation={violation} />
          ))}
        </div>
      </section>

      <ScannerModal
        imageName={form.image?.name}
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onFileSelect={(event) => setForm((current) => ({ ...current, image: event.target.files?.[0] || null }))}
      />
    </>
  );
};

export default CollectorDashboard;
