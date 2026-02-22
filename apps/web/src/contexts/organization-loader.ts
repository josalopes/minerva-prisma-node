import { getCurrentOrg } from "@/auth/auth";
import { cookies } from "next/headers";

export async function loadOrganization(): Promise<string | null> {
  // const cookieStore = cookies()
  // return (await cookieStore).get('current-org')?.value ?? null
  
  const currentOrg = await getCurrentOrg();

  return (
    currentOrg
  );
}
