// Submit client responses and notify practitioner
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

// Calculate preliminary capacity band from client responses
function calculateCapacityBand(responses) {
  let redFlags = 0;
  let amberFlags = 0;

  // Check high-load indicators
  const highLoadIds = [
    'baseline_depletion_1', 'baseline_depletion_2', 'baseline_depletion_3',
    'external_demands_1', 'external_demands_2', 'external_demands_3',
    'recovery_capacity_1', 'recovery_capacity_2', 'recovery_capacity_3'
  ];

  for (const [key, value] of Object.entries(responses)) {
    // Check for high severity responses (usually index 3 or 4 in scale questions)
    if (typeof value === 'number' && value >= 3) {
      if (highLoadIds.some(id => key.includes(id))) {
        redFlags++;
      } else {
        amberFlags++;
      }
    }
    
    // Check for multiple high-load selections
    if (Array.isArray(value) && value.length >= 3) {
      amberFlags++;
    }
  }

  if (redFlags >= 3) return 'red';
  if (redFlags >= 1 || amberFlags >= 5) return 'amber';
  return 'green';
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { token, responses, consentGiven } = JSON.parse(event.body);

    if (!token || !responses) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing token or responses' }) 
      };
    }

    if (!consentGiven) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Consent required to proceed' }) 
      };
    }

    // Get session
    const { data: session, error: fetchError } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('client_token', token)
      .single();

    if (fetchError || !session) {
      return { 
        statusCode: 404, 
        body: JSON.stringify({ error: 'Session not found' }) 
      };
    }

    // Calculate preliminary capacity band
    const capacityBand = calculateCapacityBand(responses);

    // Update session
    const { error: updateError } = await supabase
      .from('assessment_sessions')
      .update({
        client_responses: responses,
        status: 'pending_practitioner',
        client_completed_at: new Date().toISOString(),
        client_consent_given: true,
        client_consent_timestamp: new Date().toISOString(),
        capacity_band: capacityBand
      })
      .eq('client_token', token);

    if (updateError) throw updateError;

    // Get base URL
    const baseUrl = process.env.URL || 'https://baseline-access-ledger.netlify.app';
    const practitionerLink = `${baseUrl}/practitioner/${session.practitioner_token}`;

    // Send email to practitioner
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

    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: session.practitioner_email,
      subject: `Access Assessment Complete - ${session.client_name} [${capacityBand.toUpperCase()}]`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a2e; border-bottom: 2px solid #4ecdc4; padding-bottom: 10px;">
            Client Assessment Complete
          </h1>
          
          <p style="font-size: 16px; line-height: 1.6;">
            <strong>${session.client_name}</strong> has completed their Baseline Access & Equity Ledger.
          </p>
          
          <div style="background: ${bandColors[capacityBand]}22; border-left: 4px solid ${bandColors[capacityBand]}; 
                      padding: 15px; margin: 20px 0;">
            <strong style="color: ${bandColors[capacityBand]};">
              Preliminary Capacity Band: ${bandLabels[capacityBand]}
            </strong>
          </div>
          
          ${capacityBand === 'red' ? `
            <div style="background: #fff0f0; border: 1px solid #F44336; padding: 15px; margin: 20px 0;">
              <strong style="color: #F44336;">⚠️ Attention Required</strong>
              <p style="margin: 10px 0 0 0; font-size: 14px;">
                This client's responses indicate high baseline depletion. Review carefully and consider 
                whether proceeding is ethically appropriate under current conditions.
              </p>
            </div>
          ` : ''}
          
          <p style="font-size: 16px; line-height: 1.6;">
            Please review their responses and complete the practitioner interpretation section.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${practitionerLink}" 
               style="background: #4ecdc4; color: #1a1a2e; padding: 15px 30px; 
                      text-decoration: none; border-radius: 8px; font-weight: bold;
                      display: inline-block;">
              Review &amp; Complete Assessment
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #999;">
            This link is unique to this assessment session.<br>
            Client consent for sharing was obtained at ${new Date().toLocaleString('en-AU')}.
          </p>
        </div>
      `
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: true,
        capacityBand,
        message: 'Responses saved and practitioner notified' 
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to submit responses' })
    };
  }
}
