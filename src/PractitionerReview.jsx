import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const TOKENS = {
  gold: "#4ecdc4",
  goldLight: "#7eddd6",
  goldDim: "rgba(78,205,196,0.3)",
  goldGlow: "rgba(78,205,196,0.15)",
  bgDeep: "#0b0a10",
  bgCard: "rgba(18,16,28,0.92)",
  bgInput: "rgba(12,10,18,0.8)",
  purple: "#2d1f3d",
  textPrimary: "#f5f0e8",
  textSecondary: "rgba(245,240,232,0.75)",
  textMuted: "rgba(245,240,232,0.5)",
  statusLow: "#4ecdc4",
  statusLowBg: "rgba(78,205,196,0.15)",
  statusMid: "#d4a03c",
  statusMidBg: "rgba(212,160,60,0.15)",
  statusHigh: "#c44040",
  statusHighBg: "rgba(196,64,64,0.15)",
  fontSerif: "'Cormorant Garamond', 'EB Garamond', Georgia, serif",
};

const BAND_CONFIG = {
  green: {
    label: "GREEN — Learning Capacity Available",
    color: TOKENS.statusLow,
    bg: TOKENS.statusLowBg,
    icon: "🟢",
  },
  amber: {
    label: "AMBER — Learning Partially Compromised",
    color: TOKENS.statusMid,
    bg: TOKENS.statusMidBg,
    icon: "🟡",
  },
  red: {
    label: "RED — Learning Not Reliably Possible",
    color: TOKENS.statusHigh,
    bg: TOKENS.statusHighBg,
    icon: "🔴",
  },
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: TOKENS.bgDeep,
    color: TOKENS.textPrimary,
    fontFamily: TOKENS.fontSerif,
  },
  header: {
    background: `linear-gradient(135deg, ${TOKENS.purple} 0%, ${TOKENS.bgDeep} 100%)`,
    borderBottom: `1px solid ${TOKENS.goldDim}`,
    padding: '20px',
    textAlign: 'center',
  },
  title: {
    color: TOKENS.gold,
    fontSize: '1.5rem',
    margin: 0,
  },
  main: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
  },
  card: {
    backgroundColor: TOKENS.bgCard,
    borderRadius: '12px',
    border: `1px solid ${TOKENS.goldDim}`,
    padding: '25px',
    marginBottom: '20px',
  },
  sectionTitle: {
    color: TOKENS.gold,
    fontSize: '1.2rem',
    marginBottom: '15px',
    borderBottom: `1px solid ${TOKENS.goldDim}`,
    paddingBottom: '10px',
  },
  responseItem: {
    marginBottom: '15px',
    padding: '15px',
    backgroundColor: TOKENS.bgInput,
    borderRadius: '8px',
  },
  questionLabel: {
    color: TOKENS.textSecondary,
    fontSize: '0.9rem',
    marginBottom: '5px',
  },
  responseValue: {
    color: TOKENS.textPrimary,
    fontSize: '1rem',
  },
  bandBadge: (band) => ({
    display: 'inline-block',
    padding: '8px 15px',
    borderRadius: '20px',
    backgroundColor: BAND_CONFIG[band]?.bg || TOKENS.bgInput,
    color: BAND_CONFIG[band]?.color || TOKENS.textPrimary,
    fontWeight: 'bold',
    fontSize: '1rem',
  }),
  warningBox: {
    backgroundColor: TOKENS.statusHighBg,
    border: `1px solid ${TOKENS.statusHigh}`,
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
  },
  select: {
    width: '100%',
    padding: '12px',
    backgroundColor: TOKENS.bgInput,
    border: `1px solid ${TOKENS.goldDim}`,
    borderRadius: '8px',
    color: TOKENS.textPrimary,
    fontSize: '1rem',
    marginBottom: '15px',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    backgroundColor: TOKENS.bgInput,
    border: `1px solid ${TOKENS.goldDim}`,
    borderRadius: '8px',
    color: TOKENS.textPrimary,
    fontSize: '1rem',
    minHeight: '100px',
    resize: 'vertical',
    fontFamily: TOKENS.fontSerif,
  },
  button: {
    backgroundColor: TOKENS.gold,
    color: TOKENS.bgDeep,
    border: 'none',
    padding: '15px 30px',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: TOKENS.textMuted,
    cursor: 'not-allowed',
  },
};

// Map question IDs to readable labels
const QUESTION_LABELS = {
  pc1: "Information reception preference",
  pc2: "Processing time needed",
  pc3: "Cognitive overload triggers",
  be1: "Energy availability factors",
  be2: "Best time of day",
  be3: "Maximum session length",
  se1: "Lighting sensitivity",
  se2: "Sound sensitivity",
  se3: "Modality preference",
  st1: "Past negative experiences",
  st2: "Fear of judgement",
  is1: "Masking requirements",
  is2: "Previous service experiences",
  ss1: "Current supports",
  ss2: "Scaffolding disruption impact",
  bd1: "Current baseline energy",
  bd2: "Recovery status",
  bd3: "Capacity allocation",
  ed1: "External demands",
  ed2: "External demand consumption",
  rc1: "Restoration access",
  rc2: "Recovery speed",
};

