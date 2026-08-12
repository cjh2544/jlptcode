import Image from 'next/image'
 
export default function MainBackground() {
  return (
    <Image
      alt="Tokyo"
      src="/images/main_bg.png"
      fill
      priority
      sizes="100vw"
      className="object-cover"
    />
  )
}