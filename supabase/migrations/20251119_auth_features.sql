-- Seed Auth Features
INSERT INTO features (key, name, description, status, is_enabled, min_role) VALUES
('auth_google', 'Google Authentication', 'Allow users to login with Google.', 'stable', true, 'Patient'),
('auth_apple', 'Apple Authentication', 'Allow users to login with Apple.', 'stable', true, 'Patient'),
('auth_meta', 'Meta Authentication', 'Allow users to login with Meta (Facebook).', 'stable', true, 'Patient')
ON CONFLICT (key) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    status = EXCLUDED.status;
