import useSWR from "swr";
import type { SWRConfiguration } from "swr";

type ClassTypeProps = {
  params?: any;
};

const useTodaySpeakClass = (params?: ClassTypeProps, config?: SWRConfiguration) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    { url: "/api/todaySpeak/class", params: params ?? {} },
    config,
  );

  return { data, error, isLoading, isValidating, mutate };
};

export { useTodaySpeakClass };
