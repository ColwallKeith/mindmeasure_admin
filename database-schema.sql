-- Mind Measure Database Schema for AWS RDS PostgreSQL
-- Generated on 2025-09-23

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DATABASE mindmeasure SET row_security = on;

-- User profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    first_name TEXT,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment sessions table
CREATE TABLE assessment_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(user_id),
    assessment_type TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    text_data JSONB,
    audio_data JSONB,
    visual_data JSONB,
    gpt_analysis JSONB,
    assessment_completion JSONB,
    partial_text_data JSONB,
    partial_audio_data JSONB,
    incomplete_reason TEXT,
    incomplete_timestamp TIMESTAMP WITH TIME ZONE
);

-- Conversation insights table
CREATE TABLE conversation_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(user_id),
    key_concerns TEXT[],
    emotional_themes JSONB,
    conversation_summary TEXT,
    notable_changes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User conversation history table
CREATE TABLE user_conversation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(user_id) UNIQUE,
    last_topics TEXT[],
    recurring_concerns TEXT[],
    relationship_notes TEXT,
    conversation_count INTEGER DEFAULT 0,
    last_conversation_date TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fusion outputs table (for ML results)
CREATE TABLE fusion_outputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    score_smoothed DECIMAL,
    p_worse_audio DECIMAL,
    p_worse_visual DECIMAL,
    p_worse_text DECIMAL,
    p_worse_passive DECIMAL,
    uncertainty DECIMAL,
    qc_overall DECIMAL,
    drivers JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session insights table
CREATE TABLE session_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    key_concerns TEXT[],
    emotional_themes JSONB,
    conversation_summary TEXT,
    notable_changes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- University profiles table (for institutional features)
CREATE TABLE university_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    short_name TEXT,
    website TEXT,
    primary_color TEXT,
    secondary_color TEXT,
    logo TEXT,
    logo_dark TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    postcode TEXT,
    total_students INTEGER,
    undergraduate_students INTEGER,
    postgraduate_students INTEGER,
    international_students INTEGER,
    mature_students INTEGER,
    students_over_25 INTEGER,
    male_students INTEGER,
    female_students INTEGER,
    non_binary_students INTEGER,
    mind_measure_contact TEXT,
    mind_measure_email TEXT,
    launch_date DATE,
    status TEXT DEFAULT 'planning',
    target_uptake_rate DECIMAL,
    current_uptake_rate DECIMAL,
    last_data_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    custom_welcome_message TEXT,
    custom_branding JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_assessment_sessions_user_id ON assessment_sessions(user_id);
CREATE INDEX idx_assessment_sessions_status ON assessment_sessions(status);
CREATE INDEX idx_assessment_sessions_created_at ON assessment_sessions(created_at);
CREATE INDEX idx_conversation_insights_session_id ON conversation_insights(session_id);
CREATE INDEX idx_conversation_insights_user_id ON conversation_insights(user_id);
CREATE INDEX idx_fusion_outputs_session_id ON fusion_outputs(session_id);
CREATE INDEX idx_session_insights_session_id ON session_insights(session_id);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessment_sessions_updated_at BEFORE UPDATE ON assessment_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversation_insights_updated_at BEFORE UPDATE ON conversation_insights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_conversation_history_updated_at BEFORE UPDATE ON user_conversation_history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_session_insights_updated_at BEFORE UPDATE ON session_insights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_university_profiles_updated_at BEFORE UPDATE ON university_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security policies (basic setup - can be enhanced later)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_conversation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE fusion_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE university_profiles ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions" ON assessment_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON assessment_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON assessment_sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own insights" ON conversation_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own insights" ON conversation_insights FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own history" ON user_conversation_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own history" ON user_conversation_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own history" ON user_conversation_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Note: RLS policies will need to be adapted for AWS Cognito authentication
-- The auth.uid() function is Supabase-specific and will need to be replaced
-- with AWS Cognito user identification in the application layer
