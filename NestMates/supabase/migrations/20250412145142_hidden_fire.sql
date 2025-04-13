/*
  # Add sample profiles for demonstration

  This migration adds sample profiles to demonstrate the matching functionality
*/

INSERT INTO profiles (id, full_name, institution, major, internship_company, internship_title, internship_location, price_range_min, price_range_max, additional_preferences, gender, preferred_gender)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Alex Chen', 'Stanford University', 'Computer Science', 'Google', 'Software Engineering Intern', 'Mountain View, CA', 1500, 2500, 'Looking for a quiet, clean living space near public transit', 'male', 'no-preference'),
  ('00000000-0000-0000-0000-000000000002', 'Sarah Johnson', 'MIT', 'Data Science', 'Meta', 'Data Science Intern', 'Menlo Park, CA', 1800, 2800, 'Prefer having a gym in the building', 'female', 'female'),
  ('00000000-0000-0000-0000-000000000003', 'Michael Park', 'UC Berkeley', 'Electrical Engineering', 'Apple', 'Hardware Engineering Intern', 'Cupertino, CA', 1600, 2600, 'Looking for fellow tech interns', 'male', 'no-preference'),
  ('00000000-0000-0000-0000-000000000004', 'Emily Rodriguez', 'Harvard University', 'Business Analytics', 'Microsoft', 'Product Management Intern', 'Redmond, WA', 1400, 2200, 'Early bird, looking for similar roommates', 'female', 'female'),
  ('00000000-0000-0000-0000-000000000005', 'David Kim', 'Carnegie Mellon', 'Software Engineering', 'Amazon', 'SDE Intern', 'Seattle, WA', 1700, 2700, 'Interested in exploring the city with roommates', 'male', 'no-preference'),
  ('00000000-0000-0000-0000-000000000006', 'Jessica Lee', 'Columbia University', 'Computer Science', 'Goldman Sachs', 'Software Engineering Intern', 'New York City, NY', 2000, 3500, 'Looking for a roommate in Manhattan', 'female', 'female'),
  ('00000000-0000-0000-0000-000000000007', 'Ryan Patel', 'NYU', 'Computer Science', 'JP Morgan', 'Software Engineering Intern', 'New York City, NY', 1800, 3000, 'Prefer living in Brooklyn or Queens', 'male', 'no-preference'),
  ('00000000-0000-0000-0000-000000000008', 'Sophia Martinez', 'Cornell University', 'Computer Science', 'Bloomberg', 'Software Engineering Intern', 'New York City, NY', 1500, 2500, 'Looking for a quiet place to study', 'female', 'no-preference'),
  ('00000000-0000-0000-0000-000000000009', 'James Wilson', 'Rutgers University', 'Computer Science', 'Microsoft', 'Software Engineering Intern', 'New York City, NY', 2200, 4000, 'Interested in tech meetups and hackathons', 'male', 'male'),
  ('00000000-0000-0000-0000-000000000010', 'Olivia Taylor', 'Princeton University', 'Computer Science', 'Google', 'Software Engineering Intern', 'New York City, NY', 1900, 3200, 'Looking for a roommate who enjoys exploring NYC', 'female', 'no-preference'),
  ('00000000-0000-0000-0000-000000000011', 'Madison Parker', 'NYU', 'Marketing', 'Ogilvy', 'Marketing Intern', 'New York City, NY', 1500, 4000, 'Creative professional looking for female roommates, enjoys art galleries and brunch', 'female', 'female'),
  ('00000000-0000-0000-0000-000000000012', 'Emma Thompson', 'Columbia University', 'Marketing', 'Netflix', 'Marketing Intern', 'New York City, NY', 2200, 3500, 'Looking for female roommates, love exploring new restaurants', 'female', 'female'),
  ('00000000-0000-0000-0000-000000000013', 'Sophia Chen', 'Parsons School of Design', 'Marketing', 'TikTok', 'Brand Marketing Intern', 'New York City, NY', 1800, 3000, 'Social media enthusiast seeking female roommates', 'female', 'female');