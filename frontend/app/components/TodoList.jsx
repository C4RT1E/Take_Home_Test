'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Inbox } from 'lucide-react';
import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggle, onDelete, onUpdate }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // Filter by status
      if (filter === 'active' && todo.completed) return false;
      if (filter === 'completed' && !todo.completed) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = todo.title.toLowerCase().includes(query);
        const descMatch = todo.description ? todo.description.toLowerCase().includes(query) : false;
        return titleMatch || descMatch;
      }

      return true;
    });
  }, [todos, filter, searchQuery]);

  const filterTabs = [
    { id: 'all', label: 'All Tasks', count: todos.length },
    { id: 'active', label: 'Active', count: todos.filter((t) => !t.completed).length },
    { id: 'completed', label: 'Completed', count: todos.filter((t) => t.completed).length }
  ];

  return (
    <div className="space-y-5">
      {/* Controls Bar: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-800 gap-1 self-start sm:self-auto">
          {filterTabs.map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/30 rounded-lg"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                <span
                  className={`relative z-10 px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Todo List Items Container */}
      {filteredTodos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mx-auto text-slate-400">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-200">No tasks found</h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto mt-1">
              {searchQuery
                ? `No tasks match "${searchQuery}"`
                : filter === 'completed'
                ? 'No completed tasks yet. Keep grinding!'
                : filter === 'active'
                ? 'No active tasks! You are all caught up.'
                : 'Your todo list is empty. Add a task above to get started!'}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
