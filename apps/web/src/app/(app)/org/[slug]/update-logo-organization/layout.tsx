import { ReactNode } from "react"

interface OrganizationLogoLayoutProps {
  children: ReactNode;
}

export default async function OrganizationLogoLayout({
    children,
}: OrganizationLogoLayoutProps) {
    return (
        <div>
          <main className="mx-auto w-[600px] max-w-[1200px] py-4">
              {children}
          </main>                
        </div>
    )
}