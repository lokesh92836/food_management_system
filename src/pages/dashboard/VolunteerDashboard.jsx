import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaCheckCircle, FaExclamationTriangle, FaBiking, FaSpinner, FaHistory } from 'react-icons/fa';
import donationService from '../../services/donationService';
import { STATUS_COLORS, STATUS_LABELS } from '../../constants/statuses';

const VolunteerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [assignedDonations, setAssignedDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVolunteerData = async () => {
    try {
      // Fetch donations assigned to this volunteer (which are not completed or cancelled)
      const data = await donationService.list({ status: 'RESERVED,PICKED_UP' });
      // Filter for those assigned to the current user profile ID
      const profileId = user?.profile_details?.id;
      const filtered = data.results?.filter(d => d.assigned_volunteer === profileId) || [];
      setAssignedDonations(filtered);
    } catch (err) {
      console.error("Error loading volunteer data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteerData();
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
      
      {/* Verification notice */}
      {!isVerified ? (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 p-4 rounded-2xl flex items-start gap-3">
          <FaExclamationTriangle className="text-amber-500 text-xl mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-amber-900 dark:text-amber-300">Profile Verification Required</h4>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              Your courier/volunteer profile needs to be audited by administrators. You will be able to self-assign delivery missions once approved.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 p-4 rounded-2xl flex items-start gap-3">
          <FaCheckCircle className="text-emerald-500 text-xl mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-emerald-900 dark:text-emerald-300">Verified Volunteer</h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-0.5">
              You are ready to claim pickup missions and deliver meals to local communities.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
        <div>
          <h3 className="text-xl font-bold">Your Active Delivery Missions</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Confirm pick-ups at food donors and drop-offs at NGO recipients.</p>
        </div>
        {isVerified && (
          <Link 
            to="/donations" 
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all text-sm"
          >
            <FaBiking />
            <span>Discover Pickup Missions</span>
          </Link>
        )}
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 gap-6">
        {assignedDonations.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-16 text-center shadow-sm">
            <FaBiking className="text-slate-300 dark:text-slate-600 text-5xl mx-auto mb-4" />
            <h4 className="font-bold text-slate-700 dark:text-slate-300 text-lg">No active transport duties</h4>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 max-w-sm mx-auto">
              Check the available food directory and self-assign to transport packages.
            </p>
          </div>
        ) : (
          assignedDonations.map((donation) => (
            <div 
              key={donation.id}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 flex flex-col md:flex-row justify-between gap-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-4 flex-1">
                <div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[donation.status] || ''}`}>
                    {STATUS_LABELS[donation.status] || donation.status}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-3">{donation.food_name}</h4>
                  <p className="text-xs text-slate-400">{donation.food_category} &bull; {donation.serves_people} portions ({donation.quantity} kg)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                    <strong className="text-xs text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Pickup Location</strong>
                    <span className="font-semibold block mt-1">{donation.restaurant_details?.business_name}</span>
                    <span className="text-xs text-slate-500 block">{donation.pickup_address}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                    <strong className="text-xs text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Deliver Recipient</strong>
                    <span className="font-semibold block mt-1">{donation.claimed_by_ngo_details?.organization_name}</span>
                    <span className="text-xs text-slate-500 block">{donation.claimed_by_ngo_details?.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between items-end gap-4 min-w-[150px]">
                <p className="text-xs font-semibold text-slate-400">
                  Prep: {new Date(donation.preparation_time).toLocaleTimeString()}<br/>
                  Expiry: {new Date(donation.expiry_time).toLocaleTimeString()}
                </p>
                <Link 
                  to={`/donations/${donation.id}`}
                  className="w-full text-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition-all"
                >
                  Manage Mission &rarr;
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default VolunteerDashboard;
