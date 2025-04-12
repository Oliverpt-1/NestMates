-- Add more sample profiles with varied price ranges
DO $$ 
DECLARE
  new_user_id uuid;
BEGIN
  -- Software Engineer in San Francisco
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'swe1@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW())
  RETURNING id INTO new_user_id;
  
  INSERT INTO profiles (id, full_name, institution, major, internship_company, internship_title, internship_location, price_range_min, price_range_max, gender, preferred_gender, additional_preferences)
  VALUES (new_user_id, 'David Lee', 'Stanford', 'Computer Science', 'Stripe', 'Software Engineer', 'San Francisco, CA', 1500, 2800, 'Male', 'No preference', 'Clean, quiet, tech enthusiast');

  -- Another SWE with similar range
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'swe2@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW())
  RETURNING id INTO new_user_id;
  
  INSERT INTO profiles (id, full_name, institution, major, internship_company, internship_title, internship_location, price_range_min, price_range_max, gender, preferred_gender, additional_preferences)
  VALUES (new_user_id, 'Jennifer Wu', 'Berkeley', 'EECS', 'Plaid', 'Software Engineer', 'San Francisco, CA', 1800, 3000, 'Female', 'Female', 'Early riser, clean');

  -- SWE with overlapping range
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'swe3@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW())
  RETURNING id INTO new_user_id;
  
  INSERT INTO profiles (id, full_name, institution, major, internship_company, internship_title, internship_location, price_range_min, price_range_max, gender, preferred_gender, additional_preferences)
  VALUES (new_user_id, 'Michael Chen', 'MIT', 'Computer Science', 'Coinbase', 'Software Engineer', 'San Francisco, CA', 2000, 3000, 'Male', 'No preference', 'Crypto enthusiast, gym regular');
END $$;