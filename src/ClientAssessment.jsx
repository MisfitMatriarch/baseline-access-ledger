import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS — Crystal Geode Aesthetic (Teal accent)
// ═══════════════════════════════════════════════════════════════════════════════
const TOKENS = {
  gold: "#4ecdc4",
  goldLight: "#7eddd6",
  goldDim: "rgba(78,205,196,0.3)",
  goldGlow: "rgba(78,205,196,0.15)",
  bgDeep: "#0b0a10",
  bgCard: "rgba(18,16,28,0.92)",
  bgCardHover: "rgba(28,24,42,0.95)",
  bgInput: "rgba(12,10,18,0.8)",
  purple: "#2d1f3d",
  purpleGlow: "rgba(88,62,125,0.2)",
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
  fontMono: "'JetBrains Mono', monospace",
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION DATA — All 11 Sections with Questions
// ═══════════════════════════════════════════════════════════════════════════════
const SECTIONS = [
  {
    id: "processing_communication",
    name: "Processing & Communication Access",
    subtitle: "How you receive, process, and express information",
    intro: "These questions help identify what conditions support you to take in information and communicate without excessive effort. There are no wrong answers — only what works for your brain.",
    questions: [
      {
        id: "pc1",
        text: "How do you best receive new information?",
        type: "multi",
        maxSelections: 3,
        options: [
          { value: "spoken", label: "Spoken / verbal explanation" },
          { value: "written", label: "Written text" },
          { value: "visual", label: "Visual diagrams or images" },
          { value: "demonstration", label: "Demonstration / modelling" },
          { value: "combination", label: "Combination of formats" },
          { value: "varies", label: "It varies depending on the topic" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "pc2",
        text: "How much processing time do you typically need before responding?",
        type: "scale",
        options: [
          { value: 0, label: "I can usually respond quickly" },
          { value: 1, label: "I need a few moments to gather thoughts" },
          { value: 2, label: "I need noticeable pauses to process" },
          { value: 3, label: "I often need significant time or may need to return to topics later" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "pc3",
        text: "What tends to increase cognitive overload for you?",
        type: "multi",
        maxSelections: 4,
        options: [
          { value: "speed", label: "Fast-paced information" },
          { value: "volume", label: "Large amounts of information at once" },
          { value: "abstraction", label: "Abstract concepts without examples" },
          { value: "multitasking", label: "Being asked to track multiple things" },
          { value: "interruptions", label: "Interruptions or topic changes" },
          { value: "emotional", label: "Emotionally charged content" },
          { value: "none", label: "None of these particularly" },
          { value: null, label: "I'm not sure" },
        ],
      },
    ],
  },
  {
    id: "body_energy",
    name: "Body & Energy Requirements",
    subtitle: "What your body needs to function at baseline",
    intro: "These questions are about your body's needs and energy patterns.",
    questions: [
      {
        id: "be1",
        text: "What affects your energy availability?",
        type: "multi",
        maxSelections: 5,
        options: [
          { value: "fatigue", label: "Chronic fatigue" },
          { value: "pain", label: "Pain conditions" },
          { value: "medication", label: "Medication effects" },
          { value: "illness", label: "Ongoing illness" },
          { value: "cycle", label: "Hormonal cycles" },
          { value: "sleep", label: "Sleep quality" },
          { value: "food", label: "Food/nutrition access" },
          { value: "minimal", label: "Energy is generally stable" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "be2",
        text: "What time of day do you have the greatest usable capacity?",
        type: "scale",
        options: [
          { value: 0, label: "Morning" },
          { value: 1, label: "Midday" },
          { value: 2, label: "Afternoon" },
          { value: 3, label: "Evening" },
          { value: null, label: "It varies too much to say" },
        ],
      },
      {
        id: "be3",
        text: "What is the maximum session length before you experience diminishing returns?",
        type: "scale",
        options: [
          { value: 3, label: "30 minutes or less" },
          { value: 2, label: "30–50 minutes" },
          { value: 1, label: "50–90 minutes" },
          { value: 0, label: "90+ minutes is fine" },
          { value: null, label: "I'm not sure" },
        ],
      },
    ],
  },
  {
    id: "sensory_environmental",
    name: "Sensory & Environmental Conditions",
    subtitle: "What environmental conditions affect your capacity",
    intro: "These questions help identify what conditions support or drain you.",
    questions: [
      {
        id: "se1",
        text: "How does lighting affect your capacity?",
        type: "scale",
        options: [
          { value: 0, label: "Lighting rarely affects me" },
          { value: 1, label: "Strong preferences but manageable" },
          { value: 2, label: "Wrong lighting noticeably drains capacity" },
          { value: 3, label: "Lighting can make engagement impossible" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "se2",
        text: "How does sound affect your capacity?",
        type: "scale",
        options: [
          { value: 0, label: "Sound rarely affects me" },
          { value: 1, label: "Strong preferences but manageable" },
          { value: 2, label: "Background noise noticeably drains capacity" },
          { value: 3, label: "Sound sensitivity can make engagement impossible" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "se3",
        text: "Which modality reduces your total environmental load?",
        type: "scale",
        options: [
          { value: 0, label: "In-person is easier" },
          { value: 1, label: "No strong preference" },
          { value: 2, label: "Online is easier" },
          { value: 3, label: "Depends significantly on the day" },
          { value: null, label: "I'm not sure" },
        ],
      },
    ],
  },
  {
    id: "safety_trust",
    name: "Safety & Trust Conditions",
    subtitle: "What you need to feel safe engaging",
    intro: "These questions help identify what conditions support safety and trust.",
    questions: [
      {
        id: "st1",
        text: "Have you had past negative experiences in therapeutic or educational settings?",
        type: "scale",
        options: [
          { value: 0, label: "No significant past experiences affecting trust" },
          { value: 1, label: "Some experiences but manageable" },
          { value: 2, label: "Past experiences create noticeable caution" },
          { value: 3, label: "Past experiences significantly affect trust" },
          { value: null, label: "I'm not sure / prefer not to say" },
        ],
      },
      {
        id: "st2",
        text: "Is there fear of judgement, reporting, or negative consequence from what you share?",
        type: "scale",
        options: [
          { value: 0, label: "No significant fears" },
          { value: 1, label: "Mild background concern" },
          { value: 2, label: "Noticeable fear that affects openness" },
          { value: 3, label: "Significant fear affecting participation" },
          { value: null, label: "I'm not sure" },
        ],
      },
    ],
  },
  {
    id: "identity_social",
    name: "Identity & Social Load",
    subtitle: "What identity-related labour is required",
    intro: "This section is about whether being you requires extra work in this setting.",
    questions: [
      {
        id: "is1",
        text: "Do you need to mask, code-switch, or self-monitor to be in this type of setting?",
        type: "scale",
        options: [
          { value: 0, label: "Rarely or never" },
          { value: 1, label: "Sometimes" },
          { value: 2, label: "Often" },
          { value: 3, label: "Almost constantly" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "is2",
        text: "Have you had previous negative experiences with similar services?",
        type: "scale",
        options: [
          { value: 0, label: "No negative experiences" },
          { value: 1, label: "Minor negative experiences" },
          { value: 2, label: "Significant negative experiences" },
          { value: 3, label: "Traumatic experiences with similar services" },
          { value: null, label: "I'm not sure / prefer not to say" },
        ],
      },
    ],
  },
  {
    id: "current_supports",
    name: "Current Supports & Scaffolding",
    subtitle: "What is currently holding you together",
    intro: "These questions help identify what supports are stabilising your capacity.",
    questions: [
      {
        id: "ss1",
        text: "What supports, routines, or strategies are currently stabilising your capacity?",
        type: "multi",
        maxSelections: 5,
        options: [
          { value: "routines", label: "Specific routines" },
          { value: "medication", label: "Medication" },
          { value: "substances", label: "Substances (caffeine, cannabis, etc.)" },
          { value: "people", label: "Specific people" },
          { value: "environment", label: "Controlled environment" },
          { value: "rest_schedule", label: "Protected rest time" },
          { value: "minimal", label: "Not relying on specific supports" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "ss2",
        text: "What would happen if your current scaffolding were disrupted?",
        type: "scale",
        options: [
          { value: 0, label: "I would manage fine" },
          { value: 1, label: "Some difficulty but recoverable" },
          { value: 2, label: "Significant destabilisation" },
          { value: 3, label: "Major crisis likely" },
          { value: null, label: "I'm not sure" },
        ],
      },
    ],
  },
  {
    id: "baseline_depletion",
    name: "Current Baseline Depletion",
    subtitle: "Where you're starting from right now",
    intro: "These questions assess your current state, not your capacity in ideal conditions.",
    questions: [
      {
        id: "bd1",
        text: "How would you describe your current baseline energy?",
        type: "scale",
        options: [
          { value: 0, label: "Adequate — I have capacity available" },
          { value: 1, label: "Low — functioning but limited reserves" },
          { value: 2, label: "Depleted — running on fumes" },
          { value: 3, label: "Exhausted — below functional threshold" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "bd2",
        text: "Are you currently in recovery from anything? (illness, burnout, life event, crisis)",
        type: "scale",
        options: [
          { value: 0, label: "Not currently recovering" },
          { value: 1, label: "Recovering but mostly functional" },
          { value: 2, label: "Recovery is affecting daily function" },
          { value: 3, label: "Deep recovery — capacity significantly impaired" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "bd3",
        text: "How much of your capacity is already allocated to other demands?",
        type: "scale",
        options: [
          { value: 0, label: "Plenty of capacity available" },
          { value: 1, label: "Some capacity remains" },
          { value: 2, label: "Most capacity already allocated" },
          { value: 3, label: "No spare capacity — all allocated" },
          { value: null, label: "I'm not sure" },
        ],
      },
    ],
  },
  {
    id: "external_demands",
    name: "External Demands & Life Load",
    subtitle: "What else is drawing on your capacity",
    intro: "These questions capture the external demands affecting available capacity.",
    questions: [
      {
        id: "ed1",
        text: "What major external demands are currently drawing on your capacity?",
        type: "multi",
        maxSelections: 5,
        options: [
          { value: "work", label: "Work/employment" },
          { value: "caregiving", label: "Caregiving responsibilities" },
          { value: "health", label: "Own health management" },
          { value: "financial", label: "Financial stress" },
          { value: "housing", label: "Housing instability" },
          { value: "relationship", label: "Relationship difficulties" },
          { value: "grief", label: "Grief or loss" },
          { value: "minimal", label: "External demands are manageable" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "ed2",
        text: "How much capacity do these external demands consume?",
        type: "scale",
        options: [
          { value: 0, label: "Minimal — plenty left over" },
          { value: 1, label: "Moderate — some capacity remains" },
          { value: 2, label: "High — little capacity remains" },
          { value: 3, label: "Overwhelming — nothing left" },
          { value: null, label: "I'm not sure" },
        ],
      },
    ],
  },
  {
    id: "recovery_capacity",
    name: "Recovery & Restoration Capacity",
    subtitle: "What recovery resources are available",
    intro: "These questions assess your ability to recover and restore capacity.",
    questions: [
      {
        id: "rc1",
        text: "Do you currently have access to activities/environments that restore you?",
        type: "scale",
        options: [
          { value: 0, label: "Yes, regularly available" },
          { value: 1, label: "Sometimes available" },
          { value: 2, label: "Rarely available" },
          { value: 3, label: "Not currently accessible" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "rc2",
        text: "How quickly do you typically recover after demanding activities?",
        type: "scale",
        options: [
          { value: 0, label: "Quickly — within hours" },
          { value: 1, label: "Moderately — within a day" },
          { value: 2, label: "Slowly — multiple days" },
          { value: 3, label: "Very slowly — weeks or incomplete recovery" },
          { value: null, label: "I'm not sure" },
        ],
      },
    ],
  },
];

// Styles
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
  subtitle: {
    color: TOKENS.textSecondary,
    fontSize: '0.9rem',
    marginTop: '5px',
  },
  main: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  card: {
    backgroundColor: TOKENS.bgCard,
    borderRadius: '12px',
    border: `1px solid ${TOKENS.goldDim}`,
    padding: '30px',
    marginBottom: '20px',
  },
  sectionTitle: {
    color: TOKENS.gold,
    fontSize: '1.3rem',
    marginBottom: '10px',
  },
  question: {
    marginBottom: '25px',
  },
  questionText: {
    color: TOKENS.textPrimary,
    fontSize: '1.1rem',
    marginBottom: '15px',
  },
  option: {
    display: 'block',
    padding: '12px 15px',
    marginBottom: '8px',
    backgroundColor: TOKENS.bgInput,
    border: `1px solid ${TOKENS.goldDim}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: TOKENS.textSecondary,
  },
  optionSelected: {
    backgroundColor: TOKENS.goldGlow,
    borderColor: TOKENS.gold,
    color: TOKENS.textPrimary,
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
  progressBar: {
    height: '4px',
    backgroundColor: TOKENS.bgInput,
    borderRadius: '2px',
    marginBottom: '20px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: TOKENS.gold,
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  consent: {
    backgroundColor: 'rgba(78,205,196,0.1)',
    border: `1px solid ${TOKENS.gold}`,
    borderRadius: '8px',
    padding: '20px',
    marginTop: '30px',
  },
  checkbox: {
    marginRight: '10px',
    transform: 'scale(1.3)',
  },
};

export default function ClientAssessment() {
  const { token } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState({});
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Load session on mount
  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch(`/.netlify/functions/get-session?token=${token}&role=client`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to load session');
        }
        
        if (data.status !== 'pending_client') {
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

  const handleResponse = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleMultiResponse = (questionId, value, maxSelections) => {
    setResponses(prev => {
      const current = prev[questionId] || [];
      if (value === null) {
        return { ...prev, [questionId]: [null] };
      }
      if (current.includes(null)) {
        return { ...prev, [questionId]: [value] };
      }
      if (current.includes(value)) {
        return { ...prev, [questionId]: current.filter(v => v !== value) };
      }
      if (current.length >= maxSelections) {
        return prev;
      }
      return { ...prev, [questionId]: [...current, value] };
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/.netlify/functions/submit-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, responses, consentGiven: consent })
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

  const section = SECTIONS[currentSection];
  const progress = ((currentSection + 1) / SECTIONS.length) * 100;
  const isLastSection = currentSection === SECTIONS.length - 1;

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.main, textAlign: 'center', paddingTop: '100px' }}>
          <p style={{ color: TOKENS.gold }}>Loading your assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.main, textAlign: 'center', paddingTop: '100px' }}>
          <div style={{ ...styles.card, borderColor: TOKENS.statusHigh }}>
            <h2 style={{ color: TOKENS.statusHigh }}>Unable to Load Assessment</h2>
            <p>{error}</p>
            <p style={{ color: TOKENS.textMuted }}>
              Please contact your practitioner for a new link.
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
            <p style={{ marginBottom: '20px' }}>
              Thank you for completing your assessment, {session?.clientName}.
            </p>
            <p style={{ color: TOKENS.textSecondary }}>
              Your responses have been sent to {session?.practitionerName}. 
              They will review your answers and you'll both receive the final 
              results by email.
            </p>
            <p style={{ color: TOKENS.textMuted, marginTop: '30px', fontSize: '0.9rem' }}>
              You can close this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Baseline Access & Equity Ledger</h1>
        <p style={styles.subtitle}>
          Assessment for {session?.practitionerName} • {session?.practiceName}
        </p>
      </header>

      <main style={styles.main}>
        {/* Progress */}
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
        <p style={{ color: TOKENS.textMuted, fontSize: '0.85rem', marginBottom: '20px' }}>
          Section {currentSection + 1} of {SECTIONS.length}
        </p>

        {/* Section Card */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>{section.name}</h2>
          <p style={{ color: TOKENS.textSecondary, marginBottom: '10px' }}>
            {section.subtitle}
          </p>
          <p style={{ color: TOKENS.textMuted, fontSize: '0.9rem', marginBottom: '30px' }}>
            {section.intro}
          </p>

          {/* Questions */}
          {section.questions.map((q) => (
            <div key={q.id} style={styles.question}>
              <p style={styles.questionText}>{q.text}</p>
              
              {q.options.map((opt, idx) => {
                const isSelected = q.type === 'multi'
                  ? (responses[q.id] || []).includes(opt.value)
                  : responses[q.id] === opt.value;

                return (
                  <label
                    key={idx}
                    style={{
                      ...styles.option,
                      ...(isSelected ? styles.optionSelected : {}),
                    }}
                    onClick={() => {
                      if (q.type === 'multi') {
                        handleMultiResponse(q.id, opt.value, q.maxSelections);
                      } else {
                        handleResponse(q.id, opt.value);
                      }
                    }}
                  >
                    <input
                      type={q.type === 'multi' ? 'checkbox' : 'radio'}
                      checked={isSelected}
                      onChange={() => {}}
                      style={{ display: 'none' }}
                    />
                    {opt.label}
                  </label>
                );
              })}
            </div>
          ))}

          {/* Consent (only on last section) */}
          {isLastSection && (
            <div style={styles.consent}>
              <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={styles.checkbox}
                />
                <span style={{ color: TOKENS.textPrimary }}>
                  I consent to sharing my responses with{' '}
                  <strong>{session?.practitionerName}</strong> at{' '}
                  <strong>{session?.practiceName}</strong>. I understand my 
                  responses will be used to help plan my session and that email 
                  communication is not fully secure.
                </span>
              </label>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
            {currentSection > 0 && (
              <button
                onClick={() => setCurrentSection(prev => prev - 1)}
                style={{
                  ...styles.button,
                  backgroundColor: 'transparent',
                  border: `1px solid ${TOKENS.gold}`,
                  color: TOKENS.gold,
                  flex: 1,
                }}
              >
                Previous
              </button>
            )}
            
            {isLastSection ? (
              <button
                onClick={handleSubmit}
                disabled={!consent || submitting}
                style={{
                  ...styles.button,
                  flex: 2,
                  ...(!consent || submitting ? styles.buttonDisabled : {}),
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentSection(prev => prev + 1)}
                style={{ ...styles.button, flex: 2 }}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
