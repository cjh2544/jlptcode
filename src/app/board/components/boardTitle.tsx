import React, { memo } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from 'next/navigation';

type HeaderSubTitleProps = {
  title?: string,
}

const BoardTitle = (props: HeaderSubTitleProps) => {
  const {title} = props;
  const { data: session } = useSession();
  const router = useRouter();

  const handleClickWrite = () => {
    router.push('write');
  }

  return (
    <>
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between items-center">
          <h6 className="text-blueGray-700 text-xl font-bold">{title}</h6>
          {session && (
            <button type="button" onClick={handleClickWrite} className="focus:outline-none text-xs bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
              문의하기
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default memo(BoardTitle)
