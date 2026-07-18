import React from 'react';
import { Link } from 'react-router-dom';
import { FaHandHoldingHeart } from 'react-icons/fa';

const FeaturesPage = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen p-8 text-slate-800 dark:text-slate-100 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-2xl mb-8">
          <FaHandHoldingHeart />
          <span>Food Rescue</span>
        </Link>
        <h1 className="text-4xl font-extrabold mb-6">Platform Features</h1>
        <ul className="space-y-4">
          <li className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">⚡ Live Claims Workflow</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Claim notifications are fired instantly to nearby charities when fresh donations are created.</p>
          </li>
          <li className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">🔒 Role-Based Permissions</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Administrators audit and approve business licenses before users can perform transactions.</p>
          </li>
          <li className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">📊 Analytics Reports</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor aggregated performance indicators, such as portions saved and monthly contributions.</p>
          </li>
        </ul>
        <div className="mt-8">
          <Link to="/" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-bold">&larr; Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
