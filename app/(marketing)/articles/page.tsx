"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Articles = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/blog");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900/80 backdrop-blur-xl">
    </div>
  );
};

export default Articles;