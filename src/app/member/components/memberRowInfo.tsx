'use client';
import React, {FormEvent, memo, MouseEvent, useEffect, useState} from "react";
import { format } from "date-fns";
import { PAYMENT_PERIOD } from "@/app/constants/constants";
import { z } from "zod";

type MemberRowInfoProps = {
  userInfo: User,
}

const MemberRowInfo = (props:MemberRowInfoProps) => {
  const { 
    userInfo, 
  } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<Array<any> | null>(null)
  const [isShowConfirm, setShowConfirm] = useState<boolean>(false)
  const [confirmMsg, setConfirmMsg] = useState<string>('')
  const [isSuccess, setSuccess] = useState<boolean>(false)
  // const [userPayInfo, setUserPayInfo] = useState<any>({})
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true)
    setErrors(null)
  
    try {
      const formData = new FormData(event.currentTarget);
      
      const response = await fetch('/api/userPayment', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json();
      console.log(data);
      if(data.success) {
        // setUserPayInfo(Object.fromEntries(formData));
        setConfirmMsg(data.message);
        setShowConfirm(true);
        setSuccess(true);
      } else {
        if(data.error) {
          setErrors(data.error.issues);
        } else {
          setConfirmMsg(data.message);
          setShowConfirm(true);
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.message);
      }
    } finally {
      setIsLoading(false)
    }
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
                        <form onSubmit={onSubmit}>
                          <input type="hidden" name="email" value={userInfo?.email ?? ''} />
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
                              {PAYMENT_PERIOD.map((item: any, idx: number) =>{
                                  return (
                                      <label key={`payment-period-${idx}`}  className="flex items-center mb-4">
                                          <input type="radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" name="paymentType" value={item.value} />
                                          <span className="ml-2">{item.name}</span>
                                      </label>
                                  )
                              })}
                          </div>
                          <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
                            {isLoading ? (
                              <>
                                <button disabled type="submit" className="cursor-not-allowed bg-blue-300 text-white font-bold py-2 px-4 rounded focus:outline-none">
                                  <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                  </svg>
                                  처리중...
                                </button>
                              </>
                            ) : (
                              <>
                                <button data-modal-hide="default-modal" type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">적용</button>
                              </>
                            )}
                              <button onClick={() => setShowModal(!showModal)} data-modal-hide="default-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">취소</button>
                          </div>
                        </form>
                    </div>
                </div>
            </div>
        </td>
      </tr>
    </>
  );
}

export default memo(MemberRowInfo);
