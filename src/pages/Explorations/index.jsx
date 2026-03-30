import { useEffect, useMemo, useState } from "react";
import { createExploration, fetchExplorations } from "../../api/explorations";
import { fetchZones } from "../../api/zones";

const EMPTY_FORM = {
  zone_id: "",
  log_date: "",
  activity_type: "drilling",
  depth_m: "",
  water_encountered: false,
  water_depth_m: "",
  soil_description: "",
  moisture_level: "dry",
  remarks: "",
};

export default function ExplorationsPage() {
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
      const [zoneList, logs] = await Promise.all([
        zones.length ? Promise.resolve(zones) : fetchZones().catch(() => []),
        fetchExplorations({ zone_id: zoneId || undefined, limit: 50 }).catch(() => []),
      ]);
      if (!zones.length) setZones(zoneList || []);
      setRows(logs || []);
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
        log_date: form.log_date,
        activity_type: form.activity_type,
        depth_m: form.depth_m === "" ? null : Number(form.depth_m),
        water_encountered: !!form.water_encountered,
        water_depth_m: form.water_encountered && form.water_depth_m !== "" ? Number(form.water_depth_m) : null,
        soil_description: form.soil_description,
        moisture_level: form.moisture_level,
        remarks: form.remarks || null,
      };

      const res = await createExploration(payload);
      await load(form.zone_id);

      if (payload.water_encountered) {
        setInlineStatus(
          `Water observation saved. Zone saturation index updated to ${res?.zone_saturation_index ?? "-"} and risk re-forecast triggered.`,
        );
      } else {
        setInlineStatus("Exploration log submitted and risk re-forecast triggered.");
      }
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to submit exploration log.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "30px 32px 80px", fontFamily: "Inter, sans-serif" }}>
      <header style={{ marginBottom: 22 }}>
        <h1 style={{ margin: 0, color: "#e5e2e1", fontSize: 26, fontWeight: 800 }}>Exploration Logs</h1>
        <p style={{ margin: "6px 0 0", color: "#e4beba", fontSize: 12, opacity: 0.72 }}>
          Submit field exploration data and keep zone saturation + risk forecasts current.
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(360px, 460px) 1fr", gap: 20 }}>
        <section style={panelStyle}>
          <h3 style={sectionTitle}>New Exploration Entry</h3>

          {error && <div style={errorStyle}>{error}</div>}
          {!!inlineStatus && <div style={okStyle}>{inlineStatus}</div>}

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
                <label style={labelStyle}>Log Date</label>
                <input type="date" value={form.log_date} onChange={(e) => set("log_date", e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Activity Type</label>
                <select value={form.activity_type} onChange={(e) => set("activity_type", e.target.value)} required style={inputStyle}>
                  <option value="drilling">Drilling</option>
                  <option value="sampling">Sampling</option>
                  <option value="surveying">Surveying</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={labelStyle}>Depth (m)</label>
                <input type="number" step="0.01" min="0" value={form.depth_m} onChange={(e) => set("depth_m", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Moisture Level</label>
                <select value={form.moisture_level} onChange={(e) => set("moisture_level", e.target.value)} required style={inputStyle}>
                  <option value="dry">Dry</option>
                  <option value="moist">Moist</option>
                  <option value="wet">Wet</option>
                  <option value="saturated">Saturated</option>
                </select>
              </div>
            </div>

            <label style={labelStyle}>Soil Description</label>
            <textarea
              value={form.soil_description}
              onChange={(e) => set("soil_description", e.target.value)}
              rows={2}
              required
              style={{ ...inputStyle, resize: "vertical" }}
            />

            <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={form.water_encountered}
                onChange={(e) => set("water_encountered", e.target.checked)}
                style={{ accentColor: "#ffb3ad" }}
              />
              Water Encountered
            </label>

            <div
              style={{
                display: "grid",
                gap: 6,
                maxHeight: form.water_encountered ? 80 : 0,
                opacity: form.water_encountered ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 220ms ease, opacity 220ms ease",
              }}
            >
              <label style={labelStyle}>Water Depth (m)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.water_depth_m}
                onChange={(e) => set("water_depth_m", e.target.value)}
                disabled={!form.water_encountered}
                style={inputStyle}
              />
            </div>

            <label style={labelStyle}>Remarks</label>
            <textarea value={form.remarks} onChange={(e) => set("remarks", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />

            <button type="submit" disabled={submitting} style={submitStyle}>
              {submitting ? "Submitting..." : "Submit Exploration Log"}
            </button>
          </form>
        </section>

        <section style={panelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={sectionTitle}>Recent Explorations {selectedZone ? `for ${selectedZone.name}` : ""}</h3>
            <button onClick={() => load(form.zone_id)} style={ghostBtnStyle}>Refresh</button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
              <thead>
                <tr>
                  {[
                    "Date", "Zone", "Activity", "Depth", "Water", "Water Depth", "Moisture", "Saturation Trigger",
                  ].map((h) => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={tdMutedStyle}>Loading exploration logs...</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={8} style={tdMutedStyle}>No exploration logs found.</td></tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} style={{ borderTop: "1px solid rgba(91,64,62,0.18)" }}>
                      <td style={tdStyle}>{row.log_date ? new Date(row.log_date).toLocaleDateString() : "-"}</td>
                      <td style={tdStyle}>{row.zone_name}</td>
                      <td style={tdStyle}>{row.activity_type}</td>
                      <td style={tdStyle}>{row.depth_m ?? "-"}</td>
                      <td style={{ ...tdStyle, color: row.water_encountered ? "#ffb95f" : "#4edea3", fontWeight: 700 }}>
                        {row.water_encountered ? "Yes" : "No"}
                      </td>
                      <td style={tdStyle}>{row.water_depth_m ?? "-"}</td>
                      <td style={tdStyle}>{row.moisture_level}</td>
                      <td style={tdStyle}>{row.water_encountered ? "Updated" : "No"}</td>
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
