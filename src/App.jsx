import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS — Crystal Geode Aesthetic (Teal accent)
// ═══════════════════════════════════════════════════════════════════════════════
const TOKENS = {
  // Core palette - TEAL/GREEN
  gold: "#4ecdc4",
  goldLight: "#7eddd6",
  goldDim: "rgba(78,205,196,0.3)",
  goldGlow: "rgba(78,205,196,0.15)",
  
  // Background layers
  bgDeep: "#0b0a10",
  bgCard: "rgba(18,16,28,0.92)",
  bgCardHover: "rgba(28,24,42,0.95)",
  bgInput: "rgba(12,10,18,0.8)",
  
  // Purple undertones
  purple: "#2d1f3d",
  purpleGlow: "rgba(88,62,125,0.2)",
  
  // Text hierarchy
  textPrimary: "#f5f0e8",
  textSecondary: "rgba(245,240,232,0.75)",
  textMuted: "rgba(245,240,232,0.5)",
  
  // Status colors
  statusLow: "#4ecdc4",
  statusLowBg: "rgba(78,205,196,0.15)",
  statusMid: "#d4a03c",
  statusMidBg: "rgba(212,160,60,0.15)",
  statusHigh: "#c44040",
  statusHighBg: "rgba(196,64,64,0.15)",
  
  // Readiness flags
  flagReady: "#4ecdc4",
  flagReadyBg: "rgba(78,205,196,0.15)",
  flagCaution: "#d4a03c",
  flagCautionBg: "rgba(212,160,60,0.15)",
  flagNotReady: "#c44040",
  flagNotReadyBg: "rgba(196,64,64,0.15)",
  
  // Typography
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
    group: "A",
    groupName: "Communication & Cognition",
    intro: "These questions help identify what conditions support you to take in information and communicate without excessive effort. There are no wrong answers — only what works for your brain.",
    outputCategory: "sessionFormat",
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
        text: "How much processing time do you typically need before responding to questions or new information?",
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
      {
        id: "pc4",
        text: "What communication supports reduce effort for you?",
        type: "multi",
        maxSelections: 4,
        options: [
          { value: "notes", label: "Written notes or summaries" },
          { value: "pauses", label: "Built-in pauses" },
          { value: "visuals", label: "Visual aids" },
          { value: "recording", label: "Ability to record sessions" },
          { value: "agenda", label: "Agenda provided beforehand" },
          { value: "written_questions", label: "Questions in writing before discussing" },
          { value: "none", label: "I don't need specific supports" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "pc5",
        text: "Are there ways you express yourself that might be misread? (e.g., flat affect, delayed responses, tangential speech, difficulty with eye contact)",
        type: "scale",
        options: [
          { value: 0, label: "My expression is usually read accurately" },
          { value: 1, label: "Occasionally misread" },
          { value: 2, label: "Often misread" },
          { value: 3, label: "Frequently misread in ways that affect how I'm treated" },
          { value: null, label: "I'm not sure" },
        ],
      },
    ],
  },
  {
    id: "body_energy",
    name: "Body & Energy Requirements",
    subtitle: "What your body needs to function at baseline",
    group: "A",
    groupName: "Communication & Cognition",
    intro: "These questions are about your body's needs and energy patterns. Baseline cannot exist if the body is already in deficit.",
    outputCategory: "timing",
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
          { value: null, label: "It varies too much to say / I'm not sure" },
        ],
        noLoadScore: true, // This is preference, not load
      },
      {
        id: "be3",
        text: "What bodily needs must typically be met before you can engage well?",
        type: "multi",
        maxSelections: 4,
        options: [
          { value: "movement", label: "Movement or exercise" },
          { value: "food", label: "Having eaten" },
          { value: "rest", label: "Recent rest" },
          { value: "medication", label: "Medication timing" },
          { value: "bathroom", label: "Bathroom access" },
          { value: "caffeine", label: "Caffeine or stimulant" },
          { value: "none", label: "No specific requirements" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "be4",
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
      {
        id: "be5",
        text: "Do you have physical positioning needs during sessions?",
        type: "multi",
        maxSelections: 3,
        options: [
          { value: "lying", label: "Ability to lie down" },
          { value: "standing", label: "Ability to stand or move" },
          { value: "breaks", label: "Movement breaks" },
          { value: "fidget", label: "Fidget tools or objects" },
          { value: "specific_seating", label: "Specific seating requirements" },
          { value: "none", label: "Standard seating is fine" },
          { value: null, label: "I'm not sure" },
        ],
      },
    ],
  },
  {
    id: "sensory_environmental",
    name: "Sensory & Environmental Conditions",
    subtitle: "What environmental conditions affect your capacity",
    group: "B",
    groupName: "Environment & Access",
    intro: "Many people arrive without noticing the environment. Others spend capacity surviving it. These questions help identify what conditions support or drain you.",
    outputCategory: "environment",
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
        text: "How do temperature and scent affect your capacity?",
        type: "scale",
        options: [
          { value: 0, label: "Rarely affected" },
          { value: 1, label: "Preferences but manageable" },
          { value: 2, label: "Wrong conditions noticeably drain capacity" },
          { value: 3, label: "Can make engagement impossible" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "se4",
        text: "Are there environmental features that reliably dysregulate you?",
        type: "multi",
        maxSelections: 5,
        options: [
          { value: "fluorescent", label: "Fluorescent lighting" },
          { value: "clutter", label: "Visual clutter" },
          { value: "background_noise", label: "Background noise/music" },
          { value: "strong_scents", label: "Strong scents" },
          { value: "crowding", label: "Crowded spaces" },
          { value: "open_plan", label: "Open plan / lack of walls" },
          { value: "temperature", label: "Temperature extremes" },
          { value: "none", label: "None specifically" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "se5",
        text: "Is the waiting area typically sustainable for you, or does it cost capacity before you even begin?",
        type: "scale",
        options: [
          { value: 0, label: "Waiting areas are fine" },
          { value: 1, label: "Mild discomfort but manageable" },
          { value: 2, label: "Often costs noticeable capacity" },
          { value: 3, label: "Waiting areas significantly deplete me" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "se6",
        text: "Which modality reduces your total environmental load?",
        type: "scale",
        options: [
          { value: 0, label: "In-person is easier" },
          { value: 1, label: "No strong preference" },
          { value: 2, label: "Online is easier" },
          { value: 3, label: "Depends significantly on the day" },
          { value: null, label: "I'm not sure" },
        ],
        noLoadScore: true,
      },
    ],
  },
  {
    id: "structural_practical",
    name: "Structural & Practical Access",
    subtitle: "What it takes to physically attend",
    group: "B",
    groupName: "Environment & Access",
    intro: "Structural effort is invisible until it is named. These questions make visible the practical work required to attend.",
    outputCategory: "logistics",
    questions: [
      {
        id: "sp1",
        text: "What transport demands exist for you to attend?",
        type: "multi",
        maxSelections: 4,
        options: [
          { value: "driving", label: "Driving (with associated fatigue/cost)" },
          { value: "public", label: "Public transport navigation" },
          { value: "mobility", label: "Mobility aid requirements" },
          { value: "parking", label: "Parking challenges" },
          { value: "reliance", label: "Reliance on others for transport" },
          { value: "distance", label: "Significant travel distance" },
          { value: "minimal", label: "Transport is straightforward" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "sp2",
        text: "What timing constraints affect your ability to attend?",
        type: "multi",
        maxSelections: 4,
        options: [
          { value: "school", label: "School pickup/dropoff" },
          { value: "work", label: "Work schedule" },
          { value: "carer", label: "Carer availability" },
          { value: "other_appointments", label: "Other appointments" },
          { value: "energy_windows", label: "Limited energy windows" },
          { value: "flexible", label: "Schedule is relatively flexible" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "sp3",
        text: "What financial barriers affect attendance?",
        type: "scale",
        options: [
          { value: 0, label: "Finances are not a barrier" },
          { value: 1, label: "Some financial pressure" },
          { value: 2, label: "Significant financial barrier" },
          { value: 3, label: "Financial barriers make attendance precarious" },
          { value: null, label: "I'm not sure / prefer not to say" },
        ],
      },
      {
        id: "sp4",
        text: "What childcare or dependent care is required for you to attend?",
        type: "scale",
        options: [
          { value: 0, label: "No dependent care needed" },
          { value: 1, label: "Care needed but reliably available" },
          { value: 2, label: "Care needed and sometimes difficult to arrange" },
          { value: 3, label: "Care arrangements are a major barrier" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "sp5",
        text: "How much administrative work is required to attend? (forms, scheduling, communication, funding paperwork)",
        type: "scale",
        options: [
          { value: 0, label: "Minimal admin" },
          { value: 1, label: "Manageable admin" },
          { value: 2, label: "Significant admin load" },
          { value: 3, label: "Admin is a major barrier" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "sp6",
        text: "How much total effort does 'getting there' cost relative to the session itself?",
        type: "scale",
        options: [
          { value: 0, label: "Getting there is easy" },
          { value: 1, label: "Some effort but proportionate" },
          { value: 2, label: "Getting there costs significant capacity" },
          { value: 3, label: "Getting there costs more than the session" },
          { value: null, label: "I'm not sure" },
        ],
      },
    ],
  },
  {
    id: "safety_trust",
    name: "Safety, Trust & Power Awareness",
    subtitle: "What you need to feel safe enough to be present",
    group: "C",
    groupName: "Safety & Identity",
    intro: "Safety is a prerequisite for participation, not an outcome of it. These questions help identify what supports your sense of safety in this setting.",
    outputCategory: "safety",
    questions: [
      {
        id: "st1",
        text: "Are there past experiences that affect your trust in therapeutic or institutional settings?",
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
      {
        id: "st3",
        text: "How important is it that power dynamics are made explicit and transparent?",
        type: "scale",
        options: [
          { value: 0, label: "Not particularly important to me" },
          { value: 1, label: "Somewhat important" },
          { value: 2, label: "Important" },
          { value: 3, label: "Essential for my participation" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "st4",
        text: "What would support mutual safety and relational clarity in this setting?",
        type: "multi",
        maxSelections: 4,
        options: [
          { value: "clear_boundaries", label: "Clear boundaries stated upfront" },
          { value: "consent_ongoing", label: "Ongoing consent checking" },
          { value: "pace_control", label: "Control over pacing" },
          { value: "exit_option", label: "Explicit option to stop or leave" },
          { value: "confidentiality", label: "Clarity about confidentiality" },
          { value: "clinician_disclosure", label: "Some clinician self-disclosure" },
          { value: "nothing_specific", label: "Nothing specific needed" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "st5",
        text: "Is there anything you need to know about the clinician or setting before engaging?",
        type: "multi",
        maxSelections: 4,
        options: [
          { value: "approach", label: "Their therapeutic approach" },
          { value: "experience", label: "Their experience with people like me" },
          { value: "values", label: "Their values or stance on key issues" },
          { value: "reporting", label: "What they are required to report" },
          { value: "access", label: "Physical accessibility of space" },
          { value: "nothing", label: "Nothing specific" },
          { value: null, label: "I'm not sure" },
        ],
      },
    ],
  },
  {
    id: "identity_social",
    name: "Identity & Social Load",
    subtitle: "What identity-related labour is required to be here",
    group: "C",
    groupName: "Safety & Identity",
    intro: "This section recognises that dominant identities often experience reduced load through environmental alignment rather than absence of need. It's about whether being you requires extra work, vigilance, or translation in this setting.",
    outputCategory: "affirming",
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
        text: "Are there aspects of your identity that increase risk or vigilance in this type of setting?",
        type: "scale",
        options: [
          { value: 0, label: "No increased vigilance needed" },
          { value: 1, label: "Mild background awareness" },
          { value: 2, label: "Noticeable vigilance required" },
          { value: 3, label: "Significant identity-related risk awareness" },
          { value: null, label: "I'm not sure / prefer not to say" },
        ],
      },
      {
        id: "is3",
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
      {
        id: "is4",
        text: "What reduces the cost of being seen as yourself?",
        type: "multi",
        maxSelections: 4,
        options: [
          { value: "affirming_language", label: "Affirming language used" },
          { value: "no_assumptions", label: "No assumptions made about me" },
          { value: "identity_acknowledged", label: "My identity acknowledged without centering it" },
          { value: "shared_identity", label: "Clinician shares relevant identity" },
          { value: "explicit_safety", label: "Explicit safety statements" },
          { value: "nothing_specific", label: "Nothing specific needed" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "is5",
        text: "Is the clinician's identity or approach relevant to your sense of safety?",
        type: "scale",
        options: [
          { value: 0, label: "Not particularly relevant" },
          { value: 1, label: "Somewhat relevant" },
          { value: 2, label: "Quite relevant" },
          { value: 3, label: "Essential to my participation" },
          { value: null, label: "I'm not sure" },
        ],
      },
    ],
  },
  {
    id: "supports_scaffolding",
    name: "Current Supports & Scaffolding",
    subtitle: "What is currently holding you together",
    group: "D",
    groupName: "Current Supports",
    intro: "Baseline may depend on scaffolding that is often misread as 'dependence.' These questions help identify what supports are stabilising your capacity.",
    outputCategory: "supports",
    questions: [
      {
        id: "ss1",
        text: "What supports, routines, or strategies are currently stabilising your capacity?",
        type: "multi",
        maxSelections: 5,
        options: [
          { value: "routines", label: "Specific routines" },
          { value: "medication", label: "Medication" },
          { value: "substances", label: "Substances (caffeine, cannabis, alcohol, etc.)" },
          { value: "people", label: "Specific people" },
          { value: "environment", label: "Controlled environment" },
          { value: "rest_schedule", label: "Protected rest time" },
          { value: "minimal", label: "Not relying on specific supports currently" },
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
      {
        id: "ss3",
        text: "Are your current supports acknowledged or pathologised by other systems you interact with?",
        type: "scale",
        options: [
          { value: 0, label: "Generally acknowledged and respected" },
          { value: 1, label: "Mixed responses" },
          { value: 2, label: "Often questioned or pathologised" },
          { value: 3, label: "Frequently treated as problems" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "ss4",
        text: "What scaffolding might need to be in place specifically for session attendance?",
        type: "multi",
        maxSelections: 4,
        options: [
          { value: "support_person", label: "Support person present or nearby" },
          { value: "comfort_items", label: "Comfort items available" },
          { value: "exit_plan", label: "Clear exit plan" },
          { value: "post_support", label: "Post-session support arranged" },
          { value: "communication", label: "Specific communication methods" },
          { value: "none", label: "No specific scaffolding needed" },
          { value: null, label: "I'm not sure" },
        ],
      },
    ],
  },
  {
    id: "baseline_depletion",
    name: "Baseline Depletion",
    subtitle: "How much capacity is already spent before arrival",
    group: "E",
    groupName: "Arriving & Leaving State",
    intro: "Baseline cannot be assessed without accounting for prior expenditure. These questions help understand what you've already navigated before arrival.",
    outputCategory: "arriving",
    questions: [
      {
        id: "bd1",
        text: "What have you typically already navigated on a session day before arrival?",
        type: "multi",
        maxSelections: 5,
        options: [
          { value: "work", label: "Work demands" },
          { value: "parenting", label: "Parenting/caregiving" },
          { value: "admin", label: "Administrative tasks" },
          { value: "travel", label: "Travel/commuting" },
          { value: "health", label: "Health management" },
          { value: "social", label: "Social demands" },
          { value: "minimal", label: "Usually not much before sessions" },
          { value: null, label: "It varies too much to say" },
        ],
      },
      {
        id: "bd2",
        text: "Are you likely to arrive regulated, stretched, or depleted?",
        type: "scale",
        options: [
          { value: 0, label: "Usually regulated" },
          { value: 1, label: "Usually slightly stretched" },
          { value: 2, label: "Usually noticeably stretched" },
          { value: 3, label: "Usually already depleted" },
          { value: null, label: "I'm not sure / it varies" },
        ],
      },
      {
        id: "bd3",
        text: "Is the expectation to 'start fresh' realistic for you?",
        type: "scale",
        options: [
          { value: 0, label: "Yes, I can usually reset" },
          { value: 1, label: "Sometimes possible" },
          { value: 2, label: "Rarely possible" },
          { value: 3, label: "Almost never possible" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "bd4",
        text: "What could reduce your pre-session expenditure?",
        type: "multi",
        maxSelections: 4,
        options: [
          { value: "timing", label: "Different session timing" },
          { value: "location", label: "Different location / online option" },
          { value: "less_travel", label: "Reduced travel requirements" },
          { value: "admin_support", label: "Administrative support" },
          { value: "buffer_time", label: "Buffer time before session" },
          { value: "nothing", label: "Not much would change it" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "bd5",
        text: "Based on your arriving state, when should sessions ideally occur?",
        type: "scale",
        options: [
          { value: 0, label: "First thing, before other demands" },
          { value: 1, label: "Mid-morning after settling" },
          { value: 2, label: "Midday when most alert" },
          { value: 3, label: "Later in day when demands have passed" },
          { value: null, label: "I'm not sure / it varies" },
        ],
        noLoadScore: true,
      },
    ],
  },
  {
    id: "external_demands",
    name: "External Relational & Care Demands",
    subtitle: "What else is drawing on your capacity",
    group: "E",
    groupName: "Arriving & Leaving State",
    intro: "Capacity is finite and relationally distributed. These questions help identify what else is pulling on you before, during, or after attendance.",
    outputCategory: "availability",
    questions: [
      {
        id: "ed1",
        text: "Are there caregiving obligations that affect your availability or attention?",
        type: "scale",
        options: [
          { value: 0, label: "No caregiving obligations" },
          { value: 1, label: "Some obligations but manageable" },
          { value: 2, label: "Significant obligations affecting availability" },
          { value: 3, label: "Caregiving dominates my capacity" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "ed2",
        text: "Is your attention likely to be divided by responsibility or worry during sessions?",
        type: "scale",
        options: [
          { value: 0, label: "I can usually be fully present" },
          { value: 1, label: "Occasionally divided" },
          { value: 2, label: "Often divided" },
          { value: 3, label: "Almost always divided" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "ed3",
        text: "What demands cannot be paused while you attend?",
        type: "multi",
        maxSelections: 4,
        options: [
          { value: "phone_available", label: "Need to be contactable" },
          { value: "childcare", label: "Childcare time limits" },
          { value: "work", label: "Work obligations" },
          { value: "health", label: "Health monitoring" },
          { value: "other_dependent", label: "Other dependent needs" },
          { value: "none", label: "Nothing that can't pause" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "ed4",
        text: "Is there someone else whose capacity is affected by you attending?",
        type: "scale",
        options: [
          { value: 0, label: "No one else significantly affected" },
          { value: 1, label: "Minor impact on others" },
          { value: 2, label: "Noticeable impact on others" },
          { value: 3, label: "Significant strain on others" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "ed5",
        text: "What relational support exists for you attending?",
        type: "scale",
        options: [
          { value: 0, label: "Strong support from others" },
          { value: 1, label: "Some support" },
          { value: 2, label: "Limited support" },
          { value: 3, label: "No support or active resistance" },
          { value: null, label: "I'm not sure" },
        ],
      },
    ],
  },
  {
    id: "recovery_capacity",
    name: "Recovery Capacity",
    subtitle: "What participation costs after it ends",
    group: "E",
    groupName: "Arriving & Leaving State",
    intro: "True access includes survivable aftermath. These questions help identify what you need after sessions.",
    outputCategory: "recovery",
    questions: [
      {
        id: "rc1",
        text: "How long does it typically take you to return to baseline after engagement like this?",
        type: "scale",
        options: [
          { value: 0, label: "Minutes to an hour" },
          { value: 1, label: "Several hours" },
          { value: 2, label: "Rest of the day" },
          { value: 3, label: "More than a day" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "rc2",
        text: "Is your recovery passive (rest) or active (specific rituals, movement, solitude)?",
        type: "multi",
        maxSelections: 3,
        options: [
          { value: "rest", label: "Passive rest" },
          { value: "solitude", label: "Solitude" },
          { value: "movement", label: "Movement" },
          { value: "sensory", label: "Sensory regulation activities" },
          { value: "social", label: "Social connection" },
          { value: "distraction", label: "Distraction / special interest" },
          { value: "minimal", label: "I don't need specific recovery" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "rc3",
        text: "What happens if recovery time is not available?",
        type: "scale",
        options: [
          { value: 0, label: "I can push through without major impact" },
          { value: 1, label: "I function but feel it later" },
          { value: 2, label: "Significant capacity reduction follows" },
          { value: 3, label: "Risk of crash, shutdown, or crisis" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "rc4",
        text: "Is there protected time after sessions, or immediate return to demands?",
        type: "scale",
        options: [
          { value: 0, label: "Protected time available" },
          { value: 1, label: "Some buffer usually possible" },
          { value: 2, label: "Limited buffer" },
          { value: 3, label: "Immediate return to demands" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "rc5",
        text: "What would make recovery more possible?",
        type: "multi",
        maxSelections: 4,
        options: [
          { value: "earlier_sessions", label: "Earlier session times" },
          { value: "later_sessions", label: "Later session times" },
          { value: "shorter_sessions", label: "Shorter sessions" },
          { value: "less_frequent", label: "Less frequent sessions" },
          { value: "online", label: "Online option (less travel recovery)" },
          { value: "nothing", label: "Recovery needs are already met" },
          { value: null, label: "I'm not sure" },
        ],
      },
    ],
  },
  {
    id: "timing_readiness",
    name: "Timing, Readiness & System Fit",
    subtitle: "Is this the right time — and if not, what needs to shift in the system",
    group: "F",
    groupName: "Readiness & Direction",
    intro: "Readiness is contextual, not personal. This section helps identify whether baseline conditions are achievable right now, and what would need to change if not.",
    outputCategory: "readiness",
    questions: [
      {
        id: "tr1",
        text: "Are baseline conditions achievable with current resources?",
        type: "scale",
        options: [
          { value: 0, label: "Yes, conditions can be met" },
          { value: 1, label: "Mostly, with some accommodations" },
          { value: 2, label: "Partially, significant gaps remain" },
          { value: 3, label: "No, major barriers exist" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "tr2",
        text: "What changes would make engagement equitable right now?",
        type: "multi",
        maxSelections: 5,
        options: [
          { value: "timing", label: "Different timing" },
          { value: "location", label: "Different location or modality" },
          { value: "duration", label: "Different session duration" },
          { value: "frequency", label: "Different frequency" },
          { value: "environment", label: "Environmental adjustments" },
          { value: "communication", label: "Communication adjustments" },
          { value: "support", label: "Additional support" },
          { value: "financial", label: "Financial support" },
          { value: "nothing", label: "Current setup works" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "tr3",
        text: "Is postponement, pacing, or modification more therapeutically and ethically appropriate than pushing through?",
        type: "scale",
        options: [
          { value: 0, label: "No, I'm ready to engage as planned" },
          { value: 1, label: "Some modification would help" },
          { value: 2, label: "Significant modification needed" },
          { value: 3, label: "Postponement may be more appropriate right now" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "tr4",
        text: "What is the cost of not engaging vs. engaging without baseline?",
        type: "scale",
        options: [
          { value: 0, label: "Engaging now is clearly beneficial" },
          { value: 1, label: "Engaging is beneficial but timing isn't ideal" },
          { value: 2, label: "Costs and benefits are roughly equal" },
          { value: 3, label: "Engaging without baseline may cause more harm" },
          { value: null, label: "I'm not sure" },
        ],
      },
      {
        id: "tr5",
        text: "If not now, what would need to change?",
        type: "multi",
        maxSelections: 4,
        options: [
          { value: "life_circumstances", label: "Life circumstances" },
          { value: "health", label: "Health status" },
          { value: "support_systems", label: "Support systems" },
          { value: "financial", label: "Financial situation" },
          { value: "service_changes", label: "Changes to the service/setting" },
          { value: "nothing", label: "Now is the right time" },
          { value: null, label: "I'm not sure" },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════
const calculateSectionLoad = (answers, sectionId) => {
  const section = SECTIONS.find(s => s.id === sectionId);
  if (!section) return { level: "unknown", percentage: 0 };
  
  let totalScore = 0;
  let scorableQuestions = 0;
  let answeredQuestions = 0;
  
  section.questions.forEach(q => {
    if (q.type === "multi" || q.noLoadScore) return;
    scorableQuestions++;
    
    const answer = answers[q.id];
    if (answer === undefined || answer === null) return;
    
    answeredQuestions++;
    totalScore += answer;
  });
  
  const maxPossible = scorableQuestions * 3;
  const percentage = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
  
  let level, label;
  if (percentage <= 25) {
    level = "low";
    label = "Low barriers";
  } else if (percentage <= 50) {
    level = "moderate";
    label = "Moderate barriers";
  } else if (percentage <= 75) {
    level = "elevated";
    label = "Elevated barriers";
  } else {
    level = "high";
    label = "High barriers";
  }
  
  return { level, label, percentage, answeredQuestions, totalQuestions: scorableQuestions };
};

const getReadinessFlag = (answers) => {
  // Calculate overall barriers across key sections
  const keySections = ["structural_practical", "baseline_depletion", "recovery_capacity", "timing_readiness"];
  let totalPercentage = 0;
  let count = 0;
  
  keySections.forEach(sectionId => {
    const result = calculateSectionLoad(answers, sectionId);
    if (result.answeredQuestions > 0) {
      totalPercentage += result.percentage;
      count++;
    }
  });
  
  const avgPercentage = count > 0 ? totalPercentage / count : 0;
  
  // Check specific high-risk answers
  const highRiskFlags = [
    answers["tr1"] === 3, // Major barriers exist
    answers["tr3"] === 3, // Postponement may be appropriate
    answers["tr4"] === 3, // Engaging may cause more harm
    answers["rc3"] === 3, // Risk of crash without recovery
  ].filter(Boolean).length;
  
  if (highRiskFlags >= 2 || avgPercentage > 70) {
    return {
      flag: "not_ready",
      symbol: "🛑",
      label: "Baseline not currently achievable",
      description: "Significant system adjustments needed before equitable engagement is possible.",
      color: TOKENS.flagNotReady,
      bg: TOKENS.flagNotReadyBg,
    };
  } else if (highRiskFlags >= 1 || avgPercentage > 45) {
    return {
      flag: "caution",
      symbol: "⚠️",
      label: "Baseline achievable with significant adjustment",
      description: "Engagement possible but requires careful accommodation planning.",
      color: TOKENS.flagCaution,
      bg: TOKENS.flagCautionBg,
    };
  } else {
    return {
      flag: "ready",
      symbol: "✅",
      label: "Baseline achievable with accommodations",
      description: "Standard accommodations should support equitable participation.",
      color: TOKENS.flagReady,
      bg: TOKENS.flagReadyBg,
    };
  }
};

const getCapacityAllocation = (answers) => {
  // Calculate capacity consumed by access demands across all relevant sections
  // Pre-arrival cost (Sections 4, 8)
  // In-session regulatory load (Sections 1-6)
  // Post-session recovery debt (Section 10)
  
  const accessSections = [
    "processing_communication",
    "body_energy", 
    "sensory_environmental",
    "structural_practical",
    "safety_trust",
    "identity_social",
    "baseline_depletion",
    "external_demands",
    "recovery_capacity"
  ];
  
  let totalPercentage = 0;
  let count = 0;
  
  accessSections.forEach(sectionId => {
    const result = calculateSectionLoad(answers, sectionId);
    if (result.answeredQuestions > 0) {
      totalPercentage += result.percentage;
      count++;
    }
  });
  
  const avgLoad = count > 0 ? totalPercentage / count : 0;
  
  // Check specific capacity-consuming indicators
  const capacityDrains = [
    answers["bd2"] >= 2, // Arriving stretched or depleted
    answers["bd3"] >= 2, // Cannot "start fresh"
    answers["rc1"] >= 2, // Recovery takes rest of day or more
    answers["rc3"] >= 2, // Risk of crash without recovery
    answers["rc4"] >= 2, // Limited or no buffer after sessions
    answers["is1"] >= 2, // Often or constantly masking
    answers["ed2"] >= 2, // Attention often or always divided
  ].filter(Boolean).length;
  
  if (capacityDrains >= 4 || avgLoad > 60) {
    return {
      band: "red",
      symbol: "🔴",
      label: "Red — Learning not reliably possible",
      shortLabel: "Red",
      description: "Majority of capacity consumed by access and survival. What can be assessed: endurance, compliance, masking.",
      implication: "Under these conditions, assessment measures capacity to override limits, not counselling skill or learning.",
      color: TOKENS.statusHigh,
      bg: TOKENS.statusHighBg,
    };
  } else if (capacityDrains >= 2 || avgLoad > 35) {
    return {
      band: "amber",
      symbol: "🟡",
      label: "Amber — Learning partially compromised",
      shortLabel: "Amber",
      description: "Significant capacity diverted to access and regulation. What can be assessed: partial skill use, reduced learning.",
      implication: "Learning and therapeutic work possible but may be inconsistent or require additional support.",
      color: TOKENS.statusMid,
      bg: TOKENS.statusMidBg,
    };
  } else {
    return {
      band: "green",
      symbol: "🟢",
      label: "Green — Learning capacity available",
      shortLabel: "Green",
      description: "Majority of capacity available for learning and therapy. What can be assessed: counselling skills, reflection, integration.",
      implication: "Conditions support valid assessment of skill and learning.",
      color: TOKENS.statusLow,
      bg: TOKENS.statusLowBg,
    };
  }
};

const generateAccommodationsPlan = (answers) => {
  const plan = {
    environment: [],
    sessionFormat: [],
    timing: [],
    preSession: [],
    postSession: [],
    supports: [],
    flags: [],
  };
  
  // Environment accommodations
  if (answers["se1"] >= 2) plan.environment.push("Adjustable or natural lighting");
  if (answers["se2"] >= 2) plan.environment.push("Quiet space / noise management");
  if (answers["se3"] >= 2) plan.environment.push("Temperature control / scent-free environment");
  if (answers["se5"] >= 2) plan.environment.push("Minimise waiting room time or provide alternative");
  
  const envFeatures = answers["se4"] || [];
  if (envFeatures.includes("fluorescent")) plan.environment.push("No fluorescent lighting");
  if (envFeatures.includes("clutter")) plan.environment.push("Visually calm space");
  if (envFeatures.includes("strong_scents")) plan.environment.push("Scent-free environment");
  
  // Session format
  if (answers["pc2"] >= 2) plan.sessionFormat.push("Built-in processing pauses");
  if (answers["pc5"] >= 2) plan.sessionFormat.push("Clinician awareness of expressive differences");
  
  const commSupports = answers["pc4"] || [];
  if (commSupports.includes("notes")) plan.sessionFormat.push("Written notes or summaries provided");
  if (commSupports.includes("recording")) plan.sessionFormat.push("Permission to record sessions");
  if (commSupports.includes("agenda")) plan.sessionFormat.push("Agenda provided beforehand");
  if (commSupports.includes("pauses")) plan.sessionFormat.push("Explicit pauses built in");
  
  const positionNeeds = answers["be5"] || [];
  if (positionNeeds.includes("movement") || positionNeeds.includes("breaks")) {
    plan.sessionFormat.push("Movement breaks permitted");
  }
  if (positionNeeds.includes("fidget")) plan.sessionFormat.push("Fidget tools available");
  
  // Timing
  if (answers["be4"] === 3) plan.timing.push("Maximum 30 minute sessions");
  else if (answers["be4"] === 2) plan.timing.push("Maximum 50 minute sessions");
  
  const timePreference = answers["be2"];
  if (timePreference === 0) plan.timing.push("Morning sessions preferred");
  else if (timePreference === 1) plan.timing.push("Midday sessions preferred");
  else if (timePreference === 2) plan.timing.push("Afternoon sessions preferred");
  else if (timePreference === 3) plan.timing.push("Evening sessions preferred");
  
  if (answers["se6"] === 2) plan.timing.push("Online modality preferred");
  else if (answers["se6"] === 0) plan.timing.push("In-person modality preferred");
  
  // Pre-session
  const preNeeds = answers["be3"] || [];
  if (preNeeds.includes("food")) plan.preSession.push("Ensure client has eaten");
  if (preNeeds.includes("medication")) plan.preSession.push("Account for medication timing");
  if (preNeeds.includes("movement")) plan.preSession.push("Movement opportunity before session");
  
  const reducePreCost = answers["bd4"] || [];
  if (reducePreCost.includes("buffer_time")) plan.preSession.push("Buffer time before session");
  
  const scaffolding = answers["ss4"] || [];
  if (scaffolding.includes("support_person")) plan.preSession.push("Support person available");
  if (scaffolding.includes("comfort_items")) plan.preSession.push("Comfort items permitted");
  
  // Post-session
  if (answers["rc1"] >= 2) plan.postSession.push("Extended recovery time needed (rest of day or more)");
  if (answers["rc3"] >= 2) plan.postSession.push("CRITICAL: Recovery time must be protected");
  if (answers["rc4"] >= 2) plan.postSession.push("Schedule buffer after sessions");
  
  const recoveryNeeds = answers["rc2"] || [];
  if (recoveryNeeds.includes("solitude")) plan.postSession.push("Solitude needed after session");
  if (recoveryNeeds.includes("movement")) plan.postSession.push("Movement/physical activity after session");
  
  // Supports
  if (answers["sp3"] >= 2) plan.supports.push("Financial support / funding assistance");
  if (answers["sp4"] >= 2) plan.supports.push("Childcare/dependent care coordination");
  if (answers["sp5"] >= 2) plan.supports.push("Administrative support");
  
  // Safety flags
  if (answers["st1"] >= 2) plan.flags.push("Past experiences affect trust — pace relationship carefully");
  if (answers["st2"] >= 2) plan.flags.push("Fear of judgement present — explicit safety statements needed");
  if (answers["is3"] >= 2) plan.flags.push("Previous negative service experiences — trauma-informed approach essential");
  
  return plan;
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const GeodeBackground = () => (
  <div style={{
    position: "fixed",
    inset: 0,
    zIndex: 0,
    overflow: "hidden",
    background: `
      radial-gradient(ellipse at 20% 80%, ${TOKENS.purpleGlow} 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, ${TOKENS.goldGlow} 0%, transparent 40%),
      radial-gradient(ellipse at 50% 50%, rgba(45,31,61,0.3) 0%, transparent 60%),
      ${TOKENS.bgDeep}
    `,
  }} />
);

const ProgressBar = ({ current, total }) => (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "3px",
    background: TOKENS.bgCard,
    zIndex: 100,
  }}>
    <div style={{
      height: "100%",
      width: `${(current / total) * 100}%`,
      background: `linear-gradient(90deg, ${TOKENS.gold}, ${TOKENS.goldLight})`,
      transition: "width 0.3s ease",
    }} />
  </div>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: TOKENS.bgCard,
    borderRadius: "16px",
    border: `1px solid ${TOKENS.goldDim}`,
    padding: "2rem",
    backdropFilter: "blur(20px)",
    ...style,
  }}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", disabled = false, style = {} }) => {
  const baseStyle = {
    padding: "1rem 2rem",
    borderRadius: "12px",
    fontSize: "1.25rem",
    fontWeight: "600",
    fontFamily: TOKENS.fontSerif,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    border: "none",
    opacity: disabled ? 0.5 : 1,
  };
  
  const variants = {
    primary: {
      background: TOKENS.gold,
      color: TOKENS.bgDeep,
    },
    secondary: {
      background: "transparent",
      color: TOKENS.gold,
      border: `1px solid ${TOKENS.goldDim}`,
    },
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
};

const ScaleOption = ({ option, selected, onSelect }) => (
  <button
    onClick={() => onSelect(option.value)}
    style={{
      display: "block",
      width: "100%",
      padding: "1.1rem 1.5rem",
      marginBottom: "0.75rem",
      background: selected ? TOKENS.goldDim : TOKENS.bgInput,
      border: `1px solid ${selected ? TOKENS.gold : "transparent"}`,
      borderRadius: "10px",
      color: selected ? TOKENS.gold : TOKENS.textPrimary,
      fontSize: "1.15rem",
      fontFamily: TOKENS.fontSerif,
      textAlign: "left",
      cursor: "pointer",
      transition: "all 0.15s ease",
    }}
  >
    {option.label}
  </button>
);

const MultiOption = ({ option, selected, onToggle, disabled }) => (
  <button
    onClick={() => !disabled && onToggle(option.value)}
    disabled={disabled && !selected}
    style={{
      display: "inline-block",
      padding: "0.8rem 1.2rem",
      margin: "0.35rem",
      background: selected ? TOKENS.goldDim : TOKENS.bgInput,
      border: `1px solid ${selected ? TOKENS.gold : "transparent"}`,
      borderRadius: "8px",
      color: selected ? TOKENS.gold : (disabled ? TOKENS.textMuted : TOKENS.textPrimary),
      fontSize: "1.05rem",
      fontFamily: TOKENS.fontSerif,
      cursor: disabled && !selected ? "not-allowed" : "pointer",
      transition: "all 0.15s ease",
      opacity: disabled && !selected ? 0.5 : 1,
    }}
  >
    {option.label}
  </button>
);

const DESIGN_PRINCIPLES = [
  {
    title: "Engagement Is a Precondition for Ethical Practice",
    principle: "Ethical counselling and learning require that engagement itself be possible without harm. Counselling skills, reflection, and learning cannot be validly assessed or delivered unless baseline conditions for participation are present.",
    harm: "When engagement is assumed rather than assessed, individuals may be required to participate while dysregulated, unsafe, or depleted. This results in performative compliance rather than therapeutic or educational engagement, and can lead to shutdown, dissociation, or long-term avoidance of services.",
  },
  {
    title: "Harm Often Occurs Through Process, Not Intent",
    principle: "This ledger recognises that harm frequently occurs through unexamined process demands, even when practitioners have good intentions and apply standard skills competently.",
    harm: "Standardised formats (e.g. fixed session lengths, group participation, rapid verbal processing, sustained eye contact, public reflection, intensive schedules) can cause injury through cumulative sensory overload, cultural misattunement, power imbalance, or forced self-override. This harm is often invisible in the moment and misattributed to \"resistance\" or \"lack of engagement.\"",
  },
  {
    title: "Cultural Humility Is Foundational, Not Additive",
    principle: "Cultural humility is treated as a baseline counselling competency, not a specialist add-on. This includes humility in relation to neurodiversity, First Nations cultures, racialised communities, disability, trauma histories, socioeconomic context, gender, sexuality, and migration status.",
    harm: "When dominant norms are treated as neutral, culturally and structurally marginalised people are required to adapt themselves to the system. This results in masking, silence, self-suppression, and internalised blame, and can replicate historical and intergenerational harms, particularly for First Nations peoples and communities with histories of institutional trauma.",
  },
  {
    title: "No Diagnosis, Disclosure, or Self-Knowledge Is Required for Protection",
    principle: "The ledger does not require diagnostic labels, cultural disclosure, or advanced self-understanding. It focuses on functional impact and lived cost, not identity claims.",
    harm: "Systems that require people to name, justify, or explain their difference before being protected privilege those with education, language, and safety to disclose. Undiagnosed individuals, people unfamiliar with counselling frameworks, and those from cultures where self-disclosure is unsafe are left unprotected and disproportionately harmed.",
  },
  {
    title: "Equity Is Not Endurance",
    principle: "Attendance, participation, or apparent composure are not treated as evidence of readiness, learning, or wellbeing. The ledger distinguishes equitable engagement from endurance.",
    harm: "When endurance is mistaken for engagement, people who can suppress distress temporarily are rewarded, while the cost is deferred to recovery, collapse, or withdrawal. This disproportionately affects neurodivergent people, carers, people living in poverty, and those carrying cumulative trauma.",
  },
  {
    title: "Responsibility for Access Is Shared",
    principle: "Responsibility for equitable access is shared between the individual, the practitioner, and the system. The ledger explicitly differentiates between individual cost, reasonable accommodation, and system limits.",
    harm: "When access is framed as an individual responsibility, people are blamed for struggling in environments not designed for them. This reinforces power imbalance and discourages honest disclosure of difficulty, increasing risk of harm and disengagement.",
  },
  {
    title: "Ethical \"Not Yet\" Is Competent Practice",
    principle: "A determination that baseline conditions are not currently achievable is recognised as a valid and ethical outcome, not a failure of motivation, resilience, or professionalism.",
    harm: "Forcing engagement when conditions are unsafe prioritises compliance over care. This can retraumatise individuals, particularly First Nations peoples and others with histories of coercive institutions, and undermines trust in counselling and education systems.",
  },
  {
    title: "Assessment Must Measure the Intended Construct",
    principle: "Where used in educational or evaluative contexts, the ledger protects assessment validity by ensuring that counselling skills and learning are evaluated only when sufficient capacity is available.",
    harm: "When assessment proceeds under conditions of high access-related deficit, what is measured is the ability to override limits, not counselling skill or learning. This produces inequitable outcomes and systematically disadvantages those whose capacity is consumed by survival or access demands.",
  },
  {
    title: "Capacity Allocation Is Central",
    principle: "The ledger prioritises capacity allocation over symptom presentation or behavioural performance.",
    harm: "Ignoring capacity allocation leads to misinterpretation of silence, fatigue, emotional blunting, or withdrawal as personal deficits rather than indicators of overload. This results in inappropriate intervention and increased harm.",
  },
  {
    title: "Harm Reduction Is a Professional Obligation",
    principle: "Understanding and preventing harm caused by standard practices is a core professional responsibility. This includes harm experienced by autistic people, First Nations peoples, people with disabilities, and others marginalised by dominant systems.",
    harm: "When harm is minimised or normalised as \"part of the process,\" individuals learn that their safety is secondary to institutional requirements. This perpetuates mistrust, disengagement, and long-term damage.",
  },
];

const ACA_ALIGNMENTS = [
  {
    principle: "Engagement before intervention",
    designPrinciple: "Engagement Is a Precondition for Ethical Practice",
    sections: ["3.0(a) – Helping relationship must be for the benefit and safety of the client", "6.1(i) – Counsellors must take all reasonable steps to ensure the client does not suffer physical, emotional, or psychological harm", "13.3(i) – Contracting must occur before the client incurs any commitment"],
    rationale: "If engagement conditions are not assessed before attendance, clients may be exposed to foreseeable harm as an outcome of counselling sessions, which is explicitly prohibited under 6.1(i). This ledger is a pre-contracting harm assessment, not an add-on.",
  },
  {
    principle: "Harm occurs through process, not just misconduct",
    designPrinciple: "Process Can Cause Harm",
    sections: ["6.1(i) – Harm includes outcomes of counselling, not just in-session behaviour", "17.0(b) – Failure to provide an appropriate counselling environment may constitute an ethical breach"],
    rationale: "The Code explicitly recognises that environmental and emotional factors can cause harm. This ledger is the mechanism by which those factors are actually assessed.",
  },
  {
    principle: "Cultural humility as baseline competence",
    designPrinciple: "Cultural Humility Is Foundational",
    sections: ["8.1 – Client respect and sensitivity to cultural context and worldview", "8.3(i) – Counsellors must address problems of mutual comprehension due to culture, language, or other differences", "19.0(a) – ACA commitment to equality of access across culture, disability, class, etc."],
    rationale: "Treating neuroaffirming or First Nations–informed practice as \"specialist\" directly contradicts 8.1, 8.3, and 19.0. This tool embeds cultural humility before counselling begins.",
  },
  {
    principle: "No diagnosis or disclosure required",
    designPrinciple: "No Diagnosis Required for Protection",
    sections: ["8.2 – Client autonomy and self-determination", "6.2(i) – Recognition of power imbalance", "19.0(a) – Recognition of invisible barriers to participation"],
    rationale: "Requiring diagnosis or self-identification before accommodation places responsibility on the client to justify protection, which conflicts with client autonomy and equity of access.",
  },
  {
    principle: "Equity ≠ endurance",
    designPrinciple: "Equity Is Not Endurance",
    sections: ["6.1(i) – Avoidance of psychological harm", "16.0(a)(iii) – Counsellors must monitor functioning and err on the side of caution when functioning is impaired"],
    rationale: "When attendance requires sustained self-override, the client is being harmed to meet the format. The Capacity Allocation Bands are a direct application of \"err on the side of caution.\"",
  },
  {
    principle: "Shared responsibility for access",
    designPrinciple: "Responsibility for Access Is Shared",
    sections: ["5.0(c) – Counsellors take responsibility for therapeutic decisions", "6.2(i) – Power imbalance must not be abused", "13.3(ii) – Clients must have a free choice whether to participate"],
    rationale: "Without explicit access analysis, \"choice\" is coerced by structural barriers. This tool restores genuine consent.",
  },
  {
    principle: "Ethical \"not yet\" as competent practice",
    designPrinciple: "Ethical \"Not Yet\" Is Competent Practice",
    sections: ["6.3(i) – Counsellors must recognise when counselling is no longer helping", "6.3(ii) – Care must be taken in breaks and endings", "16.0(a)(iv) – Recognising when referral or non-engagement is appropriate"],
    rationale: "Forcing participation despite foreseeable harm breaches duty of care. Documented postponement is explicitly supported by the Code.",
  },
  {
    principle: "Assessment validity protection",
    designPrinciple: "Assessment Must Measure the Intended Construct",
    sections: ["16.0(a)(ii) – Counsellors must monitor competence and consider feedback", "19.0(b) – Standards must be assessed and evaluated equitably"],
    rationale: "When capacity is consumed by access demands, assessment outcomes are distorted, violating equity principles.",
  },
  {
    principle: "Capacity allocation as core metric",
    designPrinciple: "Capacity Allocation Is Central",
    sections: ["6.1(i) – Harm prevention", "16.0(a)(iii) – Monitoring impairment and functioning"],
    rationale: "Misreading overload as disengagement leads to ethical misjudgement and harm.",
  },
  {
    principle: "Harm reduction as professional obligation",
    designPrinciple: "Harm Reduction Is a Professional Obligation",
    sections: ["3.0(a) – Client benefit and safety", "6.1(i) – Avoid harm", "17.0(b) – Environmental harm as ethical breach"],
    rationale: "Ignoring known harm mechanisms violates the Code's core purpose.",
  },
];

const ACAAlignmentScreen = ({ onBack }) => (
  <div style={{
    minHeight: "100vh",
    padding: "2rem",
    paddingTop: "3rem",
    position: "relative",
    zIndex: 1,
  }}>
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <Button variant="secondary" onClick={onBack} style={{ marginBottom: "2rem" }}>
        ← Back to Design Principles
      </Button>
      
      <h1 style={{
        fontSize: "2.5rem",
        fontWeight: "600",
        color: TOKENS.textPrimary,
        fontFamily: TOKENS.fontSerif,
        marginBottom: "1rem",
      }}>
        ACA Code of Ethics Alignment
      </h1>
      
      <p style={{
        fontSize: "1.2rem",
        color: TOKENS.gold,
        fontFamily: TOKENS.fontSerif,
        fontStyle: "italic",
        marginBottom: "2rem",
      }}>
        Explicit Alignment with ACA Code of Ethics and Practice (v16)
      </p>
      
      <Card style={{ marginBottom: "2rem" }}>
        <p style={{
          fontSize: "1.1rem",
          color: TOKENS.textPrimary,
          fontFamily: TOKENS.fontSerif,
          lineHeight: 1.8,
          textAlign: "center",
        }}>
          The Baseline Access & Equity Ledger <strong style={{ color: TOKENS.gold }}>operationalises</strong> the 
          ACA Code of Ethics and Practice (v16) by ensuring that counselling engagement, environments, and 
          assessments do not cause foreseeable harm or undermine client autonomy, equity of access, or assessment validity.
        </p>
      </Card>
      
      {ACA_ALIGNMENTS.map((item, index) => (
        <Card key={index} style={{ marginBottom: "1.5rem" }}>
          <h2 style={{
            fontSize: "1.3rem",
            color: TOKENS.gold,
            fontFamily: TOKENS.fontSerif,
            marginBottom: "0.5rem",
          }}>
            {index + 1}. {item.principle}
          </h2>
          
          <p style={{
            fontSize: "0.95rem",
            color: TOKENS.textMuted,
            fontFamily: TOKENS.fontMono,
            marginBottom: "1rem",
          }}>
            Design Principle: {item.designPrinciple}
          </p>
          
          <div style={{
            padding: "1rem",
            background: "rgba(78,205,196,0.1)",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}>
            <h3 style={{
              fontSize: "0.9rem",
              color: TOKENS.gold,
              fontFamily: TOKENS.fontMono,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "0.75rem",
            }}>
              ACA v16 Sections
            </h3>
            <ul style={{ 
              margin: 0, 
              paddingLeft: "1.25rem",
              color: TOKENS.textSecondary,
              fontFamily: TOKENS.fontSerif,
              fontSize: "1rem",
              lineHeight: 1.7,
            }}>
              {item.sections.map((section, i) => (
                <li key={i} style={{ marginBottom: "0.5rem" }}>{section}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 style={{
              fontSize: "0.9rem",
              color: TOKENS.textMuted,
              fontFamily: TOKENS.fontMono,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "0.5rem",
            }}>
              Why this tool is required
            </h3>
            <p style={{
              fontSize: "1.05rem",
              color: TOKENS.textPrimary,
              fontFamily: TOKENS.fontSerif,
              lineHeight: 1.7,
            }}>
              {item.rationale}
            </p>
          </div>
        </Card>
      ))}
      
      <Card style={{ marginBottom: "2rem", background: "rgba(78,205,196,0.1)" }}>
        <p style={{
          fontSize: "1.1rem",
          color: TOKENS.textPrimary,
          fontFamily: TOKENS.fontSerif,
          lineHeight: 1.8,
          textAlign: "center",
        }}>
          <strong style={{ color: TOKENS.gold }}>This tool does not ask for extra ethics.</strong><br/>
          It implements the ethics that already exist — properly.
        </p>
      </Card>
      
      <div style={{ textAlign: "center", marginTop: "2rem", marginBottom: "3rem" }}>
        <Button variant="secondary" onClick={onBack}>
          ← Back to Design Principles
        </Button>
      </div>
    </div>
  </div>
);

const DesignPrinciplesScreen = ({ onBack, onViewACA }) => (
  <div style={{
    minHeight: "100vh",
    padding: "2rem",
    paddingTop: "3rem",
    position: "relative",
    zIndex: 1,
  }}>
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <Button variant="secondary" onClick={onBack} style={{ marginBottom: "2rem" }}>
        ← Back
      </Button>
      
      <h1 style={{
        fontSize: "2.5rem",
        fontWeight: "600",
        color: TOKENS.textPrimary,
        fontFamily: TOKENS.fontSerif,
        marginBottom: "1rem",
      }}>
        Design Principles
      </h1>
      
      <p style={{
        fontSize: "1.2rem",
        color: TOKENS.gold,
        fontFamily: TOKENS.fontSerif,
        fontStyle: "italic",
        marginBottom: "2rem",
      }}>
        Baseline Access & Equity Ledger
      </p>
      
      <Card style={{ marginBottom: "2rem" }}>
        <p style={{
          fontSize: "1.15rem",
          color: TOKENS.textPrimary,
          fontFamily: TOKENS.fontSerif,
          lineHeight: 1.8,
          textAlign: "center",
          fontStyle: "italic",
        }}>
          This tool exists to ensure that counselling and learning processes do not replicate harm 
          by requiring individuals to override their bodies, cultures, or histories in order to participate.
        </p>
      </Card>
      
      {DESIGN_PRINCIPLES.map((item, index) => (
        <Card key={index} style={{ marginBottom: "1.5rem" }}>
          <h2 style={{
            fontSize: "1.3rem",
            color: TOKENS.gold,
            fontFamily: TOKENS.fontSerif,
            marginBottom: "1rem",
          }}>
            {index + 1}. {item.title}
          </h2>
          
          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{
              fontSize: "0.9rem",
              color: TOKENS.textMuted,
              fontFamily: TOKENS.fontMono,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "0.5rem",
            }}>
              Principle
            </h3>
            <p style={{
              fontSize: "1.05rem",
              color: TOKENS.textPrimary,
              fontFamily: TOKENS.fontSerif,
              lineHeight: 1.7,
            }}>
              {item.principle}
            </p>
          </div>
          
          <div style={{
            padding: "1rem",
            background: "rgba(196,64,64,0.1)",
            borderRadius: "8px",
            borderLeft: `3px solid ${TOKENS.statusHigh}`,
          }}>
            <h3 style={{
              fontSize: "0.9rem",
              color: TOKENS.statusHigh,
              fontFamily: TOKENS.fontMono,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "0.5rem",
            }}>
              Harm if ignored
            </h3>
            <p style={{
              fontSize: "1rem",
              color: TOKENS.textSecondary,
              fontFamily: TOKENS.fontSerif,
              lineHeight: 1.7,
            }}>
              {item.harm}
            </p>
          </div>
        </Card>
      ))}
      
      <Card style={{ marginBottom: "2rem", background: "rgba(78,205,196,0.1)" }}>
        <h3 style={{
          fontSize: "1.2rem",
          color: TOKENS.textPrimary,
          fontFamily: TOKENS.fontSerif,
          marginBottom: "1rem",
          textAlign: "center",
        }}>
          Professional Ethics Alignment
        </h3>
        <p style={{
          fontSize: "1rem",
          color: TOKENS.textSecondary,
          fontFamily: TOKENS.fontSerif,
          lineHeight: 1.7,
          textAlign: "center",
          marginBottom: "1rem",
        }}>
          Each design principle maps directly to specific sections of the ACA Code of Ethics and Practice (v16).
        </p>
        <div style={{ textAlign: "center" }}>
          <Button onClick={onViewACA}>
            View ACA Ethics Alignment →
          </Button>
        </div>
      </Card>
      
      <div style={{ textAlign: "center", marginTop: "2rem", marginBottom: "3rem" }}>
        <Button variant="secondary" onClick={onBack}>
          ← Back to Introduction
        </Button>
      </div>
    </div>
  </div>
);

const HowToUseScreen = ({ onBack }) => (
  <div style={{
    minHeight: "100vh",
    padding: "2rem",
    paddingTop: "3rem",
    position: "relative",
    zIndex: 1,
  }}>
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <Button variant="secondary" onClick={onBack} style={{ marginBottom: "2rem" }}>
        ← Back
      </Button>
      
      <h1 style={{
        fontSize: "2.5rem",
        fontWeight: "600",
        color: TOKENS.textPrimary,
        fontFamily: TOKENS.fontSerif,
        marginBottom: "1rem",
      }}>
        How This Tool Is Used
      </h1>
      
      <p style={{
        fontSize: "1.2rem",
        color: TOKENS.gold,
        fontFamily: TOKENS.fontSerif,
        fontStyle: "italic",
        marginBottom: "2rem",
      }}>
        Baseline Access & Equity Ledger
      </p>
      
      {/* Purpose of Use */}
      <Card style={{ marginBottom: "1.5rem" }}>
        <h2 style={{
          fontSize: "1.3rem",
          color: TOKENS.gold,
          fontFamily: TOKENS.fontSerif,
          marginBottom: "1rem",
        }}>
          Purpose of Use
        </h2>
        <p style={{
          fontSize: "1.05rem",
          color: TOKENS.textPrimary,
          fontFamily: TOKENS.fontSerif,
          lineHeight: 1.7,
          marginBottom: "1rem",
        }}>
          This tool is used <strong>before</strong> counselling engagement, assessment, or intensive participation 
          to determine whether equitable and non-harmful engagement is possible under the current conditions.
        </p>
        <p style={{
          fontSize: "1.05rem",
          color: TOKENS.textSecondary,
          fontFamily: TOKENS.fontSerif,
          lineHeight: 1.7,
          fontStyle: "italic",
        }}>
          It is not a diagnostic tool, screening tool, or measure of motivation, resilience, or readiness.
        </p>
      </Card>
      
      {/* Who Completes It */}
      <Card style={{ marginBottom: "1.5rem" }}>
        <h2 style={{
          fontSize: "1.3rem",
          color: TOKENS.gold,
          fontFamily: TOKENS.fontSerif,
          marginBottom: "1rem",
        }}>
          Who Completes It
        </h2>
        <ul style={{ 
          margin: 0, 
          paddingLeft: "1.25rem",
          color: TOKENS.textPrimary,
          fontFamily: TOKENS.fontSerif,
          fontSize: "1.05rem",
          lineHeight: 1.8,
        }}>
          <li style={{ marginBottom: "0.75rem" }}>
            The <strong>client/participant</strong> completes the self-report sections describing lived capacity and cost.
          </li>
          <li style={{ marginBottom: "0.75rem" }}>
            The <strong>clinician/facilitator</strong> completes the interpretation and decision sections.
          </li>
          <li>
            The outcome is <strong>not finalised without clinician responsibility</strong>.
          </li>
        </ul>
      </Card>
      
      {/* When It Is Used */}
      <Card style={{ marginBottom: "1.5rem" }}>
        <h2 style={{
          fontSize: "1.3rem",
          color: TOKENS.gold,
          fontFamily: TOKENS.fontSerif,
          marginBottom: "1rem",
        }}>
          When It Is Used
        </h2>
        <ul style={{ 
          margin: 0, 
          paddingLeft: "1.25rem",
          color: TOKENS.textPrimary,
          fontFamily: TOKENS.fontSerif,
          fontSize: "1.05rem",
          lineHeight: 1.8,
        }}>
          <li style={{ marginBottom: "0.5rem" }}>Prior to first counselling session (Stage 0: Access & Modality Check)</li>
          <li style={{ marginBottom: "0.5rem" }}>Prior to intensive formats (e.g. residential school, group programs)</li>
          <li style={{ marginBottom: "0.5rem" }}>When participation conditions change</li>
          <li>When harm or collapse has previously occurred</li>
        </ul>
      </Card>
      
      {/* What the Outcome Means */}
      <Card style={{ marginBottom: "1.5rem" }}>
        <h2 style={{
          fontSize: "1.3rem",
          color: TOKENS.gold,
          fontFamily: TOKENS.fontSerif,
          marginBottom: "1rem",
        }}>
          What the Outcome Means
        </h2>
        <p style={{
          fontSize: "1.05rem",
          color: TOKENS.textPrimary,
          fontFamily: TOKENS.fontSerif,
          lineHeight: 1.7,
          marginBottom: "1rem",
        }}>
          The outcome determines whether counselling or learning can be <strong>validly assessed or beneficial</strong>, 
          not whether a person is "capable".
        </p>
        
        <div style={{
          padding: "0.75rem 1rem",
          background: TOKENS.statusLowBg,
          borderLeft: `4px solid ${TOKENS.statusLow}`,
          borderRadius: "4px",
          marginBottom: "0.75rem",
        }}>
          <strong style={{ color: TOKENS.statusLow }}>🟢 GREEN:</strong>
          <span style={{ color: TOKENS.textPrimary, marginLeft: "0.5rem" }}>
            Conditions support learning and counselling skill engagement
          </span>
        </div>
        
        <div style={{
          padding: "0.75rem 1rem",
          background: TOKENS.statusMidBg,
          borderLeft: `4px solid ${TOKENS.statusMid}`,
          borderRadius: "4px",
          marginBottom: "0.75rem",
        }}>
          <strong style={{ color: TOKENS.statusMid }}>🟡 AMBER:</strong>
          <span style={{ color: TOKENS.textPrimary, marginLeft: "0.5rem" }}>
            Learning is partially compromised; modifications required
          </span>
        </div>
        
        <div style={{
          padding: "0.75rem 1rem",
          background: TOKENS.statusHighBg,
          borderLeft: `4px solid ${TOKENS.statusHigh}`,
          borderRadius: "4px",
        }}>
          <strong style={{ color: TOKENS.statusHigh }}>🔴 RED:</strong>
          <span style={{ color: TOKENS.textPrimary, marginLeft: "0.5rem" }}>
            Engagement would primarily assess endurance and self-override, not counselling skill or learning
          </span>
        </div>
      </Card>
      
      {/* What Must Happen If RED */}
      <Card style={{ 
        marginBottom: "1.5rem",
        background: "rgba(196,64,64,0.1)",
        borderColor: TOKENS.statusHigh,
      }}>
        <h2 style={{
          fontSize: "1.3rem",
          color: TOKENS.statusHigh,
          fontFamily: TOKENS.fontSerif,
          marginBottom: "1rem",
        }}>
          What Must Happen If the Outcome Is RED
        </h2>
        <p style={{
          fontSize: "1.05rem",
          color: TOKENS.textPrimary,
          fontFamily: TOKENS.fontSerif,
          lineHeight: 1.7,
          marginBottom: "1rem",
        }}>
          If baseline is not achievable:
        </p>
        <ul style={{ 
          margin: 0, 
          paddingLeft: "1.25rem",
          color: TOKENS.textPrimary,
          fontFamily: TOKENS.fontSerif,
          fontSize: "1.05rem",
          lineHeight: 1.8,
        }}>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Proceeding is ethically questionable</strong> under ACA v16 (Client Safety, Environment, Self-Determination)
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Any participation that occurs is <strong>non-equivalent</strong>
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Harm risk is <strong>documented and foreseeable</strong>
          </li>
          <li>
            <strong>Postponement, modality change, or redesign is required</strong>
          </li>
        </ul>
      </Card>
      
      {/* What This Tool Is NOT */}
      <Card style={{ marginBottom: "2rem" }}>
        <h2 style={{
          fontSize: "1.3rem",
          color: TOKENS.gold,
          fontFamily: TOKENS.fontSerif,
          marginBottom: "1rem",
        }}>
          What This Tool Is NOT
        </h2>
        <p style={{
          fontSize: "1.05rem",
          color: TOKENS.textPrimary,
          fontFamily: TOKENS.fontSerif,
          lineHeight: 1.7,
          marginBottom: "1rem",
        }}>
          This tool must <strong>not</strong> be used to:
        </p>
        <ul style={{ 
          margin: 0, 
          paddingLeft: "1.25rem",
          color: TOKENS.textSecondary,
          fontFamily: TOKENS.fontSerif,
          fontSize: "1.05rem",
          lineHeight: 1.8,
        }}>
          <li style={{ marginBottom: "0.5rem" }}>Deny services</li>
          <li style={{ marginBottom: "0.5rem" }}>Pressure disclosure or diagnosis</li>
          <li style={{ marginBottom: "0.5rem" }}>Override client consent</li>
          <li>Force participation for assessment compliance</li>
        </ul>
      </Card>
      
      <div style={{ textAlign: "center", marginTop: "2rem", marginBottom: "3rem" }}>
        <Button variant="secondary" onClick={onBack}>
          ← Back to Introduction
        </Button>
      </div>
    </div>
  </div>
);

// Forced acknowledgement gate - requires scroll + checkbox before proceeding
const AcknowledgementGateScreen = ({ onAcknowledge }) => {
  const contentRef = useRef(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const checkScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
        setScrolledToBottom(true);
      }
    };

    // Check on mount in case content doesn't need scrolling
    checkScroll();
    
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      padding: "2rem",
      paddingTop: "3rem",
      position: "relative",
      zIndex: 1,
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: "600",
          color: TOKENS.textPrimary,
          fontFamily: TOKENS.fontSerif,
          marginBottom: "1rem",
          textAlign: "center",
        }}>
          Before You Begin
        </h1>
        
        <p style={{
          fontSize: "1.1rem",
          color: TOKENS.gold,
          fontFamily: TOKENS.fontSerif,
          fontStyle: "italic",
          marginBottom: "2rem",
          textAlign: "center",
        }}>
          Please read and acknowledge the following
        </p>
        
        <Card>
          <div
            ref={contentRef}
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              paddingRight: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <h2 style={{
              fontSize: "1.3rem",
              color: TOKENS.gold,
              fontFamily: TOKENS.fontSerif,
              marginBottom: "1rem",
            }}>
              Purpose of This Tool
            </h2>
            <p style={{
              fontSize: "1.05rem",
              color: TOKENS.textPrimary,
              fontFamily: TOKENS.fontSerif,
              lineHeight: 1.7,
              marginBottom: "1rem",
            }}>
              This tool is used <strong>before</strong> counselling engagement, assessment, or intensive 
              participation to determine whether equitable and non-harmful engagement is possible 
              under the current conditions.
            </p>
            <p style={{
              fontSize: "1.05rem",
              color: TOKENS.textSecondary,
              fontFamily: TOKENS.fontSerif,
              lineHeight: 1.7,
              marginBottom: "1.5rem",
            }}>
              It is <strong>not</strong> a diagnostic tool, screening tool, or measure of motivation, 
              resilience, or readiness.
            </p>
            
            <h2 style={{
              fontSize: "1.3rem",
              color: TOKENS.gold,
              fontFamily: TOKENS.fontSerif,
              marginBottom: "1rem",
            }}>
              What the Outcome Means
            </h2>
            <p style={{
              fontSize: "1.05rem",
              color: TOKENS.textPrimary,
              fontFamily: TOKENS.fontSerif,
              lineHeight: 1.7,
              marginBottom: "1rem",
            }}>
              The outcome determines whether counselling or learning can be <strong>validly assessed 
              or beneficial</strong>, not whether a person is "capable".
            </p>
            
            <div style={{
              padding: "0.75rem 1rem",
              background: TOKENS.statusLowBg,
              borderLeft: `4px solid ${TOKENS.statusLow}`,
              borderRadius: "4px",
              marginBottom: "0.75rem",
            }}>
              <strong style={{ color: TOKENS.statusLow }}>🟢 GREEN:</strong>
              <span style={{ color: TOKENS.textPrimary, marginLeft: "0.5rem" }}>
                Conditions support learning and counselling skill engagement
              </span>
            </div>
            
            <div style={{
              padding: "0.75rem 1rem",
              background: TOKENS.statusMidBg,
              borderLeft: `4px solid ${TOKENS.statusMid}`,
              borderRadius: "4px",
              marginBottom: "0.75rem",
            }}>
              <strong style={{ color: TOKENS.statusMid }}>🟡 AMBER:</strong>
              <span style={{ color: TOKENS.textPrimary, marginLeft: "0.5rem" }}>
                Learning is partially compromised; modifications required
              </span>
            </div>
            
            <div style={{
              padding: "0.75rem 1rem",
              background: TOKENS.statusHighBg,
              borderLeft: `4px solid ${TOKENS.statusHigh}`,
              borderRadius: "4px",
              marginBottom: "1.5rem",
            }}>
              <strong style={{ color: TOKENS.statusHigh }}>🔴 RED:</strong>
              <span style={{ color: TOKENS.textPrimary, marginLeft: "0.5rem" }}>
                Engagement would primarily assess endurance and self-override, not skill or learning
              </span>
            </div>
            
            <h2 style={{
              fontSize: "1.3rem",
              color: TOKENS.statusHigh,
              fontFamily: TOKENS.fontSerif,
              marginBottom: "1rem",
            }}>
              Critical: RED Outcome Requirements
            </h2>
            <p style={{
              fontSize: "1.05rem",
              color: TOKENS.textPrimary,
              fontFamily: TOKENS.fontSerif,
              lineHeight: 1.7,
              marginBottom: "0.75rem",
            }}>
              If baseline is not achievable:
            </p>
            <ul style={{ 
              margin: 0, 
              paddingLeft: "1.25rem",
              color: TOKENS.textPrimary,
              fontFamily: TOKENS.fontSerif,
              fontSize: "1.05rem",
              lineHeight: 1.8,
              marginBottom: "1.5rem",
            }}>
              <li>Proceeding is <strong>ethically questionable</strong> under ACA v16</li>
              <li>Any participation that occurs is <strong>non-equivalent</strong></li>
              <li>Harm risk is <strong>documented and foreseeable</strong></li>
              <li><strong>Postponement, modality change, or redesign is required</strong></li>
            </ul>
            
            <h2 style={{
              fontSize: "1.3rem",
              color: TOKENS.gold,
              fontFamily: TOKENS.fontSerif,
              marginBottom: "1rem",
            }}>
              Prohibited Uses
            </h2>
            <p style={{
              fontSize: "1.05rem",
              color: TOKENS.textPrimary,
              fontFamily: TOKENS.fontSerif,
              lineHeight: 1.7,
              marginBottom: "0.75rem",
            }}>
              This tool must <strong>not</strong> be used to:
            </p>
            <ul style={{ 
              margin: 0, 
              paddingLeft: "1.25rem",
              color: TOKENS.textSecondary,
              fontFamily: TOKENS.fontSerif,
              fontSize: "1.05rem",
              lineHeight: 1.8,
            }}>
              <li>Deny services</li>
              <li>Pressure disclosure or diagnosis</li>
              <li>Override client consent</li>
              <li>Force participation for assessment compliance</li>
            </ul>
          </div>
          
          {!scrolledToBottom && (
            <p style={{
              fontSize: "0.9rem",
              color: TOKENS.textMuted,
              fontFamily: TOKENS.fontMono,
              textAlign: "center",
              marginBottom: "1rem",
            }}>
              ↓ Please scroll to read all content ↓
            </p>
          )}
          
          <div style={{
            borderTop: `1px solid ${TOKENS.goldDim}`,
            paddingTop: "1.5rem",
          }}>
            <label style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              cursor: scrolledToBottom ? "pointer" : "not-allowed",
              opacity: scrolledToBottom ? 1 : 0.5,
              marginBottom: "1.5rem",
            }}>
              <input
                type="checkbox"
                disabled={!scrolledToBottom}
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                style={{
                  width: "20px",
                  height: "20px",
                  marginTop: "2px",
                  accentColor: TOKENS.gold,
                }}
              />
              <span style={{
                fontSize: "1.05rem",
                color: TOKENS.textPrimary,
                fontFamily: TOKENS.fontSerif,
                lineHeight: 1.5,
              }}>
                I understand how this tool is intended to be used, including the ethical requirements 
                when baseline conditions are not achievable
              </span>
            </label>
            
            <div style={{ textAlign: "center" }}>
              <Button
                disabled={!acknowledged}
                onClick={onAcknowledge}
                style={{
                  opacity: acknowledged ? 1 : 0.5,
                  cursor: acknowledged ? "pointer" : "not-allowed",
                }}
              >
                Continue to Assessment →
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const IntroScreen = ({ onBegin, onViewPrinciples, onViewHowToUse }) => (
  <div style={{
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    position: "relative",
    zIndex: 1,
  }}>
    <img 
      src="/logo.png" 
      alt="Free to Be Me" 
      style={{ 
        width: "200px", 
        marginBottom: "1.5rem",
      }} 
    />
    
    <p style={{
      color: TOKENS.gold,
      fontSize: "1rem",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      marginBottom: "1rem",
      fontFamily: TOKENS.fontMono,
    }}>
      Access & Modality Check
    </p>
    
    <h1 style={{
      fontSize: "3.5rem",
      fontWeight: "600",
      color: TOKENS.textPrimary,
      fontFamily: TOKENS.fontSerif,
      marginBottom: "1rem",
      textAlign: "center",
    }}>
      What Do You Need to Arrive?
    </h1>
    
    <p style={{
      fontSize: "1.4rem",
      fontStyle: "italic",
      color: TOKENS.gold,
      fontFamily: TOKENS.fontSerif,
      marginBottom: "3rem",
      textAlign: "center",
    }}>
      Baseline Access & Equity Ledger
    </p>
    
    <Card style={{ maxWidth: "700px", marginBottom: "2rem" }}>
      <h2 style={{
        fontSize: "1.6rem",
        color: TOKENS.textPrimary,
        fontFamily: TOKENS.fontSerif,
        marginBottom: "1.5rem",
      }}>
        This happens before therapy begins.
      </h2>
      
      <p style={{
        fontSize: "1.15rem",
        color: TOKENS.textSecondary,
        lineHeight: 1.7,
        marginBottom: "1.5rem",
        fontFamily: TOKENS.fontSerif,
      }}>
        This check identifies what <strong style={{ color: TOKENS.textPrimary }}>conditions must be in place</strong> for 
        you to participate without expending disproportionate capacity compared to others — so that your first session 
        does not inadvertently become a site of harm.
      </p>
      
      <p style={{
        fontSize: "1.15rem",
        color: TOKENS.textSecondary,
        lineHeight: 1.7,
        marginBottom: "1.5rem",
        fontFamily: TOKENS.fontSerif,
      }}>
        <em style={{ color: TOKENS.gold }}>"Baseline"</em> means the equity point — where you can engage 
        without the environment, logistics, or format costing you more than it costs others.
      </p>
      
      <p style={{
        fontSize: "1.15rem",
        color: TOKENS.textSecondary,
        lineHeight: 1.7,
        marginBottom: "1.5rem",
        fontFamily: TOKENS.fontSerif,
      }}>
        This is about <strong style={{ color: TOKENS.textPrimary }}>conditions, not content</strong>. 
        We're checking access and modality feasibility — not starting therapy.
      </p>
      
      <p style={{
        fontSize: "1.15rem",
        color: TOKENS.textSecondary,
        lineHeight: 1.7,
        fontFamily: TOKENS.fontSerif,
      }}>
        There are no right or wrong answers. This is about making visible what you need — so it can be provided.
      </p>
    </Card>
    
    <Button onClick={onBegin}>
      Begin Access Check
    </Button>
    
    <p style={{
      marginTop: "1.5rem",
      color: TOKENS.textMuted,
      fontSize: "1.05rem",
      fontFamily: TOKENS.fontMono,
    }}>
      ~15-20 minutes · 11 sections · Your pace
    </p>
    
    <div style={{
      marginTop: "2rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.5rem",
    }}>
      <button
        onClick={onViewHowToUse}
        style={{
          background: "none",
          border: "none",
          color: TOKENS.gold,
          fontSize: "1rem",
          fontFamily: TOKENS.fontSerif,
          cursor: "pointer",
          textDecoration: "underline",
          padding: "0.5rem 1rem",
        }}
      >
        How This Tool Is Used →
      </button>
      <button
        onClick={onViewPrinciples}
        style={{
          background: "none",
          border: "none",
          color: TOKENS.textMuted,
          fontSize: "0.95rem",
          fontFamily: TOKENS.fontSerif,
          cursor: "pointer",
          textDecoration: "underline",
          padding: "0.5rem 1rem",
        }}
      >
        View Design Principles →
      </button>
    </div>
  </div>
);

const QuestionScreen = ({ section, question, questionIndex, totalQuestions, answer, onAnswer, onNext, onBack, sectionIndex, totalSections }) => {
  const isMulti = question.type === "multi";
  const currentAnswer = answer || (isMulti ? [] : undefined);
  const maxSelections = question.maxSelections || 3;
  
  const handleMultiToggle = (value) => {
    if (value === null) {
      onAnswer([null]);
      return;
    }
    
    let newAnswer = [...(currentAnswer || [])].filter(v => v !== null);
    
    if (newAnswer.includes(value)) {
      newAnswer = newAnswer.filter(v => v !== value);
    } else if (newAnswer.length < maxSelections) {
      newAnswer.push(value);
    }
    
    onAnswer(newAnswer.length > 0 ? newAnswer : undefined);
  };
  
  const canProceed = isMulti 
    ? (currentAnswer && currentAnswer.length > 0)
    : currentAnswer !== undefined;
  
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      padding: "2rem",
      paddingTop: "4rem",
      position: "relative",
      zIndex: 1,
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
        {/* Section header */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{
            color: TOKENS.gold,
            fontSize: "0.9rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: TOKENS.fontMono,
            marginBottom: "0.5rem",
          }}>
            Section {sectionIndex + 1} of {totalSections} · {section.name}
          </p>
          <p style={{
            color: TOKENS.textMuted,
            fontSize: "1rem",
            fontFamily: TOKENS.fontSerif,
          }}>
            {section.subtitle}
          </p>
        </div>
        
        {/* Question card */}
        <Card style={{ marginBottom: "2rem" }}>
          <p style={{
            color: TOKENS.textMuted,
            fontSize: "0.9rem",
            fontFamily: TOKENS.fontMono,
            marginBottom: "1rem",
          }}>
            Question {questionIndex + 1} of {totalQuestions}
          </p>
          
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: "500",
            color: TOKENS.textPrimary,
            fontFamily: TOKENS.fontSerif,
            marginBottom: "2rem",
            lineHeight: 1.5,
          }}>
            {question.text}
          </h2>
          
          {isMulti && (
            <p style={{
              color: TOKENS.textMuted,
              fontSize: "0.95rem",
              fontFamily: TOKENS.fontSerif,
              marginBottom: "1.5rem",
            }}>
              Select up to {maxSelections} that apply
            </p>
          )}
          
          <div>
            {isMulti ? (
              <div style={{ display: "flex", flexWrap: "wrap", margin: "-0.35rem" }}>
                {question.options.map((option, i) => (
                  <MultiOption
                    key={i}
                    option={option}
                    selected={currentAnswer?.includes(option.value)}
                    onToggle={handleMultiToggle}
                    disabled={currentAnswer?.length >= maxSelections && !currentAnswer?.includes(option.value)}
                  />
                ))}
              </div>
            ) : (
              question.options.map((option, i) => (
                <ScaleOption
                  key={i}
                  option={option}
                  selected={currentAnswer === option.value}
                  onSelect={onAnswer}
                />
              ))
            )}
          </div>
        </Card>
        
        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button variant="secondary" onClick={onBack}>
            ← Back
          </Button>
          
          <Button onClick={onNext} disabled={!canProceed}>
            Continue →
          </Button>
        </div>
      </div>
    </div>
  );
};

const SectionIntroScreen = ({ section, sectionIndex, totalSections, onContinue, onBack }) => (
  <div style={{
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    position: "relative",
    zIndex: 1,
  }}>
    <div style={{ maxWidth: "700px", textAlign: "center" }}>
      <p style={{
        color: TOKENS.gold,
        fontSize: "0.9rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        fontFamily: TOKENS.fontMono,
        marginBottom: "1rem",
      }}>
        Section {sectionIndex + 1} of {totalSections}
      </p>
      
      <h1 style={{
        fontSize: "2.5rem",
        fontWeight: "600",
        color: TOKENS.textPrimary,
        fontFamily: TOKENS.fontSerif,
        marginBottom: "0.75rem",
      }}>
        {section.name}
      </h1>
      
      <p style={{
        fontSize: "1.3rem",
        color: TOKENS.gold,
        fontFamily: TOKENS.fontSerif,
        fontStyle: "italic",
        marginBottom: "2rem",
      }}>
        {section.subtitle}
      </p>
      
      <Card style={{ textAlign: "left", marginBottom: "2rem" }}>
        <p style={{
          fontSize: "1.15rem",
          color: TOKENS.textSecondary,
          lineHeight: 1.8,
          fontFamily: TOKENS.fontSerif,
        }}>
          {section.intro}
        </p>
      </Card>
      
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        {sectionIndex > 0 && (
          <Button variant="secondary" onClick={onBack}>
            ← Previous Section
          </Button>
        )}
        <Button onClick={onContinue}>
          Continue →
        </Button>
      </div>
    </div>
  </div>
);

const ResultsScreen = ({ answers, onRestart }) => {
  const readiness = getReadinessFlag(answers);
  const capacityAllocation = getCapacityAllocation(answers);
  const plan = generateAccommodationsPlan(answers);
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div style={{
      minHeight: "100vh",
      padding: "2rem",
      paddingTop: "4rem",
      position: "relative",
      zIndex: 1,
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <img 
            src="/logo.png" 
            alt="Free to Be Me" 
            style={{ width: "150px", marginBottom: "1rem" }} 
          />
          <p style={{
            color: TOKENS.gold,
            fontSize: "0.85rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: TOKENS.fontMono,
            marginBottom: "0.5rem",
          }}>
            Access & Modality Check Complete
          </p>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "600",
            color: TOKENS.textPrimary,
            fontFamily: TOKENS.fontSerif,
            marginBottom: "0.5rem",
          }}>
            Your Baseline Access Plan
          </h1>
          <p style={{
            color: TOKENS.textMuted,
            fontSize: "1rem",
            fontFamily: TOKENS.fontMono,
          }}>
            Generated {new Date().toLocaleDateString()}
          </p>
        </div>
        
        {/* Readiness Flag */}
        <Card style={{ 
          marginBottom: "2rem",
          background: readiness.bg,
          borderColor: readiness.color,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "2.5rem" }}>{readiness.symbol}</span>
            <div>
              <h2 style={{
                fontSize: "1.5rem",
                color: readiness.color,
                fontFamily: TOKENS.fontSerif,
                marginBottom: "0.5rem",
              }}>
                {readiness.label}
              </h2>
              <p style={{
                color: TOKENS.textSecondary,
                fontSize: "1.1rem",
                fontFamily: TOKENS.fontSerif,
              }}>
                {readiness.description}
              </p>
            </div>
          </div>
        </Card>
        
        {/* Capacity Allocation at Entry */}
        <Card style={{ 
          marginBottom: "2rem",
          background: capacityAllocation.bg,
          borderColor: capacityAllocation.color,
        }}>
          <h2 style={{
            fontSize: "1.2rem",
            color: TOKENS.textPrimary,
            fontFamily: TOKENS.fontSerif,
            marginBottom: "1rem",
          }}>
            Estimated Capacity Allocation at Entry
          </h2>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <span style={{ fontSize: "2rem" }}>{capacityAllocation.symbol}</span>
            <div>
              <h3 style={{
                fontSize: "1.3rem",
                color: capacityAllocation.color,
                fontFamily: TOKENS.fontSerif,
                marginBottom: "0.5rem",
              }}>
                {capacityAllocation.label}
              </h3>
              <p style={{
                color: TOKENS.textSecondary,
                fontSize: "1rem",
                fontFamily: TOKENS.fontSerif,
                marginBottom: "0.75rem",
              }}>
                {capacityAllocation.description}
              </p>
              <p style={{
                color: TOKENS.textMuted,
                fontSize: "0.95rem",
                fontFamily: TOKENS.fontSerif,
                fontStyle: "italic",
                padding: "0.75rem",
                background: "rgba(0,0,0,0.2)",
                borderRadius: "8px",
              }}>
                {capacityAllocation.implication}
              </p>
            </div>
          </div>
        </Card>
        
        {/* Section Load Overview */}
        <Card style={{ marginBottom: "2rem" }}>
          <h2 style={{
            fontSize: "1.4rem",
            color: TOKENS.textPrimary,
            fontFamily: TOKENS.fontSerif,
            marginBottom: "1.5rem",
          }}>
            Barrier Levels by Domain
          </h2>
          
          <div style={{ display: "grid", gap: "1rem" }}>
            {SECTIONS.map(section => {
              const result = calculateSectionLoad(answers, section.id);
              const barColor = result.level === "low" ? TOKENS.statusLow :
                             result.level === "moderate" ? TOKENS.statusMid :
                             result.level === "elevated" ? TOKENS.statusMid :
                             TOKENS.statusHigh;
              
              return (
                <div key={section.id}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    marginBottom: "0.5rem",
                  }}>
                    <span style={{ 
                      color: TOKENS.textPrimary, 
                      fontSize: "1rem",
                      fontFamily: TOKENS.fontSerif,
                    }}>
                      {section.name}
                    </span>
                    <span style={{ 
                      color: barColor, 
                      fontSize: "0.9rem",
                      fontFamily: TOKENS.fontMono,
                    }}>
                      {result.label}
                    </span>
                  </div>
                  <div style={{
                    height: "8px",
                    background: TOKENS.bgInput,
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%",
                      width: `${result.percentage}%`,
                      background: barColor,
                      borderRadius: "4px",
                      transition: "width 0.3s ease",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        
        {/* Accommodations Plan */}
        <Card style={{ marginBottom: "2rem" }}>
          <h2 style={{
            fontSize: "1.4rem",
            color: TOKENS.textPrimary,
            fontFamily: TOKENS.fontSerif,
            marginBottom: "1.5rem",
          }}>
            Accommodations Checklist
          </h2>
          
          {plan.environment.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{
                color: TOKENS.gold,
                fontSize: "1.1rem",
                fontFamily: TOKENS.fontSerif,
                marginBottom: "0.75rem",
              }}>
                Environment
              </h3>
              <ul style={{ 
                listStyle: "none", 
                padding: 0,
                margin: 0,
              }}>
                {plan.environment.map((item, i) => (
                  <li key={i} style={{
                    color: TOKENS.textSecondary,
                    fontSize: "1.05rem",
                    fontFamily: TOKENS.fontSerif,
                    padding: "0.4rem 0",
                    borderBottom: `1px solid ${TOKENS.goldDim}`,
                  }}>
                    ☐ {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {plan.sessionFormat.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{
                color: TOKENS.gold,
                fontSize: "1.1rem",
                fontFamily: TOKENS.fontSerif,
                marginBottom: "0.75rem",
              }}>
                Session Format
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {plan.sessionFormat.map((item, i) => (
                  <li key={i} style={{
                    color: TOKENS.textSecondary,
                    fontSize: "1.05rem",
                    fontFamily: TOKENS.fontSerif,
                    padding: "0.4rem 0",
                    borderBottom: `1px solid ${TOKENS.goldDim}`,
                  }}>
                    ☐ {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {plan.timing.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{
                color: TOKENS.gold,
                fontSize: "1.1rem",
                fontFamily: TOKENS.fontSerif,
                marginBottom: "0.75rem",
              }}>
                Timing & Duration
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {plan.timing.map((item, i) => (
                  <li key={i} style={{
                    color: TOKENS.textSecondary,
                    fontSize: "1.05rem",
                    fontFamily: TOKENS.fontSerif,
                    padding: "0.4rem 0",
                    borderBottom: `1px solid ${TOKENS.goldDim}`,
                  }}>
                    ☐ {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {plan.preSession.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{
                color: TOKENS.gold,
                fontSize: "1.1rem",
                fontFamily: TOKENS.fontSerif,
                marginBottom: "0.75rem",
              }}>
                Pre-Session Requirements
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {plan.preSession.map((item, i) => (
                  <li key={i} style={{
                    color: TOKENS.textSecondary,
                    fontSize: "1.05rem",
                    fontFamily: TOKENS.fontSerif,
                    padding: "0.4rem 0",
                    borderBottom: `1px solid ${TOKENS.goldDim}`,
                  }}>
                    ☐ {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {plan.postSession.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{
                color: TOKENS.gold,
                fontSize: "1.1rem",
                fontFamily: TOKENS.fontSerif,
                marginBottom: "0.75rem",
              }}>
                Post-Session Requirements
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {plan.postSession.map((item, i) => (
                  <li key={i} style={{
                    color: TOKENS.textSecondary,
                    fontSize: "1.05rem",
                    fontFamily: TOKENS.fontSerif,
                    padding: "0.4rem 0",
                    borderBottom: `1px solid ${TOKENS.goldDim}`,
                  }}>
                    ☐ {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {plan.supports.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{
                color: TOKENS.gold,
                fontSize: "1.1rem",
                fontFamily: TOKENS.fontSerif,
                marginBottom: "0.75rem",
              }}>
                Additional Supports Needed
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {plan.supports.map((item, i) => (
                  <li key={i} style={{
                    color: TOKENS.textSecondary,
                    fontSize: "1.05rem",
                    fontFamily: TOKENS.fontSerif,
                    padding: "0.4rem 0",
                    borderBottom: `1px solid ${TOKENS.goldDim}`,
                  }}>
                    ☐ {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {plan.flags.length > 0 && (
            <div>
              <h3 style={{
                color: TOKENS.statusHigh,
                fontSize: "1.1rem",
                fontFamily: TOKENS.fontSerif,
                marginBottom: "0.75rem",
              }}>
                ⚠️ Clinical Flags
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {plan.flags.map((item, i) => (
                  <li key={i} style={{
                    color: TOKENS.textSecondary,
                    fontSize: "1.05rem",
                    fontFamily: TOKENS.fontSerif,
                    padding: "0.4rem 0",
                    borderBottom: `1px solid rgba(196,64,64,0.3)`,
                  }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
        
        {/* Baseline Equity Statement */}
        <Card style={{ marginBottom: "2rem" }}>
          <p style={{
            fontSize: "1.15rem",
            color: TOKENS.textSecondary,
            fontFamily: TOKENS.fontSerif,
            fontStyle: "italic",
            lineHeight: 1.8,
            textAlign: "center",
          }}>
            <strong style={{ color: TOKENS.gold }}>Baseline is reached</strong> when this person can participate 
            without expending substantially more capacity on regulation, safety, translation, or recovery 
            than others in the same environment.
          </p>
          <p style={{
            fontSize: "1rem",
            color: TOKENS.textMuted,
            fontFamily: TOKENS.fontSerif,
            lineHeight: 1.6,
            textAlign: "center",
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: `1px solid ${TOKENS.goldDim}`,
          }}>
            <strong style={{ color: TOKENS.textSecondary }}>Residual deficit</strong> refers to the remaining capacity 
            cost when all reasonable accommodations have been applied. Deficit ≠ failure. Deficit ≠ client weakness. 
            Deficit = system limit.
          </p>
          <p style={{
            fontSize: "1rem",
            color: TOKENS.textSecondary,
            fontFamily: TOKENS.fontSerif,
            lineHeight: 1.6,
            textAlign: "center",
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: `1px solid ${TOKENS.goldDim}`,
          }}>
            <strong style={{ color: TOKENS.gold }}>When the majority of available capacity is consumed by access and regulation, 
            neither counselling skill nor learning can be validly assessed;</strong> what is being measured instead is 
            the individual's capacity to override their own limits.
          </p>
        </Card>
        
        {/* Sustained Attendance Lens */}
        <Card style={{ 
          marginBottom: "2rem",
          background: TOKENS.purpleGlow,
          borderColor: "rgba(88,62,125,0.4)",
        }}>
          <h3 style={{
            fontSize: "1.1rem",
            color: TOKENS.gold,
            fontFamily: TOKENS.fontSerif,
            marginBottom: "0.75rem",
          }}>
            📋 Sustained Attendance Lens (Multi-Day / Residential Contexts)
          </h3>
          <p style={{
            fontSize: "1rem",
            color: TOKENS.textSecondary,
            fontFamily: TOKENS.fontSerif,
            lineHeight: 1.7,
          }}>
            For multi-day or intensive formats, Sections 8–10 (Baseline Depletion, External Demands, Recovery Capacity) 
            should be considered <strong style={{ color: TOKENS.textPrimary }}>cumulatively</strong> rather than per session, 
            with particular attention to recovery debt and compounding depletion.
          </p>
        </Card>
        
        {/* Practitioner Reflection */}
        <Card style={{ 
          marginBottom: "2rem",
          background: "rgba(78,205,196,0.08)",
          borderColor: TOKENS.goldDim,
        }}>
          <h3 style={{
            fontSize: "1.1rem",
            color: TOKENS.gold,
            fontFamily: TOKENS.fontSerif,
            marginBottom: "0.75rem",
          }}>
            🪞 Practitioner Reflection (Optional)
          </h3>
          <p style={{
            fontSize: "1rem",
            color: TOKENS.textSecondary,
            fontFamily: TOKENS.fontSerif,
            fontStyle: "italic",
            lineHeight: 1.7,
          }}>
            What assumptions, habits, or defaults might I bring that could increase or reduce load for this person?
          </p>
          <div style={{
            marginTop: "1rem",
            padding: "1rem",
            background: TOKENS.bgInput,
            borderRadius: "8px",
            minHeight: "80px",
          }}>
            <p style={{
              color: TOKENS.textMuted,
              fontSize: "0.9rem",
              fontFamily: TOKENS.fontMono,
            }}>
              [Space for practitioner notes]
            </p>
          </div>
        </Card>
        
        {/* Actions */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "1rem",
          marginBottom: "3rem",
        }}>
          <Button onClick={handlePrint}>
            Print / Save PDF
          </Button>
          <Button variant="secondary" onClick={onRestart}>
            Start Again
          </Button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function BaselineAccessLedger() {
  const [screen, setScreen] = useState("intro");
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSectionIntro, setShowSectionIntro] = useState(true);
  const [answers, setAnswers] = useState({});
  
  // Check localStorage for prior acknowledgement
  const [hasAcknowledged, setHasAcknowledged] = useState(() => {
    try {
      return localStorage.getItem("bae_howto_ack_v1") === "1";
    } catch {
      return false;
    }
  });
  
  const currentSection = SECTIONS[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];
  const totalQuestions = SECTIONS.reduce((sum, s) => sum + s.questions.length, 0);
  const answeredCount = Object.keys(answers).length;
  
  const handleBegin = () => {
    if (!hasAcknowledged) {
      setScreen("acknowledge");
    } else {
      setScreen("questions");
      setShowSectionIntro(true);
    }
  };
  
  const handleAcknowledge = () => {
    try {
      localStorage.setItem("bae_howto_ack_v1", "1");
    } catch {
      // localStorage unavailable, proceed anyway
    }
    setHasAcknowledged(true);
    setScreen("questions");
    setShowSectionIntro(true);
  };
  
  const handleAnswer = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSectionIndex < SECTIONS.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
      setShowSectionIntro(true);
    } else {
      setScreen("results");
    }
  };
  
  const handleBack = () => {
    if (showSectionIntro && currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentQuestionIndex(SECTIONS[currentSectionIndex - 1].questions.length - 1);
      setShowSectionIntro(false);
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentQuestionIndex(SECTIONS[currentSectionIndex - 1].questions.length - 1);
      setShowSectionIntro(false);
    } else {
      setScreen("intro");
    }
  };
  
  const handleRestart = () => {
    setScreen("intro");
    setCurrentSectionIndex(0);
    setCurrentQuestionIndex(0);
    setShowSectionIntro(true);
    setAnswers({});
  };
  
  const handleViewPrinciples = () => {
    setScreen("principles");
  };
  
  const handleBackFromPrinciples = () => {
    setScreen("intro");
  };
  
  const handleViewACA = () => {
    setScreen("aca");
  };
  
  const handleBackFromACA = () => {
    setScreen("principles");
  };
  
  const handleViewHowToUse = () => {
    setScreen("howto");
  };
  
  const handleBackFromHowToUse = () => {
    setScreen("intro");
  };
  
  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: TOKENS.fontSerif,
      color: TOKENS.textPrimary,
      position: "relative",
    }}>
      <GeodeBackground />
      
      {screen !== "intro" && screen !== "results" && screen !== "principles" && screen !== "aca" && screen !== "howto" && screen !== "acknowledge" && (
        <ProgressBar current={answeredCount} total={totalQuestions} />
      )}
      
      {screen === "intro" && (
        <IntroScreen onBegin={handleBegin} onViewPrinciples={handleViewPrinciples} onViewHowToUse={handleViewHowToUse} />
      )}
      
      {screen === "acknowledge" && (
        <AcknowledgementGateScreen onAcknowledge={handleAcknowledge} />
      )}
      
      {screen === "howto" && (
        <HowToUseScreen onBack={handleBackFromHowToUse} />
      )}
      
      {screen === "principles" && (
        <DesignPrinciplesScreen onBack={handleBackFromPrinciples} onViewACA={handleViewACA} />
      )}
      
      {screen === "aca" && (
        <ACAAlignmentScreen onBack={handleBackFromACA} />
      )}
      
      {screen === "questions" && showSectionIntro && (
        <SectionIntroScreen
          section={currentSection}
          sectionIndex={currentSectionIndex}
          totalSections={SECTIONS.length}
          onContinue={() => setShowSectionIntro(false)}
          onBack={handleBack}
        />
      )}
      
      {screen === "questions" && !showSectionIntro && (
        <QuestionScreen
          section={currentSection}
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          totalQuestions={currentSection.questions.length}
          answer={answers[currentQuestion.id]}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onBack={() => {
            if (currentQuestionIndex === 0) {
              setShowSectionIntro(true);
            } else {
              handleBack();
            }
          }}
          sectionIndex={currentSectionIndex}
          totalSections={SECTIONS.length}
        />
      )}
      
      {screen === "results" && (
        <ResultsScreen answers={answers} onRestart={handleRestart} />
      )}
    </div>
  );
}
