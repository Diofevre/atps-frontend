import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flag, Search } from "lucide-react";
import { COUNTRIES } from "@/lib/utils";

interface ExaminingAuthorityCardProps {
  selectedCountry?: string | null;
  onCountryChange?: (value: string | null) => void;
}

export const ExaminingAuthorityCard = ({ selectedCountry, onCountryChange }: ExaminingAuthorityCardProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredCountries = ["All Examining Authorities", ...COUNTRIES].filter((country) =>
    country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-tr from-sky-600 to-blue-100 rounded-[20px] h-auto min-h-[7rem] w-full relative overflow-hidden p-6">
      <div className="flex flex-col space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mt-2">
            <div className="border-none bg-[#EECE84]/50 rounded-full p-2">
              <Flag className="w-4 h-4 fill-yellow-400 text-yellow-400 mt-0.5 ml-0.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-black text-sm">Examining authorities</span>
              <span className="text-xl font-semibold text-black">
                {selectedCountry || "All Examining Authorities"}
              </span>
            </div>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button className="rounded-[12px] mt-2 px-6 py-2 text-sm flex items-center border border-primary/20 dark:border-black/50 bg-white/80 hover:bg-white/90 text-black/80 transition-colors">
                <span>{selectedCountry ? "Change" : "Choose"}</span>
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Select Country</DialogTitle>
              </DialogHeader>
              
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search countries..."
                  className="pl-9"
                />
              </div>

              <ScrollArea className="h-[300px] mt-4 -mx-4 px-4">
                <div className="space-y-1">
                  {filteredCountries.map((country) => (
                    <button
                      key={country}
                      onClick={() => {
                        onCountryChange?.(country === "All Examining Authorities" ? null : country);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors
                        ${selectedCountry === country || (!selectedCountry && country === "All Examining Authorities")
                          ? "bg-sky-50 text-sky-600"
                          : "hover:bg-gray-50 text-gray-700"
                        }`}
                    >
                      <span className="font-medium">{country}</span>
                      {((selectedCountry === country || (!selectedCountry && country === "All Examining Authorities")) && (
                        <div className="h-2 w-2 rounded-full bg-sky-500" />
                      ))}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};