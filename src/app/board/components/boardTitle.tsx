import React, { FormEvent, memo } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from 'next/navigation';
import { useBoardCommunityStore } from "@/app/store/boardCommunityStore";

type HeaderSubTitleProps = {
  title?: string,
  visibleButton?: boolean,
  buttonTitle?: string,
}

const BoardTitle = (props: HeaderSubTitleProps) => {
  const {title, visibleButton = false, buttonTitle = '글쓰기'} = props;
  const { data: session } = useSession();
  const router = useRouter();

  const searchInfo = useBoardCommunityStore((state:any) => state.searchInfo);
  const isLoading = useBoardCommunityStore((state:any) => state.isLoading);
  const setPageInfo = useBoardCommunityStore((state:any) => state.setPageInfo);
  const setSearchInfo = useBoardCommunityStore((state:any) => state.setSearchInfo);
  const getBoardList = useBoardCommunityStore((state:any) => state.getBoardList);
  const getPageInfo = useBoardCommunityStore((state:any) => state.getPageInfo);
  const setLoading = useBoardCommunityStore((state:any) => state.setLoading);

  const handleClickWrite = () => {
    router.push('write', {scroll:false});
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true)

    const formData = new FormData(event.currentTarget);

    setSearchInfo(Object.fromEntries(formData));

    setPageInfo({ currentPage: 1 });
    await getPageInfo();
    await getBoardList();

    setLoading(false);
  }

  return (
    <>
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="flex justify-between items-center">
          <h6 className="text-blueGray-700 text-xl font-bold">{title}</h6>
          {visibleButton && (
            <>
              <div className="flex">
                <form onSubmit={onSubmit}>   
                  <div className="min-w-[200px]">
                    <div className="relative flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute w-5 h-5 top-2. left-2.5 text-slate-600">
                        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                      </svg>
                  
                      <input name="keyword"
                        defaultValue={searchInfo?.keyword}
                        className="flex-1 placeholder:text-gray-400 text-gray-700 text-xs border border-gray-300 rounded py-2 pl-10 pr-3 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search" 
                      />
                      
                      {isLoading ? (
                        <>
                          <button disabled type="button" className="cursor-not-allowed w-1/2 text-xs bg-green-300 text-white font-bold py-2 px-4 rounded focus:outline-none ml-1">
                            <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                            </svg>
                            검색중...
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="hover:bg-green-700 border border-green-500 focus:outline-none text-xs bg-green-500 text-white font-bold py-2 px-4 rounded ml-1"
                            type="submit"
                          >
                            검색
                          </button> 
                        </>
                      )}
                    </div>
                  </div>
                </form>
                <button disabled={!session} onClick={handleClickWrite} type="button"
                  className={`${session ? 'hover:bg-blue-700' : 'opacity-50 cursor-not-allowed'} focus:outline-none text-xs bg-blue-500 text-white font-bold py-2 px-4 rounded ml-2`}>
                  {buttonTitle}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default memo(BoardTitle)
