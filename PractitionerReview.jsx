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
    // 2. Accommodation Feasibility
    accommodationFeasibility: '',
    // 3. Additional Load Factors
    additionalLoadFactors: [],
    // 4. Client Presentation
    clientPresentation: '',
    // 5. Capacity Band Override
    bandOverride: 'no',
    overrideJustification: '',
    // 6. Engagement Decision
    decision: '',
    // 6.5 Client Consent
    clientConsent: '',
    // 6.6 Assessment Validity
    assessmentValidity: '',
    // 7. Reasoning / Notes
    reasoning: '',
    // 8. Responsibility Acknowledgement
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
    const band = session?.capacityBand || 'green';
    const needsOverrideJustification = practitionerData.bandOverride !== 'no';
    
    return (
      practitionerData.engagementContext &&
      practitionerData.accommodationFeasibility &&
      practitionerData.clientPresentation &&
      practitionerData.decision &&
      practitionerData.clientConsent &&
      practitionerData.assessmentValidity &&
      practitionerData.acknowledgeHarm &&
      practitionerData.acknowledgeResponsibility &&
      (band !== 'red' || practitionerData.acknowledgeRedJustification) &&
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
        {/* Override & Decision Rules */}
        <div style={styles.rulesBox}>
          <strong style={{ color: TOKENS.statusMid }}>Override & Decision Rules</strong>
          <ul style={{ margin: '10px 0 0 0', paddingLeft: '20px', color: TOKENS.textSecondary }}>
            <li><strong>RED always overrides compliance.</strong> Attendance ≠ engagement.</li>
            <li><strong>AMBER + no feasible accommodations = treat as RED.</strong></li>
            <li><strong>Multiple "I'm not sure yet" responses</strong> → lean AMBER/RED until clarified.</li>
            <li><strong>Intensive or multi-day formats:</strong> any AMBER should be treated as RED unless mitigated.</li>
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

          <p style={{ color: TOKENS.textMuted, fontSize: '0.9rem' }}>
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
            </p>
          </div>

          {/* 2. Accommodation Feasibility */}
          <div style={styles.questionBlock}>
            <p style={styles.questionText}>2. Can the accommodations indicated by the client's responses be implemented in this setting?</p>
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
            </p>
          </div>

          {/* 3. Additional Load Factors */}
          <div style={styles.questionBlock}>
            <p style={styles.questionText}>3. Are there load factors you are aware of that may not be captured in the client's responses?</p>
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
          </div>

          {/* 4. Client Presentation */}
          <div style={styles.questionBlock}>
            <p style={styles.questionText}>4. Based on your observation or communication, the client appears:</p>
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
              If presentation suggests greater depletion, lean toward higher risk until clarified.
            </p>
          </div>

          {/* 5. Capacity Band Override */}
          <div style={styles.questionBlock}>
            <p style={styles.questionText}>5. Based on your clinical judgement, do you wish to override the preliminary capacity allocation band?</p>
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

          {/* 6. Engagement Decision */}
          <div style={styles.questionBlock}>
            <p style={styles.questionText}>6. What is your decision for this engagement under current conditions?</p>
            {[
              { value: 'proceed', label: '✅ Proceed as planned' },
              { value: 'proceed_modified', label: '⚠️ Proceed with modifications' },
              { value: 'postpone', label: '⏸️ Postpone until conditions improve' },
              { value: 'refer', label: '🔄 Refer to alternative support' },
              { value: 'clarify', label: '❓ Clarification conversation required before decision' },
            ].map(opt => (
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
            ))}
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

          {/* 6.5 Client Consent */}
          <div style={styles.questionBlock}>
            <p style={styles.questionText}>6.5 Based on discussion (or available information), what is the client's consent status regarding proceeding under the proposed conditions?</p>
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
              Ethical engagement requires free and informed choice. 
              Proceeding without consent constitutes coercive participation.
            </p>
          </div>

          {/* 6.6 Assessment Validity */}
          <div style={styles.questionBlock}>
            <p style={styles.questionText}>6.6 Under the current conditions, what can be validly assessed or expected?</p>
            {[
              { value: 'full', label: 'Counselling skills and reflective learning' },
              { value: 'partial', label: 'Partial skill engagement (learning likely compromised)' },
              { value: 'containment', label: 'Containment/support only (learning not reliable)' },
              { value: 'not_assessable', label: 'Engagement itself is not currently assessable' },
              { value: 'not_assessment', label: 'Not an assessment context' },
            ].map(opt => (
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
            ))}
            <p style={styles.helperText}>
              When capacity is consumed by access or regulation, learning and skill cannot be validly assessed. 
              Proceeding under those conditions measures endurance, not competence.
            </p>
          </div>

          {/* 7. Reasoning / Notes */}
          <div style={styles.questionBlock}>
            <p style={styles.questionText}>7. Reasoning / Clinical Notes</p>
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

          {/* 8. Responsibility Acknowledgement */}
          <div style={styles.questionBlock}>
            <p style={styles.questionText}>8. Responsibility Acknowledgement</p>
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
