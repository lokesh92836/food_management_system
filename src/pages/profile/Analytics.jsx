import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaChartBar, FaSpinner, FaUtensils, FaHandsHelping, FaLeaf } from 'react-icons/fa';
import analyticsService from '../../services/analyticsService';

const Analytics = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [globalMetrics, setGlobalMetrics] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [roleMetrics, setRoleMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      // 1. Fetch platform overview totals
      const overview = await analyticsService.getOverview();
      setGlobalMetrics(overview);

      // 2. Fetch monthly stats trends
      const monthly = await analyticsService.getMonthlyStats();
      setMonthlyStats(monthly || []);

      // 3. Fetch role-specific details
      if (user?.role === 'RESTAURANT_OWNER') {
        const restData = await analyticsService.getRestaurantMetrics();
        setRoleMetrics(restData);
      } else if (user?.role === 'NGO') {
        const ngoData = await analyticsService.getNGOMetrics();
        setRoleMetrics(ngoData);
      }
    } catch (err) {
      console.error("Failed to load analytics details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-bold">Analytics & Impact Performance</h2>
        <p className="text-xs text-slate-400">Review platform-wide waste reduction values and your organization metrics.</p>
      </div>

      {/* Global Impact totals cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-650 text-white p-6 rounded-3xl shadow flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl">
            <FaUtensils />
          </div>
          <div>
            <strong className="text-xs text-emerald-100 block uppercase">Total Portions Shared</strong>
            <h3 className="text-3xl font-extrabold mt-1">{globalMetrics?.meals_saved || 0}</h3>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-violet-650 text-white p-6 rounded-3xl shadow flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl">
            <FaLeaf />
          </div>
          <div>
            <strong className="text-xs text-indigo-100 block uppercase">Food Rescued (kg)</strong>
            <h3 className="text-3xl font-extrabold mt-1">{globalMetrics?.food_saved_kg || 0}</h3>
          </div>
        </div>

        <div className="bg-gradient-to-br from-sky-500 to-blue-650 text-white p-6 rounded-3xl shadow flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl">
            <FaHandsHelping />
          </div>
          <div>
            <strong className="text-xs text-sky-100 block uppercase">People Impacted</strong>
            <h3 className="text-3xl font-extrabold mt-1">{globalMetrics?.people_helped || 0}</h3>
          </div>
        </div>
      </div>

      {/* Role specific individual metrics */}
      {roleMetrics && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-4 transition-colors">
          <h3 className="font-bold text-lg border-b border-slate-100 dark:border-slate-700/50 pb-3">
            Your Performance Impact summary ({user?.role === 'RESTAURANT_OWNER' ? 'Restaurant' : 'NGO'})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
            <div>
              <span className="text-xs text-slate-400 block uppercase">Active postings count</span>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                {roleMetrics.total_donations_created || roleMetrics.total_donations_claimed || 0}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block uppercase">Total Portions</span>
              <span className="text-lg font-bold text-emerald-500 mt-1 block">
                {roleMetrics.meals_saved || roleMetrics.meals_received || 0} portions
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block uppercase">Total Weight</span>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                {roleMetrics.food_saved_kg || 0} kg
              </span>
            </div>
            {roleMetrics.status_breakdown && (
              <div>
                <span className="text-xs text-slate-400 block uppercase">Delivered / Completed</span>
                <span className="text-lg font-bold text-indigo-500 mt-1 block">
                  {roleMetrics.status_breakdown?.DELIVERED || 0}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Monthly Statistics Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 overflow-hidden shadow-sm transition-colors">
        <h3 className="font-bold text-lg p-6 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-2">
          <FaChartBar className="text-emerald-500" />
          <span>Monthly Platform growth records</span>
        </h3>
        
        {monthlyStats.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No historical reports found yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                  <th className="py-4 px-6">Month</th>
                  <th className="py-4 px-6">Donations Completed</th>
                  <th className="py-4 px-6">Meals Distributed</th>
                  <th className="py-4 px-6">Weight Saved (kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 font-medium">
                {monthlyStats.map((stat) => (
                  <tr key={stat.month} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-bold">{stat.month}</td>
                    <td className="py-4 px-6">{stat.donations_count}</td>
                    <td className="py-4 px-6 text-emerald-600 dark:text-emerald-400 font-semibold">{stat.meals_saved} portions</td>
                    <td className="py-4 px-6">{stat.food_saved_kg} kg</td>
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

export default Analytics;
