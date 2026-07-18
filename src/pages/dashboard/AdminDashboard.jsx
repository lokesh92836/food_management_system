import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner, FaUsers, FaClipboardList, FaCheck, FaTimes, FaShieldAlt } from 'react-icons/fa';
import adminService from '../../services/adminService';
import analyticsService from '../../services/analyticsService';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch user list
      const userList = await adminService.listUsers();
      setUsers(userList || []);
      
      // 2. Fetch global overview metrics
      const globalOverview = await analyticsService.getOverview();
      setMetrics(globalOverview);
    } catch (err) {
      console.error("Failed to load admin dashboard data", err);
      toast.error("Error loading dashboard audits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerify = async (profileType, profileId, currentVerifyState) => {
    try {
      await adminService.verifyProfile(profileType, profileId, !currentVerifyState);
      toast.success(`Verification status updated successfully.`);
      // Reload details
      fetchAdminData();
    } catch (err) {
      toast.error("Failed to update verification status.");
    }
  };

  // Filter users who have profiles that are NOT verified
  const getPendingProfiles = () => {
    const pendingList = [];
    users.forEach(user => {
      const details = user.profile_details;
      if (details && !details.is_verified) {
        let typeLabel = '';
        let orgName = '';
        let registrationNum = '';
        
        if (user.role === 'RESTAURANT_OWNER') {
          typeLabel = 'Restaurant';
          orgName = details.business_name || 'Unnamed Restaurant';
          registrationNum = `License: ${details.license_number || 'N/A'}`;
        } else if (user.role === 'NGO') {
          typeLabel = 'NGO';
          orgName = details.organization_name || 'Unnamed NGO';
          registrationNum = `Reg: ${details.registration_number || 'N/A'}`;
        } else if (user.role === 'VOLUNTEER') {
          typeLabel = 'Volunteer';
          orgName = `${user.first_name} ${user.last_name}`;
          registrationNum = `ID Verification: ${details.identity_verification || 'N/A'}`;
        } else if (user.role === 'DELIVERY_PARTNER') {
          typeLabel = 'Delivery Partner';
          orgName = `${user.first_name} ${user.last_name}`;
          registrationNum = `License: ${details.license_number || 'N/A'} (${details.vehicle_type || 'N/A'})`;
        }

        if (typeLabel) {
          pendingList.push({
            userId: user.id,
            profileId: details.id,
            roleKey: user.role,
            profileType: typeLabel,
            name: orgName,
            email: user.email,
            reference: registrationNum,
            isVerified: false
          });
        }
      }
    });
    return pendingList;
  };

  const pendingProfiles = getPendingProfiles();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl flex items-center gap-4 shadow-lg">
        <FaShieldAlt className="text-4xl text-emerald-400 flex-shrink-0" />
        <div>
          <h2 className="text-xl font-bold">Admin Audit Command Center</h2>
          <p className="text-xs text-slate-400 mt-1">Approve registrations, inspect user profiles, and view global transaction analytics.</p>
        </div>
      </div>

      {/* KPI Overviews */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Listings</p>
          <h3 className="text-3xl font-extrabold mt-2">{metrics?.total_donations || 0}</h3>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Meals Saved</p>
          <h3 className="text-3xl font-extrabold mt-2 text-emerald-600 dark:text-emerald-400">{metrics?.meals_saved || 0}</h3>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weight Saved (kg)</p>
          <h3 className="text-3xl font-extrabold mt-2">{metrics?.food_saved_kg || 0}</h3>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">People Helped</p>
          <h3 className="text-3xl font-extrabold mt-2 text-sky-600 dark:text-sky-400">{metrics?.people_helped || 0}</h3>
        </div>
      </div>

      {/* Admin Tab Menus */}
      <div className="flex border-b border-slate-200 dark:border-slate-700/60 gap-8">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`pb-3 font-semibold text-sm transition-all border-b-2 
            ${activeTab === 'pending' 
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
            }
          `}
        >
          Pending verifications ({pendingProfiles.length})
        </button>
        <button 
          onClick={() => setActiveTab('links')}
          className={`pb-3 font-semibold text-sm transition-all border-b-2 
            ${activeTab === 'links' 
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
            }
          `}
        >
          Quick Audit Tables
        </button>
      </div>

      {/* Active Tab Viewport */}
      {activeTab === 'pending' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 overflow-hidden shadow-sm">
          {pendingProfiles.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <FaCheck className="text-emerald-500 text-4xl mx-auto mb-4" />
              <h4 className="font-bold text-slate-700 dark:text-slate-300">All caught up!</h4>
              <p className="text-xs mt-1 text-slate-400 dark:text-slate-500">There are no pending partner registrations to verify.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                    <th className="py-4 px-6">Name / Details</th>
                    <th className="py-4 px-6">Type</th>
                    <th className="py-4 px-6">Contact Email</th>
                    <th className="py-4 px-6">Audit Credentials</th>
                    <th className="py-4 px-6 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 font-medium">
                  {pendingProfiles.map((prof) => (
                    <tr key={prof.profileId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6 font-bold">{prof.name}</td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-lg font-bold">
                          {prof.profileType}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs">{prof.email}</td>
                      <td className="py-4 px-6 text-slate-650 dark:text-slate-400 text-xs font-mono">{prof.reference}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleVerify(
                            prof.roleKey === 'RESTAURANT_OWNER' ? 'restaurant' :
                            prof.roleKey === 'NGO' ? 'ngo' :
                            prof.roleKey === 'VOLUNTEER' ? 'volunteer' : 'delivery',
                            prof.profileId,
                            false
                          )}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1 ml-auto"
                        >
                          <FaCheck />
                          <span>Approve</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'links' && (
        <div className="grid md:grid-cols-2 gap-6">
          <Link 
            to="/dashboard/admin/users" 
            className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center text-xl">
              <FaUsers />
            </div>
            <div>
              <h4 className="font-bold text-lg">Manage Platform Users</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Review accounts, roles, and emails.</p>
            </div>
          </Link>

          <Link 
            to="/dashboard/admin/donations" 
            className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-2xl flex items-center justify-center text-xl">
              <FaClipboardList />
            </div>
            <div>
              <h4 className="font-bold text-lg">Audit Food Donations</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Inspect all donations postings and logs.</p>
            </div>
          </Link>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
