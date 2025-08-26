import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { saveAuthData, registerDoctor, type RegisterData } from '../services/authService';

export const useRegisterForm = (termsAccepted: boolean) => {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    age: 0,
    email: '',
    password: '',
    specialization: '',
    bio: '',
    phone_number: '',
    profile_image: undefined, // Changed from base64 string to File
    location: '',
    years_of_experience: 0,
    nationality: '',
    languages: '',
    doctor_type: ''
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profilePreview, setProfilePreview] = useState<string>('');

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Handle age and years_of_experience conversion to number
    if (name === 'age' || name === 'years_of_experience') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profile_image: 'Image size must be less than 5MB'
        }));
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          profile_image: 'Please select a valid image file'
        }));
        return;
      }

      // Store the File object directly
      setFormData(prev => ({
        ...prev,
        profile_image: file
      }));

      // Create preview URL for display
      const previewUrl = URL.createObjectURL(file);
      setProfilePreview(previewUrl);

      // Clear error
      if (errors.profile_image) {
        setErrors(prev => ({
          ...prev,
          profile_image: ''
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else {
      // Remove all non-digit characters except + for validation
      const cleaned = formData.phone_number.replace(/[^\d+]/g, '');
      
      // Check if it starts with + (international format)
      if (cleaned.startsWith('+')) {
        // International format: +[country code][number] (minimum 10 digits total)
        const digitsOnly = cleaned.replace(/\+/, '');
        if (digitsOnly.length < 10 || digitsOnly.length > 15) {
          newErrors.phone_number = 'International phone number must be 10-15 digits';
        }
      } else {
        // Local format: just digits (10-15 digits)
        if (cleaned.length < 10 || cleaned.length > 15) {
          newErrors.phone_number = 'Phone number must be 10-15 digits';
        }
      }
    }

    if (!formData.age || formData.age < 18) {
      newErrors.age = 'Age must be 18 or older';
    }

    if (!formData.specialization) {
      newErrors.specialization = 'Specialization is required';
    }

    if (!formData.doctor_type) {
      newErrors.doctor_type = 'Doctor type is required';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    }

    if (!termsAccepted) {
      newErrors.terms = 'You must accept the Terms and Services';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await registerDoctor(formData);

      if (response.token && response.user) {
        saveAuthData(response.token, response.user);
        toast.success('Registration successful! Welcome to HEARSTO.');
        navigate('/dashboard');
      } else {
        const successMsg = response.message || 'Registration successful! Please log in.';
        setErrors({ general: successMsg });
        toast.success(successMsg);
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';

      // Parse field-specific errors from the error message
      const fieldErrors: Record<string, string> = {};

      // Handle the new error format: "An error occurred: 400: Doctor with email abobkracc@gmail.com already exists"
      if (errorMessage.includes('Doctor with email') && errorMessage.includes('already exists')) {
        fieldErrors.email = 'A doctor with this email already exists. Please use a different email address.';
      } else if (errorMessage.includes('email')) {
        fieldErrors.email = 'This email address is already registered. Please use a different email.';
      } else if (errorMessage.includes('phone')) {
        fieldErrors.phone_number = 'This phone number is already registered. Please use a different phone number.';
      } else if (errorMessage.includes('name')) {
        fieldErrors.name = 'This name is already in use. Please use a different name.';
      } else {
        // For other errors, show as general error
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        toast.error('Please fix the validation errors below.');
      } else {
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
    setConfirmPassword,
  };
}; 