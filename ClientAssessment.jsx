import { useState, useEffect } from "react";
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
// SECTION DATA — 9 Sections, 27 Questions
// ═══════════════════════════════════════════════════════════════════════════════
const SECTIONS = [
  {
    id: "information_processing",
    name: "How You Take In and Share Information",
    subtitle: "How your brain works when people are talking to you",
    intro: "You only answer what you can. \"I'm not sure yet\" is a valid answer.",
    questions: [
      {
        id: "ip1",
        text: "How do you usually understand new information best?",
        type: "multi",
        options: [
          { value: "talking", label: "Someone talking it through with me" },
          { value: "reading", label: "Reading it in my own time" },
          { value: "visual", label: "Seeing diagrams, pictures, or examples" },
          { value: "demonstration", label: "Watching someone demonstrate or show me" },
          { value: "mix", label: "A mix of talking, reading, and visuals" },
          { value: "depends", label: "It depends a lot on the topic" },
          { value: null, label: "I'm not sure yet" },
        ],
      },
      {
        id: "ip2",
        text: "When someone asks you a question, what usually helps you respond?",
        type: "scale",
        options: [
          { value: 0, label: "I can answer straight away" },
          { value: 1, label: "I need a short pause to think" },
          { value: 2, label: "I often need noticeable time to process" },
          { value: 3, label: "I may need to come back to it later" },
          { value: null, label: "I'm not sure yet" },
        ],
      },
      {
        id: "ip3",
        text: "Which things make thinking or understanding harder for you?",
        type: "multi",
        options: [
          { value: "too_much", label: "Being given too much information at once" },
          { value: "fast", label: "Fast talking or rushing" },
          { value: "interrupted", label: "Being interrupted" },
          { value: "multiple_questions", label: "Being asked multiple questions at once" },
          { value: "abstract", label: "Abstract ideas without examples" },
          { value: "emotional", label: "Emotional or intense topics" },
          { value: "topic_changes", label: "Sudden topic changes" },
          { value: "none", label: "None of these are a big issue" },
          { value: null, label: "I'm not sure yet" },
        ],
      },
      {
        id: "ip4",
        text: "What helps communication feel easier or safer for you?",
        type: "multi",
        options: [
          { value: "notes", label: "Written notes or summaries" },
          { value: "agenda", label: "Knowing what we'll talk about beforehand" },
          { value: "pause", label: "Being allowed to pause or think" },
          { value: "write", label: "Being able to write instead of speak sometimes" },
          { value: "questions_advance", label: "Having questions in advance" },
          { value: "clarify", label: "Being allowed to clarify or rephrase" },
          { value: "nothing", label: "Nothing specific" },
          { value: null, label: "I'm not sure yet" },
        ],
      },
    ],
  },
  {
    id: "body_energy",
    name: "Your Body and Energy",
    subtitle: "What your body needs to function",
    intro: "These questions are about what your body needs right now.",
    questions: [
      {
        id: "be1",
        text: "What is currently affecting your energy levels?",
        type: "multi",
        options: [
          { value: "fatigue", label: "Ongoing tiredness or fatigue" },
          { value: "pain", label: "Pain or physical discomfort" },
          { value: "medication", label: "Medication effects" },
          { value: "health", label: "Ongoing health conditions" },
          { value: "hormonal", label: "Hormonal changes or cycles" },
          { value: "sleep", label: "Sleep quality" },
          { value: "food", label: "Eating regularly / access to food" },
          { value: "stable", label: "My energy is usually stable right now" },
          { value: null, label: "I'm not sure yet" },
        ],
      },
      {
        id: "be2",
        text: "When do you usually have the most usable energy?",
        type: "scale",
        options: [
          { value: 0, label: "Morning" },
          { value: 1, label: "Midday" },
          { value: 2, label: "Afternoon" },
          { value: 3, label: "Evening" },
          { value: 4, label: "It varies too much to tell" },
          { value: null, label: "I'm not sure yet" },
        ],
        noLoadScore: true,
      },
      {
        id: "be3",
        text: "How long can you usually stay engaged before it starts to feel too much?",
        type: "scale",
        options: [
          { value: 3, label: "30 minutes or less" },
          { value: 2, label: "30–50 minutes" },
          { value: 1, label: "50–90 minutes" },
          { value: 0, label: "Longer sessions are usually okay" },
          { value: null, label: "I'm not sure yet" },
        ],
      },
      {
        id: "be4",
        text: "How does being physically still affect you?",
        type: "scale",
        options: [
          { value: 0, label: "Being still is generally fine" },
          { value: 1, label: "I can manage with some movement" },
          { value: 2, label: "Being still drains my energy noticeably" },
          { value: 3, label: "Being still makes engagement very difficult" },
          { value: null, label: "I'm not sure yet" },
        ],
      },
      {
        id: "be5",
        text: "During sessions, what helps your body cope?",
        type: "multi",
        options: [
          { value: "move", label: "Being able to move or shift position" },
          { value: "position", label: "Sitting, standing, or lying differently" },
          { value: "fidget", label: "Fidgeting or holding something" },
          { value: "breaks", label: "Taking breaks" },
          { value: "nothing", label: "Nothing specific" },
          { value: null, label: "I'm not sure yet" },
        ],
      },
    ],
  },
  {
    id: "sensory_environment",
    name: "Sensory and Environment",
    subtitle: "How spaces affect you",
    intro: "These questions help identify what conditions support or drain you.",
    questions: [
      {
        id: "se1",
        text: "How does lighting affect you?",
        type: "scale",
        options: [
          { value: 0, label: "Hardly at all" },
          { value: 1, label: "I have preferences but can manage" },
          { value: 2, label: "Bad lighting drains me" },
          { value: 3, label: "Some lighting makes it extremely difficult to engage" },
          { value: null, label: "I'm not sure yet" },
        ],
      },
      {
        id: "se2",
        text: "How does sound affect you?",
        type: "scale",
        options: [
          { value: 0, label: "Hardly at all" },
          { value: 1, label: "I have preferences but can manage" },
          { value: 2, label: "Background noise drains me" },
          { value: 3, label: "Noise makes it extremely difficult to engage" },
          { value: null, label: "I'm not sure yet" },
        ],
      },
      {
        id: "se3",
        text: "Other things that affect you in spaces?",
        type: "multi",
        options: [
          { value: "smells", label: "Smells" },
          { value: "temperature", label: "Temperature" },
          { value: "crowded", label: "Crowded rooms" },
          { value: "clutter", label: "Visual clutter" },
          { value: "none", label: "None of these" },
          { value: null, label: "I'm not sure yet" },
        ],
      },
      {
        id: "se4",
        text: "How do waiting areas or delays before starting affect you?",
        type: "scale",
        options: [
          { value: 0, label: "Waiting is usually fine" },
          { value: 1, label: "Waiting is uncomfortable but manageable" },
          { value: 2, label: "Waiting drains my energy noticeably" },
          { value: 3, label: "Waiting makes engagement much harder" },
          { value: null, label: "I'm not sure yet" },
        ],
      },
      {
        id: "se5",
        text: "Which option usually takes less out of you overall?",
        type: "scale",
        options: [
          { value: 0, label: "In-person" },
          { value: 1, label: "Online / video" },
          { value: 2, label: "Depends on the day" },
          { value: 3, label: "No strong preference" },
          { value: null, label: "I'm not sure yet" },
        ],
        noLoadScore: true,
      },
    ],
  },
  {
    id: "safety_trust",
    name: "Safety and Trust",
    subtitle: "What helps you feel safe to engage",
    intro: "These questions help identify what conditions support safety.",
    questions: [
      {
        id: "st1",
        text: "Have past experiences affected how safe you feel in these settings?",
        type: "scale",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "A little" },
          { value: 2, label: "Yes, I'm cautious" },
          { value: 3, label: "Yes, it strongly affects me" },
          { value: null, label: "I'm not sure / prefer not to say" },
        ],
      },
      {
        id: "st2",
        text: "Do you worry about consequences from what you share?",
        type: "scale",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "A bit" },
          { value: 2, label: "Yes, it affects what I say" },
          { value: 3, label: "Yes, it makes it hard to engage" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "st3",
        text: "What helps you feel safer?",
        type: "multi",
        options: [
          { value: "boundaries", label: "Knowing boundaries clearly" },
          { value: "stop", label: "Being able to stop or pause" },
          { value: "reporting", label: "Knowing what will be reported or not" },
          { value: "believed", label: "Being believed" },
          { value: "nothing", label: "Nothing specific" },
          { value: null, label: "I'm not sure yet" },
        ],
      },
    ],
  },
  {
    id: "identity_social",
    name: "Identity and Social Effort",
    subtitle: "How much effort it takes to be in these spaces",
    intro: "These questions are about the work of being present.",
    questions: [
      {
        id: "is1",
        text: "Do you feel you need to hide, perform, or monitor yourself?",
        type: "scale",
        options: [
          { value: 0, label: "Rarely" },
          { value: 1, label: "Sometimes" },
          { value: 2, label: "Often" },
          { value: 3, label: "Almost all the time" },
          { value: null, label: "I'm not sure yet" },
        ],
      },
      {
        id: "is2",
        text: "How does sustained interaction with another person affect your energy?",
        type: "scale",
        options: [
          { value: 0, label: "Little effect" },
          { value: 1, label: "Some tiredness" },
          { value: 2, label: "Noticeable exhaustion" },
          { value: 3, label: "Very draining, even if the interaction is positive" },
          { value: null, label: "I'm not sure yet" },
        ],
      },
      {
        id: "is3",
        text: "Have similar services been hard for you in the past?",
        type: "scale",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "A little" },
          { value: 2, label: "Yes" },
          { value: 3, label: "Yes, very harmful" },
          { value: null, label: "I'm not sure / prefer not to say" },
        ],
      },
    ],
  },
  {
    id: "current_supports",
    name: "What's Holding You Together Right Now",
    subtitle: "Supports you rely on",
    intro: "These questions help identify what's stabilising your capacity.",
    questions: [
      {
        id: "cs1",
        text: "What currently helps you cope or function?",
        type: "multi",
        options: [
          { value: "routines", label: "Routines" },
          { value: "medication", label: "Medication" },
          { value: "substances", label: "Caffeine or other substances" },
          { value: "people", label: "Specific people" },
          { value: "environment", label: "Controlled environment" },
          { value: "rest", label: "Protected rest" },
          { value: "nothing", label: "Nothing specific" },
          { value: null, label: "I'm not sure yet" },
        ],
      },
      {
        id: "cs2",
        text: "If these supports were disrupted, what would likely happen?",
        type: "scale",
        options: [
          { value: 0, label: "I'd be okay" },
          { value: 1, label: "It would be hard but manageable" },
          { value: 2, label: "I'd struggle a lot" },
          { value: 3, label: "I might crash or shut down" },
          { value: null, label: "I'm not sure" },
        ],
      },
    ],
  },
  {
    id: "current_baseline",
    name: "Where You're Starting From",
    subtitle: "Your current baseline",
    intro: "These questions assess your current state, not your capacity in ideal conditions.",
    questions: [
      {
        id: "cb1",
        text: "How does your energy feel right now?",
        type: "scale",
        options: [
          { value: 0, label: "I have capacity available" },
          { value: 1, label: "Low but coping" },
          { value: 2, label: "Very limited" },
          { value: 3, label: "Exhausted / beyond capacity" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "cb2",
        text: "Are you currently recovering from something?",
        type: "scale",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "A bit" },
          { value: 2, label: "Yes, and it affects daily life" },
          { value: 3, label: "Yes, deeply" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "cb3",
        text: "How much of your capacity is already allocated to other demands right now?",
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
    id: "life_load",
    name: "Life Load",
    subtitle: "What else is using your energy",
    intro: "These questions capture what's drawing on your capacity.",
    questions: [
      {
        id: "ll1",
        text: "What's currently drawing on your energy?",
        type: "multi",
        options: [
          { value: "work", label: "Work" },
          { value: "caregiving", label: "Caregiving" },
          { value: "health", label: "Health management" },
          { value: "money", label: "Money stress" },
          { value: "housing", label: "Housing stress" },
          { value: "relationships", label: "Relationships" },
          { value: "grief", label: "Grief or loss" },
          { value: "legal_admin", label: "Legal or administrative demands" },
          { value: "manageable", label: "Mostly manageable right now" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "ll2",
        text: "How much does this take from you right now?",
        type: "scale",
        options: [
          { value: 0, label: "Not much" },
          { value: 1, label: "Some" },
          { value: 2, label: "A lot" },
          { value: 3, label: "Almost everything" },
          { value: null, label: "I'm not sure" },
        ],
      },
    ],
  },
  {
    id: "recovery",
    name: "Recovery",
    subtitle: "How you get back to baseline",
    intro: "These questions assess your ability to recover.",
    questions: [
      {
        id: "rc1",
        text: "Do you currently have access to things that help you recover?",
        type: "scale",
        options: [
          { value: 0, label: "Yes, regularly" },
          { value: 1, label: "Sometimes" },
          { value: 2, label: "Rarely" },
          { value: 3, label: "Not at all" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "rc2",
        text: "After demanding things, how long does recovery usually take?",
        type: "scale",
        options: [
          { value: 0, label: "Hours" },
          { value: 1, label: "A day" },
          { value: 2, label: "Several days" },
          { value: 3, label: "Weeks or longer" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "rc3",
        text: "What usually happens if you don't get enough recovery time?",
        type: "scale",
        options: [
          { value: 0, label: "I can usually push through" },
          { value: 1, label: "I feel it later but recover" },
          { value: 2, label: "My functioning drops significantly" },
          { value: 3, label: "I crash, shut down, or become unwell" },
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

  const handleMultiResponse = (questionId, value) => {
    setResponses(prev => {
      const current = prev[questionId] || [];
      // If selecting "I'm not sure yet" or similar null value
      if (value === null) {
        return { ...prev, [questionId]: [null] };
      }
      // If currently has null selected, replace with new value
      if (current.includes(null)) {
        return { ...prev, [questionId]: [value] };
      }
      // Toggle selection (no limit)
      if (current.includes(value)) {
        return { ...prev, [questionId]: current.filter(v => v !== value) };
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
          <h1 style={styles.title}>Baseline Access Check</h1>
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
        <h1 style={styles.title}>Baseline Access Check</h1>
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
                        handleMultiResponse(q.id, opt.value);
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
