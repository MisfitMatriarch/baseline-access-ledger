import React, { useState } from 'react';

const COLORS = {
  darkNavy: '#1a1a2e',
  teal: '#4ecdc4',
  white: '#ffffff',
  lightGray: '#f0f0f0',
  mediumGray: '#e0e0e0',
  textDark: '#2d2d2d',
  textMedium: '#555555',
  green: '#4CAF50',
  red: '#F44336'
};

export default function CreateSession() {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    practitionerName: '',
    practitionerEmail: 'sparkly@neurodivergentempowered.com',
    practiceName: 'Neurodivergent Empowered'
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create session');
      }

      setResult(data);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const handleReset = () => {
    setFormData({
      clientName: '',
      clientEmail: '',
      practitionerName: formData.practitionerName,
      practitionerEmail: formData.practitionerEmail,
      practiceName: formData.practiceName
    });
    setStatus('idle');
    setResult(null);
    setError(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: COLORS.lightGray,
      fontFamily: 'Georgia, serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: COLORS.darkNavy,
        color: COLORS.white,
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
          Baseline Access & Equity Ledger
        </h1>
        <p style={{ margin: '5px 0 0 0', color: COLORS.teal, fontSize: '0.9rem' }}>
          Practitioner Portal — Send Assessment to Client
        </p>
      </header>

      <main style={{
        maxWidth: '600px',
        margin: '40px auto',
        padding: '0 20px'
      }}>
        {status === 'success' ? (
          /* Success State */
          <div style={{
            backgroundColor: COLORS.white,
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#e8f5e9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <span style={{ fontSize: '2rem' }}>✓</span>
            </div>
            
            <h2 style={{ color: COLORS.green, marginBottom: '10px' }}>
              Assessment Link Sent
            </h2>
            
            <p style={{ color: COLORS.textMedium, marginBottom: '30px' }}>
              An email has been sent to <strong>{formData.clientEmail}</strong> with 
              a link to complete their assessment.
            </p>

            <div style={{
              backgroundColor: COLORS.lightGray,
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '30px',
              textAlign: 'left'
            }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: COLORS.textMedium }}>
                <strong>What happens next:</strong>
              </p>
              <ol style={{ margin: '10px 0 0 0', paddingLeft: '20px', color: COLORS.textMedium, fontSize: '0.9rem' }}>
                <li>Client receives email and completes their sections</li>
                <li>You receive an email notification when they finish</li>
                <li>You review their responses and complete practitioner sections</li>
                <li>Final results are emailed to both of you</li>
              </ol>
            </div>

            <button
              onClick={handleReset}
              style={{
                backgroundColor: COLORS.teal,
                color: COLORS.darkNavy,
                border: 'none',
                padding: '12px 30px',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Send Another Assessment
            </button>
          </div>
        ) : (
          /* Form State */
          <div style={{
            backgroundColor: COLORS.white,
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              color: COLORS.darkNavy, 
              marginTop: 0,
              marginBottom: '10px'
            }}>
              Send Access Assessment to Client
            </h2>
            
            <p style={{ 
              color: COLORS.textMedium, 
              marginBottom: '30px',
              fontSize: '0.95rem'
            }}>
              Enter the client's details below. They will receive an email with a 
              unique link to complete their baseline assessment before their session.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Client Details */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ 
                  color: COLORS.teal, 
                  fontSize: '1rem',
                  marginBottom: '15px',
                  borderBottom: `1px solid ${COLORS.mediumGray}`,
                  paddingBottom: '5px'
                }}>
                  Client Details
                </h3>
                
                <label style={{ display: 'block', marginBottom: '15px' }}>
                  <span style={{ 
                    display: 'block', 
                    marginBottom: '5px',
                    fontWeight: 'bold',
                    color: COLORS.textDark
                  }}>
                    Client Name *
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    placeholder="Enter client's name"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${COLORS.mediumGray}`,
                      borderRadius: '6px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </label>

                <label style={{ display: 'block' }}>
                  <span style={{ 
                    display: 'block', 
                    marginBottom: '5px',
                    fontWeight: 'bold',
                    color: COLORS.textDark
                  }}>
                    Client Email *
                  </span>
                  <input
                    type="email"
                    required
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                    placeholder="client@example.com"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${COLORS.mediumGray}`,
                      borderRadius: '6px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </label>
              </div>

              {/* Practitioner Details */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ 
                  color: COLORS.teal, 
                  fontSize: '1rem',
                  marginBottom: '15px',
                  borderBottom: `1px solid ${COLORS.mediumGray}`,
                  paddingBottom: '5px'
                }}>
                  Practitioner Details
                </h3>
                
                <label style={{ display: 'block', marginBottom: '15px' }}>
                  <span style={{ 
                    display: 'block', 
                    marginBottom: '5px',
                    fontWeight: 'bold',
                    color: COLORS.textDark
                  }}>
                    Your Name *
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.practitionerName}
                    onChange={(e) => setFormData({...formData, practitionerName: e.target.value})}
                    placeholder="Enter your name"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${COLORS.mediumGray}`,
                      borderRadius: '6px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </label>

                <label style={{ display: 'block', marginBottom: '15px' }}>
                  <span style={{ 
                    display: 'block', 
                    marginBottom: '5px',
                    fontWeight: 'bold',
                    color: COLORS.textDark
                  }}>
                    Your Email *
                  </span>
                  <input
                    type="email"
                    required
                    value={formData.practitionerEmail}
                    onChange={(e) => setFormData({...formData, practitionerEmail: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${COLORS.mediumGray}`,
                      borderRadius: '6px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: '0.8rem', color: COLORS.textMedium }}>
                    You'll receive a notification when the client completes their assessment
                  </span>
                </label>

                <label style={{ display: 'block' }}>
                  <span style={{ 
                    display: 'block', 
                    marginBottom: '5px',
                    fontWeight: 'bold',
                    color: COLORS.textDark
                  }}>
                    Practice Name
                  </span>
                  <input
                    type="text"
                    value={formData.practiceName}
                    onChange={(e) => setFormData({...formData, practiceName: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${COLORS.mediumGray}`,
                      borderRadius: '6px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </label>
              </div>

              {error && (
                <div style={{
                  backgroundColor: '#ffebee',
                  border: '1px solid #F44336',
                  color: '#c62828',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '20px'
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  width: '100%',
                  backgroundColor: status === 'sending' ? COLORS.mediumGray : COLORS.teal,
                  color: COLORS.darkNavy,
                  border: 'none',
                  padding: '15px',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: status === 'sending' ? 'not-allowed' : 'pointer'
                }}
              >
                {status === 'sending' ? 'Sending...' : 'Send Assessment Link to Client'}
              </button>
            </form>
          </div>
        )}

        {/* Info Box */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: COLORS.white,
          borderRadius: '8px',
          borderLeft: `4px solid ${COLORS.teal}`
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: COLORS.darkNavy }}>
            About this tool
          </h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: COLORS.textMedium, lineHeight: 1.6 }}>
            The Baseline Access & Equity Ledger is a pre-engagement ethical assessment 
            that determines whether equitable, non-harmful counselling engagement is 
            currently possible. It operationalises the ACA Code of Ethics and Practice (v16).
          </p>
        </div>
      </main>
    </div>
  );
}
