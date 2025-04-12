/*
  # Add sample profiles for demonstration

  This migration adds sample profiles to demonstrate the matching functionality
*/

INSERT INTO profiles (id, full_name, institution, major, internship_company, internship_title, internship_location, price_range_min, price_range_max, additional_preferences)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Alex Chen', 'Stanford University', 'Computer Science', 'Google', 'Software Engineering Intern', 'Mountain View, CA', 1500, 2500, 'Looking for a quiet, clean living space near public transit'),
  ('00000000-0000-0000-0000-000000000002', 'Sarah Johnson', 'MIT', 'Data Science', 'Meta', 'Data Science Intern', 'Menlo Park, CA', 1800, 2800, 'Prefer having a gym in the building'),
  ('00000000-0000-0000-0000-000000000003', 'Michael Park', 'UC Berkeley', 'Electrical Engineering', 'Apple', 'Hardware Engineering Intern', 'Cupertino, CA', 1600, 2600, 'Looking for fellow tech interns'),
  ('00000000-0000-0000-0000-000000000004', 'Emily Rodriguez', 'Harvard University', 'Business Analytics', 'Microsoft', 'Product Management Intern', 'Redmond, WA', 1400, 2200, 'Early bird, looking for similar roommates'),
  ('00000000-0000-0000-0000-000000000005', 'David Kim', 'Carnegie Mellon', 'Software Engineering', 'Amazon', 'SDE Intern', 'Seattle, WA', 1700, 2700, 'Interested in exploring the city with roommates');