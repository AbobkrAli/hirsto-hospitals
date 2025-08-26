import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Upload, User, Mail, Lock, Phone, Calendar, Stethoscope, FileText, ArrowRight, MapPin } from 'lucide-react';
import Select from 'react-select';
import type { MultiValue, SingleValue } from 'react-select';
import { useRegisterForm } from '../../hooks/useRegisterForm';
import { handleImageError } from '../../utils/imageUtils';
import TermsAndSignIn from './TermsAndSignIn';
import { nationalityOptions, type NationalityOption } from '../../data/nationalities';

interface LanguageOption {
  value: string;
  label: string;
}

interface SpecializationOption {
  value: string;
  label: string;
}

interface RegisterFormProps {
  setShowTermsModal: (show: boolean) => void;
  setTermsAccepted: (accepted: boolean) => void;
  termsAccepted: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ setShowTermsModal, setTermsAccepted, termsAccepted }) => {
  const {
    formData,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    isLoading,
    errors,
    profilePreview,
    handleInputChange,
    handleImageUpload,
    handleSubmit,
    setShowPassword,
    setShowConfirmPassword,
    setConfirmPassword
  } = useRegisterForm(termsAccepted);

  const [currentLocation, setCurrentLocation] = useState('');
  const [locationDetectionFailed, setLocationDetectionFailed] = useState(false);

  // Language options for react-select
  const languageOptions: LanguageOption[] = [
    { value: 'arabic', label: 'Arabic' },
    { value: 'english', label: 'English' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'italian', label: 'Italian' },
    { value: 'portuguese', label: 'Portuguese' },
    { value: 'russian', label: 'Russian' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'korean', label: 'Korean' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'turkish', label: 'Turkish' },
    { value: 'dutch', label: 'Dutch' },
    { value: 'swedish', label: 'Swedish' },
    { value: 'norwegian', label: 'Norwegian' },
    { value: 'danish', label: 'Danish' },
    { value: 'finnish', label: 'Finnish' },
    { value: 'polish', label: 'Polish' },
    { value: 'czech', label: 'Czech' },
    { value: 'hungarian', label: 'Hungarian' },
    { value: 'romanian', label: 'Romanian' },
    { value: 'bulgarian', label: 'Bulgarian' },
    { value: 'greek', label: 'Greek' },
    { value: 'hebrew', label: 'Hebrew' },
    { value: 'persian', label: 'Persian' },
    { value: 'urdu', label: 'Urdu' },
    { value: 'bengali', label: 'Bengali' },
    { value: 'thai', label: 'Thai' },
    { value: 'vietnamese', label: 'Vietnamese' },
    { value: 'indonesian', label: 'Indonesian' },
    { value: 'malay', label: 'Malay' },
    { value: 'filipino', label: 'Filipino' },
    { value: 'swahili', label: 'Swahili' },
    { value: 'amharic', label: 'Amharic' },
    { value: 'hausa', label: 'Hausa' },
    { value: 'yoruba', label: 'Yoruba' },
    { value: 'zulu', label: 'Zulu' }
  ];

  // Specialization options for react-select
  const specializationOptions: SpecializationOption[] = [
    { value: 'cardiologist', label: 'Cardiologist' },
    { value: 'neurologist', label: 'Neurologist' },
    { value: 'dermatologist', label: 'Dermatologist' },
    { value: 'pediatrician', label: 'Pediatrician' },
    { value: 'general_practitioner', label: 'General Practitioner' },
    { value: 'orthopedic_surgeon', label: 'Orthopedic Surgeon' },
    { value: 'psychiatrist', label: 'Psychiatrist' },
    { value: 'oncologist', label: 'Oncologist' },
    { value: 'endocrinologist', label: 'Endocrinologist' },
    { value: 'radiologist', label: 'Radiologist' },
    { value: 'anesthesiologist', label: 'Anesthesiologist' },
    { value: 'emergency_medicine', label: 'Emergency Medicine' },
    { value: 'family_medicine', label: 'Family Medicine' },
    { value: 'internal_medicine', label: 'Internal Medicine' },
    { value: 'surgeon', label: 'Surgeon' },
    { value: 'ophthalmologist', label: 'Ophthalmologist' },
    { value: 'otolaryngologist', label: 'Otolaryngologist' },
    { value: 'urologist', label: 'Urologist' },
    { value: 'gynecologist', label: 'Gynecologist' },
    { value: 'obstetrician', label: 'Obstetrician' },
    { value: 'pulmonologist', label: 'Pulmonologist' },
    { value: 'gastroenterologist', label: 'Gastroenterologist' },
    { value: 'nephrologist', label: 'Nephrologist' },
    { value: 'rheumatologist', label: 'Rheumatologist' },
    { value: 'hematologist', label: 'Hematologist' },
    { value: 'infectious_disease', label: 'Infectious Disease' },
    { value: 'pathologist', label: 'Pathologist' },
    { value: 'allergist', label: 'Allergist' },
    { value: 'immunologist', label: 'Immunologist' }
  ];

  // Doctor type options for react-select
  const doctorTypeOptions = [
    { value: 'international', label: 'International' },
    { value: 'local', label: 'Local' }
  ];

  // Handle phone number input with validation
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow only digits, spaces, dashes, parentheses, and +
    const sanitized = value.replace(/[^\d\s\-()]/g, '');

    // If the original value starts with +, preserve it
    const finalValue = value.startsWith('+') ? '+' + sanitized : sanitized;

    handleInputChange({
      target: {
        name: 'phone_number',
        value: finalValue
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // Get current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding to get location name
          fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
            .then(response => response.json())
            .then(data => {
              const location = `${data.city || data.locality || 'Unknown City'}, ${data.countryName || 'Unknown Country'}`;
              setCurrentLocation(location);
              setLocationDetectionFailed(false);
              // Update form data with current location
              handleInputChange({
                target: {
                  name: 'location',
                  value: location
                }
              } as React.ChangeEvent<HTMLInputElement>);
            })
            .catch(() => {
              setCurrentLocation('Location not available');
              setLocationDetectionFailed(true);
            });
        },
        () => {
          setCurrentLocation('Location not available');
          setLocationDetectionFailed(true);
        }
      );
    } else {
      setCurrentLocation('Location not available');
      setLocationDetectionFailed(true);
    }
  }, []);

  // Handle language selection change
  const handleLanguageChange = (selectedOptions: MultiValue<LanguageOption>) => {
    const languages = selectedOptions.map((option) => option.label).join(', ');
    handleInputChange({
      target: {
        name: 'languages',
        value: languages
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // Get selected languages for react-select
  const getSelectedLanguages = () => {
    if (!formData.languages) return [];
    return formData.languages.split(', ').map(lang => ({
      value: lang.toLowerCase(),
      label: lang
    }));
  };

  // Handle nationality selection change
  const handleNationalityChange = (selectedOption: SingleValue<NationalityOption>) => {
    handleInputChange({
      target: {
        name: 'nationality',
        value: selectedOption ? selectedOption.label : ''
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // Get selected nationality for react-select
  const getSelectedNationality = () => {
    if (!formData.nationality) return null;
    return nationalityOptions.find(option => option.label === formData.nationality) || null;
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={itemVariants}
    >
      {/* Form Header */}
      <div className="bg-gradient-to-r !bg-[#03045E] px-8 py-6 text-center">
        <h3 className="text-xl lg:text-2xl font-bold font-headlines text-white mb-2">
          Create Your Medical Profile
        </h3>
        <p className="text-[#CAF0F8] font-subtitles text-sm">
          Join thousands of healthcare professionals making a difference
        </p>
      </div>

      {/* Form Content */}
      <div className="px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
          <motion.div
            className="flex flex-col items-center space-y-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative group">
              <div className="w-24 h-24 bg-gradient-to-br from-[#CAF0F8]/30 to-[#90E0EF]/30 rounded-full flex items-center justify-center border-4 border-[#90E0EF]/50 overflow-hidden hover:border-[#0077B6] transition-all duration-300">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                    onError={(e) => handleImageError(e, 'doctor')}
                  />
                ) : (
                  <User className="w-8 h-8 text-[#0077B6]" />
                )}
              </div>
              <label htmlFor="profileImage" className="absolute -bottom-1 -right-1 bg-gradient-to-r !bg-[#03045E] text-white p-2 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg">
                <Upload className="w-4 h-4" />
              </label>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <p className="text-xs text-[#0077B6]/70 font-subtitles text-center">
              Upload your professional photo
            </p>
            {errors.profile_image && (
              <motion.p
                className="text-red-500 text-xs font-subtitles"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.profile_image}
              </motion.p>
            )}
          </motion.div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0077B6]/60" />
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:ring-4 focus:ring-[#90E0EF]/30 focus:border-[#0077B6] transition-all duration-300 bg-white/90 font-paragraphs placeholder:text-[#0077B6]/40 ${errors.name ? 'border-red-500' : 'border-[#90E0EF]/50 hover:border-[#90E0EF]'}`}
                  placeholder="Dr. Name"
                />
              </div>
              {errors.name && (
                <motion.p
                  className="text-red-500 text-sm mt-2 font-subtitles"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.name}
                </motion.p>
              )}
            </motion.div>

            {/* Age */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
                Age *
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0077B6]/60" />
                <input
                  name="age"
                  type="number"
                  min="18"
                  max="100"
                  value={formData.age || ''}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:ring-4 focus:ring-[#90E0EF]/30 focus:border-[#0077B6] transition-all duration-300 bg-white/90 font-paragraphs placeholder:text-[#0077B6]/40 ${errors.age ? 'border-red-500' : 'border-[#90E0EF]/50 hover:border-[#90E0EF]'}`}
                  placeholder="35"
                />
              </div>
              {errors.age && (
                <motion.p
                  className="text-red-500 text-sm mt-2 font-subtitles"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.age}
                </motion.p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0077B6]/60" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:ring-4 focus:ring-[#90E0EF]/30 focus:border-[#0077B6] transition-all duration-300 bg-white/90 font-paragraphs placeholder:text-[#0077B6]/40 ${errors.email ? 'border-red-500' : 'border-[#90E0EF]/50 hover:border-[#90E0EF]'}`}
                  placeholder="doctor@hospital.com"
                />
              </div>
              {errors.email && (
                <motion.p
                  className="text-red-500 text-sm mt-2 font-subtitles"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.email}
                </motion.p>
              )}
            </motion.div>

            {/* Phone Number */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0077B6]/60" />
                <input
                  name="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handlePhoneChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:ring-4 focus:ring-[#90E0EF]/30 focus:border-[#0077B6] transition-all duration-300 bg-white/90 font-paragraphs placeholder:text-[#0077B6]/40 ${errors.phone_number ? 'border-red-500' : 'border-[#90E0EF]/50 hover:border-[#90E0EF]'}`}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              {errors.phone_number && (
                <motion.p
                  className="text-red-500 text-sm mt-2 font-subtitles"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.phone_number}
                </motion.p>
              )}
              <p className="text-xs text-[#0077B6]/70 font-subtitles mt-1">
                Format: +1 (555) 123-4567 or (555) 123-4567
              </p>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0077B6]/60" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 focus:ring-4 focus:ring-[#90E0EF]/30 focus:border-[#0077B6] transition-all duration-300 bg-white/90 font-paragraphs placeholder:text-[#0077B6]/40 ${errors.password ? 'border-red-500' : 'border-[#90E0EF]/50 hover:border-[#90E0EF]'}`}
                  placeholder="••••••••"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0077B6]/60 hover:text-[#0077B6] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>
              {errors.password && (
                <motion.p
                  className="text-red-500 text-sm mt-2 font-subtitles"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0077B6]/60" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 focus:ring-4 focus:ring-[#90E0EF]/30 focus:border-[#0077B6] transition-all duration-300 bg-white/90 font-paragraphs placeholder:text-[#0077B6]/40 ${errors.confirmPassword ? 'border-red-500' : 'border-[#90E0EF]/50 hover:border-[#90E0EF]'}`}
                  placeholder="••••••••"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0077B6]/60 hover:text-[#0077B6] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  className="text-red-500 text-sm mt-2 font-subtitles"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Specialization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
              Medical Specialization *
            </label>
            <div className="relative">
              <Stethoscope className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0077B6]/60" />
              <Select
                options={specializationOptions}
                value={formData.specialization ? specializationOptions.find(option => option.value === formData.specialization) : null}
                onChange={(selected) => {
                  const selectedValue = selected ? selected.value : '';
                  handleInputChange({
                    target: {
                      name: 'specialization',
                      value: selectedValue
                    }
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                placeholder="Select your specialization..."
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    paddingLeft: '48px',
                    borderRadius: '12px',
                    border: state.isFocused ? '2px solid #0077B6' : '2px solid #90E0EF',
                    boxShadow: state.isFocused ? '0 0 0 4px rgba(144, 224, 239, 0.3)' : 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    minHeight: '48px',
                    '&:hover': {
                      border: '2px solid #90E0EF'
                    }
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? '#0077B6' : state.isFocused ? '#90E0EF' : 'white',
                    color: state.isSelected ? 'white' : '#1E3E72',
                    '&:hover': {
                      backgroundColor: state.isSelected ? '#0077B6' : '#90E0EF'
                    }
                  })
                }}
              />
            </div>
            {errors.specialization && (
              <motion.p
                className="text-red-500 text-sm mt-2 font-subtitles"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.specialization}
              </motion.p>
            )}
            <p className="text-xs text-[#0077B6]/70 font-subtitles mt-1">
              Select your primary medical specialization
            </p>
          </motion.div>

          {/* Doctor Type */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
              Doctor Type *
            </label>
            <div className="relative">
              <Stethoscope className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0077B6]/60" />
              <Select
                options={doctorTypeOptions}
                value={formData.doctor_type ? doctorTypeOptions.find(option => option.value === formData.doctor_type) : null}
                onChange={(selected) => {
                  const selectedValue = selected ? selected.value : '';
                  handleInputChange({
                    target: {
                      name: 'doctor_type',
                      value: selectedValue
                    }
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                placeholder="Select your doctor type..."
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    paddingLeft: '48px',
                    borderRadius: '12px',
                    border: state.isFocused ? '2px solid #0077B6' : '2px solid #90E0EF',
                    boxShadow: state.isFocused ? '0 0 0 4px rgba(144, 224, 239, 0.3)' : 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    minHeight: '48px',
                    '&:hover': {
                      border: '2px solid #90E0EF'
                    }
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? '#0077B6' : state.isFocused ? '#90E0EF' : 'white',
                    color: state.isSelected ? 'white' : '#1E3E72',
                    '&:hover': {
                      backgroundColor: state.isSelected ? '#0077B6' : '#90E0EF'
                    }
                  })
                }}
              />
            </div>
            {errors.doctor_type && (
              <motion.p
                className="text-red-500 text-sm mt-2 font-subtitles"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.doctor_type}
              </motion.p>
            )}
            <p className="text-xs text-[#0077B6]/70 font-subtitles mt-1">
              Select your doctor type (International or Local)
            </p>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
              Professional Bio *
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-5 h-5 text-[#0077B6]/60" />
              <textarea
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:ring-4 focus:ring-[#90E0EF]/30 focus:border-[#0077B6] transition-all duration-300 bg-white/90 font-paragraphs resize-none placeholder:text-[#0077B6]/40 ${errors.bio ? 'border-red-500' : 'border-[#90E0EF]/50 hover:border-[#90E0EF]'}`}
                placeholder="Share your medical experience, specializations, and approach to patient care. This helps patients understand your expertise and builds trust."
              />
            </div>
            {errors.bio && (
              <motion.p
                className="text-red-500 text-sm mt-2 font-subtitles"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.bio}
              </motion.p>
            )}
          </motion.div>

          {/* Additional Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15 }}
            >
              <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
                Current Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0077B6]/60" />
                <input
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:ring-4 focus:ring-[#90E0EF]/30 focus:border-[#0077B6] transition-all duration-300 bg-white/90 font-paragraphs placeholder:text-[#0077B6]/40 border-[#90E0EF]/50 hover:border-[#90E0EF]`}
                  placeholder={locationDetectionFailed ? "Enter your location manually..." : (currentLocation || "Detecting your location...")}
                  readOnly={!locationDetectionFailed}
                />
              </div>
              <p className="text-xs text-[#0077B6]/70 font-subtitles mt-1">
                {locationDetectionFailed
                  ? "Please enter your location manually"
                  : "Your current location has been automatically detected"
                }
              </p>
            </motion.div>

            {/* Years of Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
                Years of Experience
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0077B6]/60" />
                <input
                  name="years_of_experience"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.years_of_experience || ''}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:ring-4 focus:ring-[#90E0EF]/30 focus:border-[#0077B6] transition-all duration-300 bg-white/90 font-paragraphs placeholder:text-[#0077B6]/40 border-[#90E0EF]/50 hover:border-[#90E0EF]`}
                  placeholder="5"
                />
              </div>
            </motion.div>

            {/* Nationality */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.25 }}
            >
              <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
                Nationality
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0077B6]/60 z-10" />
                <Select
                  options={nationalityOptions}
                  value={getSelectedNationality()}
                  onChange={handleNationalityChange}
                  placeholder="Select your nationality..."
                  isSearchable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      paddingLeft: '2rem',
                      borderRadius: '0.75rem',
                      border: state.isFocused ? '2px solid #0077B6' : '2px solid rgba(144, 224, 239, 0.5)',
                      boxShadow: state.isFocused ? '0 0 0 4px rgba(144, 224, 239, 0.3)' : 'none',
                      '&:hover': {
                        border: '2px solid rgba(144, 224, 239, 1)'
                      },
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      minHeight: '3rem',
                      fontSize: '0.875rem'
                    }),
                    placeholder: (provided) => ({
                      ...provided,
                      color: 'rgba(0, 119, 182, 0.4)'
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isSelected
                        ? '#0077B6'
                        : state.isFocused
                          ? 'rgba(144, 224, 239, 0.1)'
                          : 'white',
                      color: state.isSelected ? 'white' : '#1E3E72',
                      fontSize: '0.875rem'
                    })
                  }}
                />
              </div>
            </motion.div>

            {/* Languages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
            >
              <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
                Languages Spoken
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0077B6]/60 z-10" />
                <Select
                  isMulti
                  options={languageOptions}
                  value={getSelectedLanguages()}
                  onChange={handleLanguageChange}
                  placeholder="Select languages..."
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      paddingLeft: '48px',
                      borderRadius: '12px',
                      border: state.isFocused ? '2px solid #0077B6' : '2px solid #90E0EF',
                      boxShadow: state.isFocused ? '0 0 0 4px rgba(144, 224, 239, 0.3)' : 'none',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      minHeight: '48px',
                      '&:hover': {
                        border: '2px solid #90E0EF'
                      }
                    }),
                    multiValue: (provided) => ({
                      ...provided,
                      backgroundColor: '#0077B6',
                      color: 'white',
                      borderRadius: '8px'
                    }),
                    multiValueLabel: (provided) => ({
                      ...provided,
                      color: 'white'
                    }),
                    multiValueRemove: (provided) => ({
                      ...provided,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#005a8b',
                        color: 'white'
                      }
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isSelected ? '#0077B6' : state.isFocused ? '#90E0EF' : 'white',
                      color: state.isSelected ? 'white' : '#1E3E72',
                      '&:hover': {
                        backgroundColor: state.isSelected ? '#0077B6' : '#90E0EF'
                      }
                    })
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Terms and Sign In */}
          <TermsAndSignIn
            termsAccepted={termsAccepted}
            setTermsAccepted={setTermsAccepted}
            setShowTermsModal={setShowTermsModal}
            errors={errors}
          />

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r !bg-[#03045E] text-white py-4 px-6 rounded-xl font-semibold font-subtitles text-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            {isLoading ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Doctor Account</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default RegisterForm; 