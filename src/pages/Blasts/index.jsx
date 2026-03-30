import { useEffect, useMemo, useState } from "react";
import { createBlast, fetchBlasts } from "../../api/blasts";
import { fetchZones } from "../../api/zones";

const EMPTY_FORM = {
  zone_id: "",
  blast_date: "",
  blast_time: "",
  intensity: "",
  depth_m: "",
  blasts_per_week: "",
  charge_weight_kg: "",
  detonator_type: "",
  remarks: "",
};

export default function BlastsPage() {
  const [zones, setZones] = useState([]);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [inlineStatus, setInlineStatus] = useState("");

  const selectedZone = useMemo(
    () => zones.find((z) => z.id === form.zone_id),
    [zones, form.zone_id],
  );

  const load = async (zoneId) => {
    setLoading(true);
    try {
      const [zoneList, blastRows] = await Promise.all([
        zones.length ? Promise.resolve(zones) : fetchZones().catch(() => []),
        fetchBlasts({ zone_id: zoneId || undefined, limit: 50 }).catch(() => []),
      ]);
      if (!zones.length) setZones(zoneList || []);
      setRows(blastRows || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones().then((data) => setZones(data || [])).catch(() => setZones([]));
  }, []);

  useEffect(() => {
    load(form.zone_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.zone_id]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setInlineStatus("");

    try {
      const payload = {
        zone_id: form.zone_id,
        blast_date: form.blast_date,
        blast_time: form.blast_time,
        intensity: Number(form.intensity),
        depth_m: Number(form.depth_m),
        blasts_per_week: Number(form.blasts_per_week),
        charge_weight_kg: form.charge_weight_kg === "" ? null : Number(form.charge_weight_kg),
        detonator_type: form.detonator_type || null,
        remarks: form.remarks || null,
      };

      const res = await createBlast(payload);
      await load(form.zone_id);

      if (res?.is_anomaly) {
        setInlineStatus("Anomaly detected. Alert has been raised for this zone.");
      } else {
        setInlineStatus("Blast event submitted successfully.");
      }
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to submit blast event.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "30px 32px 80px", fontFamily: "Inter, sans-serif" }}>
      <header style={{ marginBottom: 22 }}>
        <h1 style={{ margin: 0, color: "#e5e2e1", fontSize: 26, fontWeight: 800 }}>Blast Events</h1>
        <p style={{ margin: "6px 0 0", color: "#e4beba", fontSize: 12, opacity: 0.72 }}>
          Submit operational blast data and review recent anomaly-evaluated events.
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(360px, 440px) 1fr", gap: 20 }}>
        <section style={panelStyle}>
          <h3 style={sectionTitle}>New Blast Entry</h3>

          {error && <div style={errorStyle}>{error}</div>}
          {!!inlineStatus && (
            <div style={inlineStatus.includes("Anomaly") ? warnStyle : okStyle}>{inlineStatus}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
            <label style={labelStyle}>Zone</label>
            <select
              value={form.zone_id}
              onChange={(e) => set("zone_id", e.target.value)}
              required
              style={inputStyle}
            >
              <option value="">Select zone</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>{z.name} ({z.district})</option>
              ))}
            </select>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={labelStyle}>Blast Date</label>
                <input type="date" value={form.blast_date} onChange={(e) => set("blast_date", e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Blast Time</label>
                <input type="time" value={form.blast_time} onChange={(e) => set("blast_time", e.target.value)} required style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={labelStyle}>Intensity</label>
                <input type="number" step="0.01" min="0" value={form.intensity} onChange={(e) => set("intensity", e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Depth (m)</label>
                <input type="number" step="0.01" min="0" value={form.depth_m} onChange={(e) => set("depth_m", e.target.value)} required style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={labelStyle}>Blasts / Week</label>
                <input type="number" min="0" value={form.blasts_per_week} onChange={(e) => set("blasts_per_week", e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Charge Weight (kg)</label>
                <input type="number" step="0.01" min="0" value={form.charge_weight_kg} onChange={(e) => set("charge_weight_kg", e.target.value)} style={inputStyle} />
              </div>
            </div>

            <label style={labelStyle}>Detonator Type</label>
            <input value={form.detonator_type} onChange={(e) => set("detonator_type", e.target.value)} placeholder="Electronic / Non-electric" style={inputStyle} />

            <label style={labelStyle}>Remarks</label>
            <textarea value={form.remarks} onChange={(e) => set("remarks", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />

            <button type="submit" disabled={submitting} style={submitStyle}>
              {submitting ? "Submitting..." : "Submit Blast Event"}
            </button>
          </form>
        </section>

        <section style={panelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={sectionTitle}>Recent Blasts {selectedZone ? `for ${selectedZone.name}` : ""}</h3>
            <button onClick={() => load(form.zone_id)} style={ghostBtnStyle}>Refresh</button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
              <thead>
                <tr>
                  {[
                    "Date", "Zone", "Intensity", "Depth", "Blasts/Wk", "Anomaly", "Severity", "Score",
                  ].map((h) => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={tdMutedStyle}>Loading blast events...</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={8} style={tdMutedStyle}>No blast events found.</td></tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} style={{ borderTop: "1px solid rgba(91,64,62,0.18)" }}>
                      <td style={tdStyle}>{row.blast_date ? new Date(row.blast_date).toLocaleString() : "-"}</td>
                      <td style={tdStyle}>{row.zone_name}</td>
                      <td style={tdStyle}>{row.intensity ?? "-"}</td>
                      <td style={tdStyle}>{row.depth_m ?? "-"}</td>
                      <td style={tdStyle}>{row.blasts_per_week ?? "-"}</td>
                      <td style={{ ...tdStyle, color: row.is_anomaly ? "#ff5451" : "#4edea3", fontWeight: 700 }}>
                        {row.is_anomaly ? "Yes" : "No"}
                      </td>
                      <td style={tdStyle}>{row.severity || "normal"}</td>
                      <td style={tdStyle}>{row.anomaly_score ?? "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

const panelStyle = {
  background: "#201f1f",
  border: "1px solid rgba(91,64,62,0.15)",
  borderRadius: 4,
  padding: 16,
};

const sectionTitle = {
  margin: "0 0 12px",
  color: "#e5e2e1",
  fontSize: 14,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const labelStyle = {
  fontSize: 10,
  color: "#e4beba",
  opacity: 0.8,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontWeight: 700,
};

const inputStyle = {
  width: "100%",
  background: "#1c1b1b",
  border: "1px solid rgba(91,64,62,0.22)",
  borderRadius: 2,
  color: "#e5e2e1",
  fontSize: 12,
  padding: "8px 10px",
  fontFamily: "Inter",
  outline: "none",
};

const submitStyle = {
  marginTop: 4,
  background: "linear-gradient(135deg,#ffb3ad,#ff5451)",
  border: "none",
  color: "#68000a",
  borderRadius: 2,
  padding: "10px 14px",
  fontWeight: 800,
  fontSize: 10,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  cursor: "pointer",
};

const ghostBtnStyle = {
  background: "transparent",
  border: "1px solid rgba(91,64,62,0.25)",
  color: "#e4beba",
  borderRadius: 2,
  padding: "6px 10px",
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  cursor: "pointer",
};

const errorStyle = {
  background: "rgba(255,84,81,0.1)",
  border: "1px solid rgba(255,84,81,0.28)",
  color: "#ff5451",
  borderRadius: 2,
  padding: "8px 10px",
  fontSize: 11,
  marginBottom: 10,
};

const warnStyle = {
  background: "rgba(255,84,81,0.1)",
  border: "1px solid rgba(255,84,81,0.28)",
  color: "#ffb3ad",
  borderRadius: 2,
  padding: "8px 10px",
  fontSize: 11,
  marginBottom: 10,
};

const okStyle = {
  background: "rgba(78,222,163,0.1)",
  border: "1px solid rgba(78,222,163,0.28)",
  color: "#4edea3",
  borderRadius: 2,
  padding: "8px 10px",
  fontSize: 11,
  marginBottom: 10,
};

const thStyle = {
  textAlign: "left",
  fontSize: 10,
  color: "#e4beba",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  padding: "8px 8px",
};

const tdStyle = {
  color: "#e5e2e1",
  fontSize: 12,
  padding: "10px 8px",
};

const tdMutedStyle = {
  color: "#e4beba",
  opacity: 0.72,
  fontSize: 12,
  padding: "14px 8px",
};
