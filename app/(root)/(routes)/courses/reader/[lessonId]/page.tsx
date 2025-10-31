"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, BookOpen, Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface Lesson {
  id: string;
  lesson_number: number;
  title: string;
  total_pages: number;
}

export default function PDFReaderPage({ params }: { params: { lessonId: string } }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState("");
  const [viewerUrl, setViewerUrl] = useState("");

  useEffect(() => {
    fetchLesson();
  }, [params.lessonId]);

  const fetchLesson = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
      
      const response = await fetch(`${API_URL}/api/ebook/lessons/${params.lessonId}`);
      const data = await response.json();

      if (data.success) {
        setLesson(data.lesson);
      }
      
      // URL du PDF via route Next.js (évite CORS)
      const pdfBaseUrl = `/api/pdf/010`;
      setPdfUrl(pdfBaseUrl);
      
      // Utiliser PDF.js viewer avec page de départ de la leçon
      const startPage = data.success && data.lesson ? data.lesson.start_page : 1;
      setViewerUrl(`/pdfjs/web/viewer.html?file=${encodeURIComponent(pdfBaseUrl)}#page=${startPage}`);
      
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-[#EECE84] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link href="/courses/manuals">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-gray-100">
              <ChevronLeft className="h-4 w-4" />
              <span>Retour aux cours</span>
            </Button>
          </Link>

          <div className="h-6 w-px bg-gray-300" />

          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#EECE84]/20 rounded-lg">
              <BookOpen className="h-5 w-5 text-[#B8A040]" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900 text-base">
                {lesson?.title.replace(/\s*\.\s*\.\s*\.\s*/g, '') || 'Air Law'}
              </h1>
              <p className="text-xs text-gray-500">Leçon {lesson?.lesson_number} • Air Law (010) • 570 pages</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={pdfUrl}
            download
          >
            <Button variant="ghost" size="sm" className="hover:bg-gray-100 gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Télécharger</span>
            </Button>
          </a>
        </div>
      </div>

      {/* PDF Viewer - Using PDF.js viewer */}
      <div className="flex-1 relative bg-gray-100">
        {viewerUrl ? (
          <iframe
            src={viewerUrl}
            className="absolute inset-0 w-full h-full border-0"
            title="PDF Viewer"
            sandbox="allow-scripts allow-same-origin allow-forms allow-downloads"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-8">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Impossible de charger le lecteur PDF</p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[#EECE84] hover:bg-[#EECE84]/90 text-gray-900">
                  Ouvrir dans un nouvel onglet
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
