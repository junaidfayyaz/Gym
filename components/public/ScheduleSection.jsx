'use client';

import React, { useState } from 'react';
import { Calendar, Clock, UserCheck } from 'lucide-react';

const scheduleData = [
  { title: 'Morning HIIT & Cardio', time: '06:30 AM - 07:30 AM', trainer: 'Coach Hamza', day: 'Monday' },
  { title: 'Powerlifting & Hypertrophy', time: '05:00 PM - 06:30 PM', trainer: 'Coach Usman', day: 'Monday' },
  { title: 'Core & Mobility Yoga', time: '07:00 AM - 08:00 AM', trainer: 'Coach Sara', day: 'Tuesday' },
  { title: 'Crossfit Conditioning', time: '06:00 PM - 07:15 PM', trainer: 'Coach Bilawal', day: 'Wednesday' },
  { title: 'Chest & Triceps Hypertrophy', time: '05:30 PM - 07:00 PM', trainer: 'Coach Hamza', day: 'Thursday' },
  { title: 'Legs & Abs Endurance', time: '06:00 PM - 07:30 PM', trainer: 'Coach Usman', day: 'Friday' },
  { title: 'Weekend Bodybuilding Blast', time: '08:00 AM - 09:30 AM', trainer: 'Coach Bilawal', day: 'Saturday' },
];

const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ScheduleSection = () => {
  const [selectedDay, setSelectedDay] = useState('All');

  const filtered = selectedDay === 'All' ? scheduleData : scheduleData.filter((s) => s.day === selectedDay);

  return (
    <div id="schedule" className="py-20 bg-slate-900/40 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>Weekly Roster</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Class Schedule & Timetable
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Masterclasses led by certified master trainers available for all active members.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {days.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                selectedDay === d
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-extrabold uppercase">
                {item.day}
              </span>
              <h4 className="text-lg font-bold text-white">{item.title}</h4>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  <span>{item.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{item.trainer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleSection;
