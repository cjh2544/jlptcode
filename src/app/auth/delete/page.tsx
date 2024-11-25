"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import SignUpLayout from "@/app/components/Layout/SignUpLayout";
import { FormEvent, useCallback, useState } from "react";
import { z } from "zod";
import { find, includes, isEmpty } from "lodash";
import ModalConfirm from "@/app/components/Modals/ModalConfirm";
import Link from "next/link";

const DeletePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<Array<any> | null>(null)
  const [isShowConfirm, setShowConfirm] = useState<boolean>(false)
  const [confirmMsg, setConfirmMsg] = useState<string>('')
  const { data: session } = useSession();
  const [confirmType, setConfirmType] = useState<any>('info')
  const [isProcSuccess, setProcSuccess] = useState<boolean>(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if(confirm('회원탈퇴 하시겠습니까?')) {
      setIsLoading(true)
      setErrors(null)
      setConfirmType('info');
      setProcSuccess(false);
  
      try {
        const formData = new FormData(event.currentTarget);
        
        const response = await fetch('/api/user', {
          method: 'DELETE',
          body: formData,
        })

        const data = await response.json();
        
        setProcSuccess(data.success);

        if(data.success) {
          setConfirmMsg(data.message);
          setShowConfirm(true);
        } else {
          if(data.error) {
            setErrors(data.error.issues);
          } else {
            setConfirmType('warning');
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
  }

  const getErrorMessage = useCallback((colName: string) => {
    if(isEmpty(errors)) {
      return '';
    } else {
      const result = find(errors, (err) => includes(err.path, colName));
      return result?.message;
    }
  }, [errors]);

  const isValid = useCallback((colName: string) => {
    if(isEmpty(errors)) {
      return true;
    } else {
      const result = find(errors, (err) => includes(err.path, colName));
      return isEmpty(result);
    }
  }, [errors])

  const handleCloseModal = async (visible: boolean) => {
    setShowConfirm(visible);

    if(isProcSuccess) {
      await signOut();
    }
  }

  return (
    <>
      <SignUpLayout>
        <section className="grid place-content-center h-screen font-nanumGothic">
          <div className="flex flex-col items-center justify-center px-6 py-8 max-w-md md:h-screen lg:py-0">
              <a href="/" className="flex items-center mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
                <img className="w-auto" src={'/images/main_bg_title.png'} alt="JLPTCODE" />
              </a>
              <div className="w-full bg-white rounded-lg shadow-lg dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                          회원탈퇴
                      </h1>
                      <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
                          <div>
                              <label className={`block mb-2 text-sm font-bold ${isValid('name') ? 'text-gray-900' : 'text-red-600'} dark:text-white`}>이름</label>
                              <p>{session?.user.name || ''}</p>
                          </div>
                          <div>
                              <label className={`block mb-2 text-sm font-bold ${isValid('email') ? 'text-gray-900' : 'text-red-600'} dark:text-white`}>이메일</label>
                              <p>{session?.user.email || ''}</p>
                          </div>
                          <div>
                              <label className={`block mb-2 text-sm font-bold ${isValid('password') ? 'text-gray-900' : 'text-red-600'} dark:text-white`}>비밀번호 (6~20자리)</label>
                              <input required={true} minLength={6} maxLength={20} type="password" name="password" id="password" placeholder="••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                              <p className={`${isValid('password') ? 'hidden' : 'text-red-600 text-sm'}`}>{getErrorMessage('password')}</p>
                          </div>

                          <div className="flex gap-1 text-center">
                            {isLoading ? (
                              <button disabled type="button" className="w-1/2 cursor-not-allowed bg-blue-300 text-white font-bold py-2 px-4 rounded focus:outline-none">
                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                </svg>
                                처리중...
                              </button>
                            ) : (
                              <button type="submit" name="delete" className="w-1/2 text-white bg-red-500 hover:bg-red-700 focus:outline-none font-bold py-2 px-4 rounded focus:outline-none">
                                탈퇴하기
                              </button>
                            )}
                            <Link href="/" className="w-1/2 text-gray-900 bg-white border border-gray-400 font-bold py-2 px-4 rounded">
                              취소
                            </Link>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
        </section>
      </SignUpLayout>
      <ModalConfirm type={confirmType} message={confirmMsg} visible={isShowConfirm} onClose={(visible: boolean) => handleCloseModal(visible)} />
    </>
  );
};

export default DeletePage;
