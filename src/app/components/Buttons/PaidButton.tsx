import { getServerSession } from "next-auth"
import { options } from "@/app/api/auth/[...nextauth]/options";
import React, {memo, MouseEvent} from "react";

type PaidButtonProps = {
  name: string,
  type?: 'button' | 'submit' | 'reset',
  className?: string,
  iconClassName?: string,
  onClick?: (e: MouseEvent<HTMLElement>) => void,
}

const PaidButton = async(props:PaidButtonProps) => {

  const { name = '조회', type = 'button', className, iconClassName = 'fa-search', onClick } = props;

  const session = await getServerSession(options);

  const handClick = (event: MouseEvent<HTMLElement>) => {
  onClick && onClick(event);
}

  return (
    <>
      {session && session?.paymentInfo?.isValid ? (
        <button
          className={`bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 w-full ${className}`}
          type={type}
          onClick={handClick}
        >
          {iconClassName && <i className={`fas ${iconClassName} mr-1`}></i>} {name}
        </button>
      ) : (
        <button
          disabled={true}
          className={`bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 w-full ${className}`}
          type={type}
        >
          {iconClassName && <i className={`fas ${iconClassName} mr-1`}></i>} 유료기능
        </button>
      )}
      
    </>
  );
}

export default memo(PaidButton);
