import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { getOrganizationBySlug } from "@/http/organizations/get-organization-by-slug";
import { cookies } from "next/headers";
import { OrganizationProvider } from "@/contexts/organization-context";
import { getCurrentOrg } from "@/auth/auth";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Minerva App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const slug = await getCurrentOrg()

  let organization = null

  if (slug) {
    organization = (await getOrganizationBySlug(slug)).organization;
  }

  return (
    <html lang="pt">
      <body>
        <Providers>
          {organization ? (
          <OrganizationProvider organization={organization}>
            {children}
          </OrganizationProvider>
        ) : (
          children
        )}
        </Providers>

        <Toaster
          position="bottom-center"
          duration={2000}
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
