import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setCredentials } from '../../store/authSlice';
import authService from '../../services/authService';
import { getDefaultDashboardPath } from '../../routes/RoleRoute';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authService.login(data);
      dispatch(setCredentials({
        user: response.user,
        access: response.access,
        refresh: response.refresh
      }));
      
      toast.success("Welcome back! Logged in successfully.");
      const path = getDefaultDashboardPath(response.user.role);
      navigate(path, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid login credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in to your account</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Or{' '}
          <Link to="/register" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">
            register a new partner profile
          </Link>
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Email address
          </label>
          <div className="mt-1">
            <input
              type="email"
              autoComplete="email"
              className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all
                ${errors.email ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700'}
              `}
              {...register('email', { 
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
              })}
            />
            {errors.email && (
              <span className="text-xs text-rose-500 mt-1 block">{errors.email.message}</span>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">
              Forgot password?
            </Link>
          </div>
          <div className="mt-1 relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className={`w-full px-4 py-3 pr-10 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all
                ${errors.password ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700'}
              `}
              {...register('password', { required: 'Password is required' })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <span className="text-xs text-rose-500 mt-1 block">{errors.password.message}</span>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? <FaSpinner className="animate-spin text-lg" /> : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
