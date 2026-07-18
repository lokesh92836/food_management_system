import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaUtensils, FaPlus, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaHistory } from 'react-icons/fa';
import donationService from '../../services/donationService';
import analyticsService from '../../services/analyticsService';
import { STATUS_COLORS, STATUS_LABELS } from '../../constants/statuses';

const RestaurantDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [donations, setDonations] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch restaurant donations
      const donationList = await donationService.list({ ordering: '-created_at' });
      setDonations(donationList.results || []);
      
      // 2. Fetch restaurant performance metrics
      const performance = await analyticsService.getRestaurantMetrics();
      setMetrics(performance);
    } catch (err) {
      console.error("Error loading restaurant dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const isVerified = user?.profile_details?.is_verified;

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Verification Notice Banner */}
      {!isVerified ? (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 p-4 rounded-2xl flex items-start gap-3">
          <FaExclamationTriangle className="text-amber-500 text-xl mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-amber-900 dark:text-amber-300">Account Pending Verification</h4>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              Your restaurant license details are currently being reviewed by administrators. You will be able to post food donations as soon as verification is approved.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 p-4 rounded-2xl flex items-start gap-3">
          <FaCheckCircle className="text-emerald-500 text-xl mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-emerald-900 dark:text-emerald-300">Verified Business Partner</h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-0.5">
              Your profile is verified. You can post donations and coordinate pickups.
            </p>
          </div>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Postings</p>
          <h3 className="text-3xl font-extrabold mt-2 text-slate-900 dark:text-white">
            {metrics?.total_donations_created || 0}
          </h3>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Meals Saved</p>
          <h3 className="text-3xl font-extrabold mt-2 text-emerald-600 dark:text-emerald-400">
            {metrics?.meals_saved || 0}
          </h3>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Quantity</p>
          <h3 className="text-3xl font-extrabold mt-2 text-slate-900 dark:text-white">
            {metrics?.food_saved_kg || 0} <span className="text-sm font-medium text-slate-400">kg</span>
          </h3>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Reservations</p>
          <h3 className="text-3xl font-extrabold mt-2 text-sky-600 dark:text-sky-400">
            {metrics?.status_breakdown?.RESERVED || 0}
          </h3>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
        <div>
          <h3 className="text-xl font-bold">Your Donation Listings</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Track states, approve claims, and coordinate courier deliveries.</p>
        </div>
        {isVerified && (
          <Link 
            to="/donations/create" 
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all text-sm"
          >
            <FaPlus />
            <span>Create New Donation</span>
          </Link>
        )}
      </div>

      {/* Donation Tables */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 overflow-hidden shadow-sm">
        {donations.length === 0 ? (
          <div className="p-16 text-center">
            <FaUtensils className="text-slate-300 dark:text-slate-600 text-5xl mx-auto mb-4" />
            <h4 className="font-bold text-slate-700 dark:text-slate-300 text-lg">No listings posted yet</h4>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 max-w-sm mx-auto">
              Any leftover or excess food posts you schedule on the platform will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                  <th className="py-4 px-6">Food Details</th>
                  <th className="py-4 px-6">Meal Category</th>
                  <th className="py-4 px-6">Portions / Qty</th>
                  <th className="py-4 px-6">Expiry</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 font-medium">
                {donations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <Link to={`/donations/${donation.id}`} className="hover:text-emerald-500 font-bold block">
                        {donation.food_name}
                      </Link>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{donation.food_category}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700/40 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold">
                        {donation.meal_type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {donation.serves_people} portions <span className="text-xs text-slate-400">({donation.quantity} kg)</span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400">
                      {new Date(donation.expiry_time).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[donation.status] || ''}`}>
                        {STATUS_LABELS[donation.status] || donation.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link 
                        to={`/donations/${donation.id}`}
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
                      >
                        Manage &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default RestaurantDashboard;
