import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { X, Upload, ArrowRight, ArrowLeft, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScreen from './LoadingScreen';

const locations = [
  { value: 'sf', label: 'San Francisco, CA' },
  { value: 'nyc', label: 'New York City, NY' },
  { value: 'sea', label: 'Seattle, WA' },
  { value: 'aus', label: 'Austin, TX' },
  { value: 'bos', label: 'Boston, MA' },
  { value: 'chi', label: 'Chicago, IL' },
  { value: 'la', label: 'Los Angeles, CA' },
  { value: 'dc', label: 'Washington, DC' },
];

const industries = [
  { value: 'swe', label: 'Software Engineering' },
  { value: 'data', label: 'Data Science' },
  { value: 'pm', label: 'Product Management' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'finance', label: 'Finance' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'sales', label: 'Sales' },
];

interface FormData {
  firstName: string;
  lastName: string;
  location: string;
  startDate: string;
  endDate: string;
  industry: string;
  rentMin: number;
  rentMax: number;
  profilePicture: File | null;
  bio: string;
  email: string;
  password: string;
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

export default function OnboardingModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    location: '',
    startDate: '',
    endDate: '',
    industry: '',
    rentMin: 0,
    rentMax: 0,
    profilePicture: null,
    bio: '',
    email: '',
    password: '',
    gender: '',
    preferred_gender: '',
  });

  const steps = [
    {
      title: "Welcome to InternHome",
      description: "Let's get you set up with your perfect housing match",
      icon: <Home className="w-12 h-12 text-primary-600" />,
    },
    {
      title: "Your Details",
      description: "Tell us a bit about yourself",
      icon: <Home className="w-12 h-12 text-primary-600" />,
    },
    {
      title: "Internship Location",
      description: "Where will you be working?",
      icon: <Home className="w-12 h-12 text-primary-600" />,
    },
    {
      title: "Dates",
      description: "When do you need housing?",
      icon: <Home className="w-12 h-12 text-primary-600" />,
    },
    {
      title: "Industry",
      description: "What field will you be working in?",
      icon: <Home className="w-12 h-12 text-primary-600" />,
    },
    {
      title: "Budget",
      description: "What's your housing budget?",
      icon: <Home className="w-12 h-12 text-primary-600" />,
    },
    {
      title: "Profile Picture",
      description: "Add a photo of yourself",
      icon: <Home className="w-12 h-12 text-primary-600" />,
    },
    {
      title: "Final Step",
      description: "Tell us more about yourself",
      icon: <Home className="w-12 h-12 text-primary-600" />,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, profilePicture: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          full_name: `${formData.firstName} ${formData.lastName}`,
          internship_location: formData.location,
          internship_company: formData.industry,
          price_range_min: formData.rentMin,
          price_range_max: formData.rentMax,
          additional_preferences: formData.bio,
          gender: formData.gender,
          preferred_gender: formData.preferred_gender,
        });

        if (profileError) throw profileError;

        if (formData.profilePicture) {
          const fileExt = formData.profilePicture.name.split('.').pop();
          const fileName = `${authData.user.id}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, formData.profilePicture);

          if (uploadError) throw uploadError;
        }

        // Simulate some loading time for the animation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast.success('Welcome to InternHome!');
        navigate('/matches');
      }
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  const renderStepContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[400px] flex flex-col justify-center"
        >
          {currentStep === 0 && (
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Home className="w-24 h-24 text-primary-600 mx-auto mb-8" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-4">Find Your Perfect Match</h3>
              <p className="text-gray-600 mb-8">
                We'll help you find the ideal housing situation for your internship.
                Let's get started!
              </p>
              <button
                onClick={handleNext}
                className="bg-primary-600 text-white px-8 py-3 rounded-full hover:bg-primary-700 transition-colors"
              >
                Begin
              </button>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <Select
                  options={genderOptions}
                  onChange={(option) =>
                    setFormData({ ...formData, gender: option?.value || '' })
                  }
                  className="w-full"
                  placeholder="Select your gender"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Roommate Gender
                </label>
                <Select
                  options={preferredGenderOptions}
                  onChange={(option) =>
                    setFormData({ ...formData, preferred_gender: option?.value || '' })
                  }
                  className="w-full"
                  placeholder="Select preferred roommate gender"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Internship Location
              </label>
              <Select
                options={locations}
                onChange={(option) =>
                  setFormData({ ...formData, location: option?.label || '' })
                }
                className="w-full"
                placeholder="Select your internship location"
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry/Field
              </label>
              <Select
                options={industries}
                onChange={(option) =>
                  setFormData({ ...formData, industry: option?.label || '' })
                }
                className="w-full"
                placeholder="Select your industry"
              />
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Monthly Rent ($)
                </label>
                <input
                  type="number"
                  value={formData.rentMin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rentMin: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Monthly Rent ($)
                </label>
                <input
                  type="number"
                  value={formData.rentMax}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rentMax: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio (Optional)
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Tell potential roommates a bit about yourself..."
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-2xl w-full mx-4 overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-3xl font-bold text-gray-900">
                  {steps[currentStep].title}
                </h2>
                <p className="text-gray-600 mt-1">
                  {steps[currentStep].description}
                </p>
              </motion.div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <motion.div
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {renderStepContent()}

          <div className="mt-8 flex justify-between">
            <button
              onClick={handlePrevious}
              className={`flex items-center px-6 py-2 rounded-full ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-primary-600 hover:text-primary-700'
              }`}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-2 text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-colors"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center px-6 py-2 text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-colors"
              >
                Complete
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}