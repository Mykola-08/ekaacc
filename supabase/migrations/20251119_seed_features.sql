-- Seed Features
INSERT INTO features (key, name, description, status, is_enabled, min_role) VALUES
('ai_agent_proactive', 'Proactive AI Agent', 'AI that initiates conversations and suggestions based on user behavior.', 'alpha', true, 'Patient'),
('ai_memory_recall', 'AI Memory Recall', 'Allows AI to remember past interactions and preferences.', 'alpha', true, 'Patient'),
('smart_scheduling', 'Smart Scheduling', 'AI-powered appointment scheduling optimization.', 'beta', true, 'Patient'),
('advanced_analytics', 'Advanced Analytics', 'Deep dive into progress metrics and trends.', 'alpha', true, 'Therapist'),
('family_accounts', 'Family Accounts', 'Manage multiple profiles under one subscription.', 'alpha', true, 'Patient'),
('mood_tracking_advanced', 'Advanced Mood Tracking', 'Detailed mood logging with context and AI analysis.', 'beta', true, 'Patient'),
('telehealth_video', 'Telehealth Video', 'Integrated secure video calls.', 'stable', true, 'Patient'),
('journaling_voice', 'Voice Journaling', 'Record journal entries via voice with transcription.', 'beta', true, 'Patient')
ON CONFLICT (key) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    status = EXCLUDED.status;

-- Seed Permissions (Examples)
INSERT INTO permissions (key, name, description) VALUES
('users.view_all', 'View All Users', 'Can view list of all users'),
('users.manage', 'Manage Users', 'Can edit user details and roles'),
('content.publish', 'Publish Content', 'Can publish blog posts and resources'),
('analytics.view_global', 'View Global Analytics', 'Can view platform-wide statistics'),
('ai.configure', 'Configure AI', 'Can adjust global AI settings')
ON CONFLICT (key) DO NOTHING;

-- Assign Permissions to Roles
-- Admin
INSERT INTO role_permissions (role, permission_key) VALUES
('Admin', 'users.view_all'),
('Admin', 'users.manage'),
('Admin', 'content.publish'),
('Admin', 'analytics.view_global'),
('Admin', 'ai.configure')
ON CONFLICT DO NOTHING;

-- Therapist
INSERT INTO role_permissions (role, permission_key) VALUES
('Therapist', 'content.publish')
ON CONFLICT DO NOTHING;
