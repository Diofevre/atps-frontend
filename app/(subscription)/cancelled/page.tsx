"use client";

import { motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";

export default function SubscriptionCancelled() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl bg-red-50/30 backdrop-blur-xl rounded-2xl border border-red-500 p-8"
    >
      <div className="text-start">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-6">
          <X className="h-6 w-6 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold mb-3">
          Subscription Cancelled
        </h1>
        <p className="mb-8">
          No charges have been made to your account. Please check your email for confirmation.
        </p>

        <div className="space-y-4 flex flex-row justify-between items-center">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center px-6 py-1.5 text-sm rounded-xl bg-white/5 hover:bg-white/10 border border-red-500 text-red-500 transition-all duration-300 group"
          >
            <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Pricing
          </Link>
          
          <p className="text-sm">
            Need help? <Link href="/contact" className="text-red-500 hover:text-red-600">Contact support</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}