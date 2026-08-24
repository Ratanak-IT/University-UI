"use client";

import { useEffect, useRef } from "react";
import { toast } from "@/components/shared/Toast";
import { useGetMyNotificationsQuery } from "@/lib/redux/apiSlice";

const SESSION_FLAG = "ums-unread-toast-shown";

/**
 * Shows one toast per browser session if the signed-in user has unread
 * notifications, the first time this mounts with data.
 *
 * "Per session" is `sessionStorage`, not `localStorage`: the flag has to
 * clear when the tab closes, or a user who reads their notifications and
 * comes back tomorrow would never be told about new ones again.
 *
 * Mount this once per portal (the teacher and student navbars each do) — it
 * shares its query with whatever else on the page also reads notifications,
 * so this doesn't add a second fetch.
 */
export function useNotifyUnreadOnce() {
  const { data, isSuccess } = useGetMyNotificationsQuery();
  const shown = useRef(false);

  useEffect(() => {
    if (!isSuccess || shown.current) return;

    // Another tab in this same session may have already shown it.
    if (sessionStorage.getItem(SESSION_FLAG)) {
      shown.current = true;
      return;
    }

    const unread = (data ?? []).filter((n) => !n.isRead).length;
    if (unread === 0) return;

    shown.current = true;
    sessionStorage.setItem(SESSION_FLAG, "1");
    toast.info(
      `You have ${unread} unread notification${unread === 1 ? "" : "s"}.`,
      "Notifications"
    );
  }, [isSuccess, data]);
}
