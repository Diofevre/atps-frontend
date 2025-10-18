"use client";

import React, { useState } from "react";
import axios from "axios";
import { Flag, Send, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/mock-clerk";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { COUNTRIES } from "@/lib/utils";

interface ReviewFormProps {
  userId: string;
  questionId: number;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ userId, questionId }) => {
  const { getToken } = useAuth();
  const [countrySeen, setCountrySeen] = useState<string>("");
  const [information, setInformation] = useState<string>("");
  const [infoAccuracy, setInfoAccuracy] = useState<number>(5);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredCountries = COUNTRIES.filter((country: string) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!countrySeen) {
      toast.error("Please select a country");
      return;
    }
    
    const token = await getToken();
    const payload = {
      user_id: userId,
      question_id: questionId,
      country_seen: countrySeen,
      information,
      info_accuracy: infoAccuracy,
    };

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Review submitted successfully!");
      setCountrySeen("");
      setInformation("");
      setInfoAccuracy(5);
      return response;
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while submitting the review.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Country Selection Card */}
        <div className="bg-gradient-to-tr from-[#EECE84]/80 to-[#EECE84]/50 rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="absolute top-0 right-0 w-48 h-48 transform translate-x-16 -translate-y-16">
            <div className="absolute inset-0 bg-white opacity-10 rounded-full"></div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-black/20 backdrop-blur-sm rounded-full p-3">
                <Flag className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Examining Authority</span>
                <span className="text-xl font-bold truncate max-w-[200px]">
                  {countrySeen || "Select a country"}
                </span>
              </div>
            </div>
            
            <Button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-white hover:bg-[#EECE84]/10 text-black rounded-full px-6 py-2 font-medium flex items-center gap-2 transition-colors"
            >
              Choose <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Information Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Your Review
          </label>
          <textarea
            value={information}
            onChange={(e) => setInformation(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#EECE84] transition-shadow resize-none"
            placeholder="Share your insights and experiences..."
            required
          />
        </div>

        {/* Accuracy Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Information Accuracy
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {infoAccuracy}/10
            </span>
          </div>
          <Slider
            value={[infoAccuracy]}
            onValueChange={(value) => setInfoAccuracy(value[0])}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-[#EECE84]/90 hover:bg-[#EECE84]/80 text-black rounded-2xl py-3 font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Send className="w-4 h-4" />
          Submit Review
        </Button>
      </form>

      {/* Country Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] flex flex-col">
            <div className="p-4 border-b dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Select a Country</h2>
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#EECE84]"
              />
            </div>
            
            <div className="overflow-y-auto flex-1 p-2">
              <div className="grid grid-cols-1 gap-1">
                {filteredCountries.map((country) => (
                  <button
                    key={country}
                    onClick={() => {
                      setCountrySeen(country);
                      setIsModalOpen(false);
                      setSearchTerm("");
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;