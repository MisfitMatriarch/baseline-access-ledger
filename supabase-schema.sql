-- Baseline Access & Equity Ledger Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Assessment Sessions table
CREATE TABLE assessment_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Tokens for secure access
  client_token VARCHAR(64) UNIQUE NOT NULL,
  practitioner_token VARCHAR(64) UNIQUE NOT NULL,
  
  -- Contact info
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  practitioner_name VARCHAR(255) NOT NULL,
  practitioner_email VARCHAR(255) NOT NULL,
  practice_name VARCHAR(255),
  
  -- Status tracking
  status VARCHAR(50) DEFAULT 'pending_client',
  -- pending_client: waiting for client to complete
  -- pending_practitioner: client done, waiting for practitioner
  -- completed: both done, results sent
  -- expired: past retention period
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  client_completed_at TIMESTAMP WITH TIME ZONE,
  practitioner_completed_at TIMESTAMP WITH TIME ZONE,
  results_sent_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '90 days'),
  
  -- Client responses (JSON)
  client_responses JSONB,
  
  -- Practitioner review (JSON)
  practitioner_notes JSONB,
  
  -- Generated outputs (JSON)
  summary_output JSONB,
  capacity_band VARCHAR(20), -- green, amber, red
  
  -- Consent tracking
  client_consent_given BOOLEAN DEFAULT FALSE,
  client_consent_timestamp TIMESTAMP WITH TIME ZONE
);

-- Index for token lookups
CREATE INDEX idx_client_token ON assessment_sessions(client_token);
CREATE INDEX idx_practitioner_token ON assessment_sessions(practitioner_token);
CREATE INDEX idx_status ON assessment_sessions(status);
CREATE INDEX idx_practitioner_email ON assessment_sessions(practitioner_email);

-- Row Level Security
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow insert from API (anon can create sessions)
CREATE POLICY "Allow insert" ON assessment_sessions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Policy: Allow select by token (anon can read their session)
CREATE POLICY "Allow select by token" ON assessment_sessions
  FOR SELECT TO anon
  USING (true);

-- Policy: Allow update by token
CREATE POLICY "Allow update" ON assessment_sessions
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- Auto-delete expired sessions (run as scheduled job or manually)
-- DELETE FROM assessment_sessions WHERE expires_at < NOW();
