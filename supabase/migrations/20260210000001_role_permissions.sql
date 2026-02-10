
-- Create role_permissions table
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT NOT NULL,
    permission_group TEXT NOT NULL,
    action TEXT NOT NULL,
    conditions JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role, permission_group, action)
);

-- Enable RLS
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users (needed for frontend UI checks)
CREATE POLICY "Allow read for authenticated users" ON public.role_permissions
    FOR SELECT TO authenticated USING (true);

-- Seed Data (Admin)
INSERT INTO public.role_permissions (role, permission_group, action, conditions) VALUES
('Admin', 'user_management', 'create', NULL),
('Admin', 'user_management', 'read', NULL),
('Admin', 'user_management', 'update', NULL),
('Admin', 'user_management', 'delete', NULL),
('Admin', 'user_management', 'manage', NULL),
('Admin', 'content_management', 'create', NULL),
('Admin', 'content_management', 'read', NULL),
('Admin', 'content_management', 'update', NULL),
('Admin', 'content_management', 'delete', NULL),
('Admin', 'content_management', 'publish', NULL),
('Admin', 'content_management', 'manage', NULL),
('Admin', 'academy_management', 'manage', NULL),
('Admin', 'product_management', 'manage', NULL),
('Admin', 'appointment_management', 'manage', NULL),
('Admin', 'financial_management', 'manage', NULL),
('Admin', 'system_settings', 'manage', NULL),
('Admin', 'patient_data', 'view_all', NULL),
('Admin', 'patient_data', 'update', NULL),
('Admin', 'patient_data', 'export', NULL),
('Admin', 'therapist_tools', 'manage', NULL),
('Admin', 'analytics', 'manage', NULL),
('Admin', 'communication', 'manage', NULL)
ON CONFLICT (role, permission_group, action) DO NOTHING;

-- Seed Data (Therapist)
INSERT INTO public.role_permissions (role, permission_group, action, conditions) VALUES
('Therapist', 'user_management', 'read', NULL),
('Therapist', 'content_management', 'read', NULL),
('Therapist', 'appointment_management', 'create', NULL),
('Therapist', 'appointment_management', 'read', '{"assigned": true}'),
('Therapist', 'appointment_management', 'update', '{"assigned": true}'),
('Therapist', 'appointment_management', 'manage', '{"assigned": true}'), -- Adding manage for sidebar visibility
('Therapist', 'patient_data', 'view_own', '{"assigned": true}'),
('Therapist', 'patient_data', 'update', '{"assigned": true}'),
('Therapist', 'therapist_tools', 'create', NULL),
('Therapist', 'therapist_tools', 'read', NULL),
('Therapist', 'therapist_tools', 'update', '{"author": "self"}'),
('Therapist', 'therapist_tools', 'delete', '{"author": "self"}'),
('Therapist', 'financial_management', 'read', NULL),
('Therapist', 'communication', 'create', '{"recipient_role": "Patient"}'),
('Therapist', 'communication', 'read', '{"participant": true}')
ON CONFLICT (role, permission_group, action) DO NOTHING;

-- Seed Data (Patient)
INSERT INTO public.role_permissions (role, permission_group, action, conditions) VALUES
('Patient', 'content_management', 'read', '{"patient_content": true}'),
('Patient', 'appointment_management', 'create', NULL),
('Patient', 'appointment_management', 'read', '{"own": true}'),
('Patient', 'appointment_management', 'update', '{"own": true}'),
('Patient', 'appointment_management', 'delete', '{"own": true}'),
('Patient', 'patient_data', 'view_own', '{"own": true}'),
('Patient', 'patient_data', 'update', '{"own": true}'),
('Patient', 'communication', 'create', NULL),
('Patient', 'communication', 'read', '{"participant": true}'),
('Patient', 'communication', 'update', '{"own": true}'),
('Patient', 'financial_management', 'read', NULL)
ON CONFLICT (role, permission_group, action) DO NOTHING;

-- Seed Data (Reception)
INSERT INTO public.role_permissions (role, permission_group, action, conditions) VALUES
('Reception', 'user_management', 'read', '{"role": "Patient"}'),
('Reception', 'appointment_management', 'create', NULL),
('Reception', 'appointment_management', 'read', NULL),
('Reception', 'appointment_management', 'update', NULL),
('Reception', 'financial_management', 'create', '{"type": "payment"}'),
('Reception', 'financial_management', 'read', '{"type": "payment"}'),
('Reception', 'patient_data', 'view_own', '{"type": "basic_info"}')
ON CONFLICT (role, permission_group, action) DO NOTHING;
