import { useState } from "react";

const FRAMEWORKS = ["NIST SP 800-53", "NIST CSF 2.0", "FedRAMP", "CIS Controls v8"];
const ENVS = ["AWS", "Azure", "GCP", "Multi-cloud"];

const styles = `
  .assess-btn { background: #4a5568; color: #e2e8f0; transition: background 0.2s; }
  .assess-btn:hover:not(:disabled) { background: #5a6a7a; }
  .assess-btn:disabled { background: #2d3748; color: #718096; cursor: not-allowed; }
  .nist-tag { display: inline-block; font-size: 12px; font-family: monospace; padding: 3px 10px; border-radius: 99px; background: #2d2a3a; border: 1px solid #6b6080; color: #b8a9d0; text-decoration: none; transition: background 0.2s, color 0.2s, border-color 0.2s; cursor: pointer; }
  .nist-tag:hover { background: #3d3550; color: #d4c5e8; border-color: #9b8ab0; }
  textarea:focus { outline: none; border-color: #4a5568 !important; }
`;

export default function App() {
  const [input, setInput] = useState("");
  const [env, setEnv] = useState("AWS");
  const [framework, setFramework] = useState("NIST SP 800-53");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function assess() {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 4000,
          system: `You are a senior GRC analyst for ${env} environments using ${framework}. Return ONLY valid JSON (no markdown) with keys: assessmentQuestions (array), evidenceToCollect (array), potentialWeaknesses (array of {name, description, severity}), nistControls (array of {id, name, rationale}). Be specific to ${env}.`,
          messages: [{ role: "user", content: `Assess this security control:\n\n${input}` }]
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content.find(b => b.type === "text")?.text || "";
      setResult(JSON.parse(text.replace(/```json|```/g, "").trim()));
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  return (
    <>
      <style>{styles}</style>
      <div style={{ minHeight: "100vh", background: "#111318", color: "#c9d1d9", fontFamily: "system-ui, sans-serif", padding: "2rem 1rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <span style={{ fontSize: 11, background: "#1e2a1e", color: "#7a9e7a", padding: "3px 10px", borderRadius: 99, fontWeight: 600, letterSpacing: "0.05em", border: "1px solid #2d4a2d" }}>
            GRC PORTFOLIO TOOL
          </span>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0.75rem 0 0.25rem", color: "#e2e8f0" }}>
            Security Control Assessor
          </h1>
          <p style={{ color: "#6b7280", marginBottom: "1.75rem", fontSize: 14 }}>
            Powered by Claude AI · Assessment questions, evidence checklists, weaknesses & {framework} mappings
          </p>

          <div style={{ background: "#1a1c24", border: "1px solid #2a2d3a", borderRadius: 12, padding: "1.25rem", marginBottom: "1rem" }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 8, letterSpacing: "0.05em" }}>
              CONTROL DESCRIPTION OR SYSTEM DETAIL
            </label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Example: Our AWS environment uses IAM roles with least-privilege for EC2. MFA is enforced on root and all IAM users..."
              style={{ width: "100%", minHeight: 130, padding: "0.75rem", borderRadius: 8, border: "1px solid #2a2d3a", fontSize: 14, resize: "vertical", fontFamily: "inherit", boxSizing: "border-box", background: "#161820", color: "#c9d1d9" }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
              <div>
                <label style={{ fontSize: 11, color: "#6b7280", display: "block", marginBottom: 4, letterSpacing: "0.05em" }}>CLOUD ENVIRONMENT</label>
                <select value={env} onChange={e => setEnv(e.target.value)}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #2a2d3a", fontSize: 13, background: "#161820", color: "#c9d1d9" }}>
                  {ENVS.map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: "#6b7280", display: "block", marginBottom: 4, letterSpacing: "0.05em" }}>COMPLIANCE FRAMEWORK</label>
                <select value={framework} onChange={e => setFramework(e.target.value)}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #2a2d3a", fontSize: 13, background: "#161820", color: "#c9d1d9" }}>
                  {FRAMEWORKS.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <button
              onClick={assess}
              disabled={loading || !input.trim()}
              className="assess-btn"
              style={{ width: "100%", marginTop: 12, padding: "0.7rem", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              {loading ? "Analyzing..." : "Assess control"}
            </button>
          </div>

          {error && (
            <div style={{ background: "#1e1515", border: "1px solid #4a2020", borderRadius: 8, padding: "0.75rem 1rem", color: "#a87070", fontSize: 13, marginBottom: "1rem" }}>
              {error}
            </div>
          )}

          {result && <Results result={result} framework={framework} />}
        </div>
      </div>
    </>
  );
}

function Results({ result, framework }) {
  const sevColor = s => {
    if (s === "High") return { bg: "#1e1515", color: "#a87070", border: "#4a2020" };
    if (s === "Medium") return { bg: "#1e1a0f", color: "#a89a60", border: "#4a3d10" };
    return { bg: "#101e14", color: "#6a9e7a", border: "#1a4a28" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Card title="Assessment questions" icon="❓" accent="#5a7a6a">
        <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: 8 }}>
          {result.assessmentQuestions.map((q, i) => (
            <li key={i} style={{ fontSize: 13, lineHeight: 1.7, color: "#a0aab4" }}>{q}</li>
          ))}
        </ul>
      </Card>

      <Card title="Evidence to collect" icon="📋" accent="#5a6a7a">
        <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: 8 }}>
          {result.evidenceToCollect.map((e, i) => (
            <li key={i} style={{ fontSize: 13, lineHeight: 1.7, color: "#a0aab4" }}>{e}</li>
          ))}
        </ul>
      </Card>

      <Card title="Potential weaknesses" icon="⚠️" accent="#7a5a5a">
        {result.potentialWeaknesses.map((w, i) => {
          const s = sevColor(w.severity);
          return (
            <div key={i} style={{ padding: "0.75rem 0", borderBottom: i < result.potentialWeaknesses.length - 1 ? "1px solid #1e2433" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{w.name}</span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: s.bg, color: s.color, border: "1px solid " + s.border, marginLeft: "auto" }}>
                  {w.severity}
                </span>
              </div>
              <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>{w.description}</p>
            </div>
          );
        })}
      </Card>

      <Card title={framework + " control mappings"} icon="📖" accent="#6b6080">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {result.nistControls.map((c, i) => (
            
             <a key={i}
              className="nist-tag"
              href={"https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_0/home?element=" + c.id}
              target="_blank"
              rel="noreferrer">
              {c.id}
            </a>
          ))}
        </div>
        <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: 8 }}>
          {result.nistControls.map((c, i) => (
            <li key={i} style={{ fontSize: 13, lineHeight: 1.7, color: "#a0aab4" }}>
              <strong style={{ color: "#c9d1d9" }}>{c.id} – {c.name}:</strong> {c.rationale}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function Card({ title, icon, accent, children }) {
  return (
    <div style={{ background: "#1a1c24", border: "1px solid #2a2d3a", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.85rem 1.25rem", borderBottom: "1px solid #2a2d3a", borderLeft: "3px solid " + accent }}>
        <span style={{ fontSize: 15 }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#c9d1d9", letterSpacing: "0.04em" }}>{title.toUpperCase()}</span>
      </div>
      <div style={{ padding: "1rem 1.25rem" }}>{children}</div>
    </div>
  );
}