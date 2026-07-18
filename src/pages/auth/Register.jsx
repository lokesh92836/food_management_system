import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../services/authService';
import { FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.register(data);
      toast.success("Account registered successfully! You can now log in.");
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data ? Object.values(err.response.data).flat().join(' ') : "Registration failed. Try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create a partner profile</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">
            Sign in here
          </Link>
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">First Name</label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register('first_name', { required: 'Required' })}
            />
            {errors.first_name && <span className="text-xs text-rose-500">{errors.first_name.message}</span>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Last Name</label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register('last_name', { required: 'Required' })}
            />
            {errors.last_name && <span className="text-xs text-rose-500">{errors.last_name.message}</span>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
          <input
            type="email"
            className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            {...register('email', { required: 'Required' })}
          />
          {errors.email && <span className="text-xs text-rose-500">{errors.email.message}</span>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Role / Profile Type</label>
          <select
            className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-slate-200"
            {...register('role', { required: 'Required' })}
          >
            <option value="RESTAURANT_OWNER">Restaurant Owner / Donor</option>
            <option value="NGO">NGO / Charity Organization</option>
            <option value="VOLUNTEER">Volunteer Transporter</option>
            <option value="DELIVERY_PARTNER">Delivery Partner</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-3 py-2 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <span className="text-xs text-rose-500">{errors.password.message}</span>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
          <input
            type="password"
            className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            {...register('password_confirm', { 
              required: 'Required',
              validate: (val) => val === watch('password') || 'Passwords do not match'
            })}
          />
          {errors.password_confirm && <span className="text-xs text-rose-500">{errors.password_confirm.message}</span>}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all"
          >
            {loading ? <FaSpinner className="animate-spin text-lg" /> : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
