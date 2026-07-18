import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSpinner, FaArrowLeft, FaCamera, FaTimes } from 'react-icons/fa';
import donationService from '../../services/donationService';

const CreateDonation = () => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      meal_type: 'LUNCH',
      veg_non_veg: 'VEG',
      preparation_time: new Date().toISOString().slice(0, 16),
      expiry_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().slice(0, 16) // default 4 hours from now
    }
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    
    // Prepare FormData
    const formData = new FormData();
    formData.append('food_name', data.food_name);
    formData.append('food_category', data.food_category);
    formData.append('meal_type', data.meal_type);
    formData.append('veg_non_veg', data.veg_non_veg);
    formData.append('quantity', parseFloat(data.quantity));
    formData.append('serves_people', parseInt(data.serves_people, 10));
    
    // Convert local dates to ISO strings for API compatibility
    formData.append('preparation_time', new Date(data.preparation_time).toISOString());
    formData.append('expiry_time', new Date(data.expiry_time).toISOString());
    
    formData.append('pickup_address', data.pickup_address);
    formData.append('instructions', data.instructions || '');

    // Append multiple files
    images.forEach(imgFile => {
      formData.append('uploaded_images', imgFile);
    });

    try {
      await donationService.create(formData);
      toast.success("Food donation created successfully and listed on the platform!");
      navigate('/dashboard/restaurant');
    } catch (err) {
      const errorMsg = err.response?.data ? Object.values(err.response.data).flat().join(' ') : "Failed to publish listing.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const prepTime = watch('preparation_time');

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      <div className="flex items-center gap-3">
        <Link to="/dashboard/restaurant" className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all">
          <FaArrowLeft />
        </Link>
        <div>
          <h2 className="text-xl font-bold">List Surplus Food Donation</h2>
          <p className="text-xs text-slate-400">Add food listings with prep times and expiry details for immediate claims.</p>
        </div>
      </div>

      <form className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 p-6 md:p-8 shadow-sm space-y-6" onSubmit={handleSubmit(onSubmit)}>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Food / Dish Name</label>
            <input
              type="text"
              placeholder="e.g. Mixed Vegetable Biryani"
              className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register('food_name', { required: 'Food name is required' })}
            />
            {errors.food_name && <span className="text-xs text-rose-500 mt-1 block">{errors.food_name.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Category / Type</label>
            <input
              type="text"
              placeholder="e.g. Cooked Rice, Bakery, Vegetables"
              className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register('food_category', { required: 'Category is required' })}
            />
            {errors.food_category && <span className="text-xs text-rose-500 mt-1 block">{errors.food_category.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Meal Course</label>
            <select
              className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-slate-200"
              {...register('meal_type', { required: true })}
            >
              <option value="BREAKFAST">Breakfast</option>
              <option value="LUNCH">Lunch</option>
              <option value="DINNER">Dinner</option>
              <option value="SNACKS">Snacks</option>
              <option value="DESSERT">Dessert</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Veg / Non-Veg</label>
            <select
              className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-slate-200"
              {...register('veg_non_veg', { required: true })}
            >
              <option value="VEG">Vegetarian</option>
              <option value="NON_VEG">Non-Vegetarian</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Portions / Serves People</label>
            <input
              type="number"
              min="1"
              className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register('serves_people', { required: 'Required', min: { value: 1, message: 'Must serve at least 1 person' } })}
            />
            {errors.serves_people && <span className="text-xs text-rose-500 mt-1 block">{errors.serves_people.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Total Weight (kg)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register('quantity', { required: 'Required', min: { value: 0.01, message: 'Cannot be negative' } })}
            />
            {errors.quantity && <span className="text-xs text-rose-500 mt-1 block">{errors.quantity.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Preparation Time</label>
            <input
              type="datetime-local"
              className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register('preparation_time', { required: 'Required' })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Expiry Time</label>
            <input
              type="datetime-local"
              className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register('expiry_time', { 
                required: 'Required',
                validate: val => new Date(val) > new Date(prepTime) || 'Expiry must be after preparation time'
              })}
            />
            {errors.expiry_time && <span className="text-xs text-rose-500 mt-1 block">{errors.expiry_time.message}</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Pickup Address Details</label>
          <textarea
            rows="3"
            placeholder="Complete address (floor, lane, shop name)..."
            className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            {...register('pickup_address', { required: 'Address is required' })}
          />
          {errors.pickup_address && <span className="text-xs text-rose-500 mt-1 block">{errors.pickup_address.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Handling Instructions / Notes (Optional)</label>
          <textarea
            rows="2"
            placeholder="e.g. Keep refrigerated, carry large bags, park inside gate..."
            className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            {...register('instructions')}
          />
        </div>

        {/* Upload Food Images */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Food Photos</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={preview} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-slate-950/70 text-white flex items-center justify-center text-xs hover:bg-slate-950"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
            
            <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 flex flex-col justify-center items-center gap-2 cursor-pointer transition-colors text-slate-400">
              <FaCamera className="text-2xl" />
              <span className="text-[10px] font-bold">Add Photo</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all text-sm flex justify-center items-center"
          >
            {loading ? <FaSpinner className="animate-spin text-lg" /> : "Publish Donation Listing"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateDonation;
