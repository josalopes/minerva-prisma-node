import { ProfileButton } from './profile-button'
import { OrganizationSwitcher } from './organization-switcher'
import { Separator } from './ui/separator'
import { ThemeSwitcher } from './theme/theme-switcher'
import { HeaderContainer } from './header-container'

export default async function Header() {
  return (
    <HeaderContainer>
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between">
        <div className="flex items-center gap-3">
          <OrganizationSwitcher />
        </div>

        <div className="flex items-center gap-4">
          {/* <PendingInvites /> */}
          <ThemeSwitcher />
          <Separator orientation="vertical" className="h-5" />
          <ProfileButton />
        </div>
      </div>
    </HeaderContainer>
  )
}
