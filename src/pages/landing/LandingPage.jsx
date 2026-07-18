import React from 'react';
import { Link } from 'react-router-dom';
import { FaHandHoldingHeart, FaBuilding, FaUsers, FaBiking, FaAward } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Navbar Header */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-extrabold text-2xl">
          <FaHandHoldingHeart className="text-3xl" />
          <span>Food Rescue</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <Link to="/features" className="hover:text-emerald-500 transition-colors">Features</Link>
          <Link to="/about" className="hover:text-emerald-500 transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-emerald-500 transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold hover:text-emerald-500 transition-colors">Sign In</Link>
          <Link to="/register" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all">
            Join Platform
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 text-center md:pt-24 md:pb-28">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          Save Surplus Food. <span className="text-emerald-600 dark:text-emerald-400">Feed Communities.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Connecting hotels, restaurants, and caterers with local NGOs and volunteers. Let's make zero food waste a reality.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/register" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5">
            Donate Surplus Food
          </Link>
          <Link to="/about" className="px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5">
            Learn How It Works
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-emerald-600 dark:bg-emerald-950/20 border-y border-emerald-500/10 text-white py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h2 className="text-4xl font-extrabold">25K+</h2>
            <p className="text-emerald-100 dark:text-emerald-400 mt-2 text-sm font-semibold uppercase tracking-wider">Meals Rescued</p>
          </div>
          <div>
            <h2 className="text-4xl font-extrabold">500+</h2>
            <p className="text-emerald-100 dark:text-emerald-400 mt-2 text-sm font-semibold uppercase tracking-wider">Registered Restaurants</p>
          </div>
          <div>
            <h2 className="text-4xl font-extrabold">120+</h2>
            <p className="text-emerald-100 dark:text-emerald-400 mt-2 text-sm font-semibold uppercase tracking-wider">Connected NGOs</p>
          </div>
          <div>
            <h2 className="text-4xl font-extrabold">1.5K+</h2>
            <p className="text-emerald-100 dark:text-emerald-400 mt-2 text-sm font-semibold uppercase tracking-wider">Active Volunteers</p>
          </div>
        </div>
      </section>

      {/* Role Blocks */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight">Become a Partner Today</h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-md mx-auto">Choose your profile role and contribute to saving meals in your local city.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-lg text-center transition-colors">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6">
              <FaBuilding />
            </div>
            <h3 className="text-xl font-bold mb-3">Restaurants & Hotels</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">List fresh leftovers and surplus inventory securely. Control pick up instructions.</p>
            <Link to="/register" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">Register Business &rarr;</Link>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-lg text-center transition-colors">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6">
              <FaUsers />
            </div>
            <h3 className="text-xl font-bold mb-3">NGOs & Orphanages</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">Browse listings, reserve claims, and feed shelters, schools, and care homes.</p>
            <Link to="/register" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">Register NGO &rarr;</Link>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-lg text-center transition-colors">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6">
              <FaBiking />
            </div>
            <h3 className="text-xl font-bold mb-3">Volunteers & Couriers</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">Get delivery missions, pickup food packages, navigate map guides, and deliver.</p>
            <Link to="/register" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">Become a Courier &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-extrabold text-xl">
            <FaHandHoldingHeart />
            <span>Food Rescue</span>
          </div>
          <div className="flex gap-8">
            <Link to="/about" className="hover:text-emerald-500">About</Link>
            <Link to="/contact" className="hover:text-emerald-500">Contact</Link>
            <Link to="/features" className="hover:text-emerald-500">Features</Link>
          </div>
          <p>&copy; {new Date().getFullYear()} Food Rescue. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
