"use client";

import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Shield,
  Home,
  LogOut,
  Clock,
  BarChart2,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import MagicCard from "@/components/ui/magic-card";
import { PushNotificationManager } from "@/components/notifications/NotificationManager";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const user = useSession().data?.user;
  const router = useRouter();

  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  useEffect(() => {
    // Check if permission is 'default' (not yet granted or denied)
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      const timer = setTimeout(() => {
        setShowNotificationPopup(true);
      }, 4000); // 4 seconds delay
      return () => clearTimeout(timer);
    }
  }, []);

  const recentActivity = [
    { text: "Logged in from Mumbai", time: "5:12 PM" },
    { text: "Updated profile picture", time: "1:30 PM" },
    { text: "Changed password", time: "Sep 9, 2025" },
    { text: "Enabled Two-Factor Authentication", time: "Sep 9, 2025" },
  ];

  const usageData = [
    { month: "Apr", value: 65 },
    { month: "May", value: 70 },
    { month: "Jun", value: 80 },
    { month: "Jul", value: 75 },
    { month: "Aug", value: 90 },
    { month: "Sep", value: 85 },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden bg-background">
      {/* Grid background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* --- Dashboard Section (always visible) --- */}
      <motion.div
        key="dashboard"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative z-10 max-w-7xl mx-auto p-6 space-y-8 transition-all duration-500 ${
          showNotificationPopup ? "blur-sm brightness-50" : ""
        }`}
      >
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-300 text-lg">
            Welcome back, {user?.name || "..."}! It’s Saturday, September 13th.
          </p>
        </div>

        {/* Profile + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <MagicCard className="lg:col-span-1 flex flex-col items-center p-6">
            {!user ? (
              <Skeleton className="w-28 h-28 rounded-full mb-4" />
            ) : (
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={user.image || "/logo.png"} alt="Profile" />
              </Avatar>
            )}
            <h2 className="text-xl font-semibold text-white mb-1">
              {user?.name || "Loading..."}
            </h2>
            <Badge variant="secondary">Account Holder</Badge>
          </MagicCard>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Mail,
                title: "Email",
                value: user?.email || "Not available",
                color: "bg-blue-600",
              },
              {
                icon: Phone,
                title: "Phone",
                value: "Not provided",
                color: "bg-green-600",
              },
              {
                icon: Shield,
                title: "Two-Factor Authentication",
                value: "Enabled",
                color: "bg-purple-600",
                badge: "bg-green-500",
              },
              {
                icon: User,
                title: "Account Status",
                value: "Active",
                color: "bg-orange-600",
                badge: "bg-green-500",
              },
            ].map(({ icon: Icon, title, value, color, badge }, i) => (
              <MagicCard key={i} className="p-6 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className={`${color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-gray-300 font-medium">{title}</h3>
                </div>
                {badge ? (
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${badge}`} />
                    <p className="text-white font-medium">{value}</p>
                  </div>
                ) : (
                  <p className="text-white font-medium">{value}</p>
                )}
              </MagicCard>
            ))}
          </div>
        </div>

        {/* Activity + Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <Card className="lg:col-span-2 p-6 space-y-4 bg-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-white" />
              <h3 className="text-white font-semibold text-lg">
                Recent Activity
              </h3>
            </div>
            <ul className="space-y-3">
              {recentActivity.map((activity, i) => (
                <li
                  key={i}
                  className="flex justify-between text-gray-300"
                >
                  <span>{activity.text}</span>
                  <span className="text-gray-400">{activity.time}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="lg:col-span-3 p-6 bg-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <BarChart2 className="w-5 h-5 text-white" />
              <h3 className="text-white font-semibold text-lg">
                Monthly Usage
              </h3>
            </div>
            <div className="h-48 flex items-end gap-2 sm:gap-4">
              {usageData.map((data, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full h-full flex items-end">
                    <div
                      className="w-full bg-indigo-500 rounded-t-lg hover:bg-indigo-400 transition-all"
                      style={{ height: `${data.value}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 max-w-md mx-auto">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/")}
          >
            <Home className="w-4 h-4 mr-2" /> Back to Home
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => {
              signOut();
              router.push("/");
            }}
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </motion.div>

      {/* --- Notification Popup (after 4s) --- */}
      <AnimatePresence>
        {showNotificationPopup && (
          <motion.div
            key="notification-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            // REFACTOR: Changed `items-start` to `items-center` to vertically center
            // the modal on mobile screens as well as desktop.
            className="fixed inset-0 z-50 flex justify-center items-center p-4 overflow-y-auto"
          >
            {/* backdrop --- NOW NON-CLICKABLE --- */}
            <div className="absolute inset-0 bg-black/50" />
            <motion.div
              className="relative z-10"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              // REFACTOR: Changed from a 'spring' to a 'tween' (duration-based)
              // animation for a faster, non-bouncy, and smooth feel.
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* This component controls its own width and internal animations */}
              <PushNotificationManager
                onClose={() => setShowNotificationPopup(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}