-- Incident Response & Security Monitoring Schema
-- Medical-grade security implementation for automated threat detection and response

-- Security incidents table: Track security incidents and responses
CREATE TABLE IF NOT EXISTS security_incidents (
    id VARCHAR(255) PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'UNAUTHORIZED_ACCESS', 'DATA_BREACH', 'MALWARE', 'PHISHING',
        'BRUTE_FORCE', 'PRIVILEGE_ESCALATION', 'DATA_EXFILTRATION',
        'SYSTEM_COMPROMISE', 'COMPLIANCE_VIOLATION', 'INSIDER_THREAT',
        'DDOS_ATTACK', 'VULNERABILITY_EXPLOITATION', 'SUSPICIOUS_ACTIVITY'
    )),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'INVESTIGATING', 'CONTAINED', 'RESOLVED', 'CLOSED')),
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    detected_by VARCHAR(20) NOT NULL CHECK (detected_by IN ('SYSTEM', 'USER', 'EXTERNAL')),
    affected_systems TEXT[],
    affected_users TEXT[],
    indicators JSONB, -- Array of security indicators
    response JSONB, -- Automated and manual response actions
    timeline JSONB, -- Incident timeline entries
    metadata JSONB, -- Additional incident metadata
    assigned_to VARCHAR(255),
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Security alerts table: Track real-time security alerts
CREATE TABLE IF NOT EXISTS security_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('ANOMALY', 'THRESHOLD', 'PATTERN', 'RULE_VIOLATION')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO')),
    message TEXT NOT NULL,
    source VARCHAR(100) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB,
    acknowledged BOOLEAN DEFAULT false,
    acknowledged_by VARCHAR(255),
    acknowledged_at TIMESTAMPTZ,
    incident_id VARCHAR(255) REFERENCES security_incidents(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Threat intelligence table: Store threat intelligence data
CREATE TABLE IF NOT EXISTS threat_intelligence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('IOC', 'TTPs', 'VULNERABILITY', 'CAMPAIGN')),
    indicators TEXT[],
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    description TEXT NOT NULL,
    confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
    tags TEXT[],
    first_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Security monitoring rules table: Define monitoring rules and thresholds
CREATE TABLE IF NOT EXISTS security_monitoring_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    rule_type VARCHAR(50) NOT NULL CHECK (rule_type IN ('THRESHOLD', 'PATTERN', 'ANOMALY', 'CORRELATION')),
    conditions JSONB NOT NULL, -- Rule conditions and parameters
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO')),
    enabled BOOLEAN DEFAULT true,
    alert_threshold INTEGER DEFAULT 1,
    time_window INTEGER DEFAULT 300, -- Time window in seconds
    suppression_time INTEGER DEFAULT 3600, -- Suppression time in seconds
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Blocked entities table: Track blocked IPs, users, etc.
CREATE TABLE IF NOT EXISTS blocked_entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('IP_ADDRESS', 'USER', 'DOMAIN', 'EMAIL')),
    entity_value VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    blocked_by VARCHAR(255) NOT NULL,
    blocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    incident_id VARCHAR(255) REFERENCES security_incidents(id),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(entity_type, entity_value)
);

