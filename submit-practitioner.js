// Submit practitioner review and send final results to both parties
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

// Labels for display
const ENGAGEMENT_CONTEXT_LABELS = {
  standard: 'Standard session (single, scheduled)',
  intensive: 'Intensive (multiple sessions in one day)',
  residential: 'Residential or multi-day',
  group: 'Group format',
  assessment: 'Assessment or evaluation context',
  other: 'Other'
};

const ACCOMMODATION_LABELS = {
  all: 'All or most accommodations can be implemented',
  some: 'Some accommodations can be implemented',
  few: 'Few or none can be implemented',
  not_discussed: 'Not yet discussed with client'
};

const PRESENTATION_LABELS = {
  more_depleted: 'Client appears more depleted than responses suggest',
  as_expected: 'Client presentation matches responses',
  less_depleted: 'Client appears less depleted than responses suggest',
  no_contact: 'No direct contact yet'
};

const DECISION_LABELS = {
  proceed: '✅ Proceed as planned',
  proceed_modified: '⚠️ Proceed with modifications',
  postpone: '⏸️ Postpone until conditions improve',
  refer: '🔄 Refer to alternative support',
  clarify: '❓ Clarification conversation required'
};

const CONSENT_LABELS = {
  informed_consent: 'Client has given informed consent to proceed',
  hesitation: 'Client has expressed hesitation or conditional consent',
  not_informed: 'Client has not yet been informed of conditions',
  no_consent: 'Client does not consent under current conditions',
  no_contact: 'No direct contact yet'
};

const VALIDITY_LABELS = {
  full: 'Counselling skills and reflective learning can be validly assessed',
  partial: 'Partial skill engagement (learning likely compromised)',
  containment: 'Containment/support only (learning not reliable)',
  not_assessable: 'Engagement itself is not currently assessable',
  not_assessment: 'Not an assessment context'
};

const LOAD_FACTOR_LABELS = {
  crisis: 'Recent crisis or significant life event',
  compounding: 'Compounding appointments or demands this week',
  travel: 'Travel or access burden to attend',
  carer: 'Carer or dependent responsibilities on the day',
  health_flare: 'Known health flare or symptom increase',
  none: 'None that practitioner is aware of',
  unsure: 'Unsure'
};

