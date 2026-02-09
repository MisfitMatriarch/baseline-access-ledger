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
    description: "Conditions support engagement without disproportionate effort. Access and regulation costs exist but do not dominate.",
  },
  amber: {
    label: "AMBER — Learning Partially Compromised",
    color: TOKENS.statusMid,
    bg: TOKENS.statusMidBg,
    icon: "🟡",
    description: "Engagement is possible, but significant capacity is being diverted to access, regulation, or recovery. Learning or therapeutic depth is conditional.",
  },
  red: {
    label: "RED — Learning Not Reliably Possible",
    color: TOKENS.statusHigh,
    bg: TOKENS.statusHighBg,
    icon: "🔴",
    description: "The majority of capacity is consumed by access, regulation, masking, or survival. Proceeding would primarily measure endurance, not learning or therapeutic skill.",
  },
};

// Evidence base with full citations
const EVIDENCE_BASE = {
  cognitiveLoad: {
    title: "Cognitive Load & Learning",
    summary: "When cognitive load is high, learning, reflection, and integration are impaired.",
    citations: [
      "Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. Cognitive Science, 12(2), 257-285.",
      "Sweller, J., Ayres, P., & Kalyuga, S. (2011). Cognitive Load Theory. Springer.",
      "Baddeley, A. (2012). Working memory: Theories, models, and controversies. Annual Review of Psychology, 63, 1-29.",
      "Paas, F., & van Merriënboer, J. J. G. (2020). Cognitive-load theory: Methods to manage working memory load in the learning of complex tasks. Current Directions in Psychological Science, 29(4), 394-398."
    ],
    appliesTo: ["Processing & Communication", "Session length", "Assessment validity"]
  },
  stressThreat: {
    title: "Stress, Threat & Executive Function",
    summary: "Stress and perceived threat shift the nervous system away from reflective processing.",
    citations: [
      "Shields, G. S., Sazma, M. A., & Yonelinas, A. P. (2016). The effects of acute stress on core executive functions: A meta-analysis. Neuroscience & Biobehavioral Reviews, 68, 651-668.",
      "Arnsten, A. F. T. (2009). Stress signalling pathways that impair prefrontal cortex structure and function. Nature Reviews Neuroscience, 10(6), 410-422.",
      "McEwen, B. S., & Morrison, J. H. (2013). The brain on stress: Vulnerability and plasticity of the prefrontal cortex over the life course. Neuron, 79(1), 16-29."
    ],
    appliesTo: ["Safety & Trust", "Baseline depletion", "RED determinations"]
  },
  environment: {
    title: "Environment & Performance",
    summary: "Physical environments affect cognitive and emotional functioning across all populations.",
    citations: [
      "Evans, G. W., & McCoy, J. M. (1998). When buildings don't work: The role of architecture in human health. Journal of Environmental Psychology, 18(1), 85-94.",
      "Ulrich, R. S., Zimring, C., Zhu, X., et al. (2008). A review of the research literature on evidence-based healthcare design. Health Environments Research & Design Journal, 1(3), 61-125."
    ],
    appliesTo: ["Sensory & Environment", "Waiting areas", "Modality decisions"]
  },
  fatigue: {
    title: "Fatigue & Diminishing Returns",
    summary: "Longer or more intensive sessions do not linearly increase benefit; mental fatigue reduces performance.",
    citations: [
      "Boksem, M. A. S., & Tops, M. (2008). Mental fatigue: Costs and benefits. Brain Research Reviews, 59(1), 125-139.",
      "Hockey, G. R. J. (2013). The Psychology of Fatigue: Work, Effort and Control. Cambridge University Press.",
      "Hill, C. E., & Knox, S. (2009). Processing the therapeutic relationship. Psychotherapy Research, 19(1), 13-29."
    ],
    appliesTo: ["Session length", "Intensive formats", "Capacity allocation"]
  },
  masking: {
    title: "Masking & Emotional Labour",
    summary: "Sustained self-monitoring and performance consumes capacity with downstream costs.",
    citations: [
      "Hochschild, A. R. (1983). The Managed Heart: Commercialization of Human Feeling. University of California Press.",
      "Grandey, A. A. (2000). Emotional regulation in the workplace: A new way to conceptualize emotional labor. Journal of Occupational Health Psychology, 5(1), 95-110.",
      "Leary, M. R., & Kowalski, R. M. (1990). Impression management: A literature review and two-component model. Psychological Bulletin, 107(1), 34-47."
    ],
    appliesTo: ["Identity & Social Effort", "Masking", "Post-session recovery"]
  },
  cumulativeHarm: {
    title: "Delayed & Cumulative Harm",
    summary: "Harm often appears after the session; cumulative stress leads to delayed collapse.",
    citations: [
      "Maslach, C., & Leiter, M. P. (2016). Understanding the burnout experience: Recent research and its implications for psychiatry. World Psychiatry, 15(2), 103-111.",
      "Sonnentag, S., & Fritz, C. (2015). Recovery from job stress: The stressor-detachment model as an integrative framework. Journal of Organizational Behavior, 36(S1), S72-S103.",
      "Wampold, B. E., & Imel, Z. E. (2015). The Great Psychotherapy Debate (2nd ed.). Routledge."
    ],
    appliesTo: ["Recovery", "Baseline depletion", "RED rules", "Cumulative load"]
  },
  consent: {
    title: "Consent & Autonomy",
    summary: "Consent is compromised when participation causes foreseeable harm or occurs under coercive conditions.",
    citations: [
      "Beauchamp, T. L., & Childress, J. F. (2019). Principles of Biomedical Ethics (8th ed.). Oxford University Press.",
      "Deci, E. L., & Ryan, R. M. (2000). The 'what' and 'why' of goal pursuits: Human needs and the self-determination of behavior. Psychological Inquiry, 11(4), 227-268."
    ],
    appliesTo: ["Consent checks", "Ethical 'not yet'", "Practitioner responsibility"]
  },
  assessmentValidity: {
    title: "Assessment Validity",
    summary: "You cannot validly assess skill or learning under high load; assessments must measure the target construct, not extraneous variables.",
    citations: [
      "Messick, S. (1995). Validity of psychological assessment: Validation of inferences from persons' responses and performances. American Psychologist, 50(9), 741-749.",
      "Brookhart, S. M. (2013). How to Create and Use Rubrics for Formative Assessment and Grading. ASCD."
    ],
    appliesTo: ["GREEN/AMBER/RED mapping", "Assessment validity check"]
  }
};

