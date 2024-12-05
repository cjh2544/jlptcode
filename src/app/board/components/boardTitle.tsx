import React, { memo } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from 'next/navigation';

type HeaderSubTitleProps = {
  title?: string,
  visibleButton?: boolean,
  buttonTitle?: string,
}

const BoardTitle = (props: HeaderSubTitleProps) => {
  const {title, visibleButton = false, buttonTitle = '글쓰기'} = props;
  const { data: session } = useSession();
  const router = useRouter();

  const handleClickWrite = () => {
    router.push('write', {scroll:false});
  }

  return (
    <>
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between items-center">
          <h6 className="text-blueGray-700 text-xl font-bold">{title}</h6>
          {visibleButton && (
            <button disabled={!session} onClick={handleClickWrite} type="button"
              className={`${session ? 'hover:bg-blue-700' : 'opacity-50 cursor-not-allowed'} focus:outline-none text-xs bg-blue-500 text-white font-bold py-2 px-4 rounded`}>
              {buttonTitle}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default memo(BoardTitle)