-- Security metrics table: Track security KPIs and metrics
CREATE TABLE IF NOT EXISTS security_metrics_daily (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_date DATE NOT NULL,
    total_incidents INTEGER DEFAULT 0,
    critical_incidents INTEGER DEFAULT 0,
    high_incidents INTEGER DEFAULT 0,
    medium_incidents INTEGER DEFAULT 0,
    low_incidents INTEGER DEFAULT 0,
    resolved_incidents INTEGER DEFAULT 0,
    mean_time_to_detection DECIMAL(10,2), -- In minutes
    mean_time_to_response DECIMAL(10,2), -- In minutes
    mean_time_to_resolution DECIMAL(10,2), -- In hours
    false_positive_rate DECIMAL(5,2), -- Percentage
    blocked_ips INTEGER DEFAULT 0,
    blocked_users INTEGER DEFAULT 0,
    security_alerts INTEGER DEFAULT 0,
    threat_intelligence_updates INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(metric_date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_incidents_type ON security_incidents(type);
CREATE INDEX IF NOT EXISTS idx_security_incidents_severity ON security_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_security_incidents_status ON security_incidents(status);
CREATE INDEX IF NOT EXISTS idx_security_incidents_detected_at ON security_incidents(detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_incidents_affected_users ON security_incidents USING GIN(affected_users);
CREATE INDEX IF NOT EXISTS idx_security_incidents_affected_systems ON security_incidents USING GIN(affected_systems);

CREATE INDEX IF NOT EXISTS idx_security_alerts_type ON security_alerts(type);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON security_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_security_alerts_timestamp ON security_alerts(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_alerts_acknowledged ON security_alerts(acknowledged);
CREATE INDEX IF NOT EXISTS idx_security_alerts_incident_id ON security_alerts(incident_id);

CREATE INDEX IF NOT EXISTS idx_threat_intelligence_type ON threat_intelligence(type);
CREATE INDEX IF NOT EXISTS idx_threat_intelligence_severity ON threat_intelligence(severity);
CREATE INDEX IF NOT EXISTS idx_threat_intelligence_active ON threat_intelligence(is_active);
CREATE INDEX IF NOT EXISTS idx_threat_intelligence_indicators ON threat_intelligence USING GIN(indicators);
CREATE INDEX IF NOT EXISTS idx_threat_intelligence_tags ON threat_intelligence USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_security_monitoring_rules_enabled ON security_monitoring_rules(enabled);
CREATE INDEX IF NOT EXISTS idx_security_monitoring_rules_type ON security_monitoring_rules(rule_type);

CREATE INDEX IF NOT EXISTS idx_blocked_entities_type_value ON blocked_entities(entity_type, entity_value);
CREATE INDEX IF NOT EXISTS idx_blocked_entities_active ON blocked_entities(is_active);
CREATE INDEX IF NOT EXISTS idx_blocked_entities_expires_at ON blocked_entities(expires_at);

CREATE INDEX IF NOT EXISTS idx_security_metrics_daily_date ON security_metrics_daily(metric_date DESC);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_security_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_security_incidents_updated_at
    BEFORE UPDATE ON security_incidents
    FOR EACH ROW
    EXECUTE FUNCTION update_security_updated_at();

CREATE TRIGGER trigger_security_monitoring_rules_updated_at
    BEFORE UPDATE ON security_monitoring_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_security_updated_at();

-- Row Level Security (RLS)
ALTER TABLE security_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE threat_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_monitoring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_metrics_daily ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Security team and admins can access incident data
CREATE POLICY security_incidents_access_policy ON security_incidents
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = current_setting('app.current_user_id', true)
            AND r.name IN ('super_admin', 'system_admin', 'compliance_officer', 'security_team')
            AND ur.is_active = true
        )
        OR
        assigned_to = current_setting('app.current_user_id', true)
    );

CREATE POLICY security_alerts_access_policy ON security_alerts
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = current_setting('app.current_user_id', true)
            AND r.name IN ('super_admin', 'system_admin', 'compliance_officer', 'security_team')
            AND ur.is_active = true
        )
    );

CREATE POLICY threat_intelligence_access_policy ON threat_intelligence
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = current_setting('app.current_user_id', true)
            AND r.name IN ('super_admin', 'system_admin', 'security_team')
            AND ur.is_active = true
        )
    );

-- Views for security dashboards
CREATE OR REPLACE VIEW security_incident_summary AS
SELECT 
    type,
    severity,
    status,
    COUNT(*) as count,
    AVG(EXTRACT(EPOCH FROM (COALESCE(resolved_at, NOW()) - detected_at))/3600) as avg_resolution_hours,
    MIN(detected_at) as first_detected,
    MAX(detected_at) as last_detected
FROM security_incidents
WHERE detected_at > NOW() - INTERVAL '30 days'
GROUP BY type, severity, status;

CREATE OR REPLACE VIEW security_dashboard AS
SELECT 
    (SELECT COUNT(*) FROM security_incidents WHERE status IN ('OPEN', 'INVESTIGATING') AND detected_at > NOW() - INTERVAL '24 hours') as active_incidents_24h,
    (SELECT COUNT(*) FROM security_incidents WHERE severity = 'CRITICAL' AND status IN ('OPEN', 'INVESTIGATING')) as critical_open,
    (SELECT COUNT(*) FROM security_incidents WHERE severity = 'HIGH' AND status IN ('OPEN', 'INVESTIGATING')) as high_open,
    (SELECT COUNT(*) FROM security_alerts WHERE acknowledged = false AND timestamp > NOW() - INTERVAL '24 hours') as unacknowledged_alerts_24h,
    (SELECT COUNT(*) FROM blocked_entities WHERE is_active = true) as active_blocks,
    (SELECT AVG(EXTRACT(EPOCH FROM (resolved_at - detected_at))/60) 
     FROM security_incidents 
     WHERE status = 'RESOLVED' AND detected_at > NOW() - INTERVAL '7 days') as avg_resolution_time_minutes,
    (SELECT COUNT(*) FROM threat_intelligence WHERE is_active = true AND last_updated > NOW() - INTERVAL '24 hours') as threat_intel_updates_24h;

