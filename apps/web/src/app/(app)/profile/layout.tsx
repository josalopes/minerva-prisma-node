import { getCurrentOrg } from "@/auth/auth"
import Header from "@/components/header"
import { ReactNode } from "react"

interface ProfileLayoutProps {
  children: ReactNode;
}

export default async function ProfileLayout({
    children,
}: ProfileLayoutProps) {
    return (
        <div>
          <div className="pt-6"><Header /></div>
          <main className="mx-auto w-[600px] max-w-[1200px] py-4">
              {children}
          </main>                
        </div>
    )
}