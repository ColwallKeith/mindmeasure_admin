-- Fix universities table schema - Add missing CMS fields
-- This script adds all the missing columns needed for CMS functionality

-- Add missing columns to universities table
ALTER TABLE universities 
ADD COLUMN IF NOT EXISTS undergraduate_students INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS postgraduate_students INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS international_students INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS mature_students INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS male_students INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS female_students INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS non_binary_students INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS students_over_25 INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS established INTEGER,
ADD COLUMN IF NOT EXISTS primary_color VARCHAR(20) DEFAULT '#0BA66D',
ADD COLUMN IF NOT EXISTS secondary_color VARCHAR(20),
ADD COLUMN IF NOT EXISTS logo TEXT,
ADD COLUMN IF NOT EXISTS logo_dark TEXT,
ADD COLUMN IF NOT EXISTS campus_image TEXT,
ADD COLUMN IF NOT EXISTS authorized_domains TEXT[],
ADD COLUMN IF NOT EXISTS authorized_emails TEXT[],
ADD COLUMN IF NOT EXISTS emergency_contacts JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS mental_health_services JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS local_resources JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS postcode VARCHAR(20),
ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS target_uptake_rate DECIMAL(8,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS launch_date DATE,
ADD COLUMN IF NOT EXISTS mind_measure_contact TEXT,
ADD COLUMN IF NOT EXISTS mind_measure_email TEXT;

-- Fix current_uptake_rate to handle larger values
ALTER TABLE universities 
ALTER COLUMN current_uptake_rate TYPE DECIMAL(8,2);
