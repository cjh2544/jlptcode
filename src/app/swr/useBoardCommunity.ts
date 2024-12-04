import useSWR from 'swr'
import useSWRImmutable from 'swr'
import type { SWRConfiguration } from 'swr'
import { useBoardCommunityStore } from '@/app/store/boardCommunityStore';

type BoardProps = {
  params: any,
  method?: "GET" | "POST"
}

const useBoardList = ({params, method = 'POST'}: BoardProps, config?: SWRConfiguration) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR({url: '/api/boardCommunity/list', params: params, method: method}, config);

  return {data, error, isLoading, isValidating, mutate};
}

export {
  useBoardList
};