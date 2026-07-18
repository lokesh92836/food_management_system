import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-6 text-center transition-colors duration-300">
      <div className="w-20 h-20 bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-3xl flex items-center justify-center text-4xl mb-6">
        <FaExclamationTriangle />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">404 - Page Not Found</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
        The route you requested could not be resolved or does not exist.
      </p>
      <Link to="/" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
