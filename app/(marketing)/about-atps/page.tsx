import { features_about, stats_about } from "@/lib/marketing_page/constant";
import { Shield } from "lucide-react";

const AboutATPS = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen">
        {/* Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464037866556-6812c9d1c72e')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/95 via-[#0F172A]/90 to-[#0F172A]" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Hero Text & Stats */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
              {/* Text */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[24px] bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Trusted Since 2024</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Shaping the Future of
                  <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#EECE84]/40 via-[#EECE84]/50 to-[#EECE84]/60">
                    Aviation Excellence
                  </span>
                </h1>
                <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                  For over two decades, ATPS Aviation has been at the forefront of aviation
                  training, combining cutting-edge technology with world-class expertise to
                  develop the next generation of aviation professionals.
                </p>
              </div>

              {/* Stats */}
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl group-hover:bg-blue-500/30 transition-colors" />
                <div className="relative grid grid-cols-2 gap-4">
                  {stats_about.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all group/stat"
                    >
                      <p className="text-4xl font-bold text-white mb-2 group-hover/stat:text-blue-400 transition-colors">
                        {stat.value}
                      </p>
                      <h3 className="text-lg font-semibold text-gray-200 mb-1">{stat.label}</h3>
                      <p className="text-sm text-gray-400">{stat.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
              {features_about.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-blue-500/30 transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 mb-6">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutATPS;