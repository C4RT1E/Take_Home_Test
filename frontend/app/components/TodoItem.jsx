'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, Calendar, ChevronDown, ChevronUp, Loader2, Edit3, X, Save } from 'lucide-react';

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState('');

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

  const handleStartEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
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
        description: editDescription.trim() || null
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
      {isEditing ? (
        /* Inline Edit Form View */
        <form onSubmit={handleSaveEdit} className="space-y-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" /> Editing Task #{todo.id}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={isSaving || !editTitle.trim()}
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm shadow-indigo-600/30 disabled:opacity-50 cursor-pointer"
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
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-indigo-500/50 text-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
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
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
            />
          </div>

          {editError && (
            <p className="text-xs text-rose-400 font-medium px-1">{editError}</p>
          )}
        </form>
      ) : (
        /* Normal Task Card View */
        <div className="flex items-start gap-3.5">
          {/* Toggle Checkbox */}
          <button
            type="button"
            onClick={handleToggle}
            disabled={isToggling || isDeleting}
            className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
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
                    title="Toggle notes view"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors cursor-pointer"
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
                  className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting || isToggling}
                  title="Delete Task"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50 cursor-pointer"
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
      )}
    </motion.div>
  );
}
