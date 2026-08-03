'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Globe, RefreshCw } from 'lucide-react';

export default function LiveClock() {
  const [time, setTime] = useState(null);
  const [timezone, setTimezone] = useState('Local Time');
  const [abbreviation, setAbbreviation] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [apiStatus, setApiStatus] = useState('synced'); // 'synced' | 'local'

  const syncWithTimeApi = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch('https://worldtimeapi.org/api/ip', { cache: 'no-store' });
      if (!res.ok) throw new Error('Time API failed');
      const data = await res.json();

      if (data.datetime) {
        const apiDate = new Date(data.datetime);
        setTime(apiDate);
        setTimezone(data.timezone || 'UTC');
        setAbbreviation(data.abbreviation || '');
        setApiStatus('synced');
      }
    } catch (err) {
      console.warn('External Time API unavailable, using high-precision local system time:', err);
      setTime(new Date());
      const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(localTz || 'Local Time');
      setApiStatus('local');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // Initial fetch from Time API
    syncWithTimeApi();

    // Tick every second
    const timer = setInterval(() => {
      setTime((prevTime) => (prevTime ? new Date(prevTime.getTime() + 1000) : new Date()));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 animate-pulse mb-8 flex items-center justify-between">
        <div className="h-6 bg-slate-800 rounded w-1/3" />
        <div className="h-6 bg-slate-800 rounded w-1/4" />
      </div>
    );
  }

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(time);
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(time);
  const dayNum = time.getDate();
  const year = time.getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-3.5 sm:p-5 mb-6 sm:mb-8 shadow-xl shadow-slate-950/40 relative overflow-hidden backdrop-blur-xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
        {/* Left: Clock Display */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400 shadow-inner shrink-0">
            <Clock className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1 font-mono text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              <span>{hours}</span>
              <span className="animate-pulse text-indigo-400">:</span>
              <span>{minutes}</span>
              <span className="animate-pulse text-indigo-400">:</span>
              <span className="text-indigo-400">{seconds}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{dayName}, {monthName} {dayNum}, {year}</span>
            </div>
          </div>
        </div>

        {/* Right: Timezone Badge & Sync Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800/60 pt-3 sm:pt-0">
          <div className="px-3 py-2 sm:py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2 text-xs font-medium text-slate-300 flex-1 sm:flex-initial min-w-0">
            <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate max-w-[150px] sm:max-w-[200px]">{timezone}</span>
            {abbreviation && (
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold shrink-0">
                {abbreviation}
              </span>
            )}
          </div>

          <button
            onClick={syncWithTimeApi}
            disabled={isSyncing}
            title="Sync with Time API"
            className="p-2.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-slate-200 transition-all disabled:opacity-50 cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
