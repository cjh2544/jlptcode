import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";

type LoadingProps = {
  text?: string;
};

const LoadingSkeleton = (props: LoadingProps) => {
  const { text } = props;

  return (
    <div className="w-full bg-white p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 md:p-6">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`flex items-center justify-between ${i > 0 ? "pt-4" : ""}`}
        >
          <div className="space-y-2">
            <Skeleton className="h-2.5 w-24 rounded-full" />
            <Skeleton className="h-2 w-32 rounded-full" />
          </div>
          <Skeleton className="h-2.5 w-12 rounded-full" />
        </div>
      ))}
      <span className="sr-only">{text || "Loading..."}</span>
    </div>
  );
};

export default memo(LoadingSkeleton);
