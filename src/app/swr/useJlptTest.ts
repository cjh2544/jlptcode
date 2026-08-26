import useSWRImmutable from 'swr/immutable'
import type { SWRConfiguration } from 'swr'

type ClassTypeProps = {
  params?: any,
}

const useClassTypeList = (_params?: ClassTypeProps, config?: SWRConfiguration) => {
  const { data, error, isLoading, isValidating, mutate } = useSWRImmutable(
    { url: '/api/jlptTest/class' },
    config,
  );

  return { data, error, isLoading, isValidating, mutate };
}

const useJlptList = (params: ClassTypeProps, config?: SWRConfiguration) => {
  const { data, error, isLoading, isValidating, mutate } = useSWRImmutable({url: '/api/jlptTest/list', params: params, method: 'POST'}, config);

  return {data, error, isLoading, isValidating, mutate};
}

export {
  useClassTypeList,
  useJlptList
};
