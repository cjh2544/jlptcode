"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import SignUpLayout from "@/app/components/Layout/SignUpLayout";
import { FormEvent, useState } from "react";
import { z } from "zod";

const SignUpPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<Array<any> | null>(null)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setErrors(null)
 
    try {
      const formData = new FormData(event.currentTarget);

      const response = await fetch('/api/user', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json();
      
      if(data.success) {
        console.log(data.result);
      } else {
        setErrors(data.error.issues);
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
    <SignUpLayout>
      <section className="grid place-content-center h-screen font-nanumGothic">
        <div className="flex flex-col items-center justify-center px-6 py-8 max-w-md md:h-screen lg:py-0">
            <a href="/" className="flex items-center mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
              <img className="w-auto" src={'/images/main_bg_title.png'} alt="JLPTCODE" />
            </a>
            <div className="w-full bg-white rounded-lg shadow-lg dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        회원가입
                    </h1>
                    <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
                        <div>
                            <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">이름</label>
                            <input required={true} type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="김회원" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">이메일</label>
                            <input required={true} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">비밀번호</label>
                            <input required={true} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">비밀번호 확인</label>
                            <input required={true} type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">가입하기</button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                          이미 계정이 있나요? <button onClick={() => signIn()} className="font-medium text-blue-600 hover:underline dark:text-blue-500">로그인</button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
      </section>
    </SignUpLayout>
  );
};

export default SignUpPage;