// Map new question IDs to readable labels
const QUESTION_LABELS = {
  // Section 1: Information Processing
  ip1: "How they understand new information best",
  ip2: "Processing time needed to respond",
  ip3: "Things that make thinking harder",
  ip4: "What helps communication feel easier",
  // Section 2: Body & Energy
  be1: "Currently affecting energy levels",
  be2: "Time of day with most usable energy",
  be3: "Session length before it feels too much",
  be4: "How being physically still affects them",
  be5: "What helps their body cope during sessions",
  // Section 3: Sensory & Environment
  se1: "How lighting affects them",
  se2: "How sound affects them",
  se3: "Other things that affect them in spaces",
  se4: "How waiting areas or delays affect them",
  se5: "Which modality takes less out of them",
  // Section 4: Safety & Trust
  st1: "Past experiences affecting safety",
  st2: "Worry about consequences from sharing",
  st3: "What helps them feel safer",
  // Section 5: Identity & Social Effort
  is1: "Need to hide, perform, or monitor themselves",
  is2: "How sustained interaction affects energy",
  is3: "Past experiences with similar services",
  // Section 6: Current Supports
  cs1: "What currently helps them cope or function",
  cs2: "Impact if supports were disrupted",
  // Section 7: Current Baseline
  cb1: "How their energy feels right now",
  cb2: "Currently recovering from something",
  cb3: "Capacity already allocated to other demands",
  // Section 8: Life Load
  ll1: "What's currently drawing on energy",
  ll2: "How much life load takes from them",
  // Section 9: Recovery
  rc1: "Access to things that help recovery",
  rc2: "How long recovery usually takes",
  rc3: "What happens without enough recovery time",
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
    padding: '12px 20px',
    borderRadius: '20px',
    backgroundColor: BAND_CONFIG[band]?.bg || TOKENS.bgInput,
    color: BAND_CONFIG[band]?.color || TOKENS.textPrimary,
    fontWeight: 'bold',
    fontSize: '1.1rem',
  }),
  warningBox: {
    backgroundColor: TOKENS.statusHighBg,
    border: `1px solid ${TOKENS.statusHigh}`,
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
  },
  infoBox: {
    backgroundColor: 'rgba(78,205,196,0.1)',
    border: `1px solid ${TOKENS.goldDim}`,
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
    fontSize: '0.9rem',
  },
  rulesBox: {
    backgroundColor: 'rgba(212,160,60,0.1)',
    border: `1px solid ${TOKENS.statusMid}`,
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
  },
  evidenceBox: {
    backgroundColor: 'rgba(78,205,196,0.08)',
    border: `1px solid ${TOKENS.goldDim}`,
    borderRadius: '8px',
    marginBottom: '20px',
  },
  evidenceHeader: {
    padding: '15px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  evidenceContent: {
    padding: '0 15px 15px 15px',
    borderTop: `1px solid ${TOKENS.goldDim}`,
  },
  evidenceCategory: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: TOKENS.bgInput,
    borderRadius: '8px',
  },
  citation: {
    fontSize: '0.8rem',
    color: TOKENS.textMuted,
    marginLeft: '15px',
    marginBottom: '5px',
    lineHeight: 1.4,
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
    boxSizing: 'border-box',
  },
  input: {
    width: '100%',
    padding: '12px',
    backgroundColor: TOKENS.bgInput,
    border: `1px solid ${TOKENS.goldDim}`,
    borderRadius: '8px',
    color: TOKENS.textPrimary,
    fontSize: '1rem',
    boxSizing: 'border-box',
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
  helperText: {
    color: TOKENS.textMuted,
    fontSize: '0.85rem',
    marginTop: '8px',
    fontStyle: 'italic',
    lineHeight: 1.5,
  },
  citationRef: {
    color: TOKENS.gold,
    fontSize: '0.75rem',
    fontStyle: 'normal',
  },
  questionBlock: {
    marginBottom: '30px',
  },
  questionText: {
    color: TOKENS.textPrimary,
    fontSize: '1.05rem',
    marginBottom: '12px',
  },
  checkbox: {
    marginRight: '10px',
    transform: 'scale(1.2)',
  },
};

