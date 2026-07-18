import React from 'react';

/**
 * Shimmer effect animation classes are defined in globals.css.
 * We use simple tailwind animate-pulse classes to create a beautiful, modern skeleton state.
 */
export function SkeletonBlock({ className = '', style = {} }) {
  return (
    <div 
      className={`bg-gray-200 dark:bg-navy-light/45 rounded-xl animate-pulse ${className}`}
      style={style}
    />
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Hero Banner Skeleton */}
      <SkeletonBlock className="h-32 w-full rounded-3xl" />
      
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <SkeletonBlock key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>

      {/* Main Grid: Visual charts / Recents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Charts) */}
        <div className="lg:col-span-8 space-y-6">
          <SkeletonBlock className="h-96 w-full rounded-3xl" />
        </div>
        
        {/* Right Column (Recents list) */}
        <div className="lg:col-span-4 space-y-4">
          <SkeletonBlock className="h-[420px] w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="w-full space-y-4 animate-fade-in bg-white dark:bg-navy border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-card">
      {/* Table Header Filter controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2">
        <SkeletonBlock className="h-10 w-48" />
        <SkeletonBlock className="h-10 w-64" />
      </div>

      {/* Shimmering Table Content */}
      <div className="overflow-hidden border border-gray-150 dark:border-white/5 rounded-2xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black/5 dark:bg-white/5">
              {[...Array(cols)].map((_, i) => (
                <th key={i} className="p-4 text-left">
                  <SkeletonBlock className="h-4 w-24 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(rows)].map((_, r) => (
              <tr key={r} className="border-t border-gray-100 dark:border-white/5">
                {[...Array(cols)].map((_, c) => (
                  <td key={c} className="p-4">
                    <SkeletonBlock className={`h-4.5 rounded ${
                      c === 0 ? 'w-36' : 
                      c === 1 ? 'w-24' : 
                      c === 2 ? 'w-16' : 
                      'w-28'
                    }`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className="space-y-6 max-w-2xl bg-white dark:bg-navy border border-gray-100 dark:border-white/5 rounded-3xl p-6 md:p-8 animate-fade-in">
      <SkeletonBlock className="h-8 w-60 mb-6" />
      
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-11 w-full" />
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-4">
        <SkeletonBlock className="h-11 w-32" />
        <SkeletonBlock className="h-11 w-24" />
      </div>
    </div>
  );
}
