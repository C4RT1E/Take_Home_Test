'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, Calendar, ChevronDown, ChevronUp, Loader2, Edit3, X, Save, Clock, AlertTriangle } from 'lucide-react';

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [now, setNow] = useState(new Date());

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editDueDate, setEditDueDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState('');

  // Ticking timer to update live countdown/urgency status every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

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

  const formatForDatetimeInput = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const applyEditPreset = (type) => {
    const d = new Date();
    if (type === 'today_5pm') {
      d.setHours(17, 0, 0, 0);
      setEditDueDate(formatForDatetimeInput(d));
    } else if (type === 'tomorrow_9am') {
      d.setDate(d.getDate() + 1);
      d.setHours(9, 0, 0, 0);
      setEditDueDate(formatForDatetimeInput(d));
    } else if (type === 'in_3_days') {
      d.setDate(d.getDate() + 3);
      d.setHours(17, 0, 0, 0);
      setEditDueDate(formatForDatetimeInput(d));
    } else if (type === 'next_week') {
      d.setDate(d.getDate() + 7);
      d.setHours(9, 0, 0, 0);
      setEditDueDate(formatForDatetimeInput(d));
    }
  };

  const handleStartEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditDueDate(formatForDatetimeInput(todo.dueDate));
    setEditError('');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditError('');
  };

  const handleSaveEdit = async (e) => {
    if (e) e.preventDefault();
    setEditError('');

    if (!editTitle.trim()) {
      setEditError('Title cannot be empty');
      return;
    }

    try {
      setIsSaving(true);
      await onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
        dueDate: editDueDate ? new Date(editDueDate).toISOString() : null
      });
      setIsEditing(false);
    } catch (err) {
      setEditError(err.message || 'Failed to update task');
    } finally {
      setIsSaving(false);
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

  // Real-time Deadline Sync Logic
  const getDeadlineStatus = () => {
    if (!todo.dueDate) return null;
    const due = new Date(todo.dueDate);
    const diffMs = due.getTime() - now.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (todo.completed) {
      return {
        label: `Completed (Due ${formatDate(todo.dueDate)})`,
        className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        icon: Check
      };
    }

    if (diffMs < 0) {
      // Overdue
      const overdueText = Math.abs(diffHours) < 24
        ? `${Math.abs(diffHours)}h overdue`
        : `${Math.abs(diffDays)}d overdue`;
      return {
        label: `Overdue (${overdueText})`,
        className: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse font-bold',
        icon: AlertTriangle
      };
    }

    if (diffHours <= 24) {
      // Due Soon (Within 24 Hours)
      return {
        label: `Due in ${diffHours === 0 ? 'less than an hour' : `${diffHours}h`}`,
        className: 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse font-semibold',
        icon: Clock
      };
    }

    // Future
    return {
      label: `Due: ${formatDate(todo.dueDate)}`,
      className: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
      icon: Calendar
    };
  };

  const deadlineStatus = getDeadlineStatus();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
      transition={{ duration: 0.25 }}
      className={`group bg-slate-900/60 hover:bg-slate-900/90 border ${
        todo.completed
          ? 'border-slate-800/60 opacity-80'
          : deadlineStatus && deadlineStatus.label.includes('Overdue')
          ? 'border-rose-500/40 bg-rose-950/10'
          : 'border-slate-800 hover:border-slate-700'
      } rounded-2xl p-3.5 sm:p-5 transition-all duration-300 shadow-md shadow-slate-950/30`}
    >
      {isEditing ? (
        /* Inline Edit Form View */
        <form onSubmit={handleSaveEdit} className="space-y-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
              <Edit3 className="w-3.5 h-3.5 shrink-0" /> Editing Task #{todo.id}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer min-h-[36px]"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={isSaving || !editTitle.trim()}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm shadow-indigo-600/30 disabled:opacity-50 cursor-pointer min-h-[36px]"
              >
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save</span>
              </button>
            </div>
          </div>

          <div>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
                if (editError) setEditError('');
              }}
              placeholder="Task title..."
              disabled={isSaving}
              onKeyDown={(e) => {
                if (e.key === 'Escape') handleCancelEdit();
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-indigo-500/50 text-slate-100 text-base sm:text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
              autoFocus
            />
          </div>

          <div>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Optional description/notes..."
              disabled={isSaving}
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-base sm:text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
            />
          </div>

          {/* Styled Deadline Edit Box */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Task Deadline:
              </label>
              {editDueDate && (
                <button
                  type="button"
                  onClick={() => setEditDueDate('')}
                  className="text-[11px] text-slate-500 hover:text-rose-400 font-medium transition-colors p-1"
                >
                  Clear Deadline
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="datetime-local"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                disabled={isSaving}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-100 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 min-h-[38px]"
              />
              <div className="grid grid-cols-2 sm:flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => applyEditPreset('today_5pm')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium text-center min-h-[32px] flex items-center justify-center"
                >
                  Today 5PM
                </button>
                <button
                  type="button"
                  onClick={() => applyEditPreset('tomorrow_9am')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium text-center min-h-[32px] flex items-center justify-center"
                >
                  Tomorrow 9AM
                </button>
              </div>
            </div>
          </div>

          {editError && (
            <p className="text-xs text-rose-400 font-medium px-1">{editError}</p>
          )}
        </form>
      ) : (
        /* Normal Task Card View */
        <div className="flex items-start gap-3 sm:gap-3.5">
          {/* Toggle Checkbox */}
          <button
            type="button"
            onClick={handleToggle}
            disabled={isToggling || isDeleting}
            className={`mt-0.5 w-6 h-6 sm:w-6 sm:h-6 rounded-lg border flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer min-w-[24px] min-h-[24px] ${
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
            <div className="flex items-start justify-between gap-2">
              <h3
                onClick={() => todo.description && setIsExpanded(!isExpanded)}
                className={`text-sm sm:text-base font-semibold leading-snug cursor-pointer transition-all pt-0.5 ${
                  todo.completed
                    ? 'line-through text-slate-500'
                    : 'text-slate-200 hover:text-indigo-400'
                }`}
              >
                {todo.title}
              </h3>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 -mt-1 -mr-1 sm:mt-0 sm:mr-0">
                {todo.description && (
                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    title="Toggle notes view"
                    className="p-2 sm:p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                )}

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={handleStartEdit}
                  disabled={isDeleting || isToggling}
                  title="Edit Task"
                  className="p-2 sm:p-1.5 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors disabled:opacity-50 cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting || isToggling}
                  title="Delete Task"
                  className="p-2 sm:p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50 cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
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
                  className="mt-2 text-xs sm:text-sm text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 leading-relaxed"
                >
                  {todo.description}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Metadata & Deadline Footer */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 mt-3 text-[11px] sm:text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                {formatDate(todo.createdAt)}
              </span>

              <span className="w-1 h-1 rounded-full bg-slate-700 hidden sm:inline-block" />

              {/* Status Badge */}
              <span
                className={`px-2 py-0.5 rounded-md border text-[10px] sm:text-[11px] font-semibold tracking-wide ${
                  todo.completed
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {todo.completed ? 'Completed' : 'Pending'}
              </span>

              {/* Real-time Deadline Badge */}
              {deadlineStatus && (
                <span
                  className={`px-2 sm:px-2.5 py-0.5 rounded-md border text-[10px] sm:text-[11px] font-semibold tracking-wide flex items-center gap-1 sm:gap-1.5 ${deadlineStatus.className}`}
                >
                  <deadlineStatus.icon className="w-3 h-3 shrink-0" />
                  <span>{deadlineStatus.label}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
