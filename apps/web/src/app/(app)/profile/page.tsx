import { ability, auth } from "@/auth/auth"
import ProfileContent from "./profile-avatar-form";
import { cookies } from "next/headers";

export default async function Profile() {
  const { user } = await auth()
  const permissions = await ability()
  const slug = (await cookies()).get('current-org')?.value

  return (
    <div className="space-y-4">
        {/* {permissions?.can('create', 'Project') && ( */}
            <ProfileContent user={user} slug={slug}  />
        {/* )} */}
    </div>
  )
}
