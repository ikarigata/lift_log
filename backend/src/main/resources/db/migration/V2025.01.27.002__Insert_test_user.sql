-- Insert test user for development
-- Password is 'password' hashed with BCrypt (strength 10)
INSERT INTO users (id, name, email, password_hash, created_at) 
VALUES (
    '123e4567-e89b-12d3-a456-426614174000',
    'Test User',
    'test@example.com',
    '$2a$10$Xl0yhrl4VkV.RF3DIUpL/.fWEJqBt6TxIN4OEWKfBUnYZa9cdp6HS',
    NOW()
);