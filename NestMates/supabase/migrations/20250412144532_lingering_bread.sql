/*
  # Initial Schema Setup for Intern Housing Platform

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, matches auth.users)
      - `full_name` (text)
      - `avatar_url` (text)
      - `institution` (text)
      - `major` (text)
      - `internship_company` (text)
      - `internship_title` (text)
      - `internship_location` (text)
      - `price_range_min` (integer)
      - `price_range_max` (integer)
      - `additional_preferences` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `profiles` table
    - Add policies for:
      - Users can read all profiles
      - Users can only update their own profile
      - Users can only insert their own profile
*/

CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  avatar_url text,
  institution text,
  major text,
  internship_company text,
  internship_title text,
  internship_location text,
  price_range_min integer,
  price_range_max integer,
  additional_preferences text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read all profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);