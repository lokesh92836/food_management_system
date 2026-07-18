import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';
import adminService from '../../services/adminService';
import { STATUS_COLORS, STATUS_LABELS } from '../../constants/statuses';

const AdminDonationsAudit = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await adminService.listDonations();
        setDonations(data || []);
      } catch (err) {
        console.error("Failed to load donations audit details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/dashboard/admin" className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all">
          <FaArrowLeft />
        </Link>
        <div>
          <h2 className="text-xl font-bold">Food Donation Auditing Log</h2>
          <p className="text-xs text-slate-400">Review all surplus postings and transition history across the system.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                <th className="py-4 px-6">Food Name</th>
                <th className="py-4 px-6">Restaurant Donor</th>
                <th className="py-4 px-6">Claimant NGO</th>
                <th className="py-4 px-6">Quantity</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 font-medium">
              {donations.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-bold">{d.food_name}</td>
                  <td className="py-4 px-6 text-xs text-slate-500">{d.restaurant_details?.business_name}</td>
                  <td className="py-4 px-6 text-xs text-slate-500">{d.claimed_by_ngo_details?.organization_name || <span className="italic text-slate-400">None</span>}</td>
                  <td className="py-4 px-6 text-xs">
                    {d.serves_people} portions <span className="text-slate-400">({d.quantity} kg)</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${STATUS_COLORS[d.status] || ''}`}>
                      {STATUS_LABELS[d.status] || d.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link 
                      to={`/donations/${d.id}`}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
                    >
                      Audit &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDonationsAudit;
