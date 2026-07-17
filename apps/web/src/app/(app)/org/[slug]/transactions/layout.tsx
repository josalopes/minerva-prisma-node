export default async function TransactionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="mx-auto w-[600px] max-w-[1200px] py-4">{children}</main>
  )
}
