"use client";

import { useEffect, useState } from "react";
import { savePushSubscription } from "@/app/actions/notifications/PushSubscription";
import { toast } from "sonner";
import { Bell } from "lucide-react";

// --- This is the full component, combining your design with our logic ---

interface PushNotificationManagerProps {
  onClose: () => void;
}

/**
 * A helper function to convert the VAPID public key from a base64 string
 * to a Uint8Array, which is required by the PushManager.
 */
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationManager({
  onClose,
}: PushNotificationManagerProps) {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // From your design
  const [permissionState, setPermissionState] = useState<
    "default" | "granted" | "denied"
  >("default");

  // --- This is our REAL logic ---
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window
    ) {
      const currentPermission = Notification.permission;
      setPermissionState(currentPermission);

      if (currentPermission === "granted") {
        // If permission is already granted, just subscribe and close
        registerAndSubscribe();
      } else if (currentPermission === "denied") {
        // If permission is denied, we can't do anything.
        toast.error("Notifications are blocked in your browser settings.");
        onClose();
      }
    } else {
      console.warn("Push notifications are not supported in this browser.");
      onClose();
    }
  }, []); // Run only once

  // --- This is our REAL logic ---
  const registerAndSubscribe = async () => {
    setIsSubscribing(true);
    try {
      const swRegistration = await navigator.serviceWorker.register("/sw.js");
      let subscription = await swRegistration.pushManager.getSubscription();

      if (subscription === null) {
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
          throw new Error("VAPID public key is not defined.");
        }
        const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

        subscription = await swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey,
        });
      }

      const subscriptionObject = subscription.toJSON();
      const result = await savePushSubscription({
        endpoint: subscriptionObject.endpoint!,
        keys: {
          p256dh: subscriptionObject.keys!.p256dh!,
          auth: subscriptionObject.keys!.auth!,
        },
      });

      if (result.success) {
        // --- Use your "Success" animation ---
        setShowSuccess(true);
        setIsSubscribing(false);
        setTimeout(() => onClose(), 1500); // Close after showing success
      } else {
        throw new Error(result.error || "Failed to save subscription.");
      }
    } catch (error) {
      console.error("Error during push subscription:", error);
      toast.error("Failed to enable notifications.");
      setIsSubscribing(false);
      onClose(); // Close on failure
    }
  };

  // --- This is our REAL logic ---
  const handleEnableClick = async () => {
    setIsSubscribing(true); // Show loading spinner
    // This will show the browser's "Allow / Block" pop-up
    const permission = await Notification.requestPermission();
    setPermissionState(permission); // Update our local state

    if (permission === "granted") {
      // The user clicked "Allow"
      await registerAndSubscribe(); // This will auto-close
    } else {
      // The user clicked "Block"
      console.warn("User denied notification permission.");
      toast.error("Notifications were not enabled.");
      setIsSubscribing(false);
      onClose(); // Close if denied
    }
  };

  // --- This is your NEW design ---
  return (
    // We remove the 'fixed' wrapper, as the dashboard page provides it
    <>
      <style>{`
        /* All your beautiful animations */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes ringBell {
          0%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(-12deg); }
          20% { transform: rotate(12deg); }
          30% { transform: rotate(-10deg); }
          40% { transform: rotate(8deg); }
          50% { transform: rotate(-4deg); }
        }
        @keyframes borderPulse {
          0%, 100% { border-color: rgba(99, 102, 241, 0.3); box-shadow: 0 0 20px rgba(99, 102, 241, 0.15); }
          50% { border-color: rgba(99, 102, 241, 0.6); box-shadow: 0 0 30px rgba(99, 102, 241, 0.3); }
        }
        @keyframes scaleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes checkmark { 0% { stroke-dashoffset: 100; } 100% { stroke-dashoffset: 0; } }
        
        .notification-card {
          /* This 'slideUp' is used by the dashboard's <motion.div> already, 
             but we can keep it as a fallback */
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          pointer-events: auto;
        }
        .bell-icon { animation: ringBell 0.6s ease-in-out 2s infinite; }
        .border-pulse { animation: borderPulse 3s ease-in-out infinite; }
        .checkmark-icon { animation: checkmark 0.6s ease-out forwards; }
        .success-checkmark { animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* This is the main modal card */}
      <div className="notification-card w-full max-w-xs">
        {!showSuccess ? (
          // --- The "Enable" card ---
          <div className="border-pulse relative overflow-hidden rounded-lg border border-indigo-500/30 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 shadow-xl backdrop-blur-md sm:p-4">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-indigo-600/5 to-purple-600/0 pointer-events-none" />
            <div className="relative flex items-start gap-3 sm:items-center">
              <div className="bell-icon relative flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/40">
                <Bell
                  size={18}
                  className="text-white sm:w-5 sm:h-5"
                  strokeWidth={2.5}
                />
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="text-sm font-semibold text-white sm:text-base leading-tight">
                  Stay Updated
                </h3>
                <p className="text-xs text-gray-400 sm:text-sm mt-0.5 leading-snug">
                  Never miss important messages
                </p>
              </div>
              <button
                onClick={handleEnableClick} // <-- REAL function
                disabled={isSubscribing} // <-- REAL state
                className="flex-shrink-0 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-medium rounded-md transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900 whitespace-nowrap shadow-lg hover:shadow-indigo-500/20"
              >
                {isSubscribing ? (
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-white rounded-full animate-pulse" />
                    <span>Enable</span>
                  </span>
                ) : (
                  "Enable"
                )}
              </button>
            </div>
          </div>
        ) : (
          // --- The "Success" card ---
          <div className="success-checkmark relative overflow-hidden rounded-lg border border-green-500/40 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 shadow-xl backdrop-blur-md sm:p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/40">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                  style={{ strokeDasharray: 100 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                    className="checkmark-icon"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white sm:text-base">
                  All Set!
                </h3>
                <p className="text-xs text-gray-400 sm:text-sm">
                  Notifications enabled
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

