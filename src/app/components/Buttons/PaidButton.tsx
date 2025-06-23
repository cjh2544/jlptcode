import { useSession } from "next-auth/react"
import React, { memo, MouseEvent, MouseEventHandler } from "react";

type Props = {
  name?: string;
  onClick?: () => void; // 클라이언트 클릭 핸들링용 JS 함수 이름
};

const PaidButton = async({ name = '조회', onClick }: Props) => {
  const { data: session, status } = useSession()

  const isEnabled = session?.paymentInfo?.isValid;

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    onClick && onClick();
  }

  return (
    <button
      disabled={!isEnabled}
      onClick={handleClick}
      className={`px-4 py-2 rounded text-white ${
        isEnabled ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
      }`}
    >
      {isEnabled ? name : '유료기능'}
    </button>
  );
}

export default memo(PaidButton);
