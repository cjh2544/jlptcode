import useSWR from 'swr'
import type { SWRConfiguration } from 'swr'

type WordSearchProps = Word

const useWordList = (params: WordSearchProps, config?: SWRConfiguration) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR({url: '/api/word/list', params: params}, config);

  return {data, error, isLoading, isValidating, mutate};
}

const useWordPage = (params: WordSearchProps, config?: SWRConfiguration) => {
  console.log(params);
  const { data, error, isLoading, isValidating, mutate } = useSWR<Paginate>({url: '/api/word/page', params: params}, config);

  return {data, error, isLoading, isValidating, mutate};
}

export {
  useWordList,
  useWordPage
};