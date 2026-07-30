'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, RefreshCw, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import LiveClock from './components/LiveClock';
import TodoStats from './components/TodoStats';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { SkeletonCard, SkeletonStats } from './components/ui/Skeleton';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  // Auto dismiss toast notification
  const showToast = (message) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast('');
    }, 3000);
  };

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTodos();
      setTodos(data || []);
    } catch (err) {
      console.error('Failed to fetch todos:', err);
      setError(err.message || 'Could not connect to the Todo server. Please make sure the backend API is running on port 5001.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = async (newTodoData) => {
    try {
      setSubmitting(true);
      setError(null);
      const createdTodo = await api.createTodo(newTodoData);
      setTodos((prev) => [createdTodo, ...prev]);
      showToast('Task created successfully!');
      return createdTodo;
    } catch (err) {
      console.error('Failed to add todo:', err);
      const msg = err.message || 'Failed to create todo.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTodo = async (id, updates) => {
    try {
      setError(null);
      const updated = await api.updateTodo(id, updates);
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
      showToast('Task updated successfully!');
      return updated;
    } catch (err) {
      console.error('Failed to update todo:', err);
      setError(err.message || 'Failed to update task.');
      throw err;
    }
  };

  const handleToggleTodo = async (id, completed) => {
    try {
      setError(null);
      // Optimistic update
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed } : t))
      );

      const updated = await api.updateTodo(id, { completed });

      // Ensure state matches server response
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
    } catch (err) {
      console.error('Failed to toggle todo:', err);
      setError(err.message || 'Failed to update todo status.');
      // Revert on error
      fetchTodos();
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      setError(null);
      // Optimistic update
      setTodos((prev) => prev.filter((t) => t.id !== id));

      await api.deleteTodo(id);
      showToast('Task deleted successfully');
    } catch (err) {
      console.error('Failed to delete todo:', err);
      setError(err.message || 'Failed to delete todo.');
      // Revert on error
      fetchTodos();
    }
  };

  return (
    <main className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Success Toast Floating Banner */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 bg-emerald-500/15 border border-emerald-500/30 backdrop-blur-xl text-emerald-300 px-4 py-3 rounded-2xl shadow-xl shadow-emerald-950/40 flex items-center gap-2.5 text-sm font-medium"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Modern Task Manager
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30">
              <CheckSquare className="w-6 h-6 sm:w-7 sm:h-7" />
            </span>
            Todo Tracker
          </h1>
        </div>

        <button
          onClick={fetchTodos}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-slate-100 text-xs font-medium transition-all duration-200 flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Global Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-start justify-between gap-3 text-sm"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-200">Notice</p>
                <p className="text-xs text-rose-300/90 mt-0.5">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs text-rose-400 hover:text-rose-200 underline shrink-0 font-medium cursor-pointer"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Clock & Date Widget */}
      <LiveClock />

      {/* Main Content Dashboard */}
      {loading && todos.length === 0 ? (
        <div className="space-y-6">
          <SkeletonStats />
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      ) : (
        <>
          <TodoStats todos={todos} />
          <TodoForm onAddTodo={handleAddTodo} isLoading={submitting} />
          <TodoList
            todos={todos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
          />
        </>
      )}

      {/* Footer */}
      <footer className="mt-16 pt-6 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>Todo Tracker • Built with Next.js App Router, Express, Sequelize & SQLite</p>
      </footer>
    </main>
  );
}
