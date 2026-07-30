'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, Calendar, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

export default function TodoItem({ todo, onToggle, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      await onToggle(todo.id, !todo.completed);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(todo.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
      transition={{ duration: 0.25 }}
      className={`group bg-slate-900/60 hover:bg-slate-900/90 border ${
        todo.completed ? 'border-slate-800/60 opacity-80' : 'border-slate-800 hover:border-slate-700'
      } rounded-2xl p-4 sm:p-5 transition-all duration-300 shadow-md shadow-slate-950/30`}
    >
      <div className="flex items-start gap-3.5">
        {/* Toggle Checkbox */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={isToggling || isDeleting}
          className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-200 shrink-0 ${
            todo.completed
              ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
              : 'border-slate-700 hover:border-indigo-500 bg-slate-950/60'
          }`}
        >
          {isToggling ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
          ) : todo.completed ? (
            <Check className="w-4 h-4 stroke-[3]" />
          ) : null}
        </button>

        {/* Content Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3
              onClick={() => todo.description && setIsExpanded(!isExpanded)}
              className={`text-base font-medium leading-snug cursor-pointer transition-all ${
                todo.completed
                  ? 'line-through text-slate-500'
                  : 'text-slate-200 hover:text-indigo-400'
              }`}
            >
              {todo.title}
            </h3>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {todo.description && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || isToggling}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Description Collapsible */}
          <AnimatePresence>
            {isExpanded && todo.description && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-sm text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 leading-relaxed"
              >
                {todo.description}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Metadata Footer */}
          <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(todo.createdAt)}
            </span>

            <span className="w-1 h-1 rounded-full bg-slate-700" />

            <span
              className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold tracking-wide ${
                todo.completed
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
            >
              {todo.completed ? 'Completed' : 'Pending'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
