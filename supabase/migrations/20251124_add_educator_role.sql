-- Migration: Add Educator Role and Permissions
-- Description: Adds permissions for the Educator role to manage Academy courses.

-- Insert permissions
INSERT INTO permissions (key, name, description) VALUES
('academy.course.create', 'Create Course', 'Allows creating new courses'),
('academy.course.edit', 'Edit Course', 'Allows editing own courses'),
('academy.course.publish', 'Publish Course', 'Allows publishing courses')
ON CONFLICT (key) DO NOTHING;

-- Assign permissions to Educator role
INSERT INTO role_permissions (role, permission_key) VALUES
('Educator', 'academy.course.create'),
('Educator', 'academy.course.edit'),
('Educator', 'academy.course.publish')
ON CONFLICT (role, permission_key) DO NOTHING;

-- Also assign to Admin role
INSERT INTO role_permissions (role, permission_key) VALUES
('Admin', 'academy.course.create'),
('Admin', 'academy.course.edit'),
('Admin', 'academy.course.publish')
ON CONFLICT (role, permission_key) DO NOTHING;
