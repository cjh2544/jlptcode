"use client"; // 필수!
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import GoogleSigninButton from "./GoogleSigninButton";
import SignUpLayout from "@/app/components/Layout/SignUpLayout";
import { FormEvent, useCallback } from "react";

const SignInPage = () => {
  const { data: session } = useSession();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // setIsLoading(true)
    // setErrors(null)
 
    // try {
    //   const formData = new FormData(event.currentTarget);
      
    //   const response = await fetch('/api/user', {
    //     method: 'POST',
    //     body: formData,
    //   })

    //   const data = await response.json();
      
    //   if(data.success) {
    //     console.log(data.result);
    //   } else {
    //     if(data.error) {
    //       setErrors(data.error.issues);
    //     } else {
    //       setConfirmMsg(data.message);
    //       setShowConfirm(true);
    //     }
    //   }
    // } catch (error) {
    //   if (error instanceof z.ZodError) {
    //     console.log(error.message);
    //   }
    // } finally {
    //   setIsLoading(false)
    // }
  }

  const isValid = useCallback((colName: string) => {
    // if(isEmpty(errors)) {
    //   return true;
    // } else {
    //   const result = find(errors, (err) => includes(err.path, colName));
    //   return isEmpty(result);
    // }
    
    return true;
  }, [])

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
                    로그인
                </h1>
                <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
                  <GoogleSigninButton text="Sign in" />
                  <div className="my-6 flex items-center justify-center">
                    <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
                    <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
                      Or sign in with email
                    </div>
                    <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
                  </div>
                  <div>
                      <label className={`block mb-2 text-sm font-bold ${isValid('email') ? 'text-gray-900' : 'text-red-600'} dark:text-white`}>이메일</label>
                      <input required={true} minLength={2} maxLength={100} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                  </div>
                  <div>
                      <label className={`block mb-2 text-sm font-bold ${isValid('password') ? 'text-gray-900' : 'text-red-600'} dark:text-white`}>비밀번호 (6~20자리)</label>
                      <input required={true} minLength={6} maxLength={20} type="password" name="password" id="password" placeholder="••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                  </div>
                  <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none">로그인</button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    계정이 없나요?
                    <Link href="/auth/signup" className="ml-1 text-blue-600 hover:underline">
                    회원가입
                    </Link>
                  </p>
                </form>
            </div>
          </div>
        </div>
      </section>
    </SignUpLayout>
  )
}

export default SignInPage
