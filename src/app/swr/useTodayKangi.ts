import useSWR from "swr";
import useSWRImmutable from "swr";
import type { SWRConfiguration } from "swr";

type ClassTypeProps = {
  params: any;
};

const useClassTypeList = (params: ClassTypeProps, config?: SWRConfiguration) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    { url: "/api/todayKangi/class", params: params },
    config,
  );

  return { data, error, isLoading, isValidating, mutate };
};

const useStudyList = (params: ClassTypeProps, config?: SWRConfiguration) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    { url: "/api/todayKangi/study", params: params.params },
    config,
  );

  return { data, error, isLoading, isValidating, mutate };
};

const useKangiList = (params: ClassTypeProps, config?: SWRConfiguration) => {
  const { data, error, isLoading, isValidating, mutate } = useSWRImmutable(
    { url: "/api/todayKangi/list", params: params, method: "POST" },
    config,
  );

  return { data, error, isLoading, isValidating, mutate };
};

export { useClassTypeList, useStudyList, useKangiList };
