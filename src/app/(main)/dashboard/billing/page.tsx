"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Download, HardDrive, CheckCircle, Users, Sparkles, Package } from 'lucide-react';

// Sample data for the billing page
const currentPlan = {
  name: "Pro Plan",
  price: 49,
  renewalDate: "October 13, 2025",
  status: "Active",
};

const usageStats = [
  { name: "Projects", used: 18, total: 25, icon: HardDrive },
  { name: "Team Members", used: 3, total: 5, icon: Users },
  { name: "Premium Features", used: 8, total: 10, icon: Sparkles },
];

const paymentMethod = {
  type: "Visa",
  last4: "4242",
  expiry: "12/26",
};

const billingHistory = [
  { id: "INV-2025-001", date: "Sep 13, 2025", amount: 49.00, status: "Paid" },
  { id: "INV-2025-002", date: "Aug 13, 2025", amount: 49.00, status: "Paid" },
  { id: "INV-2025-003", date: "Jul 13, 2025", amount: 49.00, status: "Paid" },
  { id: "INV-2025-004", date: "Jun 13, 2025", amount: 49.00, status: "Paid" },
];

export default function BillingPage() {
  return (
    <>
      <div className="relative min-h-screen w-full overflow-hidden bg-neutral-950 text-white p-4 sm:p-6 lg:p-8">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              Billing & Subscriptions
            </h1>
            <p className="mt-2 text-lg text-neutral-400">
              Manage your plan, payment methods, and view your invoice history.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Current Plan & Usage */}
            <div className="lg:col-span-2 space-y-8">
              {/* Current Plan Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="relative overflow-hidden rounded-2xl bg-neutral-900 p-8"
              >
                <div className="absolute inset-[-200%] animate-spin-slow bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#a855f7_50%,#E2CBFF_100%)] opacity-20" />
                <div className="absolute inset-[1px] bg-neutral-900 rounded-[15px]"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{currentPlan.name}</h2>
                      <p className="text-4xl font-bold text-white">${currentPlan.price}<span className="text-lg font-normal text-neutral-400">/month</span></p>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>{currentPlan.status}</span>
                    </div>
                  </div>
                  <p className="text-neutral-400 mt-4">Your plan renews on {currentPlan.renewalDate}.</p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 text-center px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors">Manage Subscription</button>
                    <button className="flex-1 text-center px-6 py-3 bg-neutral-800/80 text-white font-semibold rounded-lg hover:bg-neutral-700/80 transition-colors">Upgrade Plan</button>
                  </div>
                </div>
              </motion.div>

              {/* Usage Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl p-8"
              >
                <h3 className="text-xl font-bold text-white mb-6">Current Usage</h3>
                <div className="space-y-6">
                  {usageStats.map((stat, i) => (
                    <div key={stat.name}>
                      <div className="flex justify-between items-center text-sm text-neutral-300 mb-2">
                        <div className="flex items-center gap-2">
                          <stat.icon className="w-4 h-4 text-neutral-500" />
                          <span>{stat.name}</span>
                        </div>
                        <span>{stat.used} / {stat.total}</span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-2.5">
                        <motion.div
                          className="bg-purple-500 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(stat.used / stat.total) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.3 + i * 0.1, type: "spring", stiffness: 100 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Payment Method & History */}
            <div className="space-y-8">
              {/* Payment Method */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Payment Method</h3>
                <div className="flex items-center gap-4 p-4 bg-neutral-800/50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-sky-400" />
                  <div>
                    <p className="font-semibold text-white">{paymentMethod.type} ending in {paymentMethod.last4}</p>
                    <p className="text-sm text-neutral-400">Expires {paymentMethod.expiry}</p>
                  </div>
                </div>
                <button className="mt-4 w-full text-center py-2 bg-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-700 transition-colors">Update</button>
              </motion.div>

              {/* Billing History */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl"
              >
                <h3 className="text-xl font-bold text-white p-6 border-b border-neutral-800">Billing History</h3>
                <div className="p-2">
                  <AnimatePresence>
                    <table className="w-full text-left text-sm">
                      <tbody>
                        {billingHistory.map((invoice, i) => (
                          <motion.tr
                            key={invoice.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
                            className="hover:bg-neutral-800/50 rounded-lg"
                          >
                            <td className="p-4">
                              <p className="font-medium text-neutral-200">{invoice.date}</p>
                              <p className="text-neutral-500">{invoice.id}</p>
                            </td>
                            <td className="p-4 text-neutral-200">${invoice.amount.toFixed(2)}</td>
                            <td className="p-4">
                              <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                                <Download className="w-4 h-4" />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Self-contained animation styles */}
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
