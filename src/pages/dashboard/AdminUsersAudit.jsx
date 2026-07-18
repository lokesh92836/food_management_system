import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner, FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';

const AdminUsersAudit = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await adminService.listUsers();
      setUsers(data || []);
    } catch (err) {
      toast.error("Failed to load user records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleVerify = async (user) => {
    const details = user.profile_details;
    if (!details) {
      toast.error("No profile details found for this user.");
      return;
    }

    const profileType = 
      user.role === 'RESTAURANT_OWNER' ? 'restaurant' :
      user.role === 'NGO' ? 'ngo' :
      user.role === 'VOLUNTEER' ? 'volunteer' : 'delivery';
      
    try {
      await adminService.verifyProfile(profileType, details.id, !details.is_verified);
      toast.success("Verification status updated.");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

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
          <h2 className="text-xl font-bold">User Administration Directory</h2>
          <p className="text-xs text-slate-400">Review all accounts registered on the network.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                <th className="py-4 px-6">Account Name</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 font-medium">
              {users.map((u) => {
                const verified = u.profile_details?.is_verified;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-bold">{u.first_name} {u.last_name || 'Admin'}</td>
                    <td className="py-4 px-6 text-xs text-slate-500">{u.email}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg uppercase tracking-wide">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {u.role === 'ADMIN' ? (
                        <span className="text-emerald-500 font-semibold">Active</span>
                      ) : verified ? (
                        <span className="text-emerald-500 font-semibold flex items-center gap-1">
                          <FaCheck className="text-xs" /> Verified
                        </span>
                      ) : (
                        <span className="text-amber-500 font-semibold flex items-center gap-1">
                          <FaTimes className="text-xs" /> Unverified
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleVerify(u)}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all
                            ${verified 
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400' 
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                            }
                          `}
                        >
                          {verified ? "Revoke Verification" : "Approve Profile"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersAudit;
