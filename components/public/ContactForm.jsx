'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Mail, Send, Phone, User, MessageSquare, MapPin } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^03\d{2}-?\d{7}$/, 'Pakistani phone format required (e.g. 0300-1234567 or 03001234567)'),
  email: z.string().email('Please enter a valid email address'),
  selectedPlan: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      selectedPlan: 'General Inquiry',
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(result.message || 'Inquiry submitted & emailed to management!');
        reset();
      } else {
        toast.error(result.message || 'Failed to submit inquiry.');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    }
  };

  return (
    <div id="contact" className="py-20 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <Mail className="w-4 h-4" />
              <span>Get In Touch</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              JOIN THE TITANFIT COMMUNITY TODAY
            </h2>

            <p className="text-slate-400 text-base leading-relaxed">
              Fill out the inquiry form to receive immediate assistance regarding PKR membership plans, personal training packages, or corporate group passes.
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-900">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-rose-500">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Helpdesk Phone Support</p>
                  <p className="text-sm font-bold text-white">+92 (042) 3555-TITAN / 0300-1234567</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-rose-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Gym Location</p>
                  <p className="text-sm font-bold text-white">Block H-3, Johar Town, Lahore, Pakistan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Muhammad Ali"
                      {...register('name')}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  {errors.name && <p className="text-xs text-rose-400 mt-1 font-semibold">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Pakistani Phone (03XX-XXXXXXX)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="0300-1234567"
                      {...register('phone')}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-rose-400 mt-1 font-semibold">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="ali@example.com"
                      {...register('email')}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-rose-400 mt-1 font-semibold">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Selected Membership / Inquiry
                  </label>
                  <select
                    {...register('selectedPlan')}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Monthly Access Pass (Rs. 3,500)">Monthly Access Pass (Rs. 3,500)</option>
                    <option value="Executive Quarterly Split (Rs. 9,000)">Executive Quarterly Split (Rs. 9,000)</option>
                    <option value="VIP Annual Championship (Rs. 30,000)">VIP Annual Championship (Rs. 30,000)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Message / Details
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <textarea
                    rows="4"
                    placeholder="Tell us about your training goals..."
                    {...register('message')}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                {errors.message && (
                  <p className="text-xs text-rose-400 mt-1 font-semibold">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting & Sending Email...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
