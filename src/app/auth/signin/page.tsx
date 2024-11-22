"use client"; // 필수!
import { ClientSafeProvider, getCsrfToken, getProviders, signIn, useSession } from "next-auth/react";
import Link from "next/link";
import SignUpLayout from "@/app/components/Layout/SignUpLayout";
import { FormEvent, useEffect, useState } from "react";
import SocialSigninButton from "./SocialSigninButton";
import ModalConfirm from "@/app/components/Modals/ModalConfirm";
import { useRouter } from 'next/navigation';

const SignInPage = () => {
  const { data: session } = useSession();
  const [ csrfToken, setCsrfToken ] = useState<string>();
  const [ providers, setProviders ] = useState<Record<string, ClientSafeProvider>>();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isShowConfirm, setShowConfirm] = useState<boolean>(false)
  const [confirmMsg, setConfirmMsg] = useState<string>('')
  const [confirmType, setConfirmType] = useState<any>('info')
  const router = useRouter()

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
    event.currentTarget.reset();

    setIsLoading(true)
 
    const res:any = await signIn('credentials', {
      email,
      password,
      csrfToken,
      redirect: false,
      callbackUrl: '/'
    });

    setIsLoading(false);

    if(!res.ok) {
      setConfirmMsg(res?.error);
      setShowConfirm(true);
      setConfirmType('warning');
    } else {
      router.push("/")
    }
  }
  const handleCloseModal = (visible: boolean) => {
    setShowConfirm(visible);
  }

  useEffect(()=> {
    getCsrf();
    getProv();
  }, [])

  return (
    <>
      <SignUpLayout>
        <section className="grid place-content-center h-screen font-nanumGothic">
          <div className="flex flex-col items-center justify-center px-6 py-8 max-w-md md:h-screen lg:py-0">
            <a href="/" className="flex items-center mb-2 text-2xl font-semibold text-gray-900">
              <img className="w-auto" src={'/images/main_bg_title.png'} alt="JLPTCODE" />
            </a>
            <div className="w-full bg-white rounded-lg shadow-lg sm:max-w-md xl:p-0">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                      로그인
                  </h1>
                  <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
                    {/* <SocialSigninButton providers={providers} onClick={(providerId) => handleClickSocialButton(providerId)} />
                    
                    <div className="my-6 flex items-center justify-center">
                      <span className="block h-px w-full bg-blue-500"></span>
                      <div className="block w-full min-w-fit bg-white px-3 text-center font-medium">
                        회원 이메일 로그인
                      </div>
                      <span className="block h-px w-full bg-blue-500"></span>
                    </div> */}
                    <div>
                        <label className={`block mb-2 text-sm font-bold`}>이메일</label>
                        <input onChange={(e) => setEmail(e.currentTarget.value)} value={email} required={true} minLength={2} maxLength={100} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@company.com" />
                    </div>
                    <div>
                        <label className={`block mb-2 text-sm font-bold`}>비밀번호 (6~20자리)</label>
                        <input onChange={(e) => setPassword(e.currentTarget.value)} value={password} required={true} minLength={6} maxLength={20} type="password" name="password" id="password" placeholder="••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                    </div>
                    {isLoading ? (
                      <>
                        <button disabled type="submit" className="cursor-not-allowed w-full bg-blue-300 text-white font-bold py-2 px-4 rounded focus:outline-none">
                          <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                          </svg>
                          로그인...
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none">
                          로그인
                        </button>
                      </>
                    )}
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
      <ModalConfirm type={confirmType} message={confirmMsg} visible={isShowConfirm} onClose={(visible: boolean) => handleCloseModal(visible)} />
    </>
  )
}

export default SignInPage
