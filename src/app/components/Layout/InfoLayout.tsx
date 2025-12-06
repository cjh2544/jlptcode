
export const metadata = {
  title: "안내",
  description: "안내",
};

export default function InfoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="flex h-screen">
        <div className="flex-1 bg-blueGray-200">
          {children}
        </div>
        <div className="flex-1 sm:hidden">
            <img
              className="object-cover object-center w-full h-full"
              src={'/images/main_bg.png'}
              alt="nature image"
            />
        </div>
      </div>
    </>
  )
}
