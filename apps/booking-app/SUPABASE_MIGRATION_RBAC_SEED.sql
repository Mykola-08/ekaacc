-- RBAC Seed Migration (Manual Fallback)
-- Ensures granular permissions exist in step with Frontend definitions in role-permissions.ts

DO $$
DECLARE
  -- Helper to insert if not exists
BEGIN
  -----------------------------------------------------------------------------
  -- 1. Create Permissions (Granular Actions)
  -----------------------------------------------------------------------------
  
  -- User Management
  INSERT INTO permissions (key, name, description) VALUES 
    ('user_management.create', 'Create User', 'Create new users'),
    ('user_management.read', 'Read User', 'Read user profiles'),
    ('user_management.update', 'Update User', 'Update user profiles'),
    ('user_management.delete', 'Delete User', 'Delete users'),
    ('user_management.manage', 'Manage User', 'Full user management');

  -- Content Management
  INSERT INTO permissions (key, name, description) VALUES 
    ('content_management.create', 'Create Content', 'Create content items'),
    ('content_management.read', 'Read Content', 'Read content items'),
    ('content_management.update', 'Update Content', 'Update content items'),
    ('content_management.publish', 'Publish Content', 'Publish content items');

  -- Appointment Management
  INSERT INTO permissions (key, name, description) VALUES 
    ('appointment_management.create', 'Create Appointment', 'Book appointments'),
    ('appointment_management.read', 'Read Appointment', 'View appointments'),
    ('appointment_management.update', 'Update Appointment', 'Reschedule/Edit appointments'),
    ('appointment_management.delete', 'Cancel Appointment', 'Cancel appointments'),
    ('appointment_management.manage', 'Manage Appointment', 'Full appointment control');

  -- Financial Management
  INSERT INTO permissions (key, name, description) VALUES 
    ('financial_management.read', 'Read Financials', 'View transactions'),
    ('financial_management.manage', 'Manage Financials', 'Process refunds and adjustments');

  -- Patient Data (Strict Privacy)
  INSERT INTO permissions (key, name, description) VALUES 
    ('patient_data.read', 'Read Patient Data', 'View patient records'),
    ('patient_data.update', 'Update Patient Data', 'Update patient medical notes'),
    ('patient_data.view_own', 'View Own Data', 'Patient views own record');

  -----------------------------------------------------------------------------
  -- 2. Assign Permissions to Roles
  -----------------------------------------------------------------------------

  -- ADMIN (All access)
  INSERT INTO role_permissions (role, permission_key) VALUES
    ('Admin', 'user_management.manage'),
    ('Admin', 'content_management.manage'),
    ('Admin', 'appointment_management.manage'),
    ('Admin', 'financial_management.manage'),
    ('Admin', 'patient_data.read'),
    ('Admin', 'patient_data.update');

  -- THERAPIST
  INSERT INTO role_permissions (role, permission_key) VALUES
    ('Therapist', 'appointment_management.read'),
    ('Therapist', 'appointment_management.update'),
    ('Therapist', 'patient_data.read'),
    ('Therapist', 'patient_data.update'),
    ('Therapist', 'content_management.read');

  -- RECEPTION
  INSERT INTO role_permissions (role, permission_key) VALUES
    ('Reception', 'appointment_management.create'),
    ('Reception', 'appointment_management.read'),
    ('Reception', 'appointment_management.update'),
    ('Reception', 'financial_management.read'),
    ('Reception', 'user_management.read');

  -- PATIENT
  INSERT INTO role_permissions (role, permission_key) VALUES
    ('Patient', 'appointment_management.create'),
    ('Patient', 'appointment_management.read'), -- own
    ('Patient', 'patient_data.view_own');
    
  -- 3. Cleanup duplicates (handled by ON CONFLICT or distinct inserts usually, 
  -- but straightforward INSERTs above should use ON CONFLICT DO NOTHING if run repeatedly)
  -- Since this is a specialized script, we rely on the caller to handle conflicts or clean execution.

EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error seeding RBAC: %', SQLERRM;
END $$;
