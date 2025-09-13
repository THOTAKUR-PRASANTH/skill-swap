"use client";

import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { User, Mail, Phone, Shield, Home, LogOut, Clock, BarChart2 } from "lucide-react";

import { useUserContext } from "@/lib/userContextProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import  MagicCard  from "@/components/ui/magic-card";

export default function DashboardPage() {
  const user = useUserContext();
  const router = useRouter();
  const { signOut } = useClerk();

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
      {/* --- This is the new dark grid background --- */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-4xl font-extrabold text-white mb-2">Dashboard</h1>
          <p className="text-gray-300 text-lg">
            {/* --- Corrected the date --- */}
            Welcome back, {user?.firstName || "..."}! It's Saturday, September 13th.
          </p>
        </div>

        {/* Top Grid: Profile + Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <MagicCard className="lg:col-span-1 flex flex-col items-center p-6">
            {!user ? (
              <Skeleton className="w-28 h-28 rounded-full mb-4" />
            ) : (
            <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={user.imageUrl || "/default-avatar.png"} alt="Profile" />
            <AvatarFallback>
              {user.firstName?.[0] || "U"}
              {user.lastName?.[0] || ""}
            </AvatarFallback>
            </Avatar>
            )}
            {!user ? (
              <Skeleton className="h-6 w-32 mb-2" />
            ) : (
              <h2 className="text-xl font-semibold text-white mb-1">
                {user.firstName} {user.lastName || ""}
              </h2>
            )}
            {!user ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <Badge variant="secondary">Account Holder</Badge>
            )}
          </MagicCard>

          {/* Info Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Mail, title: "Email", value: user?.email || "Not available", color: "bg-blue-600" },
              { icon: Phone, title: "Phone", value: user?.phoneNumber || "Not provided", color: "bg-green-600" },
              {
                icon: Shield,
                title: "Two-Factor Authentication",
                value: user?.twoFactorEnabled ? "Enabled" : "Disabled",
                color: "bg-purple-600",
                badge: user?.twoFactorEnabled ? "bg-green-500" : "bg-red-500",
              },
              { icon: User, title: "Account Status", value: "Active", color: "bg-orange-600", badge: "bg-green-500" },
            ].map(({ icon: Icon, title, value, color, badge }, i) => (
              <MagicCard key={i} className="p-6 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className={`${color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-gray-300 font-medium">{title}</h3>
                </div>
                {user ? (
                  badge ? (
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${badge}`} />
                      <p className="text-white font-medium">{value}</p>
                    </div>
                  ) : (
                    <p className="text-white font-medium">{value}</p>
                  )
                ) : (
                  <Skeleton className="h-5 w-full" />
                )}
              </MagicCard>
            ))}
          </div>
        </div>

        {/* Activity + Usage Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 p-6 space-y-4 bg-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-white" />
              <h3 className="text-white font-semibold text-lg">Recent Activity</h3>
            </div>
            <ul className="space-y-3">
              {user
                ? recentActivity.map((activity, i) => (
                    <li key={i} className="flex justify-between text-gray-300">
                      <span>{activity.text}</span>
                      <span className="text-gray-400">{activity.time}</span>
                    </li>
                  ))
                : Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
            </ul>
          </Card>

          {/* Usage Chart */}
          <Card className="lg:col-span-3 p-6 bg-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <BarChart2 className="w-5 h-5 text-white" />
              <h3 className="text-white font-semibold text-lg">Monthly Usage</h3>
            </div>
            <div className="h-48 flex items-end gap-2 sm:gap-4">
              {user
                ? usageData.map((data, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full h-full flex items-end">
                        <div
                          className="w-full bg-indigo-500 rounded-t-lg hover:bg-indigo-400 transition-all"
                          style={{ height: `${data.value}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-400 text-xs">{data.month}</span>
                    </div>
                  ))
                : Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="w-full" style={{ height: `${20 + Math.random() * 60}%` }} />)}
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 max-w-md mx-auto">
          <Button variant="outline" className="flex-1" onClick={() => router.push("/")}>
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Button variant="destructive" className="flex-1" onClick={() => signOut()}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}