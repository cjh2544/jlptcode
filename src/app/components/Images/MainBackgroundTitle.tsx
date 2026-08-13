import Image from "next/image";

export default function MainBackgroundTitle() {
  return (
    <div className="home-hero-brand">
      <img
        src="/images/logo.png"
        alt=""
        aria-hidden
        className="home-hero-brand-icon"
        width={88}
        height={88}
        decoding="async"
      />
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
