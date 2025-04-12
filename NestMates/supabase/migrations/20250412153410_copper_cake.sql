/*
  # Add gender fields and sample data

  1. Schema Updates
    - Add gender field to profiles table
    - Add preferred_gender field to profiles table
    
  2. Security
    - Maintain existing RLS policies
    
  3. Sample Data
    - Create sample users with unique emails
    - Create corresponding profiles with diverse backgrounds
*/

-- Add new columns safely
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'gender'
  ) THEN
    ALTER TABLE profiles ADD COLUMN gender text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'preferred_gender'
  ) THEN
    ALTER TABLE profiles ADD COLUMN preferred_gender text;
  END IF;
END $$;

-- Function to create a user and their profile
CREATE OR REPLACE FUNCTION create_sample_user_and_profile(
  email_address text,
  full_name_input text,
  institution_input text,
  major_input text,
  company text,
  title text,
  location text,
  min_price integer,
  max_price integer,
  preferences text,
  gender_input text,
  preferred_gender_input text
) RETURNS uuid AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Check if email already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = email_address) THEN
    RETURN NULL;
  END IF;

  -- Create user in auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change_token_current,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    email_address,
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO new_user_id;

  -- Create profile
  INSERT INTO public.profiles (
    id,
    full_name,
    institution,
    major,
    internship_company,
    internship_title,
    internship_location,
    price_range_min,
    price_range_max,
    additional_preferences,
    gender,
    preferred_gender
  ) VALUES (
    new_user_id,
    full_name_input,
    institution_input,
    major_input,
    company,
    title,
    location,
    min_price,
    max_price,
    preferences,
    gender_input,
    preferred_gender_input
  );

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql;

-- Create sample users and profiles with unique emails
SELECT create_sample_user_and_profile(
  'intern1.chen@example.com',
  'Alex Chen',
  'Stanford University',
  'Computer Science',
  'Google',
  'Software Engineering Intern',
  'San Francisco, CA',
  2000,
  3000,
  'Early riser, clean, enjoys cooking',
  'Male',
  'No preference'
);

SELECT create_sample_user_and_profile(
  'intern2.kim@example.com',
  'Sarah Kim',
  'UC Berkeley',
  'Computer Science',
  'Apple',
  'iOS Development Intern',
  'San Francisco, CA',
  2200,
  3200,
  'Night owl, pet-friendly',
  'Female',
  'Female'
);

SELECT create_sample_user_and_profile(
  'intern3.rodriguez@example.com',
  'Emma Rodriguez',
  'Parsons School of Design',
  'Product Design',
  'Adobe',
  'UX Design Intern',
  'New York City, NY',
  1800,
  2800,
  'Creative, social, loves art',
  'Female',
  'Female'
);

SELECT create_sample_user_and_profile(
  'intern4.zhang@example.com',
  'William Zhang',
  'NYU Stern',
  'Finance',
  'Goldman Sachs',
  'Investment Banking Intern',
  'New York City, NY',
  2500,
  4000,
  'Early riser, gym regular',
  'Male',
  'Male'
);

SELECT create_sample_user_and_profile(
  'intern5.liu@example.com',
  'Emily Liu',
  'University of Washington',
  'Computer Science',
  'Amazon',
  'Backend Engineer Intern',
  'Seattle, WA',
  1800,
  2800,
  'Bookworm, tea lover',
  'Female',
  'Female'
);

SELECT create_sample_user_and_profile(
  'intern6.patel@example.com',
  'Raj Patel',
  'Georgia Tech',
  'Computer Engineering',
  'Microsoft',
  'Software Engineering Intern',
  'Seattle, WA',
  2000,
  3000,
  'Tech enthusiast, loves hiking',
  'Male',
  'No preference'
);

SELECT create_sample_user_and_profile(
  'intern7.thompson@example.com',
  'Emma Thompson',
  'UCLA',
  'Marketing',
  'Netflix',
  'Marketing Intern',
  'Los Angeles, CA',
  2200,
  3200,
  'Creative, loves movies',
  'Female',
  'Female'
);

SELECT create_sample_user_and_profile(
  'intern8.garcia@example.com',
  'Carlos Garcia',
  'USC',
  'Film Production',
  'Disney',
  'Production Intern',
  'Los Angeles, CA',
  2000,
  3000,
  'Film enthusiast, early bird',
  'Male',
  'No preference'
);

SELECT create_sample_user_and_profile(
  'intern9.wilson@example.com',
  'James Wilson',
  'University of Chicago',
  'Economics',
  'JPMorgan',
  'Investment Banking Intern',
  'New York City, NY',
  2500,
  4000,
  'Finance enthusiast, gym lover',
  'Male',
  'Male'
);

SELECT create_sample_user_and_profile(
  'intern10.wang@example.com',
  'Lucy Wang',
  'MIT',
  'Computer Science',
  'Meta',
  'Software Engineering Intern',
  'San Francisco, CA',
  2300,
  3500,
  'Coding enthusiast, loves photography',
  'Female',
  'No preference'
);

-- Drop the function after use
DROP FUNCTION create_sample_user_and_profile;