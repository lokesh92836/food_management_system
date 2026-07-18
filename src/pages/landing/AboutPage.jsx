import React from 'react';
import { Link } from 'react-router-dom';
import { FaHandHoldingHeart } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen p-8 text-slate-800 dark:text-slate-100 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-2xl mb-8">
          <FaHandHoldingHeart />
          <span>Food Rescue</span>
        </Link>
        <h1 className="text-4xl font-extrabold mb-6">About Our Mission</h1>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          Every single day, large quantities of fresh leftovers and surplus food go to waste from restaurants, catering events, marriage halls, and bakeries. 
          At the same time, millions of children and adults remain undernourished.
        </p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          <strong>Food Rescue Management System</strong> was designed as a local community bridge. 
          Through state-of-the-art notifications, automated routing, and role profiles, we connect donors with charities and volunteers to direct food where it belongs.
        </p>
        <Link to="/" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-bold">&larr; Back to Home</Link>
      </div>
    </div>
  );
};

export default AboutPage;