// Generate summary output from combined data
function generateSummary(clientResponses, practitionerData, capacityBand) {
  // Determine final band (may be overridden)
  const finalBand = practitionerData.bandOverride !== 'no' 
    ? practitionerData.bandOverride 
    : capacityBand;

  // Build accommodations list from client responses
  const accommodations = [];
  
  // Information processing accommodations
  if (clientResponses.ip4) {
    const prefs = Array.isArray(clientResponses.ip4) ? clientResponses.ip4 : [clientResponses.ip4];
    if (prefs.includes('notes')) accommodations.push('Provide written notes or summaries');
    if (prefs.includes('agenda')) accommodations.push('Share agenda/topics beforehand');
    if (prefs.includes('pause')) accommodations.push('Allow pauses to think');
    if (prefs.includes('write')) accommodations.push('Allow written responses sometimes');
    if (prefs.includes('questions_advance')) accommodations.push('Provide questions in advance');
    if (prefs.includes('clarify')) accommodations.push('Allow clarification and rephrasing');
  }

  // Processing time
  if (clientResponses.ip2 >= 2) {
    accommodations.push('Allow extended processing time');
    accommodations.push('May need to return to topics later');
  }

  // Body coping strategies
  if (clientResponses.be5) {
    const prefs = Array.isArray(clientResponses.be5) ? clientResponses.be5 : [clientResponses.be5];
    if (prefs.includes('move')) accommodations.push('Allow movement and position changes');
    if (prefs.includes('fidget')) accommodations.push('Allow fidgeting or holding objects');
    if (prefs.includes('breaks')) accommodations.push('Build in breaks');
  }

  // Stillness accommodation
  if (clientResponses.be4 >= 2) {
    accommodations.push('Movement is essential — do not require stillness');
  }

  // Session parameters
  const sessionParameters = [];
  
  // Session length
  if (clientResponses.be3 === 3) sessionParameters.push('Maximum 30 minutes');
  else if (clientResponses.be3 === 2) sessionParameters.push('Maximum 30-50 minutes');
  else if (clientResponses.be3 === 1) sessionParameters.push('Maximum 50-90 minutes');

  // Best time
  const timeLabels = ['Morning', 'Midday', 'Afternoon', 'Evening', 'Varies significantly'];
  if (clientResponses.be2 !== null && clientResponses.be2 !== undefined) {
    sessionParameters.push(`Optimal time: ${timeLabels[clientResponses.be2]}`);
  }

  // Modality
  if (clientResponses.se5 === 0) sessionParameters.push('In-person preferred');
  else if (clientResponses.se5 === 1) sessionParameters.push('Online/video preferred');
  else if (clientResponses.se5 === 2) sessionParameters.push('Modality needs may vary by day');

  // Waiting accommodation
  if (clientResponses.se4 >= 2) {
    sessionParameters.push('Minimise waiting time — drains capacity');
  }

  // Environment accommodations
  const environmentNeeds = [];
  if (clientResponses.se1 >= 2) environmentNeeds.push('lighting');
  if (clientResponses.se2 >= 2) environmentNeeds.push('sound');
  if (clientResponses.se3) {
    const sensory = Array.isArray(clientResponses.se3) ? clientResponses.se3 : [clientResponses.se3];
    if (sensory.includes('smells')) environmentNeeds.push('scents');
    if (sensory.includes('temperature')) environmentNeeds.push('temperature');
    if (sensory.includes('crowded')) environmentNeeds.push('crowding');
    if (sensory.includes('clutter')) environmentNeeds.push('visual clutter');
  }
  if (environmentNeeds.length > 0) {
    accommodations.push(`Environment considerations: ${environmentNeeds.join(', ')}`);
  }

  // Safety accommodations
  if (clientResponses.st3) {
    const safety = Array.isArray(clientResponses.st3) ? clientResponses.st3 : [clientResponses.st3];
    if (safety.includes('boundaries')) accommodations.push('State boundaries clearly upfront');
    if (safety.includes('stop')) accommodations.push('Explicitly permission to stop or pause');
    if (safety.includes('reporting')) accommodations.push('Clarify reporting obligations early');
    if (safety.includes('believed')) accommodations.push('Validation and being believed is important');
  }

  // Pre-session requirements
  const preSessionReqs = [];
  if (clientResponses.st1 >= 2) {
    preSessionReqs.push('Past experiences affect trust — proceed with care');
  }
  if (clientResponses.st2 >= 2) {
    preSessionReqs.push('Fear of consequences affects openness — address early');
  }

  // Post-session requirements
  const postSessionReqs = [];
  if (clientResponses.rc2 >= 2) {
    postSessionReqs.push('Recovery takes days — avoid back-to-back demands');
  }
  if (clientResponses.rc3 >= 2) {
    postSessionReqs.push('Insufficient recovery causes significant functional drop');
  }
  if (clientResponses.rc3 === 3) {
    postSessionReqs.push('⚠️ Crash/shutdown risk if recovery not protected');
  }

  // Capacity warnings
  const capacityWarnings = [];
  if (clientResponses.cb1 >= 2) {
    capacityWarnings.push('Current energy is very limited or exhausted');
  }
  if (clientResponses.cb2 >= 2) {
    capacityWarnings.push('Currently recovering from something significant');
  }
  if (clientResponses.cb3 >= 2) {
    capacityWarnings.push('Most/all capacity already allocated');
  }
  if (clientResponses.ll2 >= 2) {
    capacityWarnings.push('Life load is consuming significant capacity');
  }
  if (clientResponses.cs2 >= 2) {
    capacityWarnings.push('Disruption to current supports would cause significant destabilisation');
  }

  // Social/identity load
  if (clientResponses.is1 >= 2) {
    capacityWarnings.push('Masking/monitoring effort is frequent or constant');
  }
  if (clientResponses.is2 >= 2) {
    capacityWarnings.push('Sustained interaction itself is draining');
  }
  if (clientResponses.is3 >= 2) {
    capacityWarnings.push('Past negative experiences with similar services');
  }

  // Final band recommendations
  if (finalBand === 'red') {
    capacityWarnings.unshift('🔴 RED: Engagement under current conditions is ethically questionable');
    preSessionReqs.unshift('Review whether proceeding is appropriate');
  } else if (finalBand === 'amber') {
    capacityWarnings.unshift('🟡 AMBER: Learning/engagement is conditional on modifications');
    preSessionReqs.unshift('Confirm accommodations are implemented before proceeding');
  }

  // Add practitioner-identified load factors
  const additionalFactors = [];
  if (practitionerData.additionalLoadFactors && practitionerData.additionalLoadFactors.length > 0) {
    practitionerData.additionalLoadFactors.forEach(factor => {
      if (factor !== 'none' && factor !== 'unsure') {
        additionalFactors.push(LOAD_FACTOR_LABELS[factor] || factor);
      }
    });
  }

  return {
    finalCapacityBand: finalBand,
    bandOverridden: practitionerData.bandOverride !== 'no',
    overrideJustification: practitionerData.overrideJustification || null,
    accommodations,
    sessionParameters,
    preSessionRequirements: preSessionReqs,
    postSessionRequirements: postSessionReqs,
    capacityWarnings,
    additionalLoadFactors: additionalFactors,
    engagementContext: ENGAGEMENT_CONTEXT_LABELS[practitionerData.engagementContext] || practitionerData.engagementContext,
    engagementContextOther: practitionerData.engagementContextOther || null,
    accommodationFeasibility: ACCOMMODATION_LABELS[practitionerData.accommodationFeasibility] || practitionerData.accommodationFeasibility,
    clientPresentation: PRESENTATION_LABELS[practitionerData.clientPresentation] || practitionerData.clientPresentation,
    decision: practitionerData.decision,
    decisionLabel: DECISION_LABELS[practitionerData.decision] || practitionerData.decision,
    clientConsent: CONSENT_LABELS[practitionerData.clientConsent] || practitionerData.clientConsent,
    assessmentValidity: VALIDITY_LABELS[practitionerData.assessmentValidity] || practitionerData.assessmentValidity,
    reasoning: practitionerData.reasoning || null,
    practitionerName: practitionerData.practitionerName || null
  };
}

