// Submit practitioner review and send final results to both parties
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate summary output from combined data
function generateSummary(clientResponses, practitionerNotes, capacityBand) {
  const accommodations = [];
  const sessionParameters = [];
  const preSessionReqs = [];
  const postSessionReqs = [];

  // Processing accommodations
  if (clientResponses.processing_1) {
    const prefs = Array.isArray(clientResponses.processing_1) 
      ? clientResponses.processing_1 
      : [clientResponses.processing_1];
    if (prefs.includes(0)) accommodations.push('Provide verbal explanations');
    if (prefs.includes(1)) accommodations.push('Provide written materials');
    if (prefs.includes(2)) accommodations.push('Use visual diagrams');
    if (prefs.includes(3)) accommodations.push('Include demonstrations');
  }

  // Processing time
  if (clientResponses.processing_2 >= 2) {
    accommodations.push('Allow extended processing time');
    accommodations.push('Pause between topics for integration');
  }

  // Sensory accommodations
  if (clientResponses.sensory_1) {
    const sensory = Array.isArray(clientResponses.sensory_1) 
      ? clientResponses.sensory_1 
      : [clientResponses.sensory_1];
    if (sensory.includes(0)) accommodations.push('Reduce lighting intensity');
    if (sensory.includes(1)) accommodations.push('Minimise background noise');
    if (sensory.includes(2)) accommodations.push('Allow sensory tools/fidgets');
    if (sensory.includes(3)) accommodations.push('Offer temperature control options');
  }

  // Energy/timing
  if (clientResponses.body_energy_1 !== undefined) {
    const bestTime = ['Morning', 'Midday', 'Afternoon', 'Evening'][clientResponses.body_energy_1];
    if (bestTime) sessionParameters.push(`Preferred session time: ${bestTime}`);
  }

  if (clientResponses.body_energy_2 >= 2) {
    sessionParameters.push('Shorter session duration recommended');
    sessionParameters.push('Build in movement/stretch breaks');
  }

  // Recovery needs
  if (clientResponses.recovery_1 >= 2) {
    postSessionReqs.push('Schedule recovery time after session');
    postSessionReqs.push('Avoid back-to-back appointments');
  }

  // Capacity band specific recommendations
  if (capacityBand === 'red') {
    sessionParameters.push('⚠️ Consider postponement or modality change');
    sessionParameters.push('Baseline conditions not currently achievable');
    preSessionReqs.push('Review whether proceeding is ethically appropriate');
  } else if (capacityBand === 'amber') {
    sessionParameters.push('Modified engagement recommended');
    sessionParameters.push('Reduce session demands');
    preSessionReqs.push('Check in about current capacity before starting');
  }

  // Add practitioner notes if present
  if (practitionerNotes?.additionalAccommodations) {
    accommodations.push(...practitionerNotes.additionalAccommodations);
  }

  return {
    accommodations,
    sessionParameters,
    preSessionRequirements: preSessionReqs,
    postSessionRequirements: postSessionReqs,
    readinessFlag: capacityBand === 'green' ? 'proceed' : capacityBand === 'amber' ? 'proceed_with_modifications' : 'not_recommended',
    practitionerDecision: practitionerNotes?.decision || null,
    practitionerComments: practitionerNotes?.comments || null
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
    green: '🟢 GREEN - Learning Capacity Available',
    amber: '🟡 AMBER - Learning Partially Compromised',
    red: '🔴 RED - Learning Not Reliably Possible'
  };

  const decisionLabels = {
    proceed: '✅ Proceed with session',
    proceed_modified: '⚠️ Proceed with modifications',
    postpone: '⏸️ Postpone until conditions improve',
    refer: '🔄 Refer to alternative support'
  };

  return `
    <div style="font-family: Georgia, serif; max-width: 700px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; border-bottom: 2px solid #4ecdc4; padding-bottom: 20px; margin-bottom: 20px;">
        <h1 style="color: #1a1a2e; margin: 0;">Access & Modality Check</h1>
        <p style="color: #4ecdc4; margin: 10px 0 0 0; font-style: italic;">
          Baseline Access & Equity Ledger Results
        </p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Client</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${session.client_name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Practitioner</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${session.practitioner_name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleDateString('en-AU')}</td>
        </tr>
      </table>
      
      <div style="background: ${bandColors[session.capacity_band]}22; 
                  border-left: 4px solid ${bandColors[session.capacity_band]}; 
                  padding: 15px; margin: 20px 0;">
        <h2 style="margin: 0 0 10px 0; color: ${bandColors[session.capacity_band]};">
          Capacity Allocation at Entry
        </h2>
        <p style="margin: 0; font-size: 18px;">
          <strong>${bandLabels[session.capacity_band]}</strong>
        </p>
      </div>
      
      ${summary.practitionerDecision ? `
        <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 8px;">
          <h3 style="margin: 0 0 10px 0; color: #1a1a2e;">Practitioner Decision</h3>
          <p style="margin: 0; font-size: 16px;">
            <strong>${decisionLabels[summary.practitionerDecision] || summary.practitionerDecision}</strong>
          </p>
          ${summary.practitionerComments ? `
            <p style="margin: 10px 0 0 0; font-style: italic; color: #666;">
              "${summary.practitionerComments}"
            </p>
          ` : ''}
        </div>
      ` : ''}
      
      ${summary.accommodations.length > 0 ? `
        <h3 style="color: #4ecdc4; border-bottom: 1px solid #4ecdc4; padding-bottom: 5px;">
          Recommended Accommodations
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
          Post-Session Requirements
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
    const { token, practitionerNotes } = JSON.parse(event.body);

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
      practitionerNotes, 
      session.capacity_band
    );

    // Update session
    const { error: updateError } = await supabase
      .from('assessment_sessions')
      .update({
        practitioner_notes: practitionerNotes,
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
              Your Baseline Access & Equity Ledger has been reviewed by ${session.practitioner_name}. 
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
