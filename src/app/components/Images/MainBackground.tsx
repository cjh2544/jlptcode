import Image from 'next/image'
 
export default function MainBackground() {
  return (
    <Image
      alt="동경"
      src="/images/main_bg.png"
      fill
      sizes="100vw"
      style={{
        objectFit: 'cover',
      }}
    />
  )
}