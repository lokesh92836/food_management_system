import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Guard components
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Pages
import LandingPage from '../pages/landing/LandingPage';
import AboutPage from '../pages/landing/AboutPage';
import ContactPage from '../pages/landing/ContactPage';
import FeaturesPage from '../pages/landing/FeaturesPage';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

import RestaurantDashboard from '../pages/dashboard/RestaurantDashboard';
import NGODashboard from '../pages/dashboard/NGODashboard';
import VolunteerDashboard from '../pages/dashboard/VolunteerDashboard';
import DeliveryDashboard from '../pages/dashboard/DeliveryDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import AdminUsersAudit from '../pages/dashboard/AdminUsersAudit';
import AdminDonationsAudit from '../pages/dashboard/AdminDonationsAudit';

import CreateDonation from '../pages/donations/CreateDonation';
import DonationList from '../pages/donations/DonationList';
import DonationDetails from '../pages/donations/DonationDetails';

import Settings from '../pages/profile/Settings';
import Notifications from '../pages/profile/Notifications';
import Analytics from '../pages/profile/Analytics';

import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/features" element={<FeaturesPage />} />

      {/* Auth Pages wrapped in AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Authenticated Dashboard Pages wrapped in DashboardLayout & ProtectedRoute */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          
          {/* Restaurant Routes */}
          <Route element={<RoleRoute allowedRoles={['RESTAURANT_OWNER']} />}>
            <Route path="/dashboard/restaurant" element={<RestaurantDashboard />} />
            <Route path="/donations/create" element={<CreateDonation />} />
          </Route>

          {/* NGO Routes */}
          <Route element={<RoleRoute allowedRoles={['NGO']} />}>
            <Route path="/dashboard/ngo" element={<NGODashboard />} />
          </Route>

          {/* Volunteer Routes */}
          <Route element={<RoleRoute allowedRoles={['VOLUNTEER']} />}>
            <Route path="/dashboard/volunteer" element={<VolunteerDashboard />} />
          </Route>

          {/* Delivery Partner Routes */}
          <Route element={<RoleRoute allowedRoles={['DELIVERY_PARTNER']} />}>
            <Route path="/dashboard/delivery" element={<DeliveryDashboard />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/admin/users" element={<AdminUsersAudit />} />
            <Route path="/dashboard/admin/donations" element={<AdminDonationsAudit />} />
          </Route>

          {/* Shared Authenticated Routes */}
          <Route path="/donations" element={<DonationList />} />
          <Route path="/donations/:id" element={<DonationDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/analytics" element={<Analytics />} />

        </Route>
      </Route>

      {/* Fallback 404 Route */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
