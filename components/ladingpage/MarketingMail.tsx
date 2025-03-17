'use client'

import React from 'react'

const MarketingMail = () => {

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <input
          type="text"
          name='q'
          placeholder="Your email adress"
          className="w-full py-3 px-4 pl-3 bg-white rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
        />
        <button
          type="submit"
          className="absolute right-[11px] top-1/2 -translate-y-1/2 bg-black text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-black/80 transition-colors duration-200"
        >
          Sign up
        </button>
      </div>
    </div>
  )
}

export default MarketingMail
