export const metadata = {
  title: "회원가입",
  description: "JLPTCODE 회원가입으로 일본어 학습을 시작하세요.",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-auth-layout">
      <div className="app-auth-layout-main">{children}</div>
      <aside className="app-auth-layout-aside" aria-hidden>
        <img src="/images/main_bg.png" alt="" />
      </aside>
    </div>
  );
}
