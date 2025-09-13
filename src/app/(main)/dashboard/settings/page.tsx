"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Bell, Palette, Camera, Mail, KeyRound } from 'lucide-react';
import { useUserContext } from "@/lib/userContextProvider";
import Image from "next/image";

// Define the settings sections
const settingsSections = [
  { name: 'Profile', icon: User, component: 'Profile' },
  { name: 'Security', icon: Shield, component: 'Security' },
  { name: 'Appearance', icon: Palette, component: 'Appearance' },
  { name: 'Notifications', icon: Bell, component: 'Notifications' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('Profile');
  const user = useUserContext();

  const renderSection = () => {
    switch (activeSection) {
      case 'Profile':
        return <ProfileSection user={user} />;
      case 'Security':
        return <SecuritySection />;
      case 'Notifications':
        return <NotificationsSection />;
      default:
        return <ProfileSection user={user} />;
    }
  };

  return (
    <>
      <div className="relative min-h-screen w-full overflow-hidden bg-neutral-950 text-white p-4 sm:p-6 lg:p-8">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-7xl mx-auto"
        >
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              Account Settings
            </h1>
            <p className="mt-2 text-lg text-neutral-400">
              Update your profile, change your password, and manage your preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar Navigation */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="lg:col-span-1"
            >
              <div className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl p-4 space-y-1">
                {settingsSections.map(section => (
                  <button
                    key={section.name}
                    onClick={() => setActiveSection(section.component)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                      activeSection === section.component
                        ? 'bg-purple-500/10 text-white'
                        : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'
                    }`}
                  >
                    <section.icon className={`w-5 h-5 ${activeSection === section.component ? 'text-purple-300' : 'text-neutral-500'}`} />
                    <span className="font-medium">{section.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Right Content Area */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  {renderSection()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </>
  );
}

// --- Component for Profile Section ---
const ProfileSection = ({ user }: { user: any }) => (
  <div className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl">
    <div className="p-8 border-b border-neutral-800">
      <h2 className="text-2xl font-bold text-white">Public Profile</h2>
      <p className="text-neutral-400 mt-1">This information will be displayed publicly.</p>
    </div>
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          <Image src={user?.imageUrl ?? ""} alt="Profile" width={80} height={80} className="w-20 h-20 rounded-full object-cover ring-2 ring-neutral-700" />
          <button className="absolute bottom-0 right-0 p-2 bg-purple-500 rounded-full hover:bg-purple-600 transition-colors">
            <Camera className="w-4 h-4 text-white" />
          </button>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{user?.firstName} {user?.lastName}</h3>
          <p className="text-neutral-400">{user?.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-neutral-300">First Name</label>
          <input type="text" defaultValue={user?.firstName} className="mt-1 w-full p-3 bg-neutral-800/50 rounded-lg border border-neutral-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" />
        </div>
        <div>
          <label className="text-sm font-medium text-neutral-300">Last Name</label>
          <input type="text" defaultValue={user?.lastName} className="mt-1 w-full p-3 bg-neutral-800/50 rounded-lg border border-neutral-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" />
        </div>
      </div>
    </div>
    <div className="p-8 border-t border-neutral-800 flex justify-end">
      <SaveButton />
    </div>
  </div>
);

// --- Component for Security Section ---
const SecuritySection = () => (
    <div className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl">
    <div className="p-8 border-b border-neutral-800">
      <h2 className="text-2xl font-bold text-white">Password & Security</h2>
      <p className="text-neutral-400 mt-1">Manage your password and two-factor authentication.</p>
    </div>
    <div className="p-8 space-y-6">
        <div>
            <label className="text-sm font-medium text-neutral-300">Current Password</label>
            <input type="password" placeholder="••••••••" className="mt-1 w-full p-3 bg-neutral-800/50 rounded-lg border border-neutral-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="text-sm font-medium text-neutral-300">New Password</label>
                <input type="password" placeholder="••••••••" className="mt-1 w-full p-3 bg-neutral-800/50 rounded-lg border border-neutral-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" />
            </div>
            <div>
                <label className="text-sm font-medium text-neutral-300">Confirm New Password</label>
                <input type="password" placeholder="••••••••" className="mt-1 w-full p-3 bg-neutral-800/50 rounded-lg border border-neutral-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition" />
            </div>
        </div>
    </div>
    <div className="p-8 border-t border-neutral-800 flex justify-end">
      <SaveButton />
    </div>
  </div>
);

// --- Component for Notifications Section ---
const NotificationsSection = () => (
    <div className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl">
    <div className="p-8 border-b border-neutral-800">
      <h2 className="text-2xl font-bold text-white">Notifications</h2>
      <p className="text-neutral-400 mt-1">Choose how you want to be notified.</p>
    </div>
    <div className="p-8 space-y-4 divide-y divide-neutral-800">
        <NotificationToggle title="New Project Invitations" description="Get notified when someone invites you to a new swap."/>
        <NotificationToggle title="Weekly Activity Report" description="Receive a summary of your activity every week."/>
        <NotificationToggle title="Promotional Emails" description="Get notified about new features and special offers."/>
    </div>
    <div className="p-8 border-t border-neutral-800 flex justify-end">
      <SaveButton />
    </div>
  </div>
);

const NotificationToggle = ({ title, description }: { title: string, description: string }) => (
    <div className="flex justify-between items-center pt-4">
        <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-sm text-neutral-400">{description}</p>
        </div>
        <div className="w-12 h-6 flex items-center bg-neutral-800 rounded-full p-1 cursor-pointer">
            <motion.div className="w-4 h-4 bg-white rounded-full shadow-md" layout />
        </div>
    </div>
);


// --- Reusable Save Button with Animated Border ---
const SaveButton = () => (
    <button
        className="group relative flex items-center justify-center h-10 px-6 overflow-hidden rounded-full bg-neutral-950"
    >
        <div className="absolute inset-[-200%] animate-spin-slow bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#a855f7_50%,#E2CBFF_100%)] opacity-40 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-[1.5px] rounded-full bg-neutral-900 group-hover:bg-neutral-800/80 transition-colors duration-300"></div>
        <span className="relative z-10 text-sm font-semibold text-neutral-300 group-hover:text-white transition-colors">
        Save Changes
        </span>
    </button>
);
