import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Heart, Shield, Users, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginPharmacy, saveAuthData } from '../../services/authService';
import type { LoginData } from '../../services/authService';
import { useAppStore } from '../../store/useAppStore';
import logoImage from '../../assets/logo.svg';
import PharmacyNavbar from '../../components/PharmacyNavbar';
import Footer from '../../components/Footer';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  });



  const [showPassword, setShowPassword] = useState(false);
  // const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const { login } = useAppStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      console.log('DEBUG validateForm errors', newErrors);
    }
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await loginPharmacy(formData);

      console.log('DEBUG response', response);

      if (response) {
        // Convert doctor data to user format for storage

        const HospitalData = {
          id: response.id || '',
          name: response.name || '',
          age: 0, // Not applicable for pharmacy
          email: response.email || '',
          bio: response.bio || '',
          phone_number: response.phone_number || '',

        };

        // Store hospital data in localStorage
        localStorage.setItem('hospitalData', JSON.stringify(HospitalData));
        // Save auth data (token and hospital data)
        saveAuthData(response.access_token, {
          ...HospitalData,
          specialization: '', // Not applicable for pharmacy
          profile_image_url: '', // Not applicable for pharmacy
          created_at: '', // Not applicable for pharmacy
          updated_at: '', // Not applicable for pharmacy
        });

        // Also update Zustand store with required User fields
        login({
          ...HospitalData,
          specialization: '',
          profile_image_url: '',
          created_at: '',
          updated_at: '',
        }, response.access_token);

        // Check if pharmacy is active
        toast.success('Welcome back! Pharmacy login successful.');
        // Small delay to ensure storage operations are complete
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);

      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  };

  return (
    <>
      <PharmacyNavbar />
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <motion.div
          className="w-full max-w-[95%] lg:max-w-[80vw] mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Side - Branding & Features */}
          <motion.div
            className="text-center hidden lg:block max-w-7xl lg:text-left space-y-8"
            variants={itemVariants}
          >
            {/* Logo & Brand */}
            <div className="space-y-4">
              <motion.div
                className="flex items-left justify-center lg:justify-start gap-4"
              >

                <div>
                  <img src={logoImage} alt="HEARSTO" className="w-62 " />
                  <p className="text-sm font-medium text-[#0077B6]/80 tracking-wider">
                    EARLY DETECTION BETTER TOMORROW
                  </p>
                </div>
              </motion.div>

              <motion.p
                className="text-lg lg:text-xl text-[#1E3E72]/80 font-subtitles max-w-md mx-auto lg:mx-0"
                variants={itemVariants}
              >
                Your comprehensive pharmacy management platform for modern pharmaceutical practice
              </motion.p>
            </div>

            {/* Features Grid */}
            <motion.div
              className="grid grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0"
              variants={itemVariants}
            >
              {[
                { icon: Heart, title: "Prescription Management", desc: "Digital prescriptions" },
                { icon: Shield, title: "Secure Storage", desc: "HIPAA compliant" },
                { icon: Users, title: "Insurance Integration", desc: "Multiple providers" },
                { icon: Zap, title: "Inventory Tracking", desc: "Real-time updates" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-[#90E0EF]/30 hover:bg-white/80 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.5 + index * 0.1 }
                  }}
                >
                  <feature.icon className="w-6 h-6 text-[#0077B6] mb-2" />
                  <h3 className="font-semibold font-subtitles text-[#1E3E72] text-sm">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-[#0077B6]/70 font-paragraphs">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex items-center justify-center lg:justify-start gap-6 text-[#0077B6]/60"
              variants={itemVariants}
            >
              <div className="text-center">
                <div className="text-2xl font-bold font-headlines text-[#1E3E72]">5K+</div>
                <div className="text-xs font-subtitles">Pharmacy Partners</div>
              </div>
              <div className="w-px h-8 bg-[#90E0EF]"></div>
              <div className="text-center">
                <div className="text-2xl font-bold font-headlines text-[#1E3E72]">99.9%</div>
                <div className="text-xs font-subtitles">Uptime</div>
              </div>
              <div className="w-px h-8 bg-[#90E0EF]"></div>
              <div className="text-center">
                <div className="text-2xl font-bold font-headlines text-[#1E3E72]">24/7</div>
                <div className="text-xs font-subtitles">Support</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            className="w-full max-w-7xl mx-auto"
            variants={itemVariants}
          >
            {/* Main Card */}
            <motion.div
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"

            >
              {/* Header */}
              <div className="bg-gradient-to-r !bg-[#03045E] px-8 py-6 ">
                <motion.h2
                  className="text-2xl lg:text-3xl font-bold font-headlines text-white mb-2"
                >
                  Hostpital Login
                </motion.h2>
                <motion.p
                  className="text-[#CAF0F8] font-subtitles"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Sign in to access your Hospital dashboard
                </motion.p>
              </div>

              {/* Form */}
              <div className="px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Email/Username Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0077B6]/60" />

                      <input
                        type={'email'}
                        name={'email'}
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:ring-4 focus:ring-[#90E0EF]/30 focus:border-[#0077B6] transition-all duration-300 bg-white/90 font-paragraphs placeholder:text-[#0077B6]/40 ${errors.email
                          ? 'border-red-500'
                          : 'border-[#90E0EF]/50 hover:border-[#90E0EF]'
                          }`}
                        placeholder={'pharmacy@example.com'}
                      />
                    </div>
                    {((errors.email)) && (
                      <motion.p
                        className="text-red-500 text-sm mt-2 font-subtitles"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
                      Password
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

                  {/* General Error */}
                  {errors.general && (
                    <motion.div
                      className="bg-red-50 border border-red-200 rounded-xl p-4"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="text-red-800 text-sm font-subtitles">
                        {errors.general}
                      </p>
                    </motion.div>
                  )}




                  {/* Login Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r !bg-[#03045E] text-white py-4 px-6 rounded-xl font-semibold font-subtitles text-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>

                  {/* Register Link - Only for pharmacy */}
                  <motion.div
                    className="text-center pt-4 border-t border-[#90E0EF]/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <span className="text-[#0077B6]/80 font-paragraphs text-sm">
                      Don't have an account?{' '}
                    </span>
                    <Link
                      to="/register"
                      className="font-semibold font-subtitles text-[#1E3E72] hover:text-[#0077B6] transition-colors text-sm hover:underline"
                    >
                      Create Account
                    </Link>
                  </motion.div>
                </form>
              </div>
            </motion.div>

            {/* Security Badge */}
            <motion.div
              className="mt-6 flex items-center justify-center gap-2 text-[#0077B6]/60"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm font-subtitles">
                Protected by enterprise-grade security
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>

  );
};

export default Login;