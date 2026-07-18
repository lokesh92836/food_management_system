import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, FaUtensils, FaSpinner, FaMapMarkerAlt, 
  FaUser, FaTruck, FaClock, FaCheckCircle, FaExclamationTriangle, FaTrashAlt 
} from 'react-icons/fa';
import donationService from '../../services/donationService';
import { STATUS_COLORS, STATUS_LABELS } from '../../constants/statuses';

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDonationDetails = async () => {
    try {
      const data = await donationService.get(id);
      setDonation(data);
    } catch (err) {
      toast.error("Failed to load donation details.");
      navigate('/donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonationDetails();
  }, [id]);

  const handleClaim = async () => {
    setActionLoading(true);
    try {
      await donationService.claim(id);
      toast.success("Food reserved successfully! Waiting for restaurant approval.");
      fetchDonationDetails();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to claim food.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await donationService.approve(id);
      toast.success("Claim approved! Courier can now pick up the food.");
      fetchDonationDetails();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to approve claim.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelfAssign = async () => {
    setActionLoading(true);
    try {
      await donationService.assignVolunteer(id);
      toast.success("You have been assigned to this delivery mission!");
      fetchDonationDetails();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to self-assign.");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePickup = async () => {
    setActionLoading(true);
    try {
      await donationService.pickup(id);
      toast.success("Food marked as picked up!");
      fetchDonationDetails();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to record pickup.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeliver = async () => {
    setActionLoading(true);
    try {
      await donationService.deliver(id);
      toast.success("Food delivered successfully! Thank you for your contribution!");
      fetchDonationDetails();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to record delivery.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel?")) return;
    setActionLoading(true);
    try {
      await donationService.cancel(id);
      toast.success("Action cancelled successfully.");
      fetchDonationDetails();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to cancel.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this listing permanently? This cannot be undone.")) return;
    setActionLoading(true);
    try {
      await donationService.delete(id);
      toast.success("Listing deleted.");
      navigate('/donations');
    } catch (err) {
      toast.error(err.response?.data ? Object.values(err.response.data).flat().join(' ') : "Delete failed.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
      </div>
    );
  }

  if (!donation) return null;

  // Determine user relationships
  const isOwner = donation.restaurant === user?.profile_details?.id;
  const isClaimantNGO = donation.claimed_by_ngo === user?.profile_details?.id;
  const isAssignedCourier = 
    (donation.assigned_volunteer && donation.assigned_volunteer === user?.profile_details?.id) ||
    (donation.assigned_delivery_partner && donation.assigned_delivery_partner === user?.profile_details?.id);

  // Stepper timeline calculation
  const stepperStates = [
    { label: 'Available', status: 'AVAILABLE', completed: true },
    { label: 'Claimed (Pending Approval)', status: 'RESERVED', completed: ['RESERVED', 'PICKED_UP', 'DELIVERED'].includes(donation.status) },
    { label: 'En Route (Picked Up)', status: 'PICKED_UP', completed: ['PICKED_UP', 'DELIVERED'].includes(donation.status) },
    { label: 'Delivered', status: 'DELIVERED', completed: donation.status === 'DELIVERED' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/donations" className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all">
            <FaArrowLeft />
          </Link>
          <div>
            <h2 className="text-xl font-bold">Food Rescue Details</h2>
            <p className="text-xs text-slate-400">Track claim statuses, audit trails, and logistics schedules.</p>
          </div>
        </div>
        
        {isOwner && donation.status === 'AVAILABLE' && (
          <button
            onClick={handleDelete}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold transition-all border border-rose-200 dark:border-rose-900/50"
          >
            <FaTrashAlt />
            <span>Delete Listing</span>
          </button>
        )}
      </div>

      {/* Workflow Stepper Progress */}
      {donation.status !== 'CANCELLED' && donation.status !== 'EXPIRED' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm transition-colors">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
            {stepperStates.map((step, idx) => (
              <React.Fragment key={step.label}>
                {/* Step circle */}
                <div className="flex flex-col items-center text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all
                    ${step.completed 
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                      : 'border-slate-200 text-slate-400 dark:border-slate-700'
                    }
                  `}>
                    {idx + 1}
                  </div>
                  <span className={`text-xs mt-2 font-bold max-w-[120px] 
                    ${step.completed ? 'text-slate-800 dark:text-white' : 'text-slate-400'}
                  `}>
                    {step.label}
                  </span>
                </div>
                {/* Connector line */}
                {idx < stepperStates.length - 1 && (
                  <div className={`hidden md:block flex-1 h-0.5 mx-4 transition-colors
                    ${stepperStates[idx + 1].completed ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}
                  `} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Listing details */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Detail card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-6">
            
            <div className="flex justify-between items-start">
              <div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[donation.status] || ''}`}>
                  {STATUS_LABELS[donation.status] || donation.status}
                </span>
                <h3 className="text-2xl font-bold mt-3 text-slate-900 dark:text-white">{donation.food_name}</h3>
                <p className="text-xs text-slate-400 mt-1">Category: {donation.food_category} &bull; Course: {donation.meal_type}</p>
              </div>
              
              <span className={`px-2.5 py-1 text-xs font-bold text-white rounded-lg
                ${donation.veg_non_veg === 'VEG' ? 'bg-green-600' : 'bg-red-600'}
              `}>
                {donation.veg_non_veg === 'VEG' ? 'VEG' : 'NON-VEG'}
              </span>
            </div>

            {/* Photos */}
            {donation.images && donation.images.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Food Images</h4>
                <div className="grid grid-cols-2 gap-4">
                  {donation.images.map((imgObj) => (
                    <div key={imgObj.id} className="h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img src={imgObj.image} alt="food upload" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details details */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 text-sm">
              <div>
                <strong className="text-slate-400 text-xs block uppercase tracking-wider">Quantity / Weight</strong>
                <span className="font-bold text-lg text-slate-800 dark:text-slate-200 mt-1 block">
                  {donation.quantity} kg
                </span>
              </div>
              <div>
                <strong className="text-slate-400 text-xs block uppercase tracking-wider">Portions Served</strong>
                <span className="font-bold text-lg text-slate-800 dark:text-slate-200 mt-1 block">
                  {donation.serves_people} portions
                </span>
              </div>
              <div>
                <strong className="text-slate-400 text-xs block uppercase tracking-wider">Preparation Time</strong>
                <span className="text-slate-700 dark:text-slate-300 mt-1 block flex items-center gap-1.5">
                  <FaClock className="text-slate-400" />
                  {new Date(donation.preparation_time).toLocaleString()}
                </span>
              </div>
              <div>
                <strong className="text-slate-400 text-xs block uppercase tracking-wider">Expiry Time</strong>
                <span className="text-slate-700 dark:text-slate-300 mt-1 block flex items-center gap-1.5">
                  <FaClock className="text-slate-400" />
                  {new Date(donation.expiry_time).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 space-y-4">
              <div>
                <strong className="text-slate-400 text-xs block uppercase tracking-wider">Pickup Address</strong>
                <p className="text-sm font-semibold mt-1 flex items-start gap-1.5">
                  <FaMapMarkerAlt className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{donation.pickup_address}</span>
                </p>
              </div>

              {donation.instructions && (
                <div>
                  <strong className="text-slate-400 text-xs block uppercase tracking-wider">Handling Instructions</strong>
                  <p className="text-sm bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-650 dark:text-slate-350 mt-1">
                    {donation.instructions}
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Audit trail status logs */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FaHistory />
              <span>Status Transition Audit Trail</span>
            </h4>
            <div className="flow-root">
              <ul className="-mb-8">
                {donation.status_logs?.map((log, logIdx) => (
                  <li key={log.id}>
                    <div className="relative pb-8">
                      {logIdx < donation.status_logs.length - 1 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-700" />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center ring-8 ring-white dark:ring-slate-800 text-xs font-bold text-emerald-500">
                            {logIdx + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-xs text-slate-500">
                              Status changed to <strong className="text-slate-700 dark:text-slate-200">{STATUS_LABELS[log.new_status] || log.new_status}</strong>
                              {log.changed_by_email && ` by ${log.changed_by_email}`}
                            </p>
                          </div>
                          <div className="text-right text-[10px] whitespace-nowrap text-slate-400">
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Right Side: Operations Command Card */}
        <div className="space-y-6">
          
          {/* Main action execution panel */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm text-center space-y-6 transition-colors">
            <h4 className="font-extrabold text-lg text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700/50 pb-3">
              Operations Control
            </h4>

            {/* NGO Claims Action Button */}
            {user?.role === 'NGO' && donation.status === 'AVAILABLE' && (
              <button
                onClick={handleClaim}
                disabled={actionLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-2xl shadow transition-all flex justify-center items-center"
              >
                {actionLoading ? <FaSpinner className="animate-spin text-lg" /> : "Claim Food Donation"}
              </button>
            )}

            {/* Restaurant Approves Claim Button */}
            {isOwner && donation.status === 'RESERVED' && !donation.approved_by_restaurant && (
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-2xl shadow transition-all flex justify-center items-center"
              >
                {actionLoading ? <FaSpinner className="animate-spin text-lg" /> : "Approve NGO Claim"}
              </button>
            )}

            {/* Volunteer / Courier Self Assign Button */}
            {(user?.role === 'VOLUNTEER' || user?.role === 'DELIVERY_PARTNER') && 
              donation.status === 'RESERVED' && 
              donation.approved_by_restaurant && 
              !donation.assigned_volunteer && 
              !donation.assigned_delivery_partner && (
                <button
                  onClick={handleSelfAssign}
                  disabled={actionLoading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-2xl shadow transition-all flex justify-center items-center"
                >
                  {actionLoading ? <FaSpinner className="animate-spin text-lg" /> : "Self-Assign to Transport"}
                </button>
            )}

            {/* Courier Pickup Action Button */}
            {isAssignedCourier && donation.status === 'RESERVED' && (
              <button
                onClick={handlePickup}
                disabled={actionLoading}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white font-bold rounded-2xl shadow transition-all flex justify-center items-center"
              >
                {actionLoading ? <FaSpinner className="animate-spin text-lg" /> : "Mark Food Picked Up"}
              </button>
            )}

            {/* Courier Deliver Action Button */}
            {isAssignedCourier && donation.status === 'PICKED_UP' && (
              <button
                onClick={handleDeliver}
                disabled={actionLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-2xl shadow transition-all flex justify-center items-center"
              >
                {actionLoading ? <FaSpinner className="animate-spin text-lg" /> : "Mark Delivered"}
              </button>
            )}

            {/* Cancellation Option (Restaurant or Claimant NGO) */}
            {(isOwner || isClaimantNGO) && ['AVAILABLE', 'RESERVED', 'PICKED_UP'].includes(donation.status) && (
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs transition-all flex justify-center items-center"
              >
                {isClaimantNGO ? "Release Food / Cancel Claim" : "Cancel Donation Post"}
              </button>
            )}

            {/* Static default state message */}
            {!isOwner && !isClaimantNGO && !isAssignedCourier && (
              <p className="text-xs text-slate-400">
                You do not have active management control over this donation.
              </p>
            )}
          </div>

          {/* Contact Details Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-700/50">
              Contact Directory
            </h4>
            
            {/* Restaurant profile details */}
            <div className="flex gap-3">
              <FaUser className="text-emerald-500 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-xs text-slate-400 block uppercase">Donor Restaurant</strong>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{donation.restaurant_details?.business_name}</span>
                <span className="text-xs text-slate-400 block">{donation.restaurant_details?.contact_number}</span>
              </div>
            </div>

            {/* NGO details */}
            {donation.claimed_by_ngo_details && (
              <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                <FaHandHoldingHeart className="text-sky-500 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-xs text-slate-400 block uppercase">Recipient NGO</strong>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{donation.claimed_by_ngo_details?.organization_name}</span>
                  <span className="text-xs text-slate-400 block">{donation.claimed_by_ngo_details?.phone}</span>
                </div>
              </div>
            )}

            {/* Courier details */}
            {(donation.assigned_volunteer_details || donation.assigned_delivery_partner_details) && (
              <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                <FaTruck className="text-indigo-500 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-xs text-slate-400 block uppercase">Courier Assigned</strong>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    {donation.assigned_volunteer_details?.name || donation.assigned_delivery_partner_details?.name}
                  </span>
                  <span className="text-xs text-slate-400 block">
                    {donation.assigned_delivery_partner_details ? "Professional Delivery Partner" : "Volunteer Courier"}
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default DonationDetails;