// Generate HTML for email
function generateResultsHTML(session, summary) {
  const bandColors = {
    green: '#4CAF50',
    amber: '#FFC107',
    red: '#F44336'
  };

  const bandLabels = {
    green: '🟢 GREEN — Learning Capacity Available',
    amber: '🟡 AMBER — Learning Partially Compromised',
    red: '🔴 RED — Learning Not Reliably Possible'
  };

  const bandDescriptions = {
    green: 'Conditions support engagement without disproportionate effort.',
    amber: 'Engagement is possible, but significant capacity is diverted to access or regulation. Learning depth is conditional.',
    red: 'Majority of capacity is consumed by access, regulation, or survival. Proceeding would primarily measure endurance, not learning.'
  };

  const band = summary.finalCapacityBand;

  return `
    <div style="font-family: Georgia, serif; max-width: 700px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; border-bottom: 2px solid #4ecdc4; padding-bottom: 20px; margin-bottom: 20px;">
        <h1 style="color: #1a1a2e; margin: 0;">Baseline Access & Equity Ledger</h1>
        <p style="color: #4ecdc4; margin: 10px 0 0 0; font-style: italic;">
          Assessment Results
        </p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Client</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${session.client_name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Practitioner</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${summary.practitionerName || session.practitioner_name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Engagement Context</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${summary.engagementContext}${summary.engagementContextOther ? ` (${summary.engagementContextOther})` : ''}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleDateString('en-AU')}</td>
        </tr>
      </table>
      
      <div style="background: ${bandColors[band]}22; 
                  border-left: 4px solid ${bandColors[band]}; 
                  padding: 15px; margin: 20px 0;">
        <h2 style="margin: 0 0 10px 0; color: ${bandColors[band]};">
          Capacity Allocation
        </h2>
        <p style="margin: 0; font-size: 18px;">
          <strong>${bandLabels[band]}</strong>
        </p>
        <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
          ${bandDescriptions[band]}
        </p>
        ${summary.bandOverridden ? `
          <p style="margin: 10px 0 0 0; font-size: 13px; color: #666; font-style: italic;">
            (Band overridden from preliminary assessment. Justification: ${summary.overrideJustification})
          </p>
        ` : ''}
      </div>

      <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 8px;">
        <h3 style="margin: 0 0 15px 0; color: #1a1a2e;">Practitioner Decision</h3>
        <p style="margin: 0 0 10px 0; font-size: 16px;">
          <strong>${summary.decisionLabel}</strong>
        </p>
        <table style="width: 100%; font-size: 14px; color: #666;">
          <tr>
            <td style="padding: 4px 0;"><strong>Client Consent:</strong></td>
            <td style="padding: 4px 0;">${summary.clientConsent}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Assessment Validity:</strong></td>
            <td style="padding: 4px 0;">${summary.assessmentValidity}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Accommodation Feasibility:</strong></td>
            <td style="padding: 4px 0;">${summary.accommodationFeasibility}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;"><strong>Client Presentation:</strong></td>
            <td style="padding: 4px 0;">${summary.clientPresentation}</td>
          </tr>
        </table>
        ${summary.reasoning ? `
          <p style="margin: 15px 0 0 0; font-style: italic; color: #444; border-top: 1px solid #ddd; padding-top: 15px;">
            <strong>Clinical Notes:</strong><br>
            ${summary.reasoning}
          </p>
        ` : ''}
      </div>

      ${summary.capacityWarnings.length > 0 ? `
        <div style="background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #e65100;">Capacity Warnings</h3>
          <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
            ${summary.capacityWarnings.map(w => `<li>${w}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      ${summary.additionalLoadFactors.length > 0 ? `
        <div style="background: #fce4ec; border-left: 4px solid #e91e63; padding: 15px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #880e4f;">Additional Load Factors (Practitioner-Identified)</h3>
          <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
            ${summary.additionalLoadFactors.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${summary.accommodations.length > 0 ? `
        <h3 style="color: #4ecdc4; border-bottom: 1px solid #4ecdc4; padding-bottom: 5px;">
          Accommodations & Supports
        </h3>
        <ul style="line-height: 1.8;">
          ${summary.accommodations.map(a => `<li>${a}</li>`).join('')}
        </ul>
      ` : ''}
      
      ${summary.sessionParameters.length > 0 ? `
        <h3 style="color: #4ecdc4; border-bottom: 1px solid #4ecdc4; padding-bottom: 5px;">
          Session Parameters
        </h3>
        <ul style="line-height: 1.8;">
          ${summary.sessionParameters.map(p => `<li>${p}</li>`).join('')}
        </ul>
      ` : ''}
      
      ${summary.preSessionRequirements.length > 0 ? `
        <h3 style="color: #4ecdc4; border-bottom: 1px solid #4ecdc4; padding-bottom: 5px;">
          Pre-Session Requirements
        </h3>
        <ul style="line-height: 1.8;">
          ${summary.preSessionRequirements.map(r => `<li>${r}</li>`).join('')}
        </ul>
      ` : ''}
      
      ${summary.postSessionRequirements.length > 0 ? `
        <h3 style="color: #4ecdc4; border-bottom: 1px solid #4ecdc4; padding-bottom: 5px;">
          Post-Session & Recovery Requirements
        </h3>
        <ul style="line-height: 1.8;">
          ${summary.postSessionRequirements.map(r => `<li>${r}</li>`).join('')}
        </ul>
      ` : ''}
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      
      <p style="font-size: 12px; color: #999; line-height: 1.6;">
        <strong>Assessment completed:</strong> ${new Date().toLocaleString('en-AU')}<br>
        <strong>Valid for:</strong> 90 days from assessment date<br><br>
        This document is for clinical planning purposes. It is not a diagnostic assessment.
        The Baseline Access & Equity Ledger operationalises the ACA Code of Ethics and Practice (v16) 
        to ensure counselling engagement does not cause foreseeable harm.<br><br>
        <em>If the majority of capacity is being used to tolerate the process itself, 
        engagement is not equitable and learning cannot be validly assessed.</em><br><br>
        ${session.practice_name || 'Neurodivergent Empowered'}
      </p>
    </div>
  `;
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { token, practitionerData } = JSON.parse(event.body);

    if (!token) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing token' }) 
      };
    }

    // Get session
    const { data: session, error: fetchError } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('practitioner_token', token)
      .single();

    if (fetchError || !session) {
      return { 
        statusCode: 404, 
        body: JSON.stringify({ error: 'Session not found' }) 
      };
    }

    // Generate summary
    const summary = generateSummary(
      session.client_responses, 
      practitionerData, 
      session.capacity_band
    );

    // Update session
    const { error: updateError } = await supabase
      .from('assessment_sessions')
      .update({
        practitioner_notes: practitionerData,
        summary_output: summary,
        status: 'completed',
        practitioner_completed_at: new Date().toISOString(),
        results_sent_at: new Date().toISOString()
      })
      .eq('practitioner_token', token);

    if (updateError) throw updateError;

    // Generate results HTML
    const resultsHTML = generateResultsHTML(session, summary);

    // Send to both parties
    const emailPromises = [
      // Send to client
      resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: session.client_email,
        subject: `Your Access Assessment Results - ${session.practice_name || 'Neurodivergent Empowered'}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <p style="font-size: 16px; line-height: 1.6;">
              Hi ${session.client_name},
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              Your Baseline Access & Equity Ledger has been reviewed. 
              Please find your results below.
            </p>
          </div>
          ${resultsHTML}
        `
      }),
      // Send to practitioner
      resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: session.practitioner_email,
        subject: `Assessment Complete - ${session.client_name} - Final Results`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <p style="font-size: 16px; line-height: 1.6;">
              Assessment for <strong>${session.client_name}</strong> has been completed 
              and results have been sent to both parties.
            </p>
            <p style="font-size: 14px; color: #666;">
              A copy is included below for your records.
            </p>
          </div>
          ${resultsHTML}
        `
      })
    ];

    await Promise.all(emailPromises);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: true,
        summary,
        message: 'Assessment complete. Results sent to both parties.' 
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to complete assessment' })
    };
  }
}
