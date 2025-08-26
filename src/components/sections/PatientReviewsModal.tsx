import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Star, Filter, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDoctorRating, useDoctorReviews } from '../../hooks/useAppointments';
import { formatters } from '../../lib/dayjs';
import { getAuthData, type User as UserType } from '../../services/authService';

interface PatientReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PatientReviewsModal: React.FC<PatientReviewsModalProps> = ({ isOpen, onClose }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const { data: ratingData, isLoading: ratingLoading } = useDoctorRating(user?.id);
  const { data: reviewsData, isLoading: reviewsLoading } = useDoctorReviews(user?.id);

  useEffect(() => {
    const { user: userData } = getAuthData();
    if (userData) {
      setUser(userData);
    }
  }, []);

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 300,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 300,
        duration: 0.2
      }
    }
  };

  // Filter reviews based on search and rating
  const filteredReviews = reviewsData?.filter(review => {
    const matchesSearch = searchTerm === '' ||
      review.reviewer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = ratingFilter === null || review.rating === ratingFilter;

    return matchesSearch && matchesRating;
  }) || [];

  // Calculate rating distribution
  const ratingDistribution = Array.from({ length: 5 }, (_, index) => {
    const rating = 5 - index;
    const count = reviewsData?.filter(review => review.rating === rating).length || 0;
    const percentage = reviewsData ? (count / reviewsData.length) * 100 : 0;
    return { rating, count, percentage };
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Patient Reviews
                  </h2>
                  <p className="text-gray-600 text-sm">
                    See what your patients are saying about you
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-6 h-6 text-gray-600" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Rating Summary */}
              <motion.div
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {ratingLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-48"></div>
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                  </div>
                ) : ratingData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Overall Rating */}
                    <div className="text-center md:text-left">
                      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center shadow-sm">
                          <Star className="w-8 h-8 text-yellow-600" />
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-gray-900">
                            {ratingData.average_rating.toFixed(1)}/5
                          </div>
                          <p className="text-gray-700 font-semibold">
                            Average Rating
                          </p>
                          <p className="text-gray-600 text-sm">
                            Based on {ratingData.total_ratings} review{ratingData.total_ratings !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Rating Distribution */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Rating Breakdown</h4>
                      <div className="space-y-2">
                        {ratingDistribution.map((item) => (
                          <div key={item.rating} className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium text-gray-700 w-3">{item.rating}</span>
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                              <motion.div
                                className="h-full bg-yellow-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${item.percentage}%` }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-8">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No Ratings Yet
                    </h3>
                    <p className="text-gray-600">
                      You haven't received any patient ratings yet
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Search and Filter Controls */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  />
                </div>

                {/* Rating Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={ratingFilter || ''}
                    onChange={(e) => setRatingFilter(e.target.value ? parseInt(e.target.value) : null)}
                    className="pl-10 pr-8 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm appearance-none cursor-pointer min-w-[140px]"
                  >
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </motion.div>

              {/* Reviews List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {reviewsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse bg-white rounded-xl p-6 border border-gray-200">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredReviews.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-600">
                        Showing {filteredReviews.length} of {reviewsData?.length || 0} reviews
                      </p>
                      {(searchTerm || ratingFilter) && (
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setRatingFilter(null);
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>

                    {filteredReviews.map((review, index) => (
                      <motion.div
                        key={review.id}
                        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                              {review.reviewer_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h6 className="font-bold text-gray-900 text-lg truncate">
                                {review.reviewer_name}
                              </h6>
                              <div className="flex items-center gap-2 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= review.rating
                                      ? 'text-yellow-500 fill-current'
                                      : 'text-gray-300'
                                      }`}
                                  />
                                ))}
                                <span className="text-sm text-gray-600 font-semibold ml-1">
                                  {review.rating}/5
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full flex-shrink-0 self-start sm:self-auto">
                            {formatters.relative(review.created_at)}
                          </span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-gray-700 leading-relaxed">
                            "{review.comment}"
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : reviewsData && reviewsData.length > 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No matching reviews
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search or filter criteria
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setRatingFilter(null);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No Reviews Yet
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      You haven't received any patient reviews yet. Keep providing excellent care and reviews will start coming in!
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PatientReviewsModal; 