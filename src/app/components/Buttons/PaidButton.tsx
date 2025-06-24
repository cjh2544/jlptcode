import { useSession } from "next-auth/react"
import React, { memo, MouseEvent, MouseEventHandler } from "react";

type Props = {
  name?: string;
  className?: string;
  iconClassName?: string;
  color?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void; // 클라이언트 클릭 핸들링용 JS 함수 이름
};

const PaidButton = ({ name = '조회', className, iconClassName = 'fa-search', color = 'lightBlue', onClick }: Props) => {
  const { data: session, status } = useSession()

  const isEnabled = session?.paymentInfo?.isValid;

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    onClick && onClick(e);
  }

  return (
    <button
      disabled={!isEnabled}
      onClick={handleClick}
      className={`text-white active:bg-${color}-600 font-bold uppercase px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 ${className} ${
        isEnabled ? `bg-${color}-500 hover:bg-${color}-600` : `bg-${color}-500 cursor-not-allowed`
      }`}
    >
      <>
        {iconClassName && <i className={`fas ${iconClassName}`}></i>}
        {isEnabled ?  name : '유료기능'}
      </>
    </button>
  );
}

export default memo(PaidButton);
