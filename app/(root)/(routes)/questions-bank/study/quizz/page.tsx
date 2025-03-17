'use client';

import { Suspense } from "react";
import QuizzComponents from "../../_components/QuizzComponents";
import { Loader } from "@/components/ui/loader";

const SuccessPage: React.FC = () => {
  return (
    <div>
      <Suspense 
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Loader />
          </div>
        }>
        <QuizzComponents />
      </Suspense>
    </div>
  );
};

export default SuccessPage;