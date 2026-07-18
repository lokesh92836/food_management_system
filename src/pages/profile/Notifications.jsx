import React, { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaSpinner, FaRegEnvelope, FaRegEnvelopeOpen } from 'react-icons/fa';
import { toast } from 'react-toastify';
import notificationService from '../../services/notificationService';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.list();
      const list = data?.results || (Array.isArray(data) ? data : []);
      setNotifications(list);
    } catch (err) {
      console.error("Failed to load notifications list", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markRead(id);
      fetchNotifications();
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const handleMarkAllRead = async () => {
    setActionLoading(true);
    try {
      await notificationService.markAllRead();
      toast.success("All notifications marked as read.");
      fetchNotifications();
    } catch (err) {
      toast.error("Failed to clear notifications.");
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

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Notifications Alert Board</h2>
          <p className="text-xs text-slate-400">Receive live alerts of surplus listings, claiming, and dispatch tasks.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow transition-all"
          >
            {actionLoading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Notification Lists */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm overflow-hidden transition-colors">
        {notifications.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <FaBell className="text-slate-350 dark:text-slate-600 text-5xl mx-auto mb-4" />
            <h4 className="font-bold text-slate-700 dark:text-slate-300">No alerts found</h4>
            <p className="text-xs mt-1 text-slate-400 dark:text-slate-500">Notifications relating to your active logistics flow will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                className={`p-5 flex items-start gap-4 transition-colors
                  ${notif.is_read 
                    ? 'opacity-70 bg-white dark:bg-slate-800' 
                    : 'bg-emerald-50/20 dark:bg-emerald-950/10'
                  }
                `}
              >
                <div className={`mt-1 text-lg 
                  ${notif.is_read ? 'text-slate-400' : 'text-emerald-500'}
                `}>
                  {notif.is_read ? <FaRegEnvelopeOpen /> : <FaRegEnvelope />}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className={`text-sm font-bold ${notif.is_read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      {new Date(notif.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                {!notif.is_read && (
                  <button
                    onClick={() => handleMarkRead(notif.id)}
                    className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-semibold"
                    title="Mark as read"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Notifications;
