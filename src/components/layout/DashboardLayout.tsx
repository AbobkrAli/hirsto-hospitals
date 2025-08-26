import { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, BarChart3, User, Settings, Package, Building2, ShoppingCart, UserPlus, Activity } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useAppStore } from '../../store/useAppStore';
import { getAuthData, performLogout } from '../../services/authService';
import { LogoutConfirmationModal } from '../sections';
import { usePharmacyData } from '../../hooks/usePharmacyData';
import type { PharmacyData as BasePharmacyData } from '../../services/authService';

type PharmacyData = BasePharmacyData & { logo_url?: string };
import logoImage from '../../assets/logo.svg';
import { usePharmacyLogo } from '../../hooks/usePharmacyLogo';
import type { LucideIcon } from 'lucide-react';

interface SubItem {
  id: string;
  name: string;
  path: string;
  icon: LucideIcon;
}

interface SidebarItem {
  id: string;
  name: string;
  icon: LucideIcon;
  path: string;
  hasSubItems: boolean;
  subItems?: SubItem[];
}

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed on mobile
  const [isMobile, setIsMobile] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    dashboard: true,
    appointments: false
  });
  const location = useLocation();
  const queryClient = useQueryClient();
  const { logout: zustandLogout, user, setUser } = useAppStore();

  // Fetch pharmacy data from API
  const { data: pharmacyData }: { data: PharmacyData | undefined } = usePharmacyData();
  // Fetch pharmacy logo from /pharmacies/me/logo
  const { data: pharmacyLogoUrl } = usePharmacyLogo();

  // Handle screen size changes
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);

      // Auto-close sidebar on mobile, auto-open on desktop
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  useEffect(() => {
    // Get user data from localStorage and set in store if not already set
    if (!user) {
      const { user: userData } = getAuthData();
      if (userData) {
        setUser(userData);
      }
    }
  }, [user, setUser]);

  // Check if current user is a branch
  const userType = localStorage.getItem('userType');
  const isBranch = userType === 'branch';

  // Check if pharmacy is a chain pharmacy (only chain pharmacies should see branches)
  const isChainPharmacy = pharmacyData?.pharmacy_type === 'chain';

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Clear Zustand store first
      zustandLogout();

      // Clear React Query cache
      queryClient.clear();

      // Show success message
      toast.success('Logged out successfully');

      // Use the global logout function for consistent behavior
      performLogout();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout completed with errors');

      // Force logout even if there's an error
      performLogout();
    } finally {
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
    }
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: BarChart3,
      path: isBranch ? '/dashboard/branch' : '/dashboard',
      hasSubItems: false
    },
    // Only show insurance for pharmacies (not branches)
    ...(!isBranch ? [{
      id: 'insurance',
      name: 'Insurance',
      icon: Settings,
      path: '/dashboard/insurance',
      hasSubItems: false
    }] : []),
    {
      id: 'doctors',
      name: 'Doctors',
      icon: UserPlus,
      path: '/dashboard/doctors',
      hasSubItems: false
    },
    {
      id: 'surgeries',
      name: 'Surgeries',
      icon: Activity,
      path: '/dashboard/surgeries',
      hasSubItems: false
    },
    {
      id: 'branches',
      name: 'Branches',
      icon: Building2,
      path: '/dashboard/branches',
      hasSubItems: false
    },
    // Only show Orders for branches or independent pharmacies
    ...((isBranch || (!isBranch && !isChainPharmacy)) ? [{
      id: 'orders',
      name: 'Orders',
      icon: ShoppingCart,
      path: '/dashboard/orders',
      hasSubItems: false
    }] : []),
  ];

  const clinicItems: SidebarItem[] = [
    {
      id: 'profile',
      name: 'Profile',
      icon: User,
      path: '/dashboard/profile',
      hasSubItems: false
    }
  ];

  const isActiveRoute = (path: string) => {
    if (path === '/dashboard' || path === '/dashboard/branch') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/branch';
    }
    return location.pathname === path;
  };

  return (
    <div className="h-screen bg-[#F9F9F9] flex relative">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          initial={isMobile ? { x: -280 } : false}
          animate={{
            x: sidebarOpen ? 0 : (isMobile ? -280 : 0),
            width: sidebarOpen ? (isMobile ? 280 : 256) : (isMobile ? 0 : 80)
          }}
          transition={{ type: "spring", damping: 40, stiffness: 300 }}
          className={`${isMobile
            ? 'fixed left-0 top-0 z-50 h-screen w-[280px]'
            : 'relative h-screen'
            } bg-white backdrop-blur-xl border-r border-gray-200 shadow-lg flex flex-col overflow-hidden`}
        >
          {/* Logo and Collapse Button */}
          <div className="p-4 border-b max-h-[60px] border-gray-200 flex items-center justify-between" style={{ height: '88px' }}>
            {sidebarOpen && (
              <div className="flex items-center gap-3">

                <img
                  src={logoImage}
                  alt="HEARSTO"
                  className={`${sidebarOpen ? 'h-6 lg:h-8' : 'h-6'} w-auto transition-all duration-300`}
                />
              </div>

            )}
            {/* Collapse Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 bg-gray-100 mx-auto rounded-full transition-colors"
            >
              <ArrowLeft className={`w-3 h-3 text-black transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* User Profile Card - Only show when expanded */}
          {sidebarOpen && (
            <div className="p-4 border-b border-gray-200">
              <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                <div className="relative">
                  <img
                    src={
                      pharmacyLogoUrl && pharmacyLogoUrl.trim() !== ''
                        ? pharmacyLogoUrl
                        : "https://previews.123rf.com/images/apoev/apoev1804/apoev180400003/98691529-default-placeholder-doctor-half-length-portrait-photo-avatar-gray-color.jpg"
                    }
                    alt={pharmacyData?.name || user?.name || 'User'}
                    className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover flex-shrink-0"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{pharmacyData?.name || user?.name || 'Pharmacy'}</p>
                  <p className="text-sm text-gray-500 truncate">{pharmacyData?.pharmacy_type || 'Pharmacy'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            {/* Main Menu Section */}
            <div className="mb-6">
              {sidebarOpen && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Main Menu</h3>
              )}
              <ul className="space-y-1">
                {sidebarItems.map((item) => {
                  const IconComponent = item.icon;
                  const isExpanded = expandedSections[item.id];
                  const isActive = isActiveRoute(item.path);

                  return (
                    <li key={item.id}>
                      {item.hasSubItems ? (
                        <>
                          <button
                            onClick={() => toggleSection(item.id)}
                            className={`w-full flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${isActive
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <IconComponent className="w-4 h-4" />
                              {sidebarOpen && <span>{item.name}</span>}
                            </div>
                            {sidebarOpen && (
                              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                            )}
                          </button>
                          {isExpanded && sidebarOpen && (
                            <ul className="ml-6 mt-1 space-y-1">
                              {item.subItems?.map((subItem) => {
                                const isSubActive = isActiveRoute(subItem.path);
                                return (
                                  <li key={subItem.id}>
                                    <Link
                                      to={subItem.path}
                                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isSubActive
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                        }`}
                                    >
                                      <div className={`w-2 h-2 rounded-full ${isSubActive ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                      <span>{subItem.name}</span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </>
                      ) : (
                        <Link
                          to={item.path}
                          className={`w-full flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${isActive
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent className="w-4 h-4" />
                            {sidebarOpen && <span>{item.name}</span>}
                          </div>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Clinic Section - Only show if there are clinic items */}
            {clinicItems.length > 0 && (
              <div>
                {sidebarOpen && (
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">appointments</h3>
                )}
                <ul className="space-y-1">
                  {clinicItems.map((item) => {
                    const IconComponent = item.icon;
                    const isExpanded = expandedSections[item.id];
                    const isActive = isActiveRoute(item.path);

                    return (
                      <li key={item.id}>
                        {item.hasSubItems ? (
                          <>
                            <button
                              onClick={() => toggleSection(item.id)}
                              className={`w-full flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${isActive
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <IconComponent className="w-4 h-4" />
                                {sidebarOpen && <span>{item.name}</span>}
                              </div>
                              {sidebarOpen && (
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                              )}
                            </button>
                            {isExpanded && sidebarOpen && (
                              <ul className="ml-6 mt-1 space-y-1">
                                {item.subItems?.map((subItem) => {
                                  const isSubActive = isActiveRoute(subItem.path);
                                  return (
                                    <li key={subItem.id}>
                                      <Link
                                        to={subItem.path}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isSubActive
                                          ? 'text-blue-600 bg-blue-50'
                                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                          }`}
                                      >
                                        <div className={`w-2 h-2 rounded-full ${isSubActive ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                        <span>{subItem.name}</span>
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </>
                        ) : (
                          <Link
                            to={item.path}
                            className={`w-full flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${isActive
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <IconComponent className="w-4 h-4" />
                              {sidebarOpen && <span>{item.name}</span>}
                            </div>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </nav>

          {/* Logout Button - Only show when expanded */}
          {sidebarOpen && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogoutClick}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-white hover:bg-[#03045E] cursor-pointer border border-gray-300 hover:border-[#03045E] rounded-lg transition-all duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen min-w-0">
        {/* Header */}
        <header className="bg-white backdrop-blur-xl border-b border-gray-200 p-4 lg:p-6" style={{ height: '60px' }}>
          <div className="flex items-center justify-end gap-4 h-full">
            <div className="flex items-center gap-2 lg:gap-6 overflow-hidden">
              {/* Placeholder for future pharmacy info */}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 bg-gradient-to-br from-gray-100 to-white lg:p-6 overflow-auto">
          <AnimatePresence>
            <div key={location.pathname}>
              <Outlet />
            </div>
          </AnimatePresence>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </div>
  );
};

export default DashboardLayout;