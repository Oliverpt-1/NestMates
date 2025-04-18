import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, MapPin, Building2, GraduationCap, DollarSign, UserCircle2, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Profile {
  id: string;
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

export default function Matches() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    async function loadData() {
      if (!user) return;
      
      try {
        // First get the current user's profile
        const { data: currentProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setUserProfile(currentProfile);

        // Get potential matches based on MUST criteria first
        const { data: matchProfiles, error: matchError } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id)
          .limit(100); // Get more profiles to filter client-side

        if (matchError) throw matchError;
        
        // Filter matches based on MUST criteria and calculate compatibility scores
        const filteredMatches = (matchProfiles || []).filter(profile => {
          // Normalize location strings for comparison (remove case sensitivity and handle NYC/NY variations)
          const normalizeLocation = (loc: string) => {
            loc = loc.toLowerCase();
            if (loc.includes('nyc') || loc.includes('new york')) return 'new york';
            return loc;
          };

          const locationMatches = normalizeLocation(profile.internship_location) === 
                                normalizeLocation(currentProfile.internship_location);

          // MUST criteria: Location and Gender preferences
          const genderPreferenceMatches = 
            profile.preferred_gender?.toLowerCase() === currentProfile.gender?.toLowerCase() || 
            profile.preferred_gender?.toLowerCase() === 'no preference' ||
            profile.preferred_gender?.toLowerCase() === 'no-preference';

          // Price range overlap check
          const priceRangeOverlaps = 
            profile.price_range_min <= currentProfile.price_range_max &&
            profile.price_range_max >= currentProfile.price_range_min;
          
          return locationMatches && genderPreferenceMatches && priceRangeOverlaps;
        });

        // Sort matches by compatibility score
        const sortedMatches = filteredMatches.sort((a, b) => {
          let scoreA = 0;
          let scoreB = 0;
          
          // Price range compatibility (HIGHEST priority)
          const priceRangeOverlapA = Math.min(
            a.price_range_max - currentProfile.price_range_min,
            currentProfile.price_range_max - a.price_range_min
          );
          const priceRangeOverlapB = Math.min(
            b.price_range_max - currentProfile.price_range_min,
            currentProfile.price_range_max - b.price_range_min
          );
          
          // Normalize price range scores (0-1) and give it highest weight
          const maxPossibleOverlap = Math.max(
            currentProfile.price_range_max - currentProfile.price_range_min,
            a.price_range_max - a.price_range_min,
            b.price_range_max - b.price_range_min
          );
          
          scoreA += (priceRangeOverlapA / maxPossibleOverlap) * 10; // Increased weight to 10
          scoreB += (priceRangeOverlapB / maxPossibleOverlap) * 10;
          
          // Same industry/company bonus (LOW priority)
          if (a.internship_company === currentProfile.internship_company) scoreA += 1;
          if (b.internship_company === currentProfile.internship_company) scoreB += 1;
          
          return scoreB - scoreA;
        });

        setProfiles(sortedMatches);
      } catch (error) {
        toast.error('Error loading matches');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, navigate]);

  const handleConnect = async (matchId: string) => {
    toast.success('Connection request sent!');
    // Here you would typically implement the connection logic
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600">Finding your perfect matches...</p>
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center max-w-md mx-auto px-4">
          <UserCircle2 className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No matches yet</h2>
          <p className="text-gray-600">
            We're still looking for perfect roommate matches in your area. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Potential Matches</h2>
          <p className="text-xl text-gray-600">
            We found {profiles.length} potential roommates in {userProfile?.internship_location}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
            >
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                  <UserCircle2 className="w-20 h-20 text-primary-600" />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {profile.full_name}
                  </h3>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="text-sm">{profile.preferred_gender === 'No preference' ? 'Any roommate' : `${profile.preferred_gender} roommate`}</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Building2 className="w-5 h-5 mr-2 text-primary-600" />
                    <span>{profile.internship_company} - {profile.internship_title}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                    <span>{profile.internship_location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <GraduationCap className="w-5 h-5 mr-2 text-primary-600" />
                    <span>{profile.institution} - {profile.major}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
                    <span>${profile.price_range_min} - ${profile.price_range_max}</span>
                  </div>
                </div>

                {profile.additional_preferences && (
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    "{profile.additional_preferences}"
                  </p>
                )}

                <button
                  onClick={() => handleConnect(profile.id)}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Connect</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}