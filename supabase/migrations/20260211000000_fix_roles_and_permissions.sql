-- Migration to standardize user roles and fix permission seeding

-- 1. Update user_role Enum (Rename existing or add new)
-- We attempt to rename if they exist, to preserve data relationships. 
-- If 'teacher' exists, we rename it to 'therapist'.
DO $$
BEGIN
    -- Rename 'teacher' to 'therapist' if it exists in the enum
    -- Postgres doesn't support "IF EXISTS" for RENAME VALUE directly, so we just try it or separate it.
    -- However, often it's safer to just ADD the new value and UPDATE records, then leave the old value.
    -- But strict enums are annoying.
    -- Let's try adding new values first.
    ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'therapist';
    ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'patient';
    ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'reception';
END
$$;

-- 2. Migrate existing profiles to new roles
UPDATE public.profiles 
SET role = 'therapist' 
WHERE role = 'teacher';

UPDATE public.profiles 
SET role = 'patient' 
WHERE role = 'student';

-- 3. Clean up role_permissions (remove TitleCase bad data)
TRUNCATE TABLE public.role_permissions;

-- 4. Re-seed correct Lowercase role permissions
INSERT INTO public.role_permissions (role, permission_group, action, conditions) VALUES
-- Admin
('admin', 'user_management', 'create', NULL),
('admin', 'user_management', 'read', NULL),
('admin', 'user_management', 'update', NULL),
('admin', 'user_management', 'delete', NULL),
('admin', 'user_management', 'manage', NULL),
('admin', 'content_management', 'create', NULL),
('admin', 'content_management', 'read', NULL),
('admin', 'content_management', 'update', NULL),
('admin', 'content_management', 'delete', NULL),
('admin', 'content_management', 'publish', NULL),
('admin', 'content_management', 'manage', NULL),
('admin', 'academy_management', 'manage', NULL),
('admin', 'product_management', 'manage', NULL),
('admin', 'appointment_management', 'manage', NULL),
('admin', 'financial_management', 'manage', NULL),
('admin', 'system_settings', 'manage', NULL),
('admin', 'patient_data', 'view_all', NULL),
('admin', 'patient_data', 'update', NULL),
('admin', 'patient_data', 'export', NULL),
('admin', 'therapist_tools', 'manage', NULL),
('admin', 'analytics', 'manage', NULL),
('admin', 'communication', 'manage', NULL),

-- Therapist
('therapist', 'user_management', 'read', NULL),
('therapist', 'content_management', 'read', NULL),
('therapist', 'appointment_management', 'create', NULL),
('therapist', 'appointment_management', 'read', '{"assigned": true}'),
('therapist', 'appointment_management', 'update', '{"assigned": true}'),
('therapist', 'appointment_management', 'manage', '{"assigned": true}'),
('therapist', 'patient_data', 'view_own', '{"assigned": true}'),
('therapist', 'patient_data', 'update', '{"assigned": true}'),
('therapist', 'therapist_tools', 'create', NULL),
('therapist', 'therapist_tools', 'read', NULL),
('therapist', 'therapist_tools', 'update', '{"author": "self"}'),
('therapist', 'therapist_tools', 'delete', '{"author": "self"}'),
('therapist', 'financial_management', 'read', NULL),
('therapist', 'communication', 'create', '{"recipient_role": "patient"}'),
('therapist', 'communication', 'read', '{"participant": true}'),

-- Patient
('patient', 'content_management', 'read', '{"patient_content": true}'),
('patient', 'appointment_management', 'create', NULL),
('patient', 'appointment_management', 'read', '{"own": true}'),
('patient', 'appointment_management', 'update', '{"own": true}'),
('patient', 'appointment_management', 'delete', '{"own": true}'),
('patient', 'patient_data', 'view_own', '{"own": true}'),
('patient', 'patient_data', 'update', '{"own": true}'),
('patient', 'communication', 'create', NULL),
('patient', 'communication', 'read', '{"participant": true}'),
('patient', 'communication', 'update', '{"own": true}'),
('patient', 'financial_management', 'read', NULL),

-- Reception
('reception', 'user_management', 'read', '{"role": "patient"}'),
('reception', 'appointment_management', 'create', NULL),
('reception', 'appointment_management', 'read', NULL),
('reception', 'appointment_management', 'update', NULL),
('reception', 'financial_management', 'create', '{"type": "payment"}'),
('reception', 'financial_management', 'read', '{"type": "payment"}'),
('reception', 'patient_data', 'view_own', '{"type": "basic_info"}')
ON CONFLICT (role, permission_group, action) DO NOTHING;