export default function PractitionerReview() {
  const { token } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const [practitionerNotes, setPractitionerNotes] = useState({
    decision: '',
    comments: '',
    additionalAccommodations: [],
    clarificationNeeded: false,
  });

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch(`/.netlify/functions/get-session?token=${token}&role=practitioner`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Failed to load session');
        
        if (data.status === 'completed') {
          setCompleted(true);
        }
        
        setSession(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [token]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/.netlify/functions/submit-practitioner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, practitionerNotes })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setCompleted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatResponse = (value) => {
    if (Array.isArray(value)) {
      return value.filter(v => v !== null).join(', ') || 'Not sure';
    }
    if (value === null) return 'Not sure';
    if (typeof value === 'number') {
      return ['Low/None', 'Mild', 'Moderate', 'High/Significant'][value] || value;
    }
    return String(value);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.main, textAlign: 'center', paddingTop: '100px' }}>
          <p style={{ color: TOKENS.gold }}>Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.main, textAlign: 'center', paddingTop: '100px' }}>
          <div style={{ ...styles.card, borderColor: TOKENS.statusHigh }}>
            <h2 style={{ color: TOKENS.statusHigh }}>Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (session?.status === 'pending_client') {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Baseline Access & Equity Ledger</h1>
        </header>
        <div style={styles.main}>
          <div style={{ ...styles.card, textAlign: 'center' }}>
            <h2 style={{ color: TOKENS.statusMid }}>Waiting for Client</h2>
            <p>
              <strong>{session.clientName}</strong> has not yet completed their assessment.
            </p>
            <p style={{ color: TOKENS.textMuted, marginTop: '20px' }}>
              You will receive an email notification when they finish.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Baseline Access & Equity Ledger</h1>
        </header>
        <div style={styles.main}>
          <div style={{ ...styles.card, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✓</div>
            <h2 style={{ color: TOKENS.gold }}>Assessment Complete</h2>
            <p>
              Results have been emailed to both you and {session?.clientName}.
            </p>
            <p style={{ color: TOKENS.textMuted, marginTop: '20px' }}>
              Check your inbox for the full report.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const band = session?.capacityBand || 'green';
  const bandConfig = BAND_CONFIG[band];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Practitioner Review</h1>
        <p style={{ color: TOKENS.textSecondary, marginTop: '5px' }}>
          Client: {session?.clientName}
        </p>
      </header>

      <main style={styles.main}>
        {/* Capacity Band Summary */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Preliminary Capacity Assessment</h2>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={styles.bandBadge(band)}>
              {bandConfig.icon} {bandConfig.label}
            </span>
          </div>

          {band === 'red' && (
            <div style={styles.warningBox}>
              <strong>⚠️ Attention Required</strong>
              <p style={{ margin: '10px 0 0 0' }}>
                Client responses indicate high baseline depletion. Under ACA Code of Ethics 
                v16, proceeding may be ethically questionable. Consider postponement, 
                modality change, or substantial modification.
              </p>
            </div>
          )}

          <p style={{ color: TOKENS.textSecondary }}>
            Completed: {session?.clientCompletedAt ? new Date(session.clientCompletedAt).toLocaleString('en-AU') : 'Unknown'}
          </p>
        </div>

        {/* Client Responses */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Client Responses</h2>
          
          {session?.clientResponses && Object.entries(session.clientResponses).map(([key, value]) => (
            <div key={key} style={styles.responseItem}>
              <div style={styles.questionLabel}>
                {QUESTION_LABELS[key] || key}
              </div>
              <div style={styles.responseValue}>
                {formatResponse(value)}
              </div>
            </div>
          ))}

          {(!session?.clientResponses || Object.keys(session.clientResponses).length === 0) && (
            <p style={{ color: TOKENS.textMuted }}>No responses recorded.</p>
          )}
        </div>

        {/* Practitioner Review Section */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Practitioner Decision</h2>

          <label style={{ display: 'block', marginBottom: '20px' }}>
            <span style={{ color: TOKENS.textSecondary, display: 'block', marginBottom: '8px' }}>
              What is your decision based on this assessment?
            </span>
            <select
              value={practitionerNotes.decision}
              onChange={(e) => setPractitionerNotes(prev => ({ ...prev, decision: e.target.value }))}
              style={styles.select}
            >
              <option value="">Select a decision...</option>
              <option value="proceed">✅ Proceed with session as planned</option>
              <option value="proceed_modified">⚠️ Proceed with modifications</option>
              <option value="postpone">⏸️ Postpone until conditions improve</option>
              <option value="refer">🔄 Refer to alternative support</option>
              <option value="clarify">❓ Need clarification call first</option>
            </select>
          </label>

          <label style={{ display: 'block', marginBottom: '20px' }}>
            <span style={{ color: TOKENS.textSecondary, display: 'block', marginBottom: '8px' }}>
              Notes / Reasoning (will be included in results)
            </span>
            <textarea
              value={practitionerNotes.comments}
              onChange={(e) => setPractitionerNotes(prev => ({ ...prev, comments: e.target.value }))}
              style={styles.textarea}
              placeholder="Any notes about your decision, modifications needed, or concerns..."
            />
          </label>

          {band === 'red' && practitionerNotes.decision === 'proceed' && (
            <div style={styles.warningBox}>
              <strong>⚠️ Proceeding with RED band</strong>
              <p style={{ margin: '10px 0 0 0' }}>
                You have chosen to proceed despite a RED capacity band. Please ensure 
                you document your reasoning and any risk mitigation strategies.
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!practitionerNotes.decision || submitting}
            style={{
              ...styles.button,
              ...(!practitionerNotes.decision || submitting ? styles.buttonDisabled : {}),
            }}
          >
            {submitting ? 'Sending Results...' : 'Complete Assessment & Send Results'}
          </button>

          <p style={{ color: TOKENS.textMuted, fontSize: '0.85rem', marginTop: '15px', textAlign: 'center' }}>
            Results will be emailed to both you and the client.
          </p>
        </div>
      </main>
    </div>
  );
}
