import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";
import ReviewExamComponents from "./_components/ReviewExamComponents";

const SuccessPage: React.FC = () => {
  return (
    <div>
      <Suspense 
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Loader />
          </div>
        }>
        <ReviewExamComponents />
      </Suspense>
    </div>
  );
};

export default SuccessPage;