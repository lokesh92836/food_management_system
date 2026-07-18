import React from 'react';
import { Link } from 'react-router-dom';
import { FaHandHoldingHeart } from 'react-icons/fa';

const ContactPage = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen p-8 text-slate-800 dark:text-slate-100 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-2xl mb-8">
          <FaHandHoldingHeart />
          <span>Food Rescue</span>
        </Link>
        <h1 className="text-4xl font-extrabold mb-6">Contact Our Team</h1>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          Have queries about onboarding, restaurant business verification, or developer APIs? Contact us anytime.
        </p>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-lg space-y-4">
          <p><strong>Support Email:</strong> support@foodrescue.org</p>
          <p><strong>Partner Enquiries:</strong> partners@foodrescue.org</p>
          <p><strong>Corporate Address:</strong> 100 Rescue Plaza, New York, NY</p>
        </div>
        <div className="mt-8">
          <Link to="/" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-bold">&larr; Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