// Evidence Panel Component
function EvidencePanel() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={styles.evidenceBox}>
      <div 
        style={styles.evidenceHeader}
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <strong style={{ color: TOKENS.gold }}>📚 Evidence Base</strong>
          <span style={{ color: TOKENS.textMuted, marginLeft: '10px', fontSize: '0.9rem' }}>
            Research underpinning this assessment
          </span>
        </div>
        <span style={{ color: TOKENS.gold, fontSize: '1.2rem' }}>
          {expanded ? '−' : '+'}
        </span>
      </div>
      
      {expanded && (
        <div style={styles.evidenceContent}>
          <p style={{ color: TOKENS.textSecondary, marginBottom: '20px', fontSize: '0.9rem' }}>
            This assessment operationalises well-established principles from cognitive load theory, 
            stress and executive function research, environmental psychology, emotional labour, and 
            assessment validity research. These principles apply across the general population; 
            neurodivergent research illustrates where these mechanisms become most visible.
          </p>
          
          {Object.entries(EVIDENCE_BASE).map(([key, category]) => (
            <div key={key} style={styles.evidenceCategory}>
              <h4 style={{ color: TOKENS.gold, margin: '0 0 8px 0', fontSize: '1rem' }}>
                {category.title}
              </h4>
              <p style={{ color: TOKENS.textSecondary, margin: '0 0 10px 0', fontSize: '0.9rem' }}>
                {category.summary}
              </p>
              <p style={{ color: TOKENS.textMuted, margin: '0 0 8px 0', fontSize: '0.8rem' }}>
                <strong>Applies to:</strong> {category.appliesTo.join(', ')}
              </p>
              <details style={{ marginTop: '10px' }}>
                <summary style={{ color: TOKENS.gold, cursor: 'pointer', fontSize: '0.85rem' }}>
                  View citations ({category.citations.length})
                </summary>
                <div style={{ marginTop: '10px' }}>
                  {category.citations.map((citation, i) => (
                    <p key={i} style={styles.citation}>{citation}</p>
                  ))}
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PractitionerReview() {
  const { token } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const [practitionerData, setPractitionerData] = useState({
    // 1. Engagement Context
    engagementContext: '',
    engagementContextOther: '',
    // 2. Cumulative Load (NEW)
    cumulativeLoad: '',
    cumulativeLoadDetails: '',
    // 3. Accommodation Feasibility
    accommodationFeasibility: '',
    // 4. Additional Load Factors
    additionalLoadFactors: [],
    // 5. Client Presentation
    clientPresentation: '',
    // 6. Capacity Band Override
    bandOverride: 'no',
    overrideJustification: '',
    // 7. Engagement Decision
    decision: '',
    // 7.5 Client Consent
    clientConsent: '',
    // 7.6 Assessment Validity
    assessmentValidity: '',
    // 8. Reasoning / Notes
    reasoning: '',
    // 9. Responsibility Acknowledgement
    acknowledgeHarm: false,
    acknowledgeResponsibility: false,
    acknowledgeRedJustification: false,
    practitionerName: '',
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

  const handleMultiSelect = (field, value) => {
    setPractitionerData(prev => {
      const current = prev[field] || [];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(v => v !== value) };
      }
      return { ...prev, [field]: [...current, value] };
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/.netlify/functions/submit-practitioner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, practitionerData })
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
      const filtered = value.filter(v => v !== null);
      if (filtered.length === 0) return 'Not sure yet';
      return filtered.map(v => v.replace(/_/g, ' ')).join(', ');
    }
    if (value === null) return 'Not sure yet';
    if (typeof value === 'number') {
      return String(value);
    }
    return String(value).replace(/_/g, ' ');
  };

  const canSubmit = () => {
    const preliminaryBand = session?.capacityBand || 'green';
    const effectiveBand = practitionerData.bandOverride !== 'no' 
      ? practitionerData.bandOverride 
      : preliminaryBand;
    const needsOverrideJustification = practitionerData.bandOverride !== 'no';
    
    // RED enforcement: cannot "proceed as planned" or claim "full" assessment validity under RED
    if (effectiveBand === 'red') {
      if (practitionerData.decision === 'proceed') return false;
      if (practitionerData.assessmentValidity === 'full') return false;
    }
    
    return (
      practitionerData.engagementContext &&
      practitionerData.cumulativeLoad &&
      practitionerData.accommodationFeasibility &&
      practitionerData.clientPresentation &&
      practitionerData.decision &&
      practitionerData.clientConsent &&
      practitionerData.assessmentValidity &&
      practitionerData.acknowledgeHarm &&
      practitionerData.acknowledgeResponsibility &&
      (effectiveBand !== 'red' || practitionerData.acknowledgeRedJustification) &&
      (!needsOverrideJustification || practitionerData.overrideJustification.trim()) &&
      practitionerData.practitionerName.trim()
    );
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
        <h1 style={styles.title}>Practitioner Review & Decision</h1>
        <p style={{ color: TOKENS.textSecondary, marginTop: '5px' }}>
          Client: {session?.clientName}
        </p>
      </header>

      <main style={styles.main}>
        {/* Evidence Panel */}
        <EvidencePanel />

        {/* Override & Decision Rules */}
        <div style={styles.rulesBox}>
          <strong style={{ color: TOKENS.statusMid }}>Override & Decision Rules</strong>
          <ul style={{ margin: '10px 0 0 0', paddingLeft: '20px', color: TOKENS.textSecondary }}>
            <li><strong>RED always overrides compliance.</strong> Attendance ≠ engagement.</li>
            <li><strong>AMBER + no feasible accommodations = treat as RED.</strong></li>
            <li><strong>Multiple "I'm not sure yet" responses</strong> → lean AMBER/RED until clarified.</li>
            <li><strong>Intensive or multi-day formats:</strong> any AMBER should be treated as RED unless mitigated.</li>
            <li><strong>Cumulative load compounds:</strong> sequential demands escalate risk beyond single-session assessment.</li>
          </ul>
          <p style={{ margin: '15px 0 0 0', color: TOKENS.textMuted, fontStyle: 'italic' }}>
            If the majority of the client's capacity is being used to tolerate the process itself, 
            engagement is not equitable and learning or counselling skill cannot be validly assessed.
          </p>
        </div>

        {/* Capacity Band Summary */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Preliminary Capacity Assessment</h2>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={styles.bandBadge(band)}>
              {bandConfig.icon} {bandConfig.label}
            </span>
          </div>

          <p style={{ color: TOKENS.textSecondary, textAlign: 'center', marginBottom: '20px' }}>
            {bandConfig.description}
          </p>

          {band === 'red' && (
            <div style={styles.warningBox}>
              <strong>⚠️ Attention Required</strong>
              <p style={{ margin: '10px 0 0 0' }}>
                Client responses indicate high baseline depletion. Proceeding under RED conditions 
                requires explicit ethical justification. Consider postponement, modality change, 
                or substantial modification.
              </p>
            </div>
          )}

          {band === 'amber' && (
            <div style={{ ...styles.infoBox, borderColor: TOKENS.statusMid }}>
              <strong style={{ color: TOKENS.statusMid }}>⚠️ Modifications Required</strong>
              <p style={{ margin: '10px 0 0 0' }}>
                Engagement is possible but fragile. Proceed only if accommodations can 
                meaningfully reduce load. If accommodations cannot be implemented, treat as RED.
              </p>
            </div>
          )}

          {/* Insufficient Data Warning */}
          {session?.insufficientData && (
            <div style={{ 
              backgroundColor: 'rgba(255,152,0,0.15)', 
              border: `1px solid ${TOKENS.statusMid}`,
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <strong style={{ color: TOKENS.statusMid }}>⚠️ Incomplete Data — Lean Toward Caution</strong>
              <p style={{ margin: '10px 0 0 0', color: TOKENS.textSecondary }}>
                More than 30% of key capacity questions were answered with "I'm not sure yet" or left incomplete.
                This does not indicate non-compliance — it may reflect the client's current state, uncertainty, 
                or difficulty with the questions.
              </p>
              <p style={{ margin: '10px 0 0 0', color: TOKENS.textMuted, fontSize: '0.9rem' }}>
                <strong>Practitioner responsibility:</strong> When data is incomplete, lean AMBER/RED until 
                clarified through conversation. The absence of disclosed needs does not mean needs are absent.
              </p>
            </div>
          )}

          <p style={{ color: TOKENS.textMuted, fontSize: '0.9rem' }}>
            Completed: {session?.clientCompletedAt ? new Date(session.clientCompletedAt).toLocaleString('en-AU') : 'Unknown'}
          </p>
        </div>

        {/* Client Responses */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Client Self-Reported Responses</h2>
          <p style={{ color: TOKENS.textMuted, fontSize: '0.85rem', marginBottom: '20px', fontStyle: 'italic' }}>
            Read-only. These responses reflect what the client reported at the time of completion.
          </p>
          
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
          <h2 style={styles.sectionTitle}>Practitioner Review & Decision</h2>

          {/* 1. Engagement Context */}
          <div style={styles.questionBlock}>
            <p style={styles.questionText}>1. What type of engagement is this assessment for?</p>
            {[
              { value: 'standard', label: 'Standard session (single, scheduled)' },
              { value: 'intensive', label: 'Intensive (multiple sessions in one day)' },
              { value: 'residential', label: 'Residential or multi-day' },
              { value: 'group', label: 'Group format' },
              { value: 'assessment', label: 'Assessment or evaluation context' },
              { value: 'other', label: 'Other' },
            ].map(opt => (
              <label
                key={opt.value}
                style={{
                  ...styles.option,
                  ...(practitionerData.engagementContext === opt.value ? styles.optionSelected : {}),
                }}
                onClick={() => setPractitionerData(prev => ({ ...prev, engagementContext: opt.value }))}
              >
                {opt.label}
              </label>
            ))}
            {practitionerData.engagementContext === 'other' && (
              <input
                type="text"
                placeholder="Please specify..."
                value={practitionerData.engagementContextOther}
                onChange={(e) => setPractitionerData(prev => ({ ...prev, engagementContextOther: e.target.value }))}
                style={{ ...styles.input, marginTop: '10px' }}
              />
            )}
            <p style={styles.helperText}>
              Intensive, group, and multi-day formats escalate risk. In these contexts, 
              any AMBER pattern should be treated as RED unless clearly mitigated.
              <br/>
              <span style={styles.citationRef}>
                (Boksem & Tops, 2008; Hockey, 2013 — fatigue & diminishing returns)
              </span>
            </p>
          </div>

          {/* 2. Cumulative Load (NEW) */}
          <div style={styles.questionBlock}>
            <p style={styles.questionText}>2. Is this engagement occurring as part of a sequence of demands?</p>
            {[
              { value: 'isolated', label: 'This is an isolated engagement (no significant recent or upcoming demands)' },
              { value: 'minor_sequence', label: 'Part of a minor sequence (one or two other demands this week)' },
              { value: 'significant_sequence', label: 'Part of a significant sequence (multiple demands this week)' },
              { value: 'intensive_block', label: 'Part of an intensive block (concurrent assessments, training, or multiple sessions)' },
              { value: 'unknown', label: 'Unknown — not yet discussed with client' },
            ].map(opt => (
              <label
                key={opt.value}
                style={{
                  ...styles.option,
                  ...(practitionerData.cumulativeLoad === opt.value ? styles.optionSelected : {}),
                }}
                onClick={() => setPractitionerData(prev => ({ ...prev, cumulativeLoad: opt.value }))}
              >
                {opt.label}
              </label>
            ))}
            {(practitionerData.cumulativeLoad === 'significant_sequence' || practitionerData.cumulativeLoad === 'intensive_block') && (
              <textarea
                placeholder="Brief details of the sequence (e.g., 'Third session this week, assessment due Friday')..."
                value={practitionerData.cumulativeLoadDetails}
                onChange={(e) => setPractitionerData(prev => ({ ...prev, cumulativeLoadDetails: e.target.value }))}
                style={{ ...styles.textarea, marginTop: '10px', minHeight: '60px' }}
              />
            )}
            <p style={styles.helperText}>
              Cumulative stress leads to delayed collapse, not immediate failure. Recovery debt compounds across days.
              Sequential demands should be considered even when each individual engagement appears manageable.
              <br/>
              <span style={styles.citationRef}>
                (Maslach & Leiter, 2016; Sonnentag & Fritz, 2015 — delayed & cumulative harm)
              </span>
            </p>
          </div>

          {/* 3. Accommodation Feasibility */}
          <div style={styles.questionBlock}>
            <p style={styles.questionText}>3. Can the accommodations indicated by the client's responses be implemented in this setting?</p>
            {[
              { value: 'all', label: 'Yes, all or most can be implemented' },
              { value: 'some', label: 'Some can be implemented' },
              { value: 'few', label: 'Few or none can be implemented' },
              { value: 'not_discussed', label: 'Not yet discussed with the client' },
            ].map(opt => (
              <label
                key={opt.value}
                style={{
                  ...styles.option,
                  ...(practitionerData.accommodationFeasibility === opt.value ? styles.optionSelected : {}),
                }}
                onClick={() => setPractitionerData(prev => ({ ...prev, accommodationFeasibility: opt.value }))}
              >
                {opt.label}
              </label>
            ))}
            <p style={styles.helperText}>
              AMBER + no feasible accommodations = RED. Feasibility is a system responsibility, not a client burden.
              When extraneous cognitive load cannot be reduced, intrinsic learning capacity is compromised.
              <br/>
              <span style={styles.citationRef}>
                (Sweller et al., 2011; Paas & van Merriënboer, 2020 — cognitive load theory)
              </span>
            </p>
          </div>

          {/* 4. Additional Load Factors */}
          <div style={styles.questionBlock}>
            <p style={styles.questionText}>4. Are there load factors you are aware of that may not be captured in the client's responses?</p>
            <p style={{ color: TOKENS.textMuted, fontSize: '0.9rem', marginBottom: '10px' }}>Select all that apply</p>
            {[
              { value: 'crisis', label: 'Recent crisis or significant life event' },
              { value: 'compounding', label: 'Compounding appointments or demands this week' },
              { value: 'travel', label: 'Travel or access burden to attend' },
              { value: 'carer', label: 'Carer or dependent responsibilities on the day' },
              { value: 'health_flare', label: 'Known health flare or symptom increase' },
              { value: 'none', label: 'None that I\'m aware of' },
              { value: 'unsure', label: 'Unsure' },
            ].map(opt => (
              <label
                key={opt.value}
                style={{
                  ...styles.option,
                  ...(practitionerData.additionalLoadFactors.includes(opt.value) ? styles.optionSelected : {}),
                }}
                onClick={() => handleMultiSelect('additionalLoadFactors', opt.value)}
              >
                {opt.label}
              </label>
            ))}
            <p style={styles.helperText}>
              External stressors reliably impair executive function, working memory, and cognitive flexibility.
              <br/>
              <span style={styles.citationRef}>
                (Shields et al., 2016; Arnsten, 2009 — stress & executive function)
              </span>
            </p>
          </div>

          {/* 5. Client Presentation */}
          <div style={styles.questionBlock}>
            <p style={styles.questionText}>5. Based on your observation or communication, the client appears:</p>
            {[
              { value: 'more_depleted', label: 'More depleted than responses suggest' },
              { value: 'as_expected', label: 'About as expected from responses' },
              { value: 'less_depleted', label: 'Less depleted than responses suggest' },
              { value: 'no_contact', label: 'I have not had direct contact yet' },
            ].map(opt => (
              <label
                key={opt.value}
                style={{
                  ...styles.option,
                  ...(practitionerData.clientPresentation === opt.value ? styles.optionSelected : {}),
                }}
                onClick={() => setPractitionerData(prev => ({ ...prev, clientPresentation: opt.value }))}
              >
                {opt.label}
              </label>
            ))}
            <p style={styles.helperText}>
              If presentation suggests greater depletion than responses indicate, lean toward higher risk until clarified.
              Masking and impression management may obscure actual capacity state.
              <br/>
              <span style={styles.citationRef}>
                (Hochschild, 1983; Grandey, 2000 — emotional labour & masking)
              </span>
            </p>
          </div>

          {/* 6. Capacity Band Override */}
          <div style={styles.questionBlock}>
            <p style={styles.questionText}>6. Based on your clinical judgement, do you wish to override the preliminary capacity allocation band?</p>
            {[
              { value: 'no', label: 'No — preliminary band is appropriate' },
              { value: 'green', label: 'Override to GREEN (requires justification)' },
              { value: 'amber', label: 'Override to AMBER (requires justification)' },
              { value: 'red', label: 'Override to RED (requires justification)' },
            ].map(opt => (
              <label
                key={opt.value}
                style={{
                  ...styles.option,
                  ...(practitionerData.bandOverride === opt.value ? styles.optionSelected : {}),
                }}
                onClick={() => setPractitionerData(prev => ({ ...prev, bandOverride: opt.value }))}
              >
                {opt.label}
              </label>
            ))}
            {practitionerData.bandOverride !== 'no' && (
              <div style={{ marginTop: '15px' }}>
                <label style={{ color: TOKENS.textSecondary, display: 'block', marginBottom: '8px' }}>
                  Justification (required for override):
                </label>
                <textarea
                  value={practitionerData.overrideJustification}
                  onChange={(e) => setPractitionerData(prev => ({ ...prev, overrideJustification: e.target.value }))}
                  style={styles.textarea}
                  placeholder="Explain the clinical reasoning for this override..."
                />
              </div>
            )}
          </div>

          {/* 7. Engagement Decision */}
          <div style={styles.questionBlock}>
            <p style={styles.questionText}>7. What is your decision for this engagement under current conditions?</p>
            
            {/* Determine effective band (may be overridden) */}
            {(() => {
              const effectiveBand = practitionerData.bandOverride !== 'no' 
                ? practitionerData.bandOverride 
                : band;
              
              if (effectiveBand === 'red') {
                return (
                  <div style={{ 
                    backgroundColor: TOKENS.statusHighBg, 
                    border: `1px solid ${TOKENS.statusHigh}`,
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '15px'
                  }}>
                    <strong style={{ color: TOKENS.statusHigh }}>🔴 RED Conditions Apply</strong>
                    <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: TOKENS.textSecondary }}>
                      "Proceed as planned" is not available under RED. Attendance ≠ engagement. 
                      You must modify, postpone, refer, or seek clarification.
                    </p>
                  </div>
                );
              }
              return null;
            })()}
            
            {(() => {
              const effectiveBand = practitionerData.bandOverride !== 'no' 
                ? practitionerData.bandOverride 
                : band;
              
              const allOptions = [
                { value: 'proceed', label: '✅ Proceed as planned', blockedByRed: true },
                { value: 'proceed_modified', label: '⚠️ Proceed with modifications (requires justification)', blockedByRed: false },
                { value: 'postpone', label: '⏸️ Postpone until conditions improve', blockedByRed: false },
                { value: 'refer', label: '🔄 Refer to alternative support', blockedByRed: false },
                { value: 'clarify', label: '❓ Clarification conversation required before decision', blockedByRed: false },
              ];
              
              return allOptions.map(opt => {
                const isBlocked = effectiveBand === 'red' && opt.blockedByRed;
                
                if (isBlocked) {
                  return (
                    <div
                      key={opt.value}
                      style={{
                        ...styles.option,
                        opacity: 0.4,
                        cursor: 'not-allowed',
                        backgroundColor: TOKENS.statusHighBg,
                        borderColor: TOKENS.statusHigh,
                      }}
                    >
                      {opt.label}
                      <span style={{ 
                        display: 'block', 
                        fontSize: '0.8rem', 
                        color: TOKENS.statusHigh,
                        marginTop: '5px' 
                      }}>
                        🚫 Not available under RED conditions
                      </span>
                    </div>
                  );
                }
                
                return (
                  <label
                    key={opt.value}
                    style={{
                      ...styles.option,
                      ...(practitionerData.decision === opt.value ? styles.optionSelected : {}),
                    }}
                    onClick={() => setPractitionerData(prev => ({ ...prev, decision: opt.value }))}
                  >
                    {opt.label}
                  </label>
                );
              });
            })()}
          </div>

          {/* Warning if proceeding with RED */}
          {(band === 'red' || practitionerData.bandOverride === 'red') && 
           (practitionerData.decision === 'proceed' || practitionerData.decision === 'proceed_modified') && (
            <div style={styles.warningBox}>
              <strong>⚠️ Proceeding under RED conditions</strong>
              <p style={{ margin: '10px 0 0 0' }}>
                You have chosen to proceed despite a RED capacity band. This requires explicit 
                ethical justification. Please ensure your reasoning is documented below.
              </p>
            </div>
          )}

          {/* 7.5 Client Consent */}
          <div style={styles.questionBlock}>
            <p style={styles.questionText}>7.5 Based on discussion (or available information), what is the client's consent status regarding proceeding under the proposed conditions?</p>
            {[
              { value: 'informed_consent', label: 'Client has given informed consent to proceed' },
              { value: 'hesitation', label: 'Client has expressed hesitation or conditional consent' },
              { value: 'not_informed', label: 'Client has not yet been informed of the conditions' },
              { value: 'no_consent', label: 'Client does not consent to proceeding under current conditions' },
              { value: 'no_contact', label: 'No direct contact yet' },
            ].map(opt => (
              <label
                key={opt.value}
                style={{
                  ...styles.option,
                  ...(practitionerData.clientConsent === opt.value ? styles.optionSelected : {}),
                }}
                onClick={() => setPractitionerData(prev => ({ ...prev, clientConsent: opt.value }))}
              >
                {opt.label}
              </label>
            ))}
            <p style={styles.helperText}>
              Informed consent requires adequate cognitive and emotional capacity to choose freely.
              Coercive contexts reduce genuine autonomy even without overt force. Proceeding without 
              consent constitutes coercive participation.
              <br/>
              <span style={styles.citationRef}>
                (Beauchamp & Childress, 2019; Deci & Ryan, 2000 — consent & autonomy)
              </span>
            </p>
          </div>

          {/* 7.6 Assessment Validity */}
          <div style={styles.questionBlock}>
            <p style={styles.questionText}>7.6 Under the current conditions, what can be validly assessed or expected?</p>
            
            {/* Block "full" assessment claim under RED */}
            {(() => {
              const effectiveBand = practitionerData.bandOverride !== 'no' 
                ? practitionerData.bandOverride 
                : band;
              
              const options = [
                { value: 'full', label: 'Counselling skills and reflective learning', blockedByRed: true },
                { value: 'partial', label: 'Partial skill engagement (learning likely compromised)', blockedByRed: false },
                { value: 'containment', label: 'Containment/support only (learning not reliable)', blockedByRed: false },
                { value: 'not_assessable', label: 'Engagement itself is not currently assessable', blockedByRed: false },
                { value: 'not_assessment', label: 'Not an assessment context', blockedByRed: false },
              ];
              
              return options.map(opt => {
                const isBlocked = effectiveBand === 'red' && opt.blockedByRed;
                
                if (isBlocked) {
                  return (
                    <div
                      key={opt.value}
                      style={{
                        ...styles.option,
                        opacity: 0.4,
                        cursor: 'not-allowed',
                        backgroundColor: TOKENS.statusHighBg,
                        borderColor: TOKENS.statusHigh,
                      }}
                    >
                      {opt.label}
                      <span style={{ 
                        display: 'block', 
                        fontSize: '0.8rem', 
                        color: TOKENS.statusHigh,
                        marginTop: '5px' 
                      }}>
                        🚫 Cannot claim full assessment validity under RED — capacity consumed by access/regulation
                      </span>
                    </div>
                  );
                }
                
                return (
                  <label
                    key={opt.value}
                    style={{
                      ...styles.option,
                      ...(practitionerData.assessmentValidity === opt.value ? styles.optionSelected : {}),
                    }}
                    onClick={() => setPractitionerData(prev => ({ ...prev, assessmentValidity: opt.value }))}
                  >
                    {opt.label}
                  </label>
                );
              });
            })()}
            <p style={styles.helperText}>
              Assessment validity requires that performance reflect the target construct, not extraneous variables.
              When fatigue, stress, or access barriers dominate, assessments measure endurance and compliance 
              instead of competence.
              <br/>
              <span style={styles.citationRef}>
                (Messick, 1995; Brookhart, 2013 — assessment validity)
              </span>
            </p>
          </div>

          {/* 8. Reasoning / Notes */}
          <div style={styles.questionBlock}>
            <p style={styles.questionText}>8. Reasoning / Clinical Notes</p>
            <p style={{ color: TOKENS.textMuted, fontSize: '0.9rem', marginBottom: '10px' }}>
              This will be included in the final results sent to both parties.
            </p>
            <textarea
              value={practitionerData.reasoning}
              onChange={(e) => setPractitionerData(prev => ({ ...prev, reasoning: e.target.value }))}
              style={styles.textarea}
              placeholder="Any notes about your decision, modifications needed, or concerns..."
            />
          </div>

          {/* 9. Responsibility Acknowledgement */}
          <div style={styles.questionBlock}>
            <p style={styles.questionText}>9. Responsibility Acknowledgement</p>
            <p style={{ color: TOKENS.textMuted, fontSize: '0.9rem', marginBottom: '15px' }}>
              By completing this section, I acknowledge that:
            </p>
            
            <label style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={practitionerData.acknowledgeHarm}
                onChange={(e) => setPractitionerData(prev => ({ ...prev, acknowledgeHarm: e.target.checked }))}
                style={styles.checkbox}
              />
              <span style={{ color: TOKENS.textPrimary }}>
                I have considered foreseeable harm arising from the counselling process and environment
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={practitionerData.acknowledgeResponsibility}
                onChange={(e) => setPractitionerData(prev => ({ ...prev, acknowledgeResponsibility: e.target.checked }))}
                style={styles.checkbox}
              />
              <span style={{ color: TOKENS.textPrimary }}>
                I accept responsibility for the decision recorded above
              </span>
            </label>

            {(band === 'red' || practitionerData.bandOverride === 'red') && (
              <label style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={practitionerData.acknowledgeRedJustification}
                  onChange={(e) => setPractitionerData(prev => ({ ...prev, acknowledgeRedJustification: e.target.checked }))}
                  style={styles.checkbox}
                />
                <span style={{ color: TOKENS.statusHigh }}>
                  I understand that proceeding under RED conditions requires explicit ethical justification
                </span>
              </label>
            )}

            <div style={{ marginTop: '20px' }}>
              <label style={{ color: TOKENS.textSecondary, display: 'block', marginBottom: '8px' }}>
                Practitioner name / role:
              </label>
              <input
                type="text"
                value={practitionerData.practitionerName}
                onChange={(e) => setPractitionerData(prev => ({ ...prev, practitionerName: e.target.value }))}
                style={styles.input}
                placeholder="Your name and role"
              />
            </div>

            <p style={{ color: TOKENS.textMuted, fontSize: '0.85rem', marginTop: '15px' }}>
              Date: {new Date().toLocaleDateString('en-AU')}
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit() || submitting}
            style={{
              ...styles.button,
              ...(!canSubmit() || submitting ? styles.buttonDisabled : {}),
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
