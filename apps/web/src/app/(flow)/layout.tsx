import Header from "@/components/header"

export default function FlowLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen flex flex-col bg-muted/40">

      <div className="shrink-0">
        <Header />
      </div>

      {/* 🔥 ÁREA DO FLOW */}
      <div className="flex-1 min-h-0 flex flex-col">
        {children}
      </div>

    </div>
  )
}
