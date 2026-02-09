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
  red: '#F44336',
  amber: '#d4a03c'
};

const DEFAULT_PRACTITIONER_EMAIL = 'sparkly@neurodivergentempowered.com';

export default function CreateSession() {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    practitionerName: '',
    practitionerEmail: DEFAULT_PRACTITIONER_EMAIL,
    practiceName: 'Neurodivergent Empowered'
  });
  const [selfUseMode, setSelfUseMode] = useState(false);
  const [consentToSend, setConsentToSend] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const isEmailOverridden = formData.practitionerEmail !== DEFAULT_PRACTITIONER_EMAIL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If email is overridden, require self-use acknowledgement
    if (isEmailOverridden && !selfUseMode) {
      setError('Please confirm you are completing this for assessment or personal use.');
      return;
    }

    if (!consentToSend) {
      setError('Please confirm consent to send responses.');
      return;
    }

    setStatus('sending');
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          selfUseMode
        })
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
    setConsentToSend(false);
    setStatus('idle');
    setResult(null);
    setError(null);
  };

  const handlePractitionerEmailChange = (email) => {
    setFormData({...formData, practitionerEmail: email});
    // If they're entering a different email, reset self-use acknowledgement
    if (email === DEFAULT_PRACTITIONER_EMAIL) {
      setSelfUseMode(false);
    }
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
          Send Access Check
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
              a link to complete the access check.
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
              Send Access Check
            </h2>
            
            <p style={{ 
              color: COLORS.textMedium, 
              marginBottom: '30px',
              fontSize: '0.95rem'
            }}>
              This tool produces an access and equity summary that is usually reviewed 
              by a practitioner. If you are completing this for assessment or personal use, 
              you can send the results to yourself.
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
                  Person Completing the Access Check
                </h3>
                
                <label style={{ display: 'block', marginBottom: '15px' }}>
                  <span style={{ 
                    display: 'block', 
                    marginBottom: '5px',
                    fontWeight: 'bold',
                    color: COLORS.textDark
                  }}>
                    Name *
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    placeholder="Enter name"
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
                    Email *
                  </span>
                  <input
                    type="email"
                    required
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                    placeholder="name@example.com"
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
                    The access check link will be sent to this email address
                  </span>
                </label>
              </div>

              {/* Results Delivery */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ 
                  color: COLORS.teal, 
                  fontSize: '1rem',
                  marginBottom: '15px',
                  borderBottom: `1px solid ${COLORS.mediumGray}`,
                  paddingBottom: '5px'
                }}>
                  Results & Access Review Delivery
                </h3>
                
                <label style={{ display: 'block', marginBottom: '15px' }}>
                  <span style={{ 
                    display: 'block', 
                    marginBottom: '5px',
                    fontWeight: 'bold',
                    color: COLORS.textDark
                  }}>
                    Reviewer Name *
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.practitionerName}
                    onChange={(e) => setFormData({...formData, practitionerName: e.target.value})}
                    placeholder="Enter reviewer name"
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

                <label style={{ display: 'block', marginBottom: '10px' }}>
                  <span style={{ 
                    display: 'block', 
                    marginBottom: '5px',
                    fontWeight: 'bold',
                    color: COLORS.textDark
                  }}>
                    Email Address for Results *
                  </span>
                  <input
                    type="email"
                    required
                    value={formData.practitionerEmail}
                    onChange={(e) => handlePractitionerEmailChange(e.target.value)}
                    placeholder="name@example.com"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${isEmailOverridden ? COLORS.amber : COLORS.mediumGray}`,
                      borderRadius: '6px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: '0.8rem', color: COLORS.textMedium }}>
                    This is the email address where responses and summary will be sent.
                  </span>
                </label>

                {/* Default email note */}
                <div style={{
                  backgroundColor: COLORS.lightGray,
                  padding: '10px 12px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  color: COLORS.textMedium,
                  marginBottom: '15px'
                }}>
                  <strong>Default practitioner email:</strong> {DEFAULT_PRACTITIONER_EMAIL}
                  <br/>
                  <span style={{ fontStyle: 'italic' }}>
                    You can change this if you are completing this for assessment or personal use.
                  </span>
                </div>

                {/* Self-use declaration - only show if email is different */}
                {isEmailOverridden && (
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    padding: '12px',
                    backgroundColor: '#fff8e1',
                    border: `1px solid ${COLORS.amber}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginBottom: '15px'
                  }}>
                    <input
                      type="checkbox"
                      checked={selfUseMode}
                      onChange={(e) => setSelfUseMode(e.target.checked)}
                      style={{ marginRight: '10px', marginTop: '3px', transform: 'scale(1.2)' }}
                    />
                    <span style={{ color: COLORS.textDark }}>
                      I am completing this for assessment or personal use, and understand that 
                      no external practitioner will review my responses unless I choose to share them.
                    </span>
                  </label>
                )}

                <label style={{ display: 'block' }}>
                  <span style={{ 
                    display: 'block', 
                    marginBottom: '5px',
                    fontWeight: 'bold',
                    color: COLORS.textDark
                  }}>
                    Practice / Organisation Name
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

              {/* Consent & Privacy */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ 
                  color: COLORS.teal, 
                  fontSize: '1rem',
                  marginBottom: '15px',
                  borderBottom: `1px solid ${COLORS.mediumGray}`,
                  paddingBottom: '5px'
                }}>
                  Consent & Privacy
                </h3>

                <label style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  marginBottom: '15px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={consentToSend}
                    onChange={(e) => setConsentToSend(e.target.checked)}
                    style={{ marginRight: '10px', marginTop: '3px', transform: 'scale(1.2)' }}
                  />
                  <span style={{ color: COLORS.textDark }}>
                    I consent to responses being sent to the email address entered above.
                  </span>
                </label>

                {/* Privacy notice */}
                <div style={{
                  backgroundColor: COLORS.lightGray,
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  color: COLORS.textMedium
                }}>
                  <strong>⚠️ Email & Privacy Notice</strong>
                  <p style={{ margin: '8px 0 0 0' }}>
                    Email is not a fully secure method of communication. Please only enter 
                    an email address you trust to receive this information.
                  </p>
                </div>
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
                {status === 'sending' ? 'Sending...' : 'Continue — Send Access Check Link'}
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
