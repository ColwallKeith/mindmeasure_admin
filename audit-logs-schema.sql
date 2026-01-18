-- Audit Logs Table Schema
-- Medical-grade security implementation for HIPAA compliance
-- Provides tamper-proof audit trails for all PHI access and modifications

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id VARCHAR(255) NOT NULL,
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    success BOOLEAN NOT NULL DEFAULT true,
    error_message TEXT,
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    compliance_flags TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance and compliance queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource);
CREATE INDEX IF NOT EXISTS idx_audit_logs_risk_level ON audit_logs(risk_level);
CREATE INDEX IF NOT EXISTS idx_audit_logs_success ON audit_logs(success);
CREATE INDEX IF NOT EXISTS idx_audit_logs_compliance ON audit_logs USING GIN(compliance_flags);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_timestamp ON audit_logs(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_timestamp ON audit_logs(resource, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_timestamp ON audit_logs(action, timestamp DESC);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_audit_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_logs_updated_at
    BEFORE UPDATE ON audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_audit_logs_updated_at();

-- Row Level Security (RLS) for audit logs
-- Only allow reading audit logs, no updates or deletes to maintain integrity
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only allow INSERT operations (no UPDATE/DELETE for audit integrity)
CREATE POLICY audit_logs_insert_policy ON audit_logs
    FOR INSERT
    WITH CHECK (true);

-- Policy: Allow SELECT for authorized users only
CREATE POLICY audit_logs_select_policy ON audit_logs
    FOR SELECT
    USING (
        -- Allow system administrators and compliance officers
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = current_setting('app.current_user_id', true)
            AND (p.role = 'admin' OR p.role = 'compliance_officer')
        )
        OR
        -- Allow users to see their own audit logs
        user_id = current_setting('app.current_user_id', true)
    );

-- Prevent UPDATE and DELETE operations to maintain audit integrity
CREATE POLICY audit_logs_no_update_policy ON audit_logs
    FOR UPDATE
    USING (false);

CREATE POLICY audit_logs_no_delete_policy ON audit_logs
    FOR DELETE
    USING (false);

-- Create a view for compliance reporting
CREATE OR REPLACE VIEW audit_logs_compliance_view AS
SELECT 
    id,
    timestamp,
    user_id,
    user_email,
    action,
    resource,
    resource_id,
    success,
    risk_level,
    compliance_flags,
    CASE 
        WHEN 'HIPAA_RELEVANT' = ANY(compliance_flags) THEN true 
        ELSE false 
    END as hipaa_relevant,
    CASE 
        WHEN 'GDPR_RELEVANT' = ANY(compliance_flags) THEN true 
        ELSE false 
    END as gdpr_relevant,
    CASE 
        WHEN risk_level = 'CRITICAL' THEN true 
        ELSE false 
    END as critical_event,
    CASE 
        WHEN success = false THEN true 
        ELSE false 
    END as failed_event
FROM audit_logs;

-- Grant appropriate permissions
GRANT SELECT ON audit_logs_compliance_view TO authenticated;
GRANT INSERT ON audit_logs TO authenticated;
GRANT SELECT ON audit_logs TO authenticated;

-- Comments for documentation
COMMENT ON TABLE audit_logs IS 'Comprehensive audit log for all system activities, especially PHI access and modifications. Designed for HIPAA, GDPR, and SOC2 compliance.';
COMMENT ON COLUMN audit_logs.timestamp IS 'When the audited event occurred (immutable)';
COMMENT ON COLUMN audit_logs.user_id IS 'ID of the user who performed the action';
COMMENT ON COLUMN audit_logs.action IS 'Type of action performed (see AuditAction enum)';
COMMENT ON COLUMN audit_logs.resource IS 'Type of resource accessed (e.g., phi_data, authentication)';
COMMENT ON COLUMN audit_logs.resource_id IS 'Specific ID of the resource accessed';
COMMENT ON COLUMN audit_logs.details IS 'Additional context and metadata about the action';
COMMENT ON COLUMN audit_logs.risk_level IS 'Security risk level of the action (LOW, MEDIUM, HIGH, CRITICAL)';
COMMENT ON COLUMN audit_logs.compliance_flags IS 'Array of compliance standards this log entry relates to';
