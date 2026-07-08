import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, Bell } from "lucide-react";
import { Link } from "react-router-dom";

import {
  getNotifications,
  markNotificationsRead,
} from "../../api/notificationApi";
import { useAuth } from "../../hooks/useAuth";

const formatNotificationTime = (value) => {
  if (!value) return "";

  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef(null);
  const displayRole = user?.role?.replaceAll("_", " ");
  const profilePath =
    user?.role === "MANAGER" ? "/manager/profile" : "/member/profile";

  const loadNotifications = useCallback(async () => {
    if (!user) return;

    const data = await getNotifications();
    if (notificationsOpen && data.unreadCount > 0) {
      await markNotificationsRead();
      setNotifications(
        data.notifications.map((notification) => ({
          ...notification,
          isRead: 1,
        }))
      );
      setUnreadCount(0);
      return;
    }

    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
  }, [notificationsOpen, user]);

  useEffect(() => {
    loadNotifications();

    const intervalId = window.setInterval(loadNotifications, 30000);
    return () => window.clearInterval(intervalId);
  }, [loadNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async () => {
    const nextOpen = !notificationsOpen;
    setNotificationsOpen(nextOpen);

    if (nextOpen && unreadCount > 0) {
      setUnreadCount(0);
      await markNotificationsRead();
      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          isRead: 1,
        }))
      );
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8">
      <button
        onClick={onMenuClick}
        className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        <Menu size={24} />
      </button>

      <div className="hidden lg:block">
        <p className="text-sm text-slate-500">Welcome back,</p>
        <h2 className="font-semibold text-slate-900">
          {user?.firstName} {user?.lastName}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div ref={notificationRef} className="relative">
          <button
            className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100"
            onClick={handleNotificationClick}
            aria-label="Notifications"
          >
            <Bell size={21} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:w-96">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="font-semibold text-slate-950">Notifications</p>
                <p className="text-xs text-slate-500">
                  Latest updates for your account
                </p>
              </div>

              <div className="max-h-96 overflow-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-slate-500">
                    No notifications yet.
                  </p>
                ) : (
                  notifications.map((notification) => {
                    const content = (
                      <>
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-semibold text-slate-900">
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                          )}
                        </div>
                        <p className="mt-1 text-sm text-slate-600">
                          {notification.message}
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                          {formatNotificationTime(notification.createdAt)}
                        </p>
                      </>
                    );

                    return notification.link ? (
                      <Link
                        key={notification.id}
                        to={notification.link}
                        onClick={() => setNotificationsOpen(false)}
                        className="block border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div
                        key={notification.id}
                        className="border-b border-slate-100 px-4 py-3"
                      >
                        {content}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <Link
          to={profilePath}
          className="flex items-center gap-3 rounded-xl px-2 py-1 hover:bg-slate-50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
            {user?.firstName?.charAt(0)}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-slate-500">{displayRole}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
