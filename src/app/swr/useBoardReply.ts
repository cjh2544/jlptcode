import useSWR from 'swr'
import useSWRImmutable from 'swr'
import type { SWRConfiguration } from 'swr'
import { useBoardCommunityStore } from '@/app/store/boardCommunityStore';

type BoardProps = {
  params: any,
  method?: "GET" | "POST"
}

const useBoardReplyInfo = ({params, method = 'GET'}: BoardProps, config?: SWRConfiguration) => {
  const { data, error, isLoading, isValidating, mutate } = useSWRImmutable ({url: '/api/board/reply/' + params.boardId, params, method}, config);

  return {data, error, isLoading, isValidating, mutate};
}

export {
  useBoardReplyInfo
};