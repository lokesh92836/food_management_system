import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FaHandHoldingHeart } from 'react-icons/fa';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-950 dark:to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-extrabold text-3xl">
          <FaHandHoldingHeart className="text-4xl animate-bounce" />
          <span>Food Rescue</span>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-slate-800 py-8 px-6 shadow-xl rounded-2xl border border-slate-100 dark:border-slate-700/60 sm:px-10 transition-colors duration-300">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
