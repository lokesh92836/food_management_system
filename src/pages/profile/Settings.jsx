import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FaSpinner, FaUser, FaLock, FaCheck } from 'react-icons/fa';
import profileService from '../../services/profileService';
import authService from '../../services/authService';
import { updateUser } from '../../store/authSlice';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Profile Form
  const { register: regProfile, handleSubmit: handleProfileSubmit } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      profile_details: {
        business_name: user?.profile_details?.business_name || '',
        owner_name: user?.profile_details?.owner_name || '',
        license_number: user?.profile_details?.license_number || '',
        gst_number: user?.profile_details?.gst_number || '',
        contact_number: user?.profile_details?.contact_number || '',
        address: user?.profile_details?.address || '',
        city: user?.profile_details?.city || '',
        state: user?.profile_details?.state || '',
        pincode: user?.profile_details?.pincode || '',
        
        // NGO details
        organization_name: user?.profile_details?.organization_name || '',
        registration_number: user?.profile_details?.registration_number || '',
        contact_person: user?.profile_details?.contact_person || '',
        phone: user?.profile_details?.phone || '',

        // Volunteer & Delivery details
        identity_verification: user?.profile_details?.identity_verification || '',
        vehicle_type: user?.profile_details?.vehicle_type || '',
        availability_status: user?.profile_details?.availability_status ?? true
      }
    }
  });

  // Password Form
  const { register: regPassword, handleSubmit: handlePasswordSubmit, reset: resetPasswordForm, formState: { errors: passwordErrors } } = useForm();

  const onUpdateProfile = async (data) => {
    setProfileLoading(true);
    
    // Clean up empty fields from sub-profile to match role
    const cleanedDetails = {};
    const d = data.profile_details;
    if (user.role === 'RESTAURANT_OWNER') {
      cleanedDetails.business_name = d.business_name;
      cleanedDetails.owner_name = d.owner_name;
      cleanedDetails.license_number = d.license_number;
      cleanedDetails.gst_number = d.gst_number;
      cleanedDetails.contact_number = d.contact_number;
      cleanedDetails.address = d.address;
      cleanedDetails.city = d.city;
      cleanedDetails.state = d.state;
      cleanedDetails.pincode = d.pincode;
    } else if (user.role === 'NGO') {
      cleanedDetails.organization_name = d.organization_name;
      cleanedDetails.registration_number = d.registration_number;
      cleanedDetails.contact_person = d.contact_person;
      cleanedDetails.phone = d.phone;
      cleanedDetails.address = d.address;
    } else if (user.role === 'VOLUNTEER') {
      cleanedDetails.identity_verification = d.identity_verification;
      cleanedDetails.availability_status = d.availability_status === 'true' || d.availability_status === true;
    } else if (user.role === 'DELIVERY_PARTNER') {
      cleanedDetails.vehicle_type = d.vehicle_type;
      cleanedDetails.license_number = d.license_number;
      cleanedDetails.availability_status = d.availability_status === 'true' || d.availability_status === true;
    }

    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      profile_details: cleanedDetails
    };

    try {
      const response = await profileService.updateProfile(payload);
      dispatch(updateUser(response));
      toast.success("Profile details updated successfully.");
    } catch (err) {
      toast.error("Failed to update profile details.");
    } finally {
      setProfileLoading(false);
    }
  };

  const onChangePassword = async (data) => {
    setPasswordLoading(true);
    try {
      await authService.changePassword({
        old_password: data.old_password,
        new_password: data.new_password,
        new_password_confirm: data.new_password_confirm
      });
      toast.success("Password changed successfully.");
      resetPasswordForm();
    } catch (err) {
      const errorMsg = err.response?.data ? Object.values(err.response.data).flat().join(' ') : "Password change failed.";
      toast.error(errorMsg);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold">Profile & Account Settings</h2>
        <p className="text-xs text-slate-400">Update credential details and configure security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Profile Details */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="font-bold text-lg border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2">
            <FaUser className="text-emerald-500" />
            <span>Profile Details</span>
          </h3>

          <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400">First Name</label>
                <input
                  type="text"
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  {...regProfile('first_name', { required: true })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400">Last Name</label>
                <input
                  type="text"
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  {...regProfile('last_name', { required: true })}
                />
              </div>
            </div>

            {/* Restaurant owner profile details inputs */}
            {user?.role === 'RESTAURANT_OWNER' && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400">Business Name</label>
                    <input
                      type="text"
                      className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                      {...regProfile('profile_details.business_name')}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400">Owner Name</label>
                    <input
                      type="text"
                      className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                      {...regProfile('profile_details.owner_name')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400">License Number</label>
                    <input
                      type="text"
                      className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                      {...regProfile('profile_details.license_number')}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400">GST Number</label>
                    <input
                      type="text"
                      className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                      {...regProfile('profile_details.gst_number')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400">Contact Phone</label>
                    <input
                      type="text"
                      className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                      {...regProfile('profile_details.contact_number')}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400">Pincode</label>
                    <input
                      type="text"
                      className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                      {...regProfile('profile_details.pincode')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400">Street Address</label>
                  <textarea
                    rows="2"
                    className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                    {...regProfile('profile_details.address')}
                  />
                </div>
              </div>
            )}

            {/* NGO details inputs */}
            {user?.role === 'NGO' && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400">Organization Name</label>
                    <input
                      type="text"
                      className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                      {...regProfile('profile_details.organization_name')}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400">Contact Person</label>
                    <input
                      type="text"
                      className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                      {...regProfile('profile_details.contact_person')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400">Registration Number</label>
                    <input
                      type="text"
                      className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                      {...regProfile('profile_details.registration_number')}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400">Phone</label>
                    <input
                      type="text"
                      className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                      {...regProfile('profile_details.phone')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400">Street Address</label>
                  <textarea
                    rows="2"
                    className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                    {...regProfile('profile_details.address')}
                  />
                </div>
              </div>
            )}

            {/* Volunteer & Courier details inputs */}
            {(user?.role === 'VOLUNTEER' || user?.role === 'DELIVERY_PARTNER') && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400">Identity Doc Number</label>
                  <input
                    type="text"
                    className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                    {...regProfile('profile_details.identity_verification')}
                  />
                </div>

                {user?.role === 'DELIVERY_PARTNER' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-400">Vehicle Info / License</label>
                    <input
                      type="text"
                      placeholder="e.g. Motorcycle, LIC-12345"
                      className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                      {...regProfile('profile_details.vehicle_type')}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-400">Availability Status</label>
                  <select
                    className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200"
                    {...regProfile('profile_details.availability_status')}
                  >
                    <option value="true">Active & Available for Jobs</option>
                    <option value="false">Busy / Offline</option>
                  </select>
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={profileLoading}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/25 disabled:opacity-50 transition-all flex items-center gap-1.5"
              >
                {profileLoading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                <span>Save Changes</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Side: Change Password */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm space-y-6 h-fit transition-colors">
          <h3 className="font-bold text-lg border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2">
            <FaLock className="text-emerald-500" />
            <span>Change Password</span>
          </h3>

          <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400">Old Password</label>
              <input
                type="password"
                required
                className="w-full mt-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none"
                {...regPassword('old_password', { required: true })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400">New Password</label>
              <input
                type="password"
                required
                className="w-full mt-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none"
                {...regPassword('new_password', { required: true, minLength: 6 })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400">Confirm Password</label>
              <input
                type="password"
                required
                className="w-full mt-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none"
                {...regPassword('new_password_confirm', { required: true })}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                {passwordLoading ? <FaSpinner className="animate-spin mx-auto text-lg" /> : "Update Password"}
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};

export default Settings;
