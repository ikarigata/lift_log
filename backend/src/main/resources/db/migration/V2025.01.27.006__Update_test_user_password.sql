-- Update test user password hash with correct BCrypt encoding
-- Password: 'password' with BCrypt strength 10
UPDATE public.users 
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMye9nfCWf/gCW/OdlkfmlrFzlWy8tPjqhq'
WHERE email = 'test@example.com';