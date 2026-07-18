import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { 
  FaHandHoldingHeart, FaThLarge, FaUtensils, FaMapMarkerAlt, 
  FaBell, FaChartBar, FaUserCog, FaSignOutAlt, FaMoon, 
  FaSun, FaBars, FaTimes, FaUsers, FaClipboardList 
} from 'react-icons/fa';
import notificationService from '../services/notificationService';

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.list();
        const list = data?.results || (Array.isArray(data) ? data : []);
        const unread = list.filter(n => !n.is_read).length;
        setUnreadNotifications(unread);
      } catch (err) {
        console.error("Failed to fetch notification count", err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getNavigationLinks = () => {
    const common = [
      { name: 'Notifications', path: '/notifications', icon: <FaBell /> },
      { name: 'Profile Settings', path: '/settings', icon: <FaUserCog /> }
    ];

    switch (user?.role) {
      case 'RESTAURANT_OWNER':
        return [
          { name: 'Dashboard', path: '/dashboard/restaurant', icon: <FaThLarge /> },
          { name: 'Donate Food', path: '/donations/create', icon: <FaUtensils /> },
          { name: 'Analytics Reports', path: '/analytics', icon: <FaChartBar /> },
          ...common
        ];
      case 'NGO':
        return [
          { name: 'Dashboard', path: '/dashboard/ngo', icon: <FaThLarge /> },
          { name: 'Browse Donations', path: '/donations', icon: <FaMapMarkerAlt /> },
          { name: 'Analytics Reports', path: '/analytics', icon: <FaChartBar /> },
          ...common
        ];
      case 'VOLUNTEER':
        return [
          { name: 'Dashboard', path: '/dashboard/volunteer', icon: <FaThLarge /> },
          { name: 'Find Food Requests', path: '/donations', icon: <FaMapMarkerAlt /> },
          ...common
        ];
      case 'DELIVERY_PARTNER':
        return [
          { name: 'Dashboard', path: '/dashboard/delivery', icon: <FaThLarge /> },
          ...common
        ];
      case 'ADMIN':
        return [
          { name: 'Dashboard', path: '/dashboard/admin', icon: <FaThLarge /> },
          { name: 'Audit Users', path: '/dashboard/admin/users', icon: <FaUsers /> },
          { name: 'Audit Donations', path: '/dashboard/admin/donations', icon: <FaClipboardList /> },
          { name: 'Global Analytics', path: '/analytics', icon: <FaChartBar /> },
          ...common
        ];
      default:
        return common;
    }
  };

  const links = getNavigationLinks();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800">
          <FaHandHoldingHeart className="text-emerald-500 text-3xl" />
          <span className="font-extrabold text-lg tracking-wide uppercase">Food Rescue</span>
        </div>

        {/* User Badge */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center font-bold text-emerald-400">
              {user?.first_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150
                  ${isActive 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.name}</span>
                {link.name === 'Notifications' && unreadNotifications > 0 && (
                  <span className="ml-auto w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            {darkMode ? <FaSun className="text-amber-400 text-lg" /> : <FaMoon className="text-indigo-400 text-lg" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-all"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700/60 px-6 flex items-center justify-between z-30 transition-colors duration-300">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 lg:hidden"
          >
            <FaBars className="text-2xl" />
          </button>

          <div className="hidden lg:block">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Food Rescue Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/notifications" 
              className="relative p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all"
            >
              <FaBell className="text-xl" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-800" />
              )}
            </Link>
            
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">{user?.first_name} {user?.last_name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase">{user?.role?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Panel */}
        <main className="flex-1 overflow-y-auto p-6 focus:outline-none">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;
