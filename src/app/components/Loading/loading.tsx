import { Spinner } from "@/components/ui/spinner";
import { memo } from "react";

type LoadingProps = {
  text?: string;
};

const Loading = (props: LoadingProps) => {
  const { text } = props;

  return (
    <div className="max-w-full p-4 mx-auto grid h-56 place-content-center justify-items-center gap-3">
      <Spinner className="size-8" />
      <p className="animate-pulse text-xl font-semibold">
        {text ? text : "Loading..."}
      </p>
    </div>
  );
};

export default memo(Loading);
