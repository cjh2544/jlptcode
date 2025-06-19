'use client';
import React, {memo, MouseEvent, useEffect, useState} from "react";
import { format } from "date-fns";

type MemberRowInfoProps = {
  userInfo: User,
}

const MemberRowInfo = (props:MemberRowInfoProps) => {
  const { 
    userInfo, 
  } = props;

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
  }

  const handleSave = (data: any) => {
    console.log(data);
  }

  return (
    <>
      <tr>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm items-center whitespace-no-wrap">
          <p className="text-gray-900">
              {userInfo.name}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm whitespace-no-wrap">
          <p className="text-gray-900">
              {userInfo.email}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm whitespace-no-wrap">
          <p className="text-gray-900">
              {format(userInfo.createdAt as string, 'yyyy-MM-dd HH:mm:ss')}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm whitespace-no-wrap">
            <button onClick={() => setShowModal(!showModal)} data-modal-target="default-modal" data-modal-toggle="default-modal" className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" type="button">
                유료기간 적용
            </button>
            <div className={`${showModal ? '' : 'hidden'} backdrop-blur-md drop-shadow-lg fixed inset-0 px-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]`}>
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                    <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {userInfo.name}
                            </h3>
                            <button onClick={() => setShowModal(!showModal)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="default-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-4 md:p-5 space-y-4">
                            <p className="text-base leading-relaxed text-gray-500">
                                With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
                            </p>
                            <p className="text-base leading-relaxed text-gray-500">
                                The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
                            </p>
                        </div>
                        <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
                            <button onClick={() => handleSave('aaaaaaaaaaa')} data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">적용</button>
                            <button onClick={() => setShowModal(!showModal)} data-modal-hide="default-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">취소</button>
                        </div>
                    </div>
                </div>
            </div>
        </td>
      </tr>
    </>
  );
}

export default memo(MemberRowInfo);
