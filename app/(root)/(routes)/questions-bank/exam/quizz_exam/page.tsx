import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";
import QuizzExamComponents from "../_components/QuizzExamComponents";

const SuccessPage: React.FC = () => {
  return (
    <div>
      <Suspense 
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Loader />
          </div>
        }>
        <QuizzExamComponents />
      </Suspense>
    </div>
  );
};

export default SuccessPage;