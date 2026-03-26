import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "./AuthContext";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../api/notifications";
import { getVapidPublicKey, subscribePush } from "../api/push";

const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  snackbar: null,
  isDrawerOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
  markRead: async () => {},
  markAllRead: async () => {},
});

const PUSH_SENT_KEY_PREFIX = "push_sub_sent";

function toUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function NotificationProvider({ children }) {
  const { currentUser, token } = useAuth();
  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  const loadNotifications = useCallback(async () => {
    if (!token) {
      setNotifications([]);
      return;
    }

    try {
      const rows = await fetchNotifications();
      setNotifications(rows || []);
    } catch {
      setNotifications([]);
    }
  }, [token]);

  const closeSocket = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const connectSocket = useCallback(() => {
    if (!currentUser?.id || !token) return;

    closeSocket();
    const ws = new WebSocket(`ws://localhost:8000/ws/${currentUser.id}?token=${encodeURIComponent(token)}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed?.event !== "notification" || !parsed?.notification) return;

        setNotifications((prev) => [parsed.notification, ...prev]);
        setSnackbar({
          id: parsed.notification.id,
          title: parsed.notification.title,
          message: parsed.notification.message,
        });
      } catch {
        // Ignore malformed websocket messages.
      }
    };

    ws.onclose = () => {
      if (!currentUser?.id) return;
      reconnectTimerRef.current = setTimeout(() => {
        connectSocket();
      }, 5000);
    };
  }, [closeSocket, currentUser?.id, token]);

  const registerPush = useCallback(async () => {
    if (!currentUser?.id || !token) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      return;
    }

    try {
      const swReg = await navigator.serviceWorker.register("/sw.js");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const key = await getVapidPublicKey();
      if (!key) return;

      const sentStorageKey = `${PUSH_SENT_KEY_PREFIX}:${currentUser.id}`;
      if (localStorage.getItem(sentStorageKey) === "1") return;

      const existing = await swReg.pushManager.getSubscription();
      const subscription =
        existing ||
        (await swReg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: toUint8Array(key),
        }));

      await subscribePush(subscription);
      localStorage.setItem(sentStorageKey, "1");
    } catch {
      // Push is optional; websocket notifications still work.
    }
  }, [currentUser?.id, token]);

  const markRead = useCallback(async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch {
      // no-op
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {
      // no-op
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (!currentUser?.id || !token) {
      closeSocket();
      return;
    }
    connectSocket();
    registerPush();
    return () => closeSocket();
  }, [closeSocket, connectSocket, registerPush, currentUser?.id, token]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      snackbar,
      setSnackbar,
      isDrawerOpen,
      openDrawer: () => setIsDrawerOpen(true),
      closeDrawer: () => setIsDrawerOpen(false),
      markRead,
      markAllRead,
      reloadNotifications: loadNotifications,
    }),
    [isDrawerOpen, loadNotifications, markAllRead, markRead, notifications, snackbar, unreadCount]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export const useNotifications = () => useContext(NotificationContext);
