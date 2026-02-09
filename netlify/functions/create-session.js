// Create a new assessment session and send email to client
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { clientName, clientEmail, practitionerName, practitionerEmail, practiceName } = JSON.parse(event.body);

    if (!clientName || !clientEmail || !practitionerName || !practitionerEmail) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing required fields' }) 
      };
    }

    const clientToken = generateToken();
    const practitionerToken = generateToken();

    // Create session in database
    const { data, error } = await supabase
      .from('assessment_sessions')
      .insert({
        client_token: clientToken,
        practitioner_token: practitionerToken,
        client_name: clientName,
        client_email: clientEmail,
        practitioner_name: practitionerName,
        practitioner_email: practitionerEmail,
        practice_name: practiceName || 'Neurodivergent Empowered',
        status: 'pending_client'
      })
      .select()
      .single();

    if (error) throw error;

    // Get base URL from request
    const baseUrl = process.env.URL || 'https://baseline-access-ledger.netlify.app';
    const clientLink = `${baseUrl}/client/${clientToken}`;

    // Send email to client
    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: clientEmail,
      subject: 'Baseline Access & Equity Ledger - Please Complete Before Your Session',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a2e; border-bottom: 2px solid #4ecdc4; padding-bottom: 10px;">
            Access & Modality Check
          </h1>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Hi ${clientName},
          </p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            ${practitionerName} from ${practiceName || 'Neurodivergent Empowered'} has invited you to complete a 
            <strong>Baseline Access & Equity Ledger</strong> before your upcoming session.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            This helps us understand what you need to engage comfortably and safely. 
            It takes about 10-15 minutes.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${clientLink}" 
               style="background: #4ecdc4; color: #1a1a2e; padding: 15px 30px; 
                      text-decoration: none; border-radius: 8px; font-weight: bold;
                      display: inline-block;">
              Complete Your Assessment
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            This link is unique to you and expires in 90 days. Your responses will be shared 
            with ${practitionerName} to help them prepare for your session.
          </p>
          
          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            If you have any questions, reply to this email or contact ${practitionerEmail}.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #999;">
            ${practiceName || 'Neurodivergent Empowered'}<br>
            This is not a crisis service. If you need immediate support, please contact Lifeline (13 11 14) 
            or your local emergency services.
          </p>
        </div>
      `
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: true, 
        sessionId: data.id,
        clientLink,
        message: 'Assessment link sent to client' 
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create session' })
    };
  }
}
