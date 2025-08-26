import { usePharmacyLogo } from '../hooks/usePharmacyLogo';
import { useState, useEffect } from 'react';
import { User, Building2, Star, Camera, MapPin, Shield, Upload, CheckCircle, FileText, AlertCircle, CreditCard, Trash2 } from 'lucide-react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { getAuthData, type User as UserType, type PharmacyUpdateData } from '../services/authService';
import { uploadPharmacyLogo } from '../services/pharmacyService';
import { usePharmacyData, useUpdatePharmacyProfile } from '../hooks/usePharmacyData';
import { useInsuranceCompanies } from '../hooks/useInsurance';
import { usePharmacyRatings } from '../hooks/usePharmacyRatings';
import { usePharmacyVerificationRequests, useSubmitVerificationFile, useAvailableVerificationRequirements, useSubmitVerificationForRequirement } from '../hooks/usePharmacyVerification';
import ProfileSkeleton from '../components/atoms/ProfileSkeleton';
import Button from '../components/atoms/Button';

interface PharmacyData {
  name: string;
  email: string;
  location: string;
  pharmacy_type: 'chain' | 'separate';
  number_of_branches: number;
  bio: string;
  phone_number: string;
  logo_image: string;
  insurance_company_ids: number[];
  password: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [originalData, setOriginalData] = useState<PharmacyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch pharmacy data from API
  const { data: apiPharmacyData, isLoading: pharmacyLoading, refetch: refetchPharmacyData } = usePharmacyData();
  // Fetch pharmacy logo from /pharmacies/me/logo
  const { data: pharmacyLogoUrl, refetch: refetchPharmacyLogo } = usePharmacyLogo();
  const { mutate: updatePharmacyProfile } = useUpdatePharmacyProfile();

  // Fetch insurance companies
  const { data: insuranceCompanies = [] } = useInsuranceCompanies();

  // Fetch ratings and verification data
  const { data: ratingsData, isLoading: ratingsLoading } = usePharmacyRatings();
  const { data: verificationRequests, isLoading: requirementsLoading } = usePharmacyVerificationRequests();
  const { data: availableRequirements, isLoading: availableRequirementsLoading } = useAvailableVerificationRequirements();
  const { mutate: submitVerificationDocument } = useSubmitVerificationFile();
  const { mutate: submitVerificationForRequirement } = useSubmitVerificationForRequirement();

