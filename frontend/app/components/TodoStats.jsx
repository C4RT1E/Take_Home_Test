'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';

export default function TodoStats({ todos }) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const statCards = [
    {
      title: 'Total Tasks',
      value: total,
      icon: ListTodo,
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30'
    },
    {
      title: 'Completed',
      value: completed,
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      title: 'Pending',
      value: active,
      icon: Clock,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30'
    },
    {
      title: 'Completion Rate',
      value: `${percentage}%`,
      icon: TrendingUp,
      color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30'
    }
  ];

  return (
    <div className="space-y-3.5 sm:space-y-4 mb-6 sm:mb-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`bg-slate-900/60 border rounded-2xl p-3 sm:p-5 flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all duration-300 shadow-lg shadow-slate-950/40`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] sm:text-sm font-medium text-slate-400 truncate">
                  {stat.title}
                </span>
                <div className={`p-1.5 sm:p-2 rounded-xl bg-gradient-to-br ${stat.color} border shadow-inner shrink-0`}>
                  <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>
              </div>
              <div className="mt-2 sm:mt-3">
                <span className="text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                  {stat.value}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 sm:p-5 shadow-lg shadow-slate-950/40">
        <div className="flex items-center justify-between mb-2 text-xs sm:text-sm">
          <span className="font-medium text-slate-300">Overall Progress</span>
          <span className="font-semibold text-indigo-400">{completed} of {total} completed</span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
