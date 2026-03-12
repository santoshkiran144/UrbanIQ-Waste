import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import BackButton from "../components/BackButton";
import HouseholdCard from "../components/HouseholdCard";
import ViolationCard from "../components/ViolationCard";
import api from "../api/client";
import { sampleHouseholds, sampleViolations } from "../data/sampleData";

const initialHouseholdForm = {
  buildingName: "",
  unitNumber: ""
};

const initialViolationForm = {
  collector: "",
  location: "",
  notes: "",
  status: "verified",
  pointsDeducted: 10,
  image: null,
  date: ""
};

const AdminHouseholdDetails = () => {
  const { householdId } = useParams();
  const navigate = useNavigate();
  const [households, setHouseholds] = useState([]);
  const [violations, setViolations] = useState([]);
  const [users, setUsers] = useState([]);
  const [householdForm, setHouseholdForm] = useState(initialHouseholdForm);
  const [violationForm, setViolationForm] = useState(initialViolationForm);
  const [editingViolationId, setEditingViolationId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const currentHousehold = useMemo(
    () => households.find((household) => household.householdId === householdId) || null,
    [householdId, households]
  );

  const relatedViolations = useMemo(
    () => violations.filter((violation) => violation.householdId === householdId),
    [householdId, violations]
  );

  const collectors = useMemo(() => users.filter((user) => user.role === "collector"), [users]);

  const loadData = async () => {
    try {
      const [householdsResponse, violationsResponse, usersResponse] = await Promise.all([
        api.get("/admin/households"),
        api.get("/admin/violations"),
        api.get("/admin/users")
      ]);
      setHouseholds(householdsResponse.data.households);
      setViolations(violationsResponse.data.violations);
      setUsers(usersResponse.data.users);
    } catch (_error) {
      setHouseholds(sampleHouseholds);
      setViolations(sampleViolations);
      setUsers([
        { id: "collector-1", name: "Ravi Kumar", role: "collector" },
        { id: "collector-2", name: "Meena Das", role: "collector" }
      ]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (currentHousehold) {
      setHouseholdForm({
        buildingName: currentHousehold.buildingName || "",
        unitNumber: currentHousehold.unitNumber || ""
      });
    }
  }, [currentHousehold]);

  const handleHouseholdUpdate = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!currentHousehold?._id) {
      setHouseholds((current) =>
        current.map((household) =>
          household.householdId === householdId
            ? { ...household, ...householdForm, householdId: `${householdForm.buildingName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase()}-${householdForm.unitNumber.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}` }
            : household
        )
      );
      setMessage("Demo mode: household updated locally.");
      return;
    }

    try {
      const { data } = await api.put(`/admin/households/${currentHousehold._id}`, householdForm);
      setMessage("Household updated.");
      if (data.household?.householdId && data.household.householdId !== householdId) {
        navigate(`/dashboard/admin/households/${data.household.householdId}`);
      }
      loadData();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to update household.");
    }
  };

  const handleHouseholdDelete = async () => {
    setMessage("");
    setError("");

    if (!currentHousehold) {
      return;
    }

    if (!currentHousehold._id) {
      setHouseholds((current) => current.filter((household) => household.householdId !== householdId));
      setViolations((current) => current.filter((violation) => violation.householdId !== householdId));
      navigate("/dashboard/admin");
      return;
    }

    try {
      await api.delete(`/admin/households/${currentHousehold._id}`);
      navigate("/dashboard/admin");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to delete household.");
    }
  };

  const handleViolationSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = new FormData();
      payload.append("householdId", householdId);
      payload.append("collector", violationForm.collector);
      payload.append("location", violationForm.location);
      payload.append("notes", violationForm.notes);
      payload.append("status", violationForm.status);
      payload.append("pointsDeducted", violationForm.pointsDeducted);
      if (violationForm.date) {
        payload.append("date", violationForm.date);
      }
      if (violationForm.image) {
        payload.append("image", violationForm.image);
      }

      if (editingViolationId) {
        await api.put(`/admin/violations/${editingViolationId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setMessage("Violation updated.");
      } else {
        await api.post("/admin/violations", payload, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setMessage("Violation created.");
      }
      setViolationForm(initialViolationForm);
      setEditingViolationId("");
      loadData();
    } catch (_error) {
      const collectorName = collectors.find((collector) => collector.id === violationForm.collector)?.name || "Collector";
      const optimisticViolation = {
        _id: editingViolationId || `demo-${Date.now()}`,
        householdId,
        collector: { _id: violationForm.collector, name: collectorName },
        location: violationForm.location,
        notes: violationForm.notes,
        status: violationForm.status,
        pointsDeducted: Number(violationForm.pointsDeducted),
        imageUrl: sampleViolations[0]?.imageUrl,
        date: violationForm.date || new Date().toISOString(),
        household: currentHousehold
      };

      if (editingViolationId) {
        setViolations((current) =>
          current.map((violation) => (violation._id === editingViolationId ? optimisticViolation : violation))
        );
        setMessage("Demo mode: violation updated locally.");
      } else {
        setViolations((current) => [optimisticViolation, ...current]);
        setMessage("Demo mode: violation created locally.");
      }
      setViolationForm(initialViolationForm);
      setEditingViolationId("");
    }
  };

  const handleViolationEdit = (violation) => {
    setEditingViolationId(violation._id);
    setViolationForm({
      collector: violation.collector?._id || "",
      location: violation.location || "",
      notes: violation.notes || "",
      status: violation.status || "verified",
      pointsDeducted: violation.pointsDeducted || 10,
      image: null,
      date: violation.date ? new Date(violation.date).toISOString().slice(0, 10) : ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViolationDelete = async (violation) => {
    setMessage("");
    setError("");

    try {
      if (!violation._id || `${violation._id}`.startsWith("demo-")) {
        throw new Error("demo");
      }
      await api.delete(`/admin/violations/${violation._id}`);
      setMessage("Violation deleted.");
      loadData();
    } catch (_error) {
      setViolations((current) => current.filter((item) => item._id !== violation._id));
      setMessage("Demo mode: violation deleted locally.");
    }
  };

  if (!currentHousehold) {
    return <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-white shadow-glass">Household not found.</section>;
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-brand-700/20 to-slate-950 p-8 shadow-glow">
          <BackButton fallback="/dashboard/admin" />
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Household Detail</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white">{currentHousehold.householdId}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            Manage this household record and review every linked violation from one admin screen.
          </p>
          {message ? <div className="mt-5 rounded-2xl border border-brand-400/20 bg-brand-400/10 px-4 py-3 text-sm text-brand-100">{message}</div> : null}
          {error ? <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}
        </article>
        <HouseholdCard household={currentHousehold} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glass backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Household CRUD</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Update or remove this household</h2>
            </div>
            <button
              className="rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20"
              onClick={handleHouseholdDelete}
              type="button"
            >
              Delete Household
            </button>
          </div>
          <form className="mt-6 grid gap-4" onSubmit={handleHouseholdUpdate}>
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
              Update Household
            </button>
          </form>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glass backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Violation CRUD</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{editingViolationId ? "Edit violation" : "Create violation"}</h2>
            </div>
            {editingViolationId ? (
              <button
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                onClick={() => {
                  setEditingViolationId("");
                  setViolationForm(initialViolationForm);
                }}
                type="button"
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
          <form className="mt-6 grid gap-4" onSubmit={handleViolationSubmit}>
            <select
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-brand-400"
              onChange={(event) => setViolationForm((current) => ({ ...current, collector: event.target.value }))}
              value={violationForm.collector}
            >
              <option value="">Select collector</option>
              {collectors.map((collector) => (
                <option key={collector.id} value={collector.id}>
                  {collector.name}
                </option>
              ))}
            </select>
            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-brand-400"
              onChange={(event) => setViolationForm((current) => ({ ...current, location: event.target.value }))}
              placeholder="Location"
              value={violationForm.location}
            />
            <textarea
              className="h-28 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-brand-400"
              onChange={(event) => setViolationForm((current) => ({ ...current, notes: event.target.value }))}
              placeholder="Notes"
              value={violationForm.notes}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <select
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-brand-400"
                onChange={(event) => setViolationForm((current) => ({ ...current, status: event.target.value }))}
                value={violationForm.status}
              >
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="dismissed">Dismissed</option>
              </select>
              <input
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-brand-400"
                onChange={(event) => setViolationForm((current) => ({ ...current, pointsDeducted: event.target.value }))}
                placeholder="Points deducted"
                type="number"
                value={violationForm.pointsDeducted}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300 transition hover:border-brand-400/40">
                <input
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => setViolationForm((current) => ({ ...current, image: event.target.files?.[0] || null }))}
                  type="file"
                />
                {violationForm.image?.name || "Upload evidence image"}
              </label>
              <input
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-brand-400"
                onChange={(event) => setViolationForm((current) => ({ ...current, date: event.target.value }))}
                type="date"
                value={violationForm.date}
              />
            </div>
            <button className="rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-6 py-3 font-semibold text-white shadow-glow transition hover:scale-[1.01]" type="submit">
              {editingViolationId ? "Update Violation" : "Create Violation"}
            </button>
          </form>
        </article>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Household Violations</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">All violations linked to {householdId}</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {relatedViolations.map((violation) => (
            <div className="space-y-3" key={violation._id}>
              <ViolationCard violation={violation} />
              <div className="flex gap-3">
                <button
                  className="flex-1 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                  onClick={() => handleViolationEdit(violation)}
                  type="button"
                >
                  Edit Violation
                </button>
                <button
                  className="flex-1 rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20"
                  onClick={() => handleViolationDelete(violation)}
                  type="button"
                >
                  Delete Violation
                </button>
              </div>
            </div>
          ))}
          {!relatedViolations.length ? (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-300">No violations recorded for this household.</div>
          ) : null}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Quick Navigation</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10" to="/dashboard/admin">
            Back to Dashboard
          </Link>
          {relatedViolations[0] ? (
            <Link
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              to={`/dashboard/admin/violations/${relatedViolations[0]._id}`}
            >
              View Latest Violation
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default AdminHouseholdDetails;
