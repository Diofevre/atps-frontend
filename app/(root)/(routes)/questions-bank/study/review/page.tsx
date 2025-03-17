import { Suspense } from "react";
import ReviewComponents from "../../_components/ReviewComponents";
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
        <ReviewComponents />
      </Suspense>
    </div>
  );
};

export default SuccessPage;