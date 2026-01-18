#!/usr/bin/env node

// Quick database schema fix for p_worse_fused column
const { Pool } = require('pg');

const dbConfig = {
  host: 'mindmeasure-aurora.cluster-cz8c8wq4k3ak.eu-west-2.rds.amazonaws.com',
  port: 5432,
  database: 'mindmeasure',
  user: 'mindmeasure_admin',
  password: 'MindMeasure2024!',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
};

const fixSchemaSQL = `
-- Add missing p_worse_fused column to fusion_outputs table
ALTER TABLE fusion_outputs 
ADD COLUMN IF NOT EXISTS p_worse_fused DECIMAL(5,4);

-- Fix RETURNING syntax issue by ensuring PostgreSQL compatibility
-- (This is likely a syntax issue with the query builder)

-- Add any other missing columns
ALTER TABLE fusion_outputs 
ADD COLUMN IF NOT EXISTS final_score INTEGER,
ADD COLUMN IF NOT EXISTS score_smoothed DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS uncertainty DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS qc_overall DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS session_id UUID,
ADD COLUMN IF NOT EXISTS analysis JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS topics JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS public_state TEXT DEFAULT 'report',
ADD COLUMN IF NOT EXISTS model_version TEXT DEFAULT 'v1.0';

-- Ensure profiles has baseline_established column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS baseline_established BOOLEAN DEFAULT false;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_fusion_outputs_p_worse_fused ON fusion_outputs(p_worse_fused);
CREATE INDEX IF NOT EXISTS idx_fusion_outputs_session_id ON fusion_outputs(session_id);
CREATE INDEX IF NOT EXISTS idx_fusion_outputs_user_id ON fusion_outputs(user_id);
`;

async function runFix() {
  const pool = new Pool(dbConfig);
  
  try {
    console.log('🔧 Fixing database schema for p_worse_fused column...');
    
    await pool.query(fixSchemaSQL);
    
    console.log('✅ Database schema fixed successfully');
    console.log('   - Added p_worse_fused column to fusion_outputs');
    console.log('   - Added other missing columns');
    console.log('   - Added performance indexes');
    
  } catch (error) {
    console.error('❌ Database schema fix failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runFix();
