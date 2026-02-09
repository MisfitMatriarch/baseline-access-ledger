// Submit client responses and notify practitioner
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

// Calculate preliminary capacity band from client responses
// Based on the GREEN/AMBER/RED mapping rules
function calculateCapacityBand(responses) {
  // Count RED pattern indicators
  let redPatterns = 0;
  
  // Count AMBER cluster indicators
  let amberClusters = 0;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // RED PATTERN DETECTION
  // ═══════════════════════════════════════════════════════════════════════════
  
  // RED Pattern 1: Access Dominates Capacity
  // - Waiting makes engagement much harder (se4 = 3)
  // - Most or all capacity already allocated (cb3 >= 2)
  if (responses.se4 === 3) redPatterns++;
  if (responses.cb3 >= 2) redPatterns++;
  
  // RED Pattern 2: Regulation Overrides Engagement
  // - Lighting or sound makes engagement impossible (se1 = 3 or se2 = 3)
  // - Stillness makes engagement very difficult (be4 = 3)
  // - Session tolerance ≤30 mins AND energy depleted (be3 = 3 AND cb1 >= 2)
  if (responses.se1 === 3 || responses.se2 === 3) redPatterns++;
  if (responses.be4 === 3) redPatterns++;
  if (responses.be3 === 3 && responses.cb1 >= 2) redPatterns++;
  
  // RED Pattern 3: Safety Prevents Participation
  // - Significant fear affects participation (st2 = 3)
  // - Past experiences strongly affect trust (st1 = 3)
  // - Masking occurs almost all the time (is1 = 3)
  if (responses.st2 === 3) redPatterns++;
  if (responses.st1 === 3) redPatterns++;
  if (responses.is1 === 3) redPatterns++;
  
  // RED Pattern 4: Recovery Collapse Risk
  // - Recovery takes weeks or is incomplete (rc2 = 3)
  // - Lack of recovery leads to crash/shutdown (rc3 = 3)
  // - Recovery resources not accessible (rc1 = 3)
  if (responses.rc2 === 3) redPatterns++;
  if (responses.rc3 === 3) redPatterns++;
  if (responses.rc1 === 3) redPatterns++;
  
  // RED Pattern 5: Cumulative Load
  // - Energy is "exhausted / beyond capacity" (cb1 = 3)
  // - Recovery is "deep" and affects daily life (cb2 >= 2)
  // - External demands consume almost everything (ll2 = 3)
  if (responses.cb1 === 3) redPatterns++;
  if (responses.cb2 >= 2 && responses.cb2 !== null) redPatterns++;
  if (responses.ll2 === 3) redPatterns++;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // AMBER CLUSTER DETECTION
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Cognitive Load Cluster
  // - Needs noticeable processing time (ip2 >= 2)
  // - Multiple overload triggers selected (ip3 has 3+ items)
  if (responses.ip2 >= 2) amberClusters++;
  if (Array.isArray(responses.ip3) && responses.ip3.filter(v => v !== null && v !== 'none').length >= 3) {
    amberClusters++;
  }
  
  // Energy Constraint Cluster
  // - Energy is "low but coping" (cb1 = 1) or worse
  // - Session tolerance ≤30-50 minutes (be3 >= 2)
  // - Stillness drains energy noticeably (be4 >= 2)
  if (responses.cb1 >= 1 && responses.cb1 !== null) amberClusters++;
  if (responses.be3 >= 2) amberClusters++;
  if (responses.be4 >= 2) amberClusters++;
  
  // Sensory / Access Cluster
  // - Lighting or sound drains energy (se1 = 2 or se2 = 2)
  // - Waiting drains capacity noticeably (se4 >= 2)
  if (responses.se1 === 2 || responses.se2 === 2) amberClusters++;
  if (responses.se4 >= 2) amberClusters++;
  
  // Safety / Identity Load
  // - Noticeable fear affects openness (st2 = 2)
  // - Masking occurs often (is1 = 2)
  // - Social interaction is noticeably exhausting (is2 >= 2)
  if (responses.st2 === 2) amberClusters++;
  if (responses.is1 === 2) amberClusters++;
  if (responses.is2 >= 2) amberClusters++;
  
  // Recovery Risk
  // - Recovery takes several days (rc2 = 2)
  // - Lack of recovery leads to significant functional drop (rc3 = 2)
  if (responses.rc2 === 2) amberClusters++;
  if (responses.rc3 === 2) amberClusters++;
  
  // Scaffolding fragility
  // - Disruption would cause significant destabilisation (cs2 >= 2)
  if (responses.cs2 >= 2) amberClusters++;
  
  // Past service harm
  // - Similar services have been hard or very harmful (is3 >= 2)
  if (responses.is3 >= 2) amberClusters++;
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DETERMINE BAND
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Any ONE high-risk pattern = RED
  if (redPatterns >= 1) {
    return 'red';
  }
  
  // Multiple amber clusters = AMBER
  if (amberClusters >= 3) {
    return 'amber';
  }
  
  // Otherwise GREEN
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
      green: '🟢 GREEN — Learning Capacity Available',
      amber: '🟡 AMBER — Learning Partially Compromised',
      red: '🔴 RED — Learning Not Reliably Possible'
    };

    const bandDescriptions = {
      green: 'Conditions support engagement without disproportionate effort.',
      amber: 'Engagement is possible, but significant capacity is being diverted to access or regulation. Modifications required.',
      red: 'Majority of capacity is consumed by access, regulation, or survival. Proceeding would primarily measure endurance, not learning.'
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
            <strong style="color: ${bandColors[capacityBand]}; font-size: 16px;">
              Preliminary Capacity Band: ${bandLabels[capacityBand]}
            </strong>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
              ${bandDescriptions[capacityBand]}
            </p>
          </div>
          
          ${capacityBand === 'red' ? `
            <div style="background: #fff0f0; border: 1px solid #F44336; padding: 15px; margin: 20px 0;">
              <strong style="color: #F44336;">⚠️ Attention Required</strong>
              <p style="margin: 10px 0 0 0; font-size: 14px;">
                This client's responses indicate high baseline depletion. Review carefully and consider 
                whether proceeding is ethically appropriate under current conditions.
              </p>
              <p style="margin: 10px 0 0 0; font-size: 13px; color: #666;">
                Under ACA Code of Ethics v16, proceeding when engagement would primarily measure 
                endurance rather than learning may constitute foreseeable harm.
              </p>
            </div>
          ` : capacityBand === 'amber' ? `
            <div style="background: #fff8e1; border: 1px solid #FFC107; padding: 15px; margin: 20px 0;">
              <strong style="color: #f57c00;">⚠️ Modifications Required</strong>
              <p style="margin: 10px 0 0 0; font-size: 14px;">
                This client's responses indicate partial capacity compromise. Proceed only if 
                accommodations can meaningfully reduce load.
              </p>
              <p style="margin: 10px 0 0 0; font-size: 13px; color: #666;">
                If accommodations cannot be implemented, treat as RED.
              </p>
            </div>
          ` : ''}
          
          <p style="font-size: 16px; line-height: 1.6;">
            Please review their responses and complete the practitioner decision section.
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
