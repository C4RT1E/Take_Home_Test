import React from 'react';

export function SkeletonCard() {
  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 animate-pulse flex items-start gap-4">
      <div className="w-6 h-6 rounded-lg bg-slate-800 shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-slate-800 rounded-md w-3/4" />
        <div className="h-4 bg-slate-800/60 rounded-md w-1/2" />
        <div className="h-3 bg-slate-800/40 rounded-md w-1/4 pt-1" />
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 animate-pulse space-y-2">
          <div className="h-4 bg-slate-800 rounded w-1/2" />
          <div className="h-7 bg-slate-800 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}
