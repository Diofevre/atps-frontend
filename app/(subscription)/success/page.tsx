"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SubscriptionSuccess() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl bg-white backdrop-blur-xl rounded-2xl border border-green-500 p-8"
    >
      <div className="text-start">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 mb-6">
          <CheckCircle className="h-6 w-6 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold mb-3">
          Subscription Activated
        </h1>
        <p className="text-gray-400 mb-6">
          Welcome to ATPS Aviation Premium! Please check your email for confirmation and important details.
        </p>

        <div className="bg-white/5 rounded-xl p-4 mb-8 text-left">
          <h3 className="text-sm font-medium text-white mb-3">Next steps:</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Check your email for subscription details
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Access your premium features
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Explore the dashboard
            </li>
          </ul>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-all duration-300 group"
        >
          Go to Dashboard
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}