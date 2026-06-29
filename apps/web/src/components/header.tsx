import Image from "next/image"
import { Slash } from "lucide-react"

import ambientalIcon from "@/assets/ambiental-reciclagem-icon.png"
import { ProfileButton } from "./profile-button"
import { OrganizationSwitcher } from "./organization-switcher"
import { ability, auth } from "@/auth/auth"
import { Separator } from "./ui/separator"
import { ThemeSwitcher } from "./theme/theme-switcher"
import { HeaderContainer } from "./header-container"

export default async function Header() {
    const { user } = await auth()    
    const permissions = await ability()
    
    return (
        <HeaderContainer>
            <div className="h-16 mx-auto flex max-w-[1200px] items-center justify-between">
                <div className="flex items-center gap-3">
                    <OrganizationSwitcher />
                </div>

                <div className="flex items-center gap-4">
                    {/* <PendingInvites /> */}
                    <ThemeSwitcher />
                    <Separator orientation="vertical" className="h-5"/>
                    <ProfileButton />
                </div>
            </div>
        </HeaderContainer>
    )
}