CREATE OR REPLACE VIEW incident_response_metrics AS
SELECT 
    DATE_TRUNC('day', detected_at) as incident_date,
    COUNT(*) as total_incidents,
    COUNT(*) FILTER (WHERE severity = 'CRITICAL') as critical_count,
    COUNT(*) FILTER (WHERE severity = 'HIGH') as high_count,
    COUNT(*) FILTER (WHERE status = 'RESOLVED') as resolved_count,
    AVG(EXTRACT(EPOCH FROM (resolved_at - detected_at))/3600) FILTER (WHERE status = 'RESOLVED') as avg_resolution_hours,
    COUNT(DISTINCT affected_users[1]) as affected_users_count
FROM security_incidents
WHERE detected_at > NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', detected_at)
ORDER BY incident_date DESC;

-- Insert default monitoring rules
INSERT INTO security_monitoring_rules (name, description, rule_type, conditions, severity, created_by) VALUES
('Brute Force Detection', 'Detect brute force login attempts', 'THRESHOLD', '{"action": "LOGIN_FAILURE", "threshold": 10, "time_window": 300, "group_by": "ip_address"}', 'HIGH', 'system'),
('Bulk Data Export', 'Detect bulk PHI data exports', 'THRESHOLD', '{"action": "PHI_EXPORT", "threshold": 3, "time_window": 3600, "group_by": "user_id"}', 'CRITICAL', 'system'),
('Off-Hours Access', 'Detect access outside business hours', 'PATTERN', '{"actions": ["LOGIN_SUCCESS"], "time_conditions": {"exclude_hours": [9, 18]}}', 'MEDIUM', 'system'),
('Admin Role Assignment', 'Monitor administrative role assignments', 'THRESHOLD', '{"action": "ROLE_ASSIGN", "threshold": 1, "conditions": {"role_level": ">= 80"}}', 'HIGH', 'system'),
('Repeated Access Denials', 'Detect repeated unauthorized access attempts', 'THRESHOLD', '{"action": "ACCESS_DENIED", "threshold": 5, "time_window": 1800, "group_by": "user_id"}', 'MEDIUM', 'system')
ON CONFLICT DO NOTHING;

-- Insert sample threat intelligence
INSERT INTO threat_intelligence (source, type, indicators, severity, description, confidence, tags) VALUES
('MITRE ATT&CK', 'TTPs', ARRAY['T1078', 'T1110', 'T1021'], 'HIGH', 'Common attack techniques: Valid Accounts, Brute Force, Remote Services', 90, ARRAY['authentication', 'lateral_movement']),
('Internal', 'IOC', ARRAY['192.168.1.100', '10.0.0.50'], 'MEDIUM', 'Suspicious internal IP addresses from previous incidents', 75, ARRAY['internal_threat', 'investigation']),
('Threat Feed', 'VULNERABILITY', ARRAY['CVE-2023-1234', 'CVE-2023-5678'], 'CRITICAL', 'Critical vulnerabilities affecting healthcare systems', 95, ARRAY['vulnerability', 'healthcare'])
ON CONFLICT DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE security_incidents IS 'Security incidents and automated response tracking';
COMMENT ON TABLE security_alerts IS 'Real-time security alerts and notifications';
COMMENT ON TABLE threat_intelligence IS 'Threat intelligence indicators and TTPs';
COMMENT ON TABLE security_monitoring_rules IS 'Automated security monitoring rules and thresholds';
COMMENT ON TABLE blocked_entities IS 'Blocked IP addresses, users, and other entities';
COMMENT ON TABLE security_metrics_daily IS 'Daily security metrics and KPIs';

COMMENT ON COLUMN security_incidents.type IS 'Type of security incident (UNAUTHORIZED_ACCESS, DATA_BREACH, etc.)';
COMMENT ON COLUMN security_incidents.severity IS 'Incident severity level (CRITICAL, HIGH, MEDIUM, LOW)';
COMMENT ON COLUMN security_incidents.indicators IS 'JSON array of security indicators (IOCs, behaviors, etc.)';
COMMENT ON COLUMN security_incidents.response IS 'JSON object containing automated and manual response actions';
COMMENT ON COLUMN security_incidents.timeline IS 'JSON array of incident timeline entries';
COMMENT ON COLUMN threat_intelligence.confidence IS 'Confidence level in threat intelligence (0-100)';
COMMENT ON COLUMN security_monitoring_rules.conditions IS 'JSON object defining rule conditions and parameters';
COMMENT ON COLUMN blocked_entities.entity_type IS 'Type of blocked entity (IP_ADDRESS, USER, DOMAIN, EMAIL)';
