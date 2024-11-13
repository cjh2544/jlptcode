import useSWR from 'swr'
import useSWRImmutable from 'swr'
import type { SWRConfiguration } from 'swr'
import { useJlptStore } from '@/app/store/jlptStore';

type UserProps = {
  params: any,
}

const useCreateUser = (params: UserProps, config?: SWRConfiguration) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR({url: '/api/user', params: params}, config);

  return {data, error, isLoading, isValidating, mutate};
}

export {
  useCreateUser
};