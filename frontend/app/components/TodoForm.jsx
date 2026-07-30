'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, AlertCircle, Loader2, Sparkles, X } from 'lucide-react';

export default function TodoForm({ onAddTodo, isLoading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const formatForInput = (d) => {
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const applyPreset = (type) => {
    const now = new Date();
    if (type === 'today_5pm') {
      now.setHours(17, 0, 0, 0);
      setDueDate(formatForInput(now));
    } else if (type === 'tomorrow_9am') {
      now.setDate(now.getDate() + 1);
      now.setHours(9, 0, 0, 0);
      setDueDate(formatForInput(now));
    } else if (type === 'in_3_days') {
      now.setDate(now.getDate() + 3);
      now.setHours(17, 0, 0, 0);
      setDueDate(formatForInput(now));
    } else if (type === 'next_week') {
      now.setDate(now.getDate() + 7);
      now.setHours(9, 0, 0, 0);
      setDueDate(formatForInput(now));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Todo title is required');
      return;
    }

    try {
      await onAddTodo({
        title: title.trim(),
        description: description.trim() || null,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null
      });

      // Reset form on success
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (err) {
      setError(err.message || 'Failed to add todo');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 sm:p-6 mb-8 shadow-xl shadow-slate-950/50 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">
          Create New Task
        </h2>
      </div>

      <div className="space-y-4">
        {/* Title Input */}
        <div>
          <input
            type="text"
            placeholder="What needs to be done? (e.g., Complete project report)"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-xl bg-slate-950/70 border ${
              error ? 'border-rose-500/70 focus:ring-rose-500/30' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
            } text-slate-100 placeholder-slate-500 outline-none focus:ring-2 transition-all text-sm sm:text-base`}
          />
        </div>

        {/* Description Textarea */}
        <div>
          <textarea
            placeholder="Add optional notes or description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm resize-none"
          />
        </div>

        {/* Styled Set Deadline Section */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Calendar className="w-3.5 h-3.5" />
              </span>
              Task Deadline
            </label>
            {dueDate && (
              <button
                type="button"
                onClick={() => setDueDate('')}
                className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer font-medium"
              >
                <X className="w-3 h-3" /> Clear Deadline
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isLoading}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-100 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all"
              />
            </div>

            {/* Quick Shortcut Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => applyPreset('today_5pm')}
                className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-indigo-300 text-[11px] font-medium transition-colors cursor-pointer"
              >
                Today 5 PM
              </button>
              <button
                type="button"
                onClick={() => applyPreset('tomorrow_9am')}
                className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-indigo-300 text-[11px] font-medium transition-colors cursor-pointer"
              >
                Tomorrow 9 AM
              </button>
              <button
                type="button"
                onClick={() => applyPreset('in_3_days')}
                className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-indigo-300 text-[11px] font-medium transition-colors cursor-pointer"
              >
                In 3 Days
              </button>
              <button
                type="button"
                onClick={() => applyPreset('next_week')}
                className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-indigo-300 text-[11px] font-medium transition-colors cursor-pointer"
              >
                Next Week
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center gap-2 text-rose-400 text-xs font-medium bg-rose-500/10 border border-rose-500/20 px-3.5 py-2 rounded-xl"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/35 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 flex items-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add Todo</span>
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
}
