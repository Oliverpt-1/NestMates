import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import Select from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface ProfileData {
  full_name: string;
  avatar_url: string;
  institution: string;
  major: string;
  internship_company: string;
  internship_title: string;
  internship_location: string;
  price_range_min: number;
  price_range_max: number;
  additional_preferences: string;
  gender: string;
  preferred_gender: string;
}

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'other', label: 'Other' },
];

const preferredGenderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'other', label: 'Other' },
  { value: 'no-preference', label: 'No preference' },
];

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    avatar_url: '',
    institution: '',
    major: '',
    internship_company: '',
    internship_title: '',
    internship_location: '',
    price_range_min: 0,
    price_range_max: 0,
    additional_preferences: '',
    gender: '',
    preferred_gender: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data) setProfile(data);
      } catch (error) {
        toast.error('Error loading profile');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...profile });

      if (error) throw error;
      toast.success('Profile saved successfully!');
    } catch (error) {
      toast.error('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
              Educational Institution
            </label>
            <input
              type="text"
              id="institution"
              value={profile.institution}
              onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="major" className="block text-sm font-medium text-gray-700">
              Major
            </label>
            <input
              type="text"
              id="major"
              value={profile.major}
              onChange={(e) => setProfile({ ...profile, major: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="internship_company" className="block text-sm font-medium text-gray-700">
              Internship Company
            </label>
            <input
              type="text"
              id="internship_company"
              value={profile.internship_company}
              onChange={(e) => setProfile({ ...profile, internship_company: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="internship_title" className="block text-sm font-medium text-gray-700">
              Internship Title
            </label>
            <input
              type="text"
              id="internship_title"
              value={profile.internship_title}
              onChange={(e) => setProfile({ ...profile, internship_title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="internship_location" className="block text-sm font-medium text-gray-700">
              Internship Location
            </label>
            <input
              type="text"
              id="internship_location"
              value={profile.internship_location}
              onChange={(e) => setProfile({ ...profile, internship_location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price_range_min" className="block text-sm font-medium text-gray-700">
                Minimum Budget
              </label>
              <input
                type="number"
                id="price_range_min"
                value={profile.price_range_min}
                onChange={(e) => setProfile({ ...profile, price_range_min: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="price_range_max" className="block text-sm font-medium text-gray-700">
                Maximum Budget
              </label>
              <input
                type="number"
                id="price_range_max"
                value={profile.price_range_max}
                onChange={(e) => setProfile({ ...profile, price_range_max: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="additional_preferences" className="block text-sm font-medium text-gray-700">
              Additional Preferences
            </label>
            <textarea
              id="additional_preferences"
              rows={4}
              value={profile.additional_preferences}
              onChange={(e) => setProfile({ ...profile, additional_preferences: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <Select
              id="gender"
              options={genderOptions}
              value={genderOptions.find(option => option.value === profile.gender)}
              onChange={(option: Option | null) => setProfile({ ...profile, gender: option?.value || '' })}
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="preferred_gender" className="block text-sm font-medium text-gray-700">
              Preferred Roommate Gender
            </label>
            <Select
              id="preferred_gender"
              options={preferredGenderOptions}
              value={preferredGenderOptions.find(option => option.value === profile.preferred_gender)}
              onChange={(option: Option | null) => setProfile({ ...profile, preferred_gender: option?.value || '' })}
              className="mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}