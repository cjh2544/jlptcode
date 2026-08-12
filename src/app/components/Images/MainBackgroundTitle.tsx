import Image from "next/image";

export default function MainBackgroundTitle() {
  return (
    <div className="flex w-full justify-center">
      <Image
        src="/images/main_bg_title.png"
        width={500}
        height={200}
        alt="JLPT CODE"
        className="mx-auto h-auto w-full max-w-[500px]"
        priority
      />
    </div>
  );
}
