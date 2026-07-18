import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaSpinner, FaUtensils } from 'react-icons/fa';
import donationService from '../../services/donationService';
import { STATUS_COLORS, STATUS_LABELS } from '../../constants/statuses';

const DonationList = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mealFilter, setMealFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('AVAILABLE'); // default view available

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        search: searchTerm || undefined,
        meal_type: mealFilter || undefined,
        veg_non_veg: typeFilter || undefined,
        status: statusFilter || undefined
      };
      const response = await donationService.list(params);
      setDonations(response.results || []);
      setTotalCount(response.count || 0);
      setNextPage(response.next);
      setPrevPage(response.previous);
    } catch (err) {
      console.error("Failed to load donations listing", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [page, mealFilter, typeFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDonations();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold">Surplus Food Listings Catalog</h2>
        <p className="text-xs text-slate-400">Search and filter active donations available in your community.</p>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between transition-colors">
        
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search food, categories, addresses, donors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-slate-100"
          />
          <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
        </form>

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="AVAILABLE">Show Available Only</option>
            <option value="">Show All Listings</option>
            <option value="RESERVED">Claimed / Reserved</option>
            <option value="DELIVERED">Delivered / Completed</option>
          </select>

          {/* Meal Type Filter */}
          <select
            value={mealFilter}
            onChange={(e) => { setMealFilter(e.target.value); setPage(1); }}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="">All Course Types</option>
            <option value="BREAKFAST">Breakfast</option>
            <option value="LUNCH">Lunch</option>
            <option value="DINNER">Dinner</option>
            <option value="SNACKS">Snacks</option>
            <option value="DESSERT">Dessert</option>
          </select>

          {/* Veg/Non-Veg Filter */}
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="">All Diet Types</option>
            <option value="VEG">Vegetarian</option>
            <option value="NON_VEG">Non-Vegetarian</option>
          </select>
        </div>

      </div>

      {/* Grid of Listings */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <FaSpinner className="animate-spin text-emerald-600 text-4xl" />
        </div>
      ) : donations.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-16 text-center shadow-sm">
          <FaUtensils className="text-slate-300 dark:text-slate-600 text-5xl mx-auto mb-4" />
          <h4 className="font-bold text-slate-700 dark:text-slate-300 text-lg">No listings match your filters</h4>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 max-w-sm mx-auto">
            Try adjusting your search queries or clearing active status dropdowns.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <div 
              key={donation.id} 
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              
              {/* Card Image */}
              <div className="h-44 bg-slate-100 dark:bg-slate-900 relative">
                {donation.images && donation.images.length > 0 ? (
                  <img 
                    src={donation.images[0].image} 
                    alt={donation.food_name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-4xl">
                    <FaUtensils />
                  </div>
                )}
                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[donation.status] || ''}`}>
                  {STATUS_LABELS[donation.status] || donation.status}
                </span>
                
                {/* Diet Badge */}
                <span className={`absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold text-white
                  ${donation.veg_non_veg === 'VEG' ? 'bg-green-600' : 'bg-red-600'}
                `}>
                  {donation.veg_non_veg === 'VEG' ? 'VEG' : 'NON-VEG'}
                </span>
              </div>

              {/* Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1">{donation.food_name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{donation.food_category} &bull; {donation.meal_type}</p>
                  
                  <div className="mt-3 text-sm space-y-2">
                    <p className="text-slate-650 dark:text-slate-300">
                      <strong>Serves:</strong> {donation.serves_people} portions ({donation.quantity} kg)
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      <strong>Location:</strong> {donation.pickup_address}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Expiry: {new Date(donation.expiry_time).toLocaleTimeString()}
                  </span>
                  <Link
                    to={`/donations/${donation.id}`}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow"
                  >
                    View Details
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {totalCount > 10 && (
        <div className="flex justify-center items-center gap-4 pt-6">
          <button
            disabled={!prevPage}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold disabled:opacity-50"
          >
            &larr; Previous
          </button>
          <span className="text-xs text-slate-400 font-semibold">Page {page} of {Math.ceil(totalCount / 10)}</span>
          <button
            disabled={!nextPage}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold disabled:opacity-50"
          >
            Next &rarr;
          </button>
        </div>
      )}

    </div>
  );
};

export default DonationList;