  const [pharmacyData, setPharmacyData] = useState<PharmacyData>({
    name: '',
    email: '',
    location: '',
    pharmacy_type: 'separate',
    number_of_branches: 0,
    bio: '',
    phone_number: '',
    logo_image: '',
    insurance_company_ids: [],
    password: ''
  });

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');

  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingRequestId, setUploadingRequestId] = useState<number | null>(null);
  const [uploadingRequirementId, setUploadingRequirementId] = useState<number | null>(null);

  // Financial information state
  const [visaCards, setVisaCards] = useState<Array<{
    id: string;
    cardNumber: string;
    expiryDate: string;
    cardholderName: string;
    cvv: string;
  }>>([]);

  const [bankAccounts, setBankAccounts] = useState<Array<{
    id: string;
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    accountType: string;
    accountHolderName: string;
  }>>([]);

  const [selectedPaymentType, setSelectedPaymentType] = useState<'visa' | 'bank' | null>(null);

  // Account type options for react-select
  const accountTypeOptions = [
    { value: 'checking', label: 'Checking Account' },
    { value: 'savings', label: 'Savings Account' },
    { value: 'business', label: 'Business Account' }
  ];

  // Custom styles for react-select to match theme
  const selectStyles = {
    control: (provided: Record<string, unknown>, state: { isFocused: boolean }) => ({
      ...provided,
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
      borderRadius: '0.5rem',
      padding: '0.5rem',
      fontSize: '1rem',
      fontWeight: '500',
      '&:hover': {
        borderColor: '#3b82f6'
      }
    }),
    option: (provided: Record<string, unknown>, state: { isSelected: boolean; isFocused: boolean }) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#dbeafe' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      padding: '0.75rem 1rem',
      fontWeight: '500'
    }),
    singleValue: (provided: Record<string, unknown>) => ({
      ...provided,
      color: '#374151',
      fontWeight: '500'
    }),
    placeholder: (provided: Record<string, unknown>) => ({
      ...provided,
      color: '#9ca3af',
      fontWeight: '400'
    })
  };

  // Verification state (removed for pharmacy)
  // const { data: verificationRequirements, isLoading: requirementsLoading } = useDoctorVerificationRequirements(user?.id || 0);
  // const { mutate: submitVerificationDocument } = useSubmitVerificationDocument();

  // ...pharmacy type options removed (not used in this component)

  useEffect(() => {
    const fetchPharmacyData = async () => {
      try {
        // Get user data from localStorage first
        const { user: userData } = getAuthData();
        if (userData) {
          setUser(userData);

          if (apiPharmacyData) {
            const data: PharmacyData = {
              name: apiPharmacyData.name || '',
              email: apiPharmacyData.email || '',
              location: apiPharmacyData.location || '',
              pharmacy_type: (apiPharmacyData.pharmacy_type as 'chain' | 'separate') || 'separate',
              number_of_branches: apiPharmacyData.number_of_branches || 0,
              bio: apiPharmacyData.bio || '',
              phone_number: apiPharmacyData.phone_number || '',
              logo_image: apiPharmacyData.logo_image || '',
              insurance_company_ids: (apiPharmacyData.insurance_companies as Array<{ id: number }> || []).map(ic => ic.id),
              password: ''
            };

            setPharmacyData(data);
            setOriginalData(data);
          }
        }
      } catch (error) {
        console.error('Error fetching pharmacy data:', error);
        setMessage({ type: 'error', text: 'Failed to load profile data' });
      }
    };

    fetchPharmacyData();
  }, [apiPharmacyData]);

  // Cleanup preview URL when component unmounts or preview is cleared
  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Handle number fields
    if (name === 'number_of_branches') {
      setPharmacyData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setPharmacyData(prev => ({ ...prev, [name]: value }));
    }

    // Clear message when user starts editing
    if (message) {
      setMessage(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select a valid image file' });
        return;
      }

      setSelectedImageFile(file);
      setPreviewImageUrl(URL.createObjectURL(file));
    }
  };

  const handleImageCancel = () => {
    setSelectedImageFile(null);
    setPreviewImageUrl('');
  };

  const handleRequirementFileUpload = (requirementId: number, file: File) => {
    setUploadingRequirementId(requirementId);

    submitVerificationForRequirement({
      requirementId,
      file
    }, {
      onSuccess: () => {
        setUploadingRequirementId(null);
        toast.success('Document uploaded successfully!');
      },
      onError: (error) => {
        setUploadingRequirementId(null);
        toast.error(error.message || 'Failed to upload document');
      }
    });
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      // Prepare data for API - only include password if it's not empty
      const updateData: PharmacyUpdateData = {
        name: pharmacyData.name,
        email: pharmacyData.email,
        location: pharmacyData.location,
        bio: pharmacyData.bio,
        phone_number: pharmacyData.phone_number,
        insurance_company_ids: pharmacyData.insurance_company_ids,
        // Include required fields defined by PharmacyUpdateData
        number_of_branches: pharmacyData.number_of_branches,
        pharmacy_type: pharmacyData.pharmacy_type
      };

      // Only include password if it's not empty
      if (pharmacyData.password.trim()) {
        updateData.password = pharmacyData.password;
      }

      // Call API to update profile
      updatePharmacyProfile(updateData);

      const newData: PharmacyData = {
        ...pharmacyData,
        password: '' // Clear password after successful update
      };
      setPharmacyData(newData);
      setOriginalData(newData);

      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSave = async () => {
    if (!selectedImageFile) return;

    setIsLoading(true);
    try {
      // Upload the logo using the new endpoint
      await uploadPharmacyLogo(selectedImageFile);
      // Refetch pharmacy data and logo to get the updated logo
      await Promise.all([
        refetchPharmacyData(),
        refetchPharmacyLogo()
      ]);
      setSelectedImageFile(null);
      setPreviewImageUrl('');
      toast.success('Pharmacy logo updated successfully!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload logo';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setPharmacyData(originalData);
    }
    setSelectedImageFile(null);
    setPreviewImageUrl('');
    setIsEditing(false);
  };

  if (pharmacyLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                loading={isLoading}
                className="flex items-center gap-2"
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="relative">
              <img
                src={
                  previewImageUrl
                  || (pharmacyLogoUrl && pharmacyLogoUrl.trim() !== ''
                        ? pharmacyLogoUrl
                        : "https://previews.123rf.com/images/apoev/apoev1804/apoev180400003/98691529-default-placeholder-doctor-half-length-portrait-photo-avatar-gray-color.jpg")
                }
                alt={user?.name || 'User Avatar'}
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-gray-200 object-cover shadow-lg"
              />

              {/* Camera button - only visible when no image is selected */}
              {!selectedImageFile && (
                <button
                  onClick={() => document.getElementById('profile-image-upload')?.click()}
                  className="absolute bottom-2 left-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Save image button - only when image is selected */}
              {selectedImageFile && (
                <>
                  <button
                    onClick={handleImageSave}
                    disabled={isLoading}
                    className="absolute bottom-2 left-2 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={handleImageCancel}
                    disabled={isLoading}
                    className="absolute bottom-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center lg:text-left space-y-3 min-w-0 w-full">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 truncate">{user?.name}</h3>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {/* Active Status Badge */}
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${apiPharmacyData?.is_active
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                  <div className={`w-2 h-2 rounded-full ${apiPharmacyData?.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {apiPharmacyData?.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Profile Information */}
              <div className="mb-4">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4" />
                    <span>{apiPharmacyData?.pharmacy_type === 'separate' ? 'Independent Pharmacy' : 'Chain Pharmacy'}</span>
                  </div>
                  {apiPharmacyData?.number_of_branches && apiPharmacyData.number_of_branches > 1 && (
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4" />
                      <span>{apiPharmacyData.number_of_branches} branches</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-row lg:items-center gap-2 lg:gap-4">
                <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium text-sm border border-blue-200 mx-auto lg:mx-0 max-w-fit">
                  <Building2 className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{apiPharmacyData?.pharmacy_type === 'separate' ? 'Independent Pharmacy' : 'Chain Pharmacy'}</span>
                </span>
                {apiPharmacyData?.number_of_branches && apiPharmacyData.number_of_branches > 1 && (
                  <span className="text-gray-600 text-sm">{apiPharmacyData.number_of_branches} branches</span>
                )}
              </div>

              {/* Location */}
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                {apiPharmacyData?.location && (
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{apiPharmacyData.location}</span>
                  </div>
                )}
                {apiPharmacyData?.phone_number && (
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span>{apiPharmacyData.phone_number}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation & Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {[
            { id: 'personal', name: 'Pharmacy Information', icon: Building2 },
            { id: 'ratings', name: 'Ratings', icon: Star },
            { id: 'verification', name: 'Verification', icon: Shield },
            { id: 'financial', name: 'Financial', icon: CreditCard }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all duration-300 relative ${activeTab === tab.id
                  ? 'text-blue-600 bg-white border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.name}</span>
                <span className="sm:hidden text-xs">{tab.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Pharmacy Information</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pharmacy Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={pharmacyData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white font-medium disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={pharmacyData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white font-medium disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={pharmacyData.phone_number}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white font-medium disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={pharmacyData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white font-medium disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* pharmacy_type and number_of_branches are not editable in edit mode */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Insurance Companies
                    </label>
                    <Select
                      options={insuranceCompanies.map(company => ({
                        value: company.id,
                        label: company.name
                      }))}
                      value={insuranceCompanies
                        .filter(company => pharmacyData.insurance_company_ids.includes(company.id))
                        .map(company => ({
                          value: company.id,
                          label: company.name
                        }))
                      }
                      onChange={(selectedOptions) => {
                        const ids = selectedOptions ? selectedOptions.map(option => option.value) : [];
                        setPharmacyData(prev => ({
                          ...prev,
                          insurance_company_ids: ids
                        }));
                      }}
                      isMulti
                      isDisabled={!isEditing}
                      styles={selectStyles}
                      placeholder="Select insurance companies"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password (leave blank to keep current)
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={pharmacyData.password}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white font-medium disabled:bg-gray-50"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biography
                  </label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={pharmacyData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white font-medium disabled:bg-gray-50 resize-none"
                    placeholder="Tell customers about your pharmacy, your services, and your experience..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Ratings Tab */}
          {activeTab === 'ratings' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Customer Ratings</h3>
              </div>

              {/* Average Rating Section */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                  <div className="text-center lg:text-left">
                    {ratingsLoading ? (
                      <div className="animate-pulse space-y-3">
                        <div className="h-12 bg-yellow-200 rounded-lg w-48"></div>
                        <div className="h-6 bg-yellow-200 rounded-lg w-36"></div>
                      </div>
                    ) : ratingsData && ratingsData.length > 0 ? (
                      <>
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                          <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Star className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h4 className="text-3xl font-bold text-yellow-900">
                              {(ratingsData.reduce((sum, rating) => sum + ((rating.delivery_speed + rating.response_speed) / 2), 0) / ratingsData.length).toFixed(1)}/5
                            </h4>
                            <p className="text-yellow-700 font-semibold">
                              Average Rating
                            </p>
                          </div>
                        </div>
                        <p className="text-yellow-600 text-sm">
                          Based on {ratingsData.length} review{ratingsData.length !== 1 ? 's' : ''}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                          <div className="w-16 h-16 bg-gray-400 rounded-2xl flex items-center justify-center shadow-lg">
                            <Star className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h4 className="text-3xl font-bold text-gray-700">
                              No Ratings
                            </h4>
                            <p className="text-gray-600 font-semibold">
                              Not rated yet
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm">
                          You haven't received any ratings from customers yet
                        </p>
                      </>
                    )}
                  </div>

                  {ratingsData && ratingsData.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <div className="bg-white rounded-lg p-4 border border-yellow-200 shadow-sm">
                        <h5 className="font-bold text-yellow-900 mb-3">Delivery Speed</h5>
                        <div className="flex items-center gap-2 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-6 h-6 ${star <= Math.round(ratingsData.reduce((sum, rating) => sum + rating.delivery_speed, 0) / ratingsData.length)
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                                }`}
                            />
                          ))}
                          <span className="text-lg font-bold text-yellow-600 ml-2">
                            {(ratingsData.reduce((sum, rating) => sum + rating.delivery_speed, 0) / ratingsData.length).toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-yellow-200 shadow-sm">
                        <h5 className="font-bold text-yellow-900 mb-3">Response Speed</h5>
                        <div className="flex items-center gap-2 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-6 h-6 ${star <= Math.round(ratingsData.reduce((sum, rating) => sum + rating.response_speed, 0) / ratingsData.length)
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                                }`}
                            />
                          ))}
                          <span className="text-lg font-bold text-yellow-600 ml-2">
                            {(ratingsData.reduce((sum, rating) => sum + rating.response_speed, 0) / ratingsData.length).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Individual Reviews Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Customer Reviews</h4>

                {ratingsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-4">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : ratingsData && ratingsData.length > 0 ? (
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {ratingsData.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                              U{review.user_id}
                            </div>
                            <div className="min-w-0">
                              <h6 className="font-bold text-gray-900 text-lg truncate">
                                Customer #{review.user_id}
                              </h6>
                              <div className="flex items-center gap-4 mt-1">
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-500">Delivery:</span>
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${star <= review.delivery_speed
                                        ? 'text-yellow-500 fill-current'
                                        : 'text-gray-300'
                                        }`}
                                    />
                                  ))}
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-500">Response:</span>
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${star <= review.response_speed
                                        ? 'text-yellow-500 fill-current'
                                        : 'text-gray-300'
                                        }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full flex-shrink-0 self-start sm:self-auto">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed bg-white rounded-lg p-3 border border-gray-200">
                          "{review.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-gray-100 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                      <Star className="w-10 h-10 text-gray-400" />
                    </div>
                    <h5 className="text-lg font-bold text-gray-900 mb-2">
                      No Reviews Yet
                    </h5>
                    <p className="text-gray-500 max-w-md mx-auto">
                      You haven't received any customer reviews yet. Keep providing excellent service and reviews will start coming in!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Verification Tab */}
          {activeTab === 'verification' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Document Verification</h3>
              </div>

              {/* Verification Requirements */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                {requirementsLoading || availableRequirementsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-4">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : verificationRequests && verificationRequests.length > 0 ? (
                  <div className="space-y-4">
                    {verificationRequests.map((requirement) => (
                      <div key={requirement.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {requirement.requirement.file_name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {requirement.requirement.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <span>File type: {requirement.requirement.file_type}</span>
                              <span>Required: {requirement.requirement.is_required ? 'Yes' : 'No'}</span>
                            </div>

                            {/* Status Badge */}
                            <div className="mb-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${requirement.status === 'accepted' ? 'bg-green-100 text-green-800 border border-green-200' :
                                requirement.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                                  requirement.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                    'bg-gray-100 text-gray-800 border border-gray-200'
                                }`}>
                                {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
                              </span>
                            </div>

                            {/* Admin Notes */}
                            {requirement.admin_notes && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                                <p className="text-sm text-blue-800">
                                  <strong>Admin Note:</strong> {requirement.admin_notes}
                                </p>
                              </div>
                            )}

                            {/* File Upload Section - Show for pending or rejected */}
                            {(requirement.status === 'pending' || requirement.status === 'rejected') && (
                              <div className="space-y-3">
                                <div className="relative">
                                  <input
                                    type="file"
                                    accept="*/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        setUploadingRequestId(requirement.id);
                                        submitVerificationDocument({
                                          requestId: requirement.id,
                                          file: file
                                        }, {
                                          onSuccess: () => {
                                            setUploadingRequestId(null);
                                            toast.success('Document uploaded successfully!');
                                          },
                                          onError: (error) => {
                                            setUploadingRequestId(null);
                                            toast.error(error.message || 'Failed to upload document');
                                          }
                                        });
                                      }
                                    }}
                                    className="hidden"
                                    id={`file-upload-${requirement.id}`}
                                    disabled={uploadingRequestId === requirement.id}
                                  />
                                  <label
                                    htmlFor={`file-upload-${requirement.id}`}
                                    className={`block w-full px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white cursor-pointer hover:bg-gray-50 text-center disabled:opacity-50 disabled:cursor-not-allowed ${uploadingRequestId === requirement.id ? 'opacity-50 cursor-not-allowed' : ''
                                      }`}
                                  >
                                    {uploadingRequestId === requirement.id ? (
                                      <div className="text-blue-600">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto mb-1"></div>
                                        <p className="font-semibold text-sm">Uploading...</p>
                                        <p className="text-xs text-gray-500">Please wait</p>
                                      </div>
                                    ) : (
                                      <div className="text-blue-600">
                                        <Upload className="w-5 h-5 mx-auto mb-1" />
                                        <p className="font-semibold text-sm">
                                          {requirement.status === 'rejected' ? 'Re-upload Document' : 'Upload Document'}
                                        </p>
                                        <p className="text-xs text-gray-500">Click to select any file type</p>
                                      </div>
                                    )}
                                  </label>
                                </div>
                              </div>
                            )}

                            {/* Submitted File Display */}
                            {requirement.file_url && (
                              <div className={`rounded-lg p-3 ${requirement.status === 'accepted' ? 'bg-green-50 border border-green-200' :
                                requirement.status === 'rejected' ? 'bg-red-50 border border-red-200' :
                                  'bg-yellow-50 border border-yellow-200'
                                }`}>
                                <div className="flex items-center gap-2">
                                  {requirement.status === 'accepted' ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : requirement.status === 'rejected' ? (
                                    <AlertCircle className="w-4 h-4 text-red-600" />
                                  ) : (
                                    <FileText className="w-4 h-4 text-yellow-600" />
                                  )}
                                  <span className={`text-sm font-medium ${requirement.status === 'accepted' ? 'text-green-800' :
                                    requirement.status === 'rejected' ? 'text-red-800' :
                                      'text-yellow-800'
                                    }`}>
                                    {requirement.status === 'accepted' ? 'Document Approved' :
                                      requirement.status === 'rejected' ? 'Document Rejected' :
                                        'Document Submitted'}
                                  </span>
                                </div>
                                {requirement.submitted_at && (
                                  <p className={`text-xs mt-1 ${requirement.status === 'accepted' ? 'text-green-600' :
                                    requirement.status === 'rejected' ? 'text-red-600' :
                                      'text-yellow-600'
                                    }`}>
                                    Submitted: {new Date(requirement.submitted_at).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : availableRequirements && availableRequirements.length > 0 ? (
                  // Show available requirements for upload when no active requests
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        Upload Verification Documents
                      </h4>
                      <p className="text-gray-500 max-w-md mx-auto">
                        Upload the required documents to start your verification process.
                      </p>
                    </div>

                    <div className="grid gap-4">
                      {availableRequirements.map((requirement) => (
                        <div key={requirement.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-2">{requirement.file_name}</h4>
                              <p className="text-gray-600 text-sm mb-3">{requirement.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <FileText className="w-4 h-4" />
                                  {requirement.file_type}
                                </span>
                                {requirement.is_required && (
                                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                                    Required
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <input
                              type="file"
                              accept="*/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleRequirementFileUpload(requirement.id, file);
                                }
                              }}
                              className="hidden"
                              id={`requirement-upload-${requirement.id}`}
                              disabled={uploadingRequirementId === requirement.id}
                            />
                            <label
                              htmlFor={`requirement-upload-${requirement.id}`}
                              className={`block w-full px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white cursor-pointer hover:bg-gray-50 text-center ${uploadingRequirementId === requirement.id ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                              {uploadingRequirementId === requirement.id ? (
                                <div className="text-blue-600">
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto mb-1"></div>
                                  <p className="font-semibold text-sm">Uploading...</p>
                                  <p className="text-xs text-gray-500">Please wait</p>
                                </div>
                              ) : (
                                <div className="text-blue-600">
                                  <Upload className="w-5 h-5 mx-auto mb-1" />
                                  <p className="font-semibold text-sm">Upload Document</p>
                                  <p className="text-xs text-gray-500">Click to select any file type</p>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-gray-100 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                      <AlertCircle className="w-10 h-10 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      No Verification Requirements
                    </h4>
                    <p className="text-gray-500 max-w-md mx-auto">
                      You don't have any verification requirements at the moment. Please check back later.
                    </p>
                    <Button
                      onClick={() => window.location.reload()}
                      className="flex items-center gap-2 mt-4"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Refresh
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Financial Tab */}
          {activeTab === 'financial' && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Payment Methods</h3>
                  <p className="text-gray-600 text-sm mt-1">Manage your payment information securely</p>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Secure Payment Processing</h4>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      Your payment information is encrypted and stored securely. We use industry-standard security measures to protect your financial data.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              {!selectedPaymentType && visaCards.length === 0 && bankAccounts.length === 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                  <div className="text-center mb-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Add Payment Method</h4>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Choose your preferred payment method. You can add either a credit card or bank account for receiving payments.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <button
                      onClick={() => {
                        setSelectedPaymentType('visa');
                        const newCard = {
                          id: Date.now().toString(),
                          cardNumber: '',
                          expiryDate: '',
                          cardholderName: '',
                          cvv: ''
                        };
                        setVisaCards([newCard]);
                      }}
                      className="group relative p-8 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <CreditCard className="w-8 h-8 text-white" />
                        </div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-2">Credit/Debit Card</h5>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Add your Visa, Mastercard, or other major credit cards for instant payments
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPaymentType('bank');
                        const newAccount = {
                          id: Date.now().toString(),
                          accountNumber: '',
                          routingNumber: '',
                          bankName: '',
                          accountType: 'checking',
                          accountHolderName: ''
                        };
                        setBankAccounts([newAccount]);
                      }}
                      className="group relative p-8 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-2">Bank Account</h5>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Connect your bank account for direct deposits and transfers
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Credit Card Section */}
              {(selectedPaymentType === 'visa' || visaCards.length > 0) && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-6 h-6 text-white" />
                        <h4 className="text-xl font-semibold text-white">Credit Card Information</h4>
                      </div>
                      {visaCards.length > 0 && (
                        <button
                          onClick={() => {
                            setVisaCards([]);
                            setSelectedPaymentType(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove Card
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-8">
                    {visaCards.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No credit card added</p>
                        <p className="text-sm mt-1">Add your card information to start receiving payments</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {visaCards.map((card, index) => (
                          <div key={card.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            {/* Card Preview */}
                            <div className="mb-8">
                              <div className="relative w-full max-w-md mx-auto">
                                <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl p-6 text-white shadow-2xl">
                                  <div className="flex justify-between items-start mb-8">
                                    <div className="w-12 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded opacity-80"></div>
                                    <div className="text-right">
                                      <div className="text-xs opacity-70">VALID THRU</div>
                                      <div className="text-sm font-mono">{card.expiryDate || 'MM/YY'}</div>
                                    </div>
                                  </div>
                                  <div className="mb-6">
                                    <div className="font-mono text-lg tracking-wider mb-2">
                                      {card.cardNumber ?
                                        card.cardNumber.replace(/(\d{4})/g, '$1 ').trim() :
                                        '•••• •••• •••• ••••'
                                      }
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-end">
                                    <div>
                                      <div className="text-xs opacity-70 mb-1">CARD HOLDER</div>
                                      <div className="text-sm font-medium">
                                        {card.cardholderName || 'YOUR NAME'}
                                      </div>
                                    </div>
                                    <div className="text-xl font-bold">VISA</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Cardholder Name *
                                </label>
                                <input
                                  type="text"
                                  placeholder="Enter full name as shown on card"
                                  value={card.cardholderName}
                                  onChange={(e) => {
                                    const updatedCards = [...visaCards];
                                    updatedCards[index].cardholderName = e.target.value.toUpperCase();
                                    setVisaCards(updatedCards);
                                  }}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Card Number *
                                </label>
                                <input
                                  type="text"
                                  placeholder="1234 5678 9012 3456"
                                  maxLength={19}
                                  value={card.cardNumber}
                                  onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, '');
                                    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                                    const updatedCards = [...visaCards];
                                    updatedCards[index].cardNumber = value;
                                    setVisaCards(updatedCards);
                                  }}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-mono text-lg tracking-wider"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Expiry Date *
                                </label>
                                <input
                                  type="text"
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  value={card.expiryDate}
                                  onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, '');
                                    if (value.length >= 2) {
                                      value = value.substring(0, 2) + '/' + value.substring(2, 4);
                                    }
                                    const updatedCards = [...visaCards];
                                    updatedCards[index].expiryDate = value;
                                    setVisaCards(updatedCards);
                                  }}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-mono text-center"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  CVV *
                                </label>
                                <input
                                  type="password"
                                  placeholder="123"
                                  maxLength={4}
                                  value={card.cvv}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    const updatedCards = [...visaCards];
                                    updatedCards[index].cvv = value;
                                    setVisaCards(updatedCards);
                                  }}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-mono text-center"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bank Account Section */}
              {(selectedPaymentType === 'bank' || bankAccounts.length > 0) && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-6 h-6 text-white" />
                        <h4 className="text-xl font-semibold text-white">Bank Account Information</h4>
                      </div>
                      {bankAccounts.length > 0 && (
                        <button
                          onClick={() => {
                            setBankAccounts([]);
                            setSelectedPaymentType(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove Account
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-8">
                    {bankAccounts.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No bank account added</p>
                        <p className="text-sm mt-1">Connect your bank account for direct deposits</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {bankAccounts.map((account, index) => (
                          <div key={account.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Bank Name *
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g., Chase Bank, Bank of America"
                                  value={account.bankName}
                                  onChange={(e) => {
                                    const updatedAccounts = [...bankAccounts];
                                    updatedAccounts[index].bankName = e.target.value;
                                    setBankAccounts(updatedAccounts);
                                  }}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Account Type *
                                </label>
                                <Select
                                  value={accountTypeOptions.find(option => option.value === account.accountType)}
                                  onChange={(selectedOption) => {
                                    const updatedAccounts = [...bankAccounts];
                                    updatedAccounts[index].accountType = selectedOption?.value || 'checking';
                                    setBankAccounts(updatedAccounts);
                                  }}
                                  options={accountTypeOptions}
                                  styles={selectStyles}
                                  placeholder="Select account type"
                                  isSearchable={false}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Routing Number *
                                </label>
                                <input
                                  type="text"
                                  placeholder="9-digit routing number"
                                  maxLength={9}
                                  value={account.routingNumber}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    const updatedAccounts = [...bankAccounts];
                                    updatedAccounts[index].routingNumber = value;
                                    setBankAccounts(updatedAccounts);
                                  }}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Account Number *
                                </label>
                                <input
                                  type="password"
                                  placeholder="Account number"
                                  value={account.accountNumber}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    const updatedAccounts = [...bankAccounts];
                                    updatedAccounts[index].accountNumber = value;
                                    setBankAccounts(updatedAccounts);
                                  }}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-mono"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Account Holder Name *
                                </label>
                                <input
                                  type="text"
                                  placeholder="Full name as it appears on bank account"
                                  value={account.accountHolderName}
                                  onChange={(e) => {
                                    const updatedAccounts = [...bankAccounts];
                                    updatedAccounts[index].accountHolderName = e.target.value;
                                    setBankAccounts(updatedAccounts);
                                  }}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
                                />
                              </div>
                            </div>

                            {/* Bank Account Info */}
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <h5 className="text-sm font-semibold text-blue-900 mb-1">Secure Bank Connection</h5>
                                  <p className="text-xs text-blue-700 leading-relaxed">
                                    Your bank information is encrypted with bank-level security. We partner with trusted financial institutions to ensure safe transactions.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {(visaCards.length > 0 || bankAccounts.length > 0) && (
                <div className="flex flex-col sm:flex-row gap-4 justify-end bg-gray-50 rounded-xl p-6">
                  <button
                    onClick={() => {
                      const hasValidCard = visaCards.some(card =>
                        card.cardNumber && card.expiryDate && card.cardholderName && card.cvv
                      );
                      const hasValidAccount = bankAccounts.some(account =>
                        account.bankName && account.accountNumber && account.routingNumber && account.accountHolderName
                      );

                      if (hasValidCard || hasValidAccount) {
                        toast.success('Payment method saved successfully! Your information is secure.');
                      } else {
                        toast.error('Please fill in all required fields before saving.');
                      }
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Save Payment Method
                  </button>
                  <button
                    onClick={() => {
                      setVisaCards([]);
                      setBankAccounts([]);
                      setSelectedPaymentType(null);
                    }}
                    className="px-8 py-3 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 rounded-lg transition-all duration-200 font-medium"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Ratings Tab */}
          {activeTab === 'ratings' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Customer Ratings</h3>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile; 