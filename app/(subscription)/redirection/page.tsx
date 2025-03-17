import React from 'react';
import { ArrowRight, CreditCard, Star, Check } from 'lucide-react';

const RedirectionPage = () => {
  return (
    <div className="bg-white flex flex-col">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-[#EECE84] to-amber-400 relative overflow-hidden rounded-t-[12px]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#EECE84] to-amber-400 opacity-80"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
              <Star className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Upgrade Your Plan</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            You currently don&apos;t have an active subscription. Upgrade now to access all features.
          </p>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto fill-white">
            <path d="M0,96L80,80C160,64,320,32,480,32C640,32,800,64,960,69.3C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center px-4 -mt-6 relative z-10">
        <div className="w-full max-w-2xl p-10">
          <div className="flex items-center mb-8 pb-6 border-b border-gray-100">
            <div className="bg-[#EECE84]/10 p-3 rounded-full">
              <CreditCard className="h-6 w-6 text-[#EECE84]" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">Complete Your Upgrade</h2>
              <p className="text-sm text-gray-500">You&apos;ve been redirected to our upgrade page</p>
            </div>
          </div>

          {/* Plan details */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Features</h3>
            </div>
            
            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-[#EECE84]" />
                <p className="ml-3 text-gray-600">
                  <span className="font-medium text-gray-800">Full access</span> to all platform features
                </p>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-[#EECE84]" />
                <p className="ml-3 text-gray-600">
                  <span className="font-medium text-gray-800">Priority support</span> when you need help
                </p>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-[#EECE84]" />
                <p className="ml-3 text-gray-600">
                  <span className="font-medium text-gray-800">Advanced tools</span> for better productivity
                </p>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-[#EECE84]" />
                <p className="ml-3 text-gray-600">
                  <span className="font-medium text-gray-800">No limitations</span> on usage or storage
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-10">
            <a
              href="pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-base font-medium bg-[#EECE84] hover:bg-[#EECE84]/90 transition-all duration-300 group rounded-full shadow-md shadow-[#EECE84]/20"
            >
              Pricing
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform mt-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RedirectionPage;