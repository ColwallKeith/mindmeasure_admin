-- Cost Tracking System Database Schema
-- Comprehensive cost monitoring and budget management

-- Cost tracking table for all service usage
CREATE TABLE IF NOT EXISTS cost_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_type VARCHAR(50) NOT NULL, -- 'openai', 'elevenlabs', 'aws', 'vercel', 'supabase'
    operation_type VARCHAR(100) NOT NULL, -- 'chat_completion', 'text_to_speech', 'database_query', etc.
    cost_usd DECIMAL(10, 6) NOT NULL,
    tokens_used INTEGER,
    model_used VARCHAR(100),
    audio_duration_seconds INTEGER,
    user_id UUID REFERENCES auth.users(id),
    university_id VARCHAR(50),
    metadata JSONB, -- Additional service-specific data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget limits and tracking
CREATE TABLE IF NOT EXISTS cost_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_type VARCHAR(50) NOT NULL,
    monthly_limit_usd DECIMAL(10, 2) NOT NULL,
    current_spend_usd DECIMAL(10, 2) DEFAULT 0,
    alert_threshold_percent INTEGER DEFAULT 80, -- Alert when 80% of budget is reached
    university_id VARCHAR(50), -- NULL for global budgets
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(service_type, university_id)
);

-- Cost alerts and notifications
CREATE TABLE IF NOT EXISTS cost_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_type VARCHAR(50) NOT NULL,
    alert_type VARCHAR(50) NOT NULL, -- 'budget_exceeded', 'threshold_reached', 'unusual_spike', 'service_down'
    message TEXT NOT NULL,
    cost_amount DECIMAL(10, 6),
    threshold_percent DECIMAL(5, 2),
    university_id VARCHAR(50),
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by UUID REFERENCES auth.users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cost optimization recommendations
CREATE TABLE IF NOT EXISTS cost_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_type VARCHAR(50) NOT NULL,
    recommendation_type VARCHAR(50) NOT NULL, -- 'model_downgrade', 'usage_optimization', 'budget_adjustment'
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    potential_savings_usd DECIMAL(10, 2),
    implementation_effort VARCHAR(20), -- 'low', 'medium', 'high'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'implemented', 'dismissed'
    university_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service usage patterns for optimization
CREATE TABLE IF NOT EXISTS usage_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_type VARCHAR(50) NOT NULL,
    pattern_type VARCHAR(50) NOT NULL, -- 'peak_hours', 'seasonal', 'user_behavior'
    pattern_data JSONB NOT NULL,
    analysis_date DATE NOT NULL,
    university_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cost_tracking_service_date ON cost_tracking(service_type, created_at);
CREATE INDEX IF NOT EXISTS idx_cost_tracking_university ON cost_tracking(university_id, created_at);
CREATE INDEX IF NOT EXISTS idx_cost_tracking_user ON cost_tracking(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_cost_budgets_service ON cost_budgets(service_type, university_id);
CREATE INDEX IF NOT EXISTS idx_cost_alerts_unacknowledged ON cost_alerts(acknowledged, created_at) WHERE acknowledged = FALSE;

-- Views for common queries
CREATE OR REPLACE VIEW monthly_cost_summary AS
SELECT 
    service_type,
    university_id,
    DATE_TRUNC('month', created_at) as month,
    SUM(cost_usd) as total_cost,
    COUNT(*) as total_operations,
    AVG(cost_usd) as avg_cost_per_operation,
    MIN(created_at) as first_operation,
    MAX(created_at) as last_operation
FROM cost_tracking
GROUP BY service_type, university_id, DATE_TRUNC('month', created_at);

CREATE OR REPLACE VIEW daily_cost_summary AS
SELECT 
    service_type,
    university_id,
    DATE_TRUNC('day', created_at) as day,
    SUM(cost_usd) as total_cost,
    COUNT(*) as total_operations,
    AVG(cost_usd) as avg_cost_per_operation
FROM cost_tracking
GROUP BY service_type, university_id, DATE_TRUNC('day', created_at);

-- Function to update budget current spend
CREATE OR REPLACE FUNCTION update_budget_spend()
RETURNS TRIGGER AS $$
BEGIN
    -- Update current spend for the service budget
    UPDATE cost_budgets 
    SET 
        current_spend_usd = (
            SELECT COALESCE(SUM(cost_usd), 0)
            FROM cost_tracking 
            WHERE service_type = NEW.service_type 
            AND university_id = NEW.university_id
            AND created_at >= DATE_TRUNC('month', NOW())
        ),
        updated_at = NOW()
    WHERE service_type = NEW.service_type 
    AND (university_id = NEW.university_id OR (university_id IS NULL AND NEW.university_id IS NULL));
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update budget spend
CREATE TRIGGER trigger_update_budget_spend
    AFTER INSERT ON cost_tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_budget_spend();

-- Function to generate cost recommendations
CREATE OR REPLACE FUNCTION generate_cost_recommendations()
RETURNS VOID AS $$
DECLARE
    service_record RECORD;
    avg_daily_cost DECIMAL;
    recommendation_text TEXT;
BEGIN
    -- Generate recommendations for high-cost services
    FOR service_record IN 
        SELECT 
            service_type,
            university_id,
            AVG(daily_cost) as avg_daily_cost,
            MAX(daily_cost) as max_daily_cost
        FROM (
            SELECT 
                service_type,
                university_id,
                DATE_TRUNC('day', created_at) as day,
                SUM(cost_usd) as daily_cost
            FROM cost_tracking
            WHERE created_at >= NOW() - INTERVAL '30 days'
            GROUP BY service_type, university_id, DATE_TRUNC('day', created_at)
        ) daily_costs
        GROUP BY service_type, university_id
        HAVING AVG(daily_cost) > 5.00 -- Only for services costing more than $5/day on average
    LOOP
        -- Check if recommendation already exists
        IF NOT EXISTS (
            SELECT 1 FROM cost_recommendations 
            WHERE service_type = service_record.service_type 
            AND university_id = service_record.university_id
            AND status = 'pending'
            AND created_at > NOW() - INTERVAL '7 days'
        ) THEN
            -- Generate recommendation based on usage pattern
            IF service_record.avg_daily_cost > 20 THEN
                recommendation_text := 'Consider optimizing ' || service_record.service_type || ' usage or upgrading to a more cost-effective plan.';
                
                INSERT INTO cost_recommendations (
                    service_type,
                    recommendation_type,
                    title,
                    description,
                    potential_savings_usd,
                    implementation_effort,
                    university_id
                ) VALUES (
                    service_record.service_type,
                    'usage_optimization',
                    'High Usage Optimization',
                    recommendation_text,
                    service_record.avg_daily_cost * 0.2 * 30, -- Estimate 20% savings
                    'medium',
                    service_record.university_id
                );
            END IF;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Sample data for testing (remove in production)
INSERT INTO cost_budgets (service_type, monthly_limit_usd, alert_threshold_percent) VALUES
('openai', 500.00, 80),
('elevenlabs', 200.00, 75),
('aws', 1000.00, 85),
('vercel', 100.00, 90)
ON CONFLICT (service_type, university_id) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE cost_tracking IS 'Tracks all service usage costs across the platform';
COMMENT ON TABLE cost_budgets IS 'Manages budget limits and spending tracking for each service';
COMMENT ON TABLE cost_alerts IS 'Stores cost-related alerts and notifications';
COMMENT ON TABLE cost_recommendations IS 'AI-generated recommendations for cost optimization';
COMMENT ON TABLE usage_patterns IS 'Analyzes usage patterns for cost optimization insights';
