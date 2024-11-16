"use client"; // 필수!
import { ClientSafeProvider, getCsrfToken, getProviders, signIn, useSession } from "next-auth/react";
import Link from "next/link";
import SignUpLayout from "@/app/components/Layout/SignUpLayout";
import { FormEvent, useEffect, useState } from "react";
import SocialSigninButton from "./SocialSigninButton";

const SignInPage = () => {
  const { data: session } = useSession();
  const [ csrfToken, setCsrfToken ] = useState<string>();
  const [ providers, setProviders ] = useState<Record<string, ClientSafeProvider>>();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<Array<any> | null>(null)

  const getCsrf = async () => {
    const csrf = await getCsrfToken();
    setCsrfToken(csrf);
  }

  const getProv = async () => {
    const prov = await getProviders();
    prov && setProviders(prov);
  }

  const handleClickSocialButton = async (providerId: string) => {
    signIn(providerId);
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true)
    setErrors(null)
 
    const formData = new FormData(event.currentTarget);

    const res = await signIn('credentials', Object.fromEntries(formData.entries()));

    console.log(res);
  }

  // const isValid = useCallback((colName: string) => {
  //   // if(isEmpty(errors)) {
  //   //   return true;
  //   // } else {
  //   //   const result = find(errors, (err) => includes(err.path, colName));
  //   //   return isEmpty(result);
  //   // }
    
  //   return true;
  // }, [])

  useEffect(()=> {
    getCsrf();
    getProv();
  }, [])

  return (
    <SignUpLayout>
      <section className="grid place-content-center h-screen font-nanumGothic">
        <div className="flex flex-col items-center justify-center px-6 py-8 max-w-md md:h-screen lg:py-0">
          <a href="/" className="flex items-center mb-2 text-2xl font-semibold text-gray-900">
            <img className="w-auto" src={'/images/main_bg_title.png'} alt="JLPTCODE" />
          </a>
          <div className="w-full bg-white rounded-lg shadow-lg sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                    로그인{session?.user.email}
                </h1>
                <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
                  <input type="hidden" name="redirect" value="false" />
                  <input type="hidden" name="callbackUrl" value="/" />
                  <input type="hidden" name="csrfToken" value={csrfToken} />
                  
                  <SocialSigninButton providers={providers} onClick={(providerId) => handleClickSocialButton(providerId)} />
                  
                  <div className="my-6 flex items-center justify-center">
                    <span className="block h-px w-full bg-blue-500"></span>
                    <div className="block w-full min-w-fit bg-white px-3 text-center font-medium">
                      회원 이메일 로그인
                    </div>
                    <span className="block h-px w-full bg-blue-500"></span>
                  </div>
                  <div>
                      <label className={`block mb-2 text-sm font-bold`}>이메일</label>
                      <input required={true} minLength={2} maxLength={100} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@company.com" />
                  </div>
                  <div>
                      <label className={`block mb-2 text-sm font-bold`}>비밀번호 (6~20자리)</label>
                      <input required={true} minLength={6} maxLength={20} type="password" name="password" id="password" placeholder="••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                  </div>
                  <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none">로그인</button>
                  <p className="text-sm font-light text-gray-500">
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
