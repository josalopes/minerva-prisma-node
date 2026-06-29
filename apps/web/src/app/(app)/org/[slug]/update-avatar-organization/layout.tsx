import Header from "@/components/header";

export default async function OrganizationAvatarLayout({
    children,
}: {
  children: React.ReactNode
}) {
    return (
      <>
        <div className="shrink-0">
            <Header />
        </div>

        <main className="mx-auto w-[600px] max-w-[1200px] py-40">
            {children}
        </main>
      </>
    )
}