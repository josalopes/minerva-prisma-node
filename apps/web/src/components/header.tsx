import Image from "next/image"
import { Slash } from "lucide-react"

import ambientalIcon from "@/assets/ambiental-reciclagem-icon.png"
import { ProfileButton } from "./profile-button"
import { OrganizationSwitcher } from "./organization-switcher"
import { ability, auth } from "@/auth/auth"
import { Separator } from "./ui/separator"
import { ThemeSwitcher } from "./theme/theme-switcher"

export default async function Header() {
    const { user } = await auth()    
    const permissions = await ability()

    return (
        <>
            <div className="mx-auto flex max-w-[1200px] items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* <Image 
                        src={ambientalIcon} 
                        alt="Ambiental Reciclagem Icon" 
                        className="size-6 dark:invert" 
                    />
                    <Slash className="size-3 -rotate-[24deg] text-border" /> */}

                    <OrganizationSwitcher />
                </div>


                <div className="flex items-center gap-4">
                    {/* <PendingInvites /> */}
                    <ThemeSwitcher />
                    <Separator orientation="vertical" className="h-5"/>
                    <ProfileButton />
                </div>
            </div>
            <div className="py-2">
                <Separator />
            </div>
        </>
    )
}
