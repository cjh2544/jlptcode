import Image from "next/image";

export default function MainBackgroundTitle() {
  return (
    <div className="home-hero-brand">
      <Image
        src="/images/main_bg_title.png"
        width={640}
        height={234}
        alt="JLPT CODE"
        className="home-hero-brand-title"
        priority
      />
    </div>
  );
}
