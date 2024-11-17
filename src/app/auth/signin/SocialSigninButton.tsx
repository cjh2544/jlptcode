'use client';

import { filter, includes, remove } from 'lodash';
import { ClientSafeProvider, signIn } from 'next-auth/react';
import Link from 'next/link';
import { FormEvent, MouseEvent } from 'react';

type SocialSigninButtonProps = {
  providers: Record<string, ClientSafeProvider> | undefined,
  onClick: (providerId: string) => {}
}
export default function SocialSigninButton({ providers, onClick }: SocialSigninButtonProps) {
  const handleClickSocialButton = (providerId: string) => (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    onClick && onClick(providerId)
  }
  
  return (
    <div>
      {providers && filter(Object.values(providers), (item) => item.id !== 'credentials').map((provider: ClientSafeProvider) => (
        <a href="#" key={provider.id} onClick={handleClickSocialButton(provider.id)}
          className='flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray-2 p-[15px] font-medium hover:bg-opacity-50 mb-1'>
          <img src={`https://authjs.dev/img/providers/${provider['id']}.svg`} height={20} width={20}/>
          { 
            { 
              google : '구글',
              naver : '네이버',
              kakao : '카카오'
            }[provider['id'] as string]
          } 로그인
        </a>
      ))}
    </div>
  );
}
