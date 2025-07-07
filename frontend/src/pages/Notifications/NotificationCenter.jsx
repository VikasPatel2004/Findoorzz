import React, { useEffect, useState, useContext } from 'react';
import notificationService from '../../services/notificationService';
import { AuthContext } from '../../context/AuthContext';

// Helper for relative time
function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now - past) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return past.toLocaleDateString();
}

// Color and icon per type
const typeStyles = {
  Lender: { color: '#1976d2', bg: '#e3f2fd', icon: '🏦' },
  Landlord: { color: '#388e3c', bg: '#e8f5e9', icon: '🏠' },
  Renter: { color: '#fbc02d', bg: '#fffde7', icon: '🧑‍💼' },
  Student: { color: '#7b1fa2', bg: '#f3e5f5', icon: '🎓' },
  Broker: { color: '#d84315', bg: '#ffebee', icon: '🤝' },
  default: { color: '#616161', bg: '#f5f5f5', icon: '🔔' },
};

const NotificationCenter = () => {
  const { user, token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await notificationService.getNotifications(token);
        setNotifications(data);
      } catch (err) {
        setError('Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchNotifications();
  }, [token]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markNotificationAsRead(id, token);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      setError('Failed to mark as read');
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[40vh] text-lg">Loading notifications...</div>;
  if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8 bg-white rounded-xl shadow-lg mt-8 mb-8 min-h-[60vh]">
      <h2 className="text-2xl font-bold mb-6 text-center">Notification Center</h2>
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <span style={{ fontSize: 48, marginBottom: 12 }}>🔔</span>
          <div className="text-lg font-medium">You're all caught up!</div>
          <div className="text-sm mt-2">No notifications at the moment.</div>
        </div>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif) => {
            const style = typeStyles[notif.type] || typeStyles.default;
            return (
              <li
                key={notif._id}
                className={`flex items-start gap-4 p-4 rounded-lg shadow transition-all border ${notif.read ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-200'} hover:shadow-md`}
                style={{ position: 'relative', borderLeft: `6px solid ${style.color}` }}
              >
                <div className="flex-shrink-0 text-2xl" style={{ color: style.color }}>
                  {style.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-semibold"
                      style={{ background: style.bg, color: style.color, border: `1px solid ${style.color}` }}
                    >
                      {notif.type || 'General'}
                    </span>
                    {!notif.read && <span className="ml-2 text-xs text-blue-600 font-bold animate-pulse">● Unread</span>}
                  </div>
                  <div className={`text-base ${notif.read ? 'text-gray-700' : 'font-semibold text-black'}`}>{notif.message}</div>
                  <div className="text-xs text-gray-500 mt-1">{timeAgo(notif.createdAt)}</div>
                </div>
                {!notif.read && (
                  <button
                    onClick={() => handleMarkAsRead(notif._id)}
                    className="ml-4 px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-700 transition"
                  >
                    Mark as read
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default NotificationCenter;
