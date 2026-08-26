import useSWRImmutable from 'swr/immutable'
import type { SWRConfiguration } from 'swr'

type ClassTypeProps = {
  params?: any,
}

const useClassTypeList = (_params?: ClassTypeProps, config?: SWRConfiguration) => {
  const { data, error, isLoading, isValidating, mutate } = useSWRImmutable({url: '/api/jpt/class'}, config);

  return {data, error, isLoading, isValidating, mutate};
}

const useJptList = (params: ClassTypeProps, config?: SWRConfiguration) => {
  const { data, error, isLoading, isValidating, mutate } = useSWRImmutable({url: '/api/jpt/list', params: params, method: 'POST'}, config);

  return {data, error, isLoading, isValidating, mutate};
}

export {
  useClassTypeList,
  useJptList
};
