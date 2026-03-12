import { RefreshCcw, ShieldAlert, TrendingUp, Trophy } from "../components/Icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import DashboardCharts from "../components/DashboardCharts";
import HouseholdCard from "../components/HouseholdCard";
import ViolationCard from "../components/ViolationCard";
import api from "../api/client";
import { sampleHouseholds, sampleViolations } from "../data/sampleData";

const initialHouseholdForm = {
  buildingName: "",
  unitNumber: ""
};

const buildHouseholdId = ({ buildingName, unitNumber }) =>
  `${buildingName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase() || "BLDG"}-${
    unitNumber.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() || "UNIT"
  }`;

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [households, setHouseholds] = useState([]);
  const [violations, setViolations] = useState([]);
  const [householdForm, setHouseholdForm] = useState(initialHouseholdForm);
  const [editingHouseholdId, setEditingHouseholdId] = useState("");
  const [householdMessage, setHouseholdMessage] = useState("");
  const [householdError, setHouseholdError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState("");

  const loadDashboard = async () => {
    try {
      const [analyticsResponse, householdsResponse, violationsResponse] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/households"),
        api.get("/admin/violations")
      ]);

      setAnalytics(analyticsResponse.data);
      setHouseholds(householdsResponse.data.households);
      setViolations(violationsResponse.data.violations);
    } catch (_error) {
      setAnalytics({
        summary: {
          compliancePercentage: 84,
          totalViolations: sampleViolations.length,
          totalHouseholds: sampleHouseholds.length
        },
        repeatOffenders: sampleHouseholds.filter((household) => household.violationCount >= 2),
        buildingPerformance: [
          { _id: "Green Heights", avgScore: 80 },
          { _id: "Skyline Residency", avgScore: 80 }
        ],
        monthlyViolationTrends: [
          { label: "2026-01", count: 2 },
          { label: "2026-02", count: 4 },
          { label: "2026-03", count: 3 }
        ]
      });
      setHouseholds(sampleHouseholds);
      setViolations(sampleViolations);
    }
  };

  useEffect(() => {
    loadDashboard();
    const intervalId = window.setInterval(() => {
      loadDashboard().catch(() => {});
    }, 10000);
    return () => window.clearInterval(intervalId);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshMessage("");
    try {
      await loadDashboard();
      setRefreshMessage(`Dashboard refreshed at ${new Date().toLocaleTimeString()}.`);
    } finally {
      setRefreshing(false);
    }
  };

  const getHouseholdKey = (household) => household._id || household.householdId;

  const handleHouseholdSubmit = async (event) => {
    event.preventDefault();
    setHouseholdError("");
    setHouseholdMessage("");

    if (!householdForm.buildingName || !householdForm.unitNumber) {
      setHouseholdError("Building name and unit number are required.");
      return;
    }

    try {
      if (editingHouseholdId) {
        await api.put(`/admin/households/${editingHouseholdId}`, householdForm);
        setHouseholdMessage("Household updated.");
      } else {
        await api.post("/admin/households", householdForm);
        setHouseholdMessage("Household created.");
      }
      setHouseholdForm(initialHouseholdForm);
      setEditingHouseholdId("");
      await loadDashboard();
    } catch (_error) {
      const optimisticHousehold = {
        ...householdForm,
        householdId: buildHouseholdId(householdForm),
        complianceScore: 100,
        violationCount: 0
      };

      if (editingHouseholdId) {
        setHouseholds((current) =>
          current.map((household) =>
            getHouseholdKey(household) === editingHouseholdId ? { ...household, ...optimisticHousehold } : household
          )
        );
        setHouseholdMessage("Demo mode: household updated locally.");
      } else {
        setHouseholds((current) => [optimisticHousehold, ...current]);
        setHouseholdMessage("Demo mode: household created locally.");
      }
      setHouseholdForm(initialHouseholdForm);
      setEditingHouseholdId("");
    }
  };

  const handleHouseholdEdit = (household) => {
    setEditingHouseholdId(getHouseholdKey(household));
    setHouseholdForm({
      buildingName: household.buildingName || "",
      unitNumber: household.unitNumber || ""
    });
    setHouseholdError("");
    setHouseholdMessage(`Editing ${household.householdId}. Update the form and click "Update Household".`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHouseholdDelete = async (household) => {
    const householdKey = getHouseholdKey(household);
    setHouseholdError("");
    setHouseholdMessage("");

    try {
      if (!household._id) {
        throw new Error("demo");
      }
      await api.delete(`/admin/households/${household._id}`);
      setHouseholdMessage("Household deleted.");
      await loadDashboard();
    } catch (_error) {
      setHouseholds((current) => current.filter((item) => getHouseholdKey(item) !== householdKey));
      setHouseholdMessage("Demo mode: household deleted locally.");
    }
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-brand-700/20 to-slate-950 p-8 shadow-glow">
          <BackButton fallback="/dashboard" />
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">RWA Dashboard</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white">Monitor compliance across buildings with live, gamified insights.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            Each household starts with 100 points and loses 10 for every verified violation. Use the dashboard to identify patterns, repeat offenders, and opportunities for intervention.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { icon: Trophy, label: "Compliance percentage", value: `${analytics?.summary.compliancePercentage || 0}%` },
              { icon: ShieldAlert, label: "Total violations", value: analytics?.summary.totalViolations || 0 },
              { icon: TrendingUp, label: "Tracked households", value: analytics?.summary.totalHouseholds || 0 }
            ].map(({ icon: Icon, label, value }) => (
              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5" key={label}>
                <span className="inline-flex rounded-2xl bg-white/10 p-3 text-brand-100">
                  <Icon size={18} />
                </span>
                <p className="mt-4 text-sm text-slate-400">{label}</p>
                <p className="mt-2 font-display text-4xl text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glass backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Top Violating Households</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Priority review list</h2>
            </div>
            <button
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-brand-400/50"
              onClick={handleRefresh}
              type="button"
            >
              <span className="inline-flex items-center gap-2">
                <RefreshCcw size={16} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </span>
            </button>
          </div>
          {refreshMessage ? <p className="mt-4 text-sm text-brand-100">{refreshMessage}</p> : null}
          <div className="mt-6 space-y-3">
            {(analytics?.repeatOffenders || []).slice(0, 5).map((household) => (
              <Link
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4 transition hover:border-brand-400/40 hover:bg-white/5"
                key={household._id || household.householdId}
                to={`/dashboard/admin/households/${household.householdId}`}
              >
                <div>
                  <p className="font-semibold text-white">{household.householdId}</p>
                  <p className="text-sm text-slate-400">{household.buildingName}</p>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <span className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-200">
                    {household.violationCount} violations
                  </span>
                  <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-100">
                    {household.complianceScore} score
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <DashboardCharts buildings={analytics?.buildingPerformance || []} trends={analytics?.monthlyViolationTrends || []} />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glass backdrop-blur-xl">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Compliance Scores</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Top household cards</h2>
              <p className="mt-2 text-sm text-slate-300">Create, update, or delete household records directly from this card section.</p>
            </div>
            {editingHouseholdId ? (
              <button
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                onClick={() => {
                  setEditingHouseholdId("");
                  setHouseholdForm(initialHouseholdForm);
                  setHouseholdError("");
                  setHouseholdMessage("");
                }}
                type="button"
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
          <form className="mb-6 grid gap-4 rounded-[1.5rem] border border-white/10 bg-slate-950/40 p-5 md:grid-cols-[1fr_1fr_auto]" onSubmit={handleHouseholdSubmit}>
            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-brand-400"
              onChange={(event) => setHouseholdForm((current) => ({ ...current, buildingName: event.target.value }))}
              placeholder="Building name"
              value={householdForm.buildingName}
            />
            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-brand-400"
              onChange={(event) => setHouseholdForm((current) => ({ ...current, unitNumber: event.target.value }))}
              placeholder="Unit number"
              value={householdForm.unitNumber}
            />
            <button className="rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-6 py-3 font-semibold text-white shadow-glow transition hover:scale-[1.01]" type="submit">
              {editingHouseholdId ? "Update Household" : "Create Household"}
            </button>
            {householdMessage ? <div className="rounded-2xl border border-brand-400/20 bg-brand-400/10 px-4 py-3 text-sm text-brand-100 md:col-span-3">{householdMessage}</div> : null}
            {householdError ? <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 md:col-span-3">{householdError}</div> : null}
          </form>
          <div className="grid gap-4 md:grid-cols-2">
            {households.slice(0, 6).map((household) => (
              <div className="space-y-3" key={getHouseholdKey(household)}>
                <Link to={`/dashboard/admin/households/${household.householdId}`}>
                  <HouseholdCard household={household} interactive />
                </Link>
                <div className="flex gap-3">
                  <button
                    className="flex-1 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    onClick={() => handleHouseholdEdit(household)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20"
                    onClick={() => handleHouseholdDelete(household)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glass backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Violation Table</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Latest evidence queue</h2>
          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-300">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Household</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-slate-950/30">
                {violations.slice(0, 6).map((violation) => (
                  <tr key={violation._id}>
                    <td className="px-4 py-4">
                      <Link className="font-semibold text-white hover:text-brand-100" to={`/dashboard/admin/violations/${violation._id}`}>
                        {violation.householdId}
                      </Link>
                    </td>
                    <td className="px-4 py-4">{violation.household?.complianceScore ?? "N/A"}</td>
                    <td className="px-4 py-4 capitalize">{violation.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Evidence Reports</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Review submitted violations</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {violations.slice(0, 4).map((violation) => (
            <ViolationCard key={violation._id} violation={violation} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
