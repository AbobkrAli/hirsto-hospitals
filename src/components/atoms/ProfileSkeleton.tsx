import React from 'react';

const shimmer = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200';

const ProfileSkeleton: React.FC = () => (
  <div className="space-y-6 sm:space-y-8">
    {/* Header Skeleton */}
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 sm:gap-6">
      <div className="space-y-2 sm:space-y-3 w-full max-w-md">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${shimmer}`} />
          <div className="flex flex-col gap-2 w-full">
            <div className={`h-7 sm:h-8 w-40 sm:w-56 rounded ${shimmer}`} />
            <div className={`h-4 sm:h-5 w-32 sm:w-40 rounded ${shimmer}`} />
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className={`h-10 w-24 sm:w-32 rounded-xl ${shimmer}`} />
        <div className={`h-10 w-24 sm:w-32 rounded-xl ${shimmer}`} />
      </div>
    </div>

    {/* Profile Card Skeleton */}
    <div className="relative overflow-hidden rounded-2xl shadow-xl border bg-gradient-to-br from-white/90 to-gray-50/90 border-[#90E0EF]/30">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-6 lg:gap-8">
          <div className="relative group">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[#90E0EF]/50 ${shimmer}`} />
          </div>
          <div className="flex-1 text-center lg:text-left space-y-2 sm:space-y-3 lg:space-y-4 min-w-0 w-full">
            <div className={`h-7 sm:h-8 w-40 sm:w-56 rounded ${shimmer} mb-2`} />
            <div className="flex flex-col sm:flex-row gap-2 lg:gap-4">
              <div className={`h-6 w-32 sm:w-40 rounded ${shimmer}`} />
              <div className={`h-6 w-28 sm:w-32 rounded ${shimmer}`} />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-3">
              <div className={`h-5 w-24 rounded ${shimmer}`} />
              <div className={`h-5 w-20 rounded ${shimmer}`} />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Tabs Skeleton */}
    <div className="relative overflow-hidden rounded-2xl shadow-xl border bg-white/90 border-[#90E0EF]/30">
      <div className="flex border-b border-[#90E0EF]/30 bg-gradient-to-r from-gray-50/50 to-white/50">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-6 py-3 sm:py-5">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${shimmer}`} />
            <div className={`h-5 w-16 sm:w-24 rounded ${shimmer}`} />
          </div>
        ))}
      </div>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Content skeleton blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-16 sm:h-20 rounded-xl ${shimmer}`} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ProfileSkeleton; 