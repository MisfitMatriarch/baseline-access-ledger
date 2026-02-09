// Get assessment session by token (client or practitioner)
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { token, role } = event.queryStringParameters;

    if (!token || !role) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing token or role' }) 
      };
    }

    const tokenField = role === 'client' ? 'client_token' : 'practitioner_token';
    
    const { data, error } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq(tokenField, token)
      .single();

    if (error || !data) {
      return { 
        statusCode: 404, 
        body: JSON.stringify({ error: 'Session not found' }) 
      };
    }

    // Check if expired
    if (new Date(data.expires_at) < new Date()) {
      return { 
        statusCode: 410, 
        body: JSON.stringify({ error: 'Session has expired' }) 
      };
    }

    // Return appropriate data based on role
    const responseData = {
      id: data.id,
      clientName: data.client_name,
      practitionerName: data.practitioner_name,
      practiceName: data.practice_name,
      status: data.status,
      createdAt: data.created_at,
    };

    if (role === 'practitioner') {
      responseData.clientEmail = data.client_email;
      responseData.clientResponses = data.client_responses;
      responseData.clientCompletedAt = data.client_completed_at;
      responseData.practitionerNotes = data.practitioner_notes;
      responseData.summaryOutput = data.summary_output;
      responseData.capacityBand = data.capacity_band;
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(responseData)
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get session' })
    };
  }
}
