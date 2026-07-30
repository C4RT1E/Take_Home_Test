'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, AlignLeft, AlertCircle, Loader2 } from 'lucide-react';

export default function TodoForm({ onAddTodo, isLoading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);

  const toggleDescription = () => {
    const nextState = !showDescription;
    setShowDescription(nextState);
    if (nextState) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
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
        description: description.trim() || null
      });

      // Reset form on success
      setTitle('');
      setDescription('');
      setShowDescription(false);
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
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Plus className="w-4 h-4" />
          </span>
          Create New Task
        </h2>
        <button
          type="button"
          onClick={toggleDescription}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
            showDescription
              ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 shadow-sm shadow-indigo-500/10'
              : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white'
          }`}
        >
          <AlignLeft className="w-3.5 h-3.5" />
          <span>{showDescription ? 'Hide Details' : '+ Add Details'}</span>
        </button>
      </div>

      <div className="space-y-3">
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

        {/* Description Textarea Field */}
        {showDescription && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <textarea
              ref={textareaRef}
              placeholder="Add optional notes or description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm resize-none"
            />
          </motion.div>
        )}

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

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-slate-500">
          {showDescription ? 'Task title & optional details ready' : 'Click "+ Add Details" to include notes'}
        </span>
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
