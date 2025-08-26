import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Eye, EyeOff, Upload, ArrowRight, Mail, Lock, Phone, MapPin, Building, RotateCcw } from 'lucide-react';
import type { PharmacyRegisterData } from '../../services/authService';
import { usePharmacyRegister } from '../../hooks/usePharmacyRegister';
import { useInsuranceCompanies } from '../../hooks/useInsurance';
import { handleImageError } from '../../utils/imageUtils';
import '../../styles/ReactSelect.css';

interface PharmacyRegisterFormProps {
  onSubmit?: (data: PharmacyRegisterData) => Promise<void>;
}

interface SelectOption {
  value: string | number;
  label: string;
}

export const PharmacyRegisterForm: React.FC<PharmacyRegisterFormProps> = ({
  onSubmit,
}) => {
  const navigate = useNavigate();
  const { register, isLoading, error, isSuccess, clearError } = usePharmacyRegister();

  // Fetch insurance companies from API
  const { data: insuranceCompaniesData, isLoading: insuranceLoading } = useInsuranceCompanies();

  const [formData, setFormData] = useState<PharmacyRegisterData>({
    name: '',
    email: '',
    password: '',
    location: '',
    bio: '',
    phone_number: '',
    logo: null,
    insurance_company_ids: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedInsuranceIds, setSelectedInsuranceIds] = useState<number[]>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [manualLocationEntry, setManualLocationEntry] = useState(false);

  // Get insurance companies from API
  const insuranceCompanies = insuranceCompaniesData || [];

  // Handle successful registration
  useEffect(() => {
    if (isSuccess) {
      navigate('/dashboard');
    }
  }, [isSuccess, navigate]);

  // Auto-detect location on component mount
  useEffect(() => {
    const detectLocation = async () => {
      if (!navigator.geolocation) {
        setManualLocationEntry(true);
        return;
      }

      setIsLocationLoading(true);

      const timeoutId = setTimeout(() => {
        setIsLocationLoading(false);
        setManualLocationEntry(true);
      }, 10000); // 10 second timeout

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          clearTimeout(timeoutId);
          const { latitude, longitude } = position.coords;

          try {
            // Use reverse geocoding to get location name
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );

            if (response.ok) {
              const data = await response.json();
              const location = `${data.city || data.locality || ''}, ${data.countryName || ''}`.replace(/^,\s*/, '');

              if (location && location !== ', ') {
                setFormData(prev => ({ ...prev, location }));
                setLocationDetected(true);
              } else {
                setManualLocationEntry(true);
              }
            } else {
              setManualLocationEntry(true);
            }
          } catch (error) {
            console.error('Error getting location name:', error);
            setManualLocationEntry(true);
          } finally {
            setIsLocationLoading(false);
          }
        },
        (error) => {
          clearTimeout(timeoutId);
          console.error('Geolocation error:', error);
          setIsLocationLoading(false);
          setManualLocationEntry(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 300000 // 5 minutes
        }
      );
    };

    detectLocation();
  }, []);

  const retryLocationDetection = () => {
    setIsLocationLoading(true);
    setManualLocationEntry(false);
    setLocationDetected(false);
    setFormData(prev => ({ ...prev, location: '' }));

    const timeoutId = setTimeout(() => {
      setIsLocationLoading(false);
      setManualLocationEntry(true);
    }, 10000);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(timeoutId);
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );

          if (response.ok) {
            const data = await response.json();
            const location = `${data.city || data.locality || ''}, ${data.countryName || ''}`.replace(/^,\s*/, '');

            if (location && location !== ', ') {
              setFormData(prev => ({ ...prev, location }));
              setLocationDetected(true);
            } else {
              setManualLocationEntry(true);
            }
          } else {
            setManualLocationEntry(true);
          }
        } catch (error) {
          console.error('Error getting location name:', error);
          setManualLocationEntry(true);
        } finally {
          setIsLocationLoading(false);
        }
      },
      (error) => {
        clearTimeout(timeoutId);
        console.error('Geolocation error:', error);
        setIsLocationLoading(false);
        setManualLocationEntry(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 300000
      }
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsuranceChange = (selectedOptions: readonly SelectOption[]) => {
    const selectedIds = selectedOptions.map(option => option.value as number);
    setSelectedInsuranceIds(selectedIds);
    setFormData(prevData => ({
      ...prevData,
      insurance_company_ids: selectedIds,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        await register(formData);
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
      {/* Form Header */}
      <div className="bg-[#03045E] px-8 py-6 text-center">
        <h3 className="text-xl lg:text-2xl font-bold font-headlines text-white mb-2">
          Create Your Hospital Profile
        </h3>
        <p className="text-[#CAF0F8] font-subtitles text-sm">
          Join thousands of Hospital professionals making a difference
        </p>
      </div>

      {/* Form Content */}
      <div className="px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative group">
              <div className="w-24 h-24 bg-gradient-to-br from-[#CAF0F8]/30 to-[#90E0EF]/30 rounded-full flex items-center justify-center border-4 border-[#90E0EF]/50 overflow-hidden hover:border-[#0077B6] transition-all duration-300">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-cover"
                    onError={(e) => handleImageError(e, 'default')}
                  />
                ) : (
                  <Building className="w-8 h-8 text-[#0077B6]" />
                )}
              </div>
              <label htmlFor="logoImage" className="absolute -bottom-1 -right-1 bg-[#03045E] text-white p-2 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg">
                <Upload className="w-4 h-4" />
              </label>
              <input
                id="logoImage"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
            <p className="text-xs text-[#0077B6]/70 font-subtitles text-center">
              Upload your Hospital logo
            </p>
            {errors.logo && (
              <p className="text-red-500 text-xs font-subtitles">
                {errors.logo}
              </p>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
              <button
                type="button"
                onClick={clearError}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pharmacy Name */}
            <div>
              <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
                Hospital Name *
              </label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0077B6]/60" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:ring-4 focus:ring-[#90E0EF]/30 focus:border-[#0077B6] transition-all duration-300 bg-white/90 font-paragraphs placeholder:text-[#0077B6]/40 ${errors.name ? 'border-red-500' : 'border-[#90E0EF]/50 hover:border-[#90E0EF]'
                    }`}
                  placeholder="Enter Hospital name"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-2 font-subtitles">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0077B6]/60" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:ring-4 focus:ring-[#90E0EF]/30 focus:border-[#0077B6] transition-all duration-300 bg-white/90 font-paragraphs placeholder:text-[#0077B6]/40 ${errors.email ? 'border-red-500' : 'border-[#90E0EF]/50 hover:border-[#90E0EF]'
                    }`}
                  placeholder="Hospital@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-2 font-subtitles">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0077B6]/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 focus:ring-4 focus:ring-[#90E0EF]/30 focus:border-[#0077B6] transition-all duration-300 bg-white/90 font-paragraphs placeholder:text-[#0077B6]/40 ${errors.password ? 'border-red-500' : 'border-[#90E0EF]/50 hover:border-[#90E0EF]'
                    }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0077B6]/60 hover:text-[#0077B6] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-2 font-subtitles">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0077B6]/60" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 focus:ring-4 focus:ring-[#90E0EF]/30 focus:border-[#0077B6] transition-all duration-300 bg-white/90 font-paragraphs placeholder:text-[#0077B6]/40 ${errors.confirmPassword ? 'border-red-500' : 'border-[#90E0EF]/50 hover:border-[#90E0EF]'
                    }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0077B6]/60 hover:text-[#0077B6] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-2 font-subtitles">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0077B6]/60" />
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number || ''}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:ring-4 focus:ring-[#90E0EF]/30 focus:border-[#0077B6] transition-all duration-300 bg-white/90 font-paragraphs placeholder:text-[#0077B6]/40 ${errors.phone_number ? 'border-red-500' : 'border-[#90E0EF]/50 hover:border-[#90E0EF]'
                    }`}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              {errors.phone_number && (
                <p className="text-red-500 text-sm mt-2 font-subtitles">
                  {errors.phone_number}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
                Location
                {isLocationLoading && (
                  <span className="ml-2 text-xs text-[#0077B6]">(Detecting location...)</span>
                )}
                {locationDetected && (
                  <span className="ml-2 text-xs text-green-600">(Location detected)</span>
                )}
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0077B6]/60" />
                {isLocationLoading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-[#0077B6]/30 border-t-[#0077B6] rounded-full animate-spin"></div>
                  </div>
                )}
                {(manualLocationEntry || !locationDetected) && !isLocationLoading && (
                  <button
                    type="button"
                    onClick={retryLocationDetection}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0077B6] hover:text-[#03045E] transition-colors"
                    title="Retry location detection"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}

                {locationDetected && !manualLocationEntry ? (
                  // Show detected location as read-only
                  <div
                    className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-green-500/50 bg-green-50/50 font-paragraphs text-[#1E3E72] cursor-default"
                  >
                    {formData.location}
                  </div>
                ) : (
                  // Show input field for manual entry
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    disabled={isLocationLoading}
                    className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 focus:ring-4 focus:ring-[#90E0EF]/30 focus:border-[#0077B6] transition-all duration-300 bg-white/90 font-paragraphs placeholder:text-[#0077B6]/40 ${isLocationLoading ? 'opacity-70 cursor-not-allowed' : ''
                      } ${errors.location ? 'border-red-500' : 'border-[#90E0EF]/50 hover:border-[#90E0EF]'
                      }`}
                    placeholder={isLocationLoading ? "Detecting your location..." : "City, Country"}
                  />
                )}
              </div>
              {manualLocationEntry && !locationDetected && !isLocationLoading && (
                <p className="text-xs text-[#0077B6]/70 mt-1 font-subtitles">
                  Automatic location detection failed. Please enter manually or click the retry button.
                </p>
              )}
              {locationDetected && !manualLocationEntry && (
                <p className="text-xs text-green-600/70 mt-1 font-subtitles">
                  Location automatically detected.
                </p>
              )}
              {errors.location && (
                <p className="text-red-500 text-sm mt-2 font-subtitles">
                  {errors.location}
                </p>
              )}
            </div>

            {/* Insurance Companies */}
            <div className='col-span-2'>
              <label className="block  text-sm font-semibold font-subtitles text-[#1E3E72] mb-3">
                Insurance Companies Accepted
              </label>
              <p className="text-sm text-[#0077B6]/70 font-subtitles mb-4">
                Select insurance companies you work with:
              </p>
              <Select
                isMulti
                isLoading={insuranceLoading}
                value={insuranceCompanies
                  .filter(company => selectedInsuranceIds.includes(company.id))
                  .map(company => ({ value: company.id, label: company.name }))
                }
                onChange={(selectedOptions) => handleInsuranceChange(selectedOptions as readonly SelectOption[])}
                options={insuranceCompanies.map(company => ({
                  value: company.id,
                  label: company.name
                }))}
                className="react-select-container w-full"
                classNamePrefix="react-select"
                placeholder={insuranceLoading ? "Loading insurance companies..." : "Select insurance companies..."}
                noOptionsMessage={() => insuranceLoading ? "Loading..." : "No insurance companies found"}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    padding: '0.5rem',
                    borderRadius: '0.75rem',
                    border: `2px solid ${errors.insurance_company_ids ? '#ef4444' : state.isFocused ? '#0077B6' : '#90E0EF80'}`,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: state.isFocused ? '0 0 0 4px rgba(144, 224, 239, 0.3)' : 'none',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit',
                    minHeight: '3.5rem',
                    '&:hover': {
                      borderColor: errors.insurance_company_ids ? '#ef4444' : '#90E0EF'
                    }
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#CAF0F8',
                    borderRadius: '0.5rem',
                    margin: '0.125rem'
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: '#1E3E72',
                    fontWeight: '500',
                    fontFamily: 'inherit',
                    padding: '0.25rem 0.5rem'
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: '#0077B6',
                    borderRadius: '0 0.5rem 0.5rem 0',
                    padding: '0.25rem',
                    '&:hover': {
                      backgroundColor: '#90E0EF',
                      color: '#03045E'
                    }
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: 'rgba(0, 119, 182, 0.4)',
                    fontFamily: 'inherit'
                  }),
                  option: (base, state) => ({
                    ...base,
                    color: state.isSelected ? 'white' : '#1E3E72',
                    backgroundColor: state.isSelected ? '#0077B6' : state.isFocused ? '#CAF0F8' : 'white',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: state.isSelected ? '#0077B6' : '#CAF0F8',
                      color: state.isSelected ? 'white' : '#03045E'
                    }
                  }),
                  menu: (base) => ({
                    ...base,
                    border: '2px solid #90E0EF80',
                    borderRadius: '0.75rem',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden'
                  }),
                  menuList: (base) => ({
                    ...base,
                    padding: '0.5rem 0',
                    borderRadius: '0.75rem'
                  })
                }}
              />
              {errors.insurance_company_ids && (
                <p className="text-red-500 text-sm mt-2 font-subtitles">
                  {errors.insurance_company_ids}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex col-span-2 w-full justify-center  pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative px-8 w-full py-4 bg-[#03045E] text-white font-bold font-headlines rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[200px] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                <span className="flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                      Creating Profile...
                    </>
                  ) : (
                    <>
                      Create Hospital Profile
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div >
    </div >
  );
};
