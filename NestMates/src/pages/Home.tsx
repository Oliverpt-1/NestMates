import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, Building2, MapPin } from 'lucide-react';
import OnboardingModal from '../components/OnboardingModal';
import { useState, useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Show onboarding modal if restart=true in URL
    if (searchParams.get('restart') === 'true') {
      setShowOnboarding(true);
    }
  }, [searchParams]);

  const handleGetStarted = () => {
    if (user) {
      navigate('/matches');
    } else {
      setShowOnboarding(true);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-br from-primary-600 to-secondary-500">
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 drop-shadow-lg">
            Find Your Perfect
            <br />
            Intern Housing Match
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/90">
            Connect with fellow interns, share housing preferences, and find your ideal roommate for your summer internship.
          </p>

          <button
            onClick={handleGetStarted}
            className="bg-white text-primary-600 px-8 py-4 rounded-full text-xl font-semibold hover:bg-primary-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started Now
          </button>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-200">
              <Users className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="text-xl font-semibold mb-2">Match with Interns</h3>
              <p className="text-white/80">Find roommates with similar interests and lifestyles</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-200">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="text-xl font-semibold mb-2">Perfect Housing</h3>
              <p className="text-white/80">Discover housing options that match your preferences</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-200">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-white" />
              <h3 className="text-xl font-semibold mb-2">Location Matching</h3>
              <p className="text-white/80">Find housing near your internship location</p>
            </div>
          </div>
        </div>
      </div>

      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
    </div>
  );
}