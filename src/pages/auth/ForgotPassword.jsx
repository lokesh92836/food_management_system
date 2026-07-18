import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../services/authService';
import { FaSpinner } from 'react-icons/fa';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [resetSentEmail, setResetSentEmail] = useState('');
  const [devToken, setDevToken] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);

  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: regReset, handleSubmit: handleResetSubmit, watch, formState: { errors: resetErrors } } = useForm();

  const onSubmitEmail = async (data) => {
    setLoading(true);
    try {
      const response = await authService.forgotPassword(data.email);
      toast.success(response.message || "Reset token has been dispatched.");
      setResetSentEmail(data.email);
      if (response.reset_token_dev) {
        setDevToken(response.reset_token_dev);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Error dispatching password reset.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitNewPassword = async (data) => {
    setConfirmLoading(true);
    try {
      await authService.resetPassword(
        resetSentEmail,
        data.token,
        data.password,
        data.password_confirm
      );
      toast.success("Password reset completed successfully. You can now log in.");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid token or password mismatch.");
    } finally {
      setConfirmLoading(false);
    }
  };

  if (resetSentEmail) {
    return (
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reset Password</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Enter the reset token sent to your email and select a new password.
          </p>
          {devToken && (
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
              <strong>Local Reset Token:</strong> {devToken}
            </div>
          )}
        </div>

        <form className="space-y-4" onSubmit={handleResetSubmit(onSubmitNewPassword)}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Reset Token</label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...regReset('token', { required: 'Token is required' })}
            />
            {resetErrors.token && <span className="text-xs text-rose-500">{resetErrors.token.message}</span>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">New Password</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...regReset('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
            />
            {resetErrors.password && <span className="text-xs text-rose-500">{resetErrors.password.message}</span>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...regReset('password_confirm', { 
                required: 'Required',
                validate: (val) => val === watch('password') || 'Passwords do not match'
              })}
            />
            {resetErrors.password_confirm && <span className="text-xs text-rose-500">{resetErrors.password_confirm.message}</span>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={confirmLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all"
            >
              {confirmLoading ? <FaSpinner className="animate-spin text-lg" /> : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Forgot password?</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Enter your registered email and we'll send you a password reset code.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmitEmail)}>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Email address
          </label>
          <div className="mt-1">
            <input
              type="email"
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

        <div className="flex items-center justify-between text-xs font-semibold">
          <Link to="/login" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">
            Back to Sign In
          </Link>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? <FaSpinner className="animate-spin text-lg" /> : "Request Reset Code"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
