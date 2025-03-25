'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Props {
  title: string;
  link: string;
  link_title: string;
}

export default function ErrorHandler({ title, link, link_title } : Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-8 text-center"
        >
          <Image
            src="/error-empty.svg"
            alt="No Data"
            width={240}
            height={240}
            className="mx-auto mb-6"
          />
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">No {title} Found</h2>
          <p className="text-gray-500 text-lg mb-8">
            Please reload or refresh the page to try again.
          </p>
          <Link 
            href={`/${link}`}
            className="group inline-flex items-center text-xl font-medium text-gray-600 hover:text-gray-900 mb-8"
          >
            <span className="mr-2 text-2xl leading-none select-none">
              ⟵
            </span>
            {link_title}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}