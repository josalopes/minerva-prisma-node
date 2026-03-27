"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation"
import clsx from "clsx";

import { 
    Banknote, 
    CalendarCheck2, 
    ChevronLeft, 
    ChevronRight, 
    Folder, 
    List, 
    Settings,
    UserPen,
    Users, Store,
    Warehouse,
    Feather
 } from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import {
    Collapsible,
    CollapsibleContent
} from "@/components/ui/collapsible"

import { Button } from "@/components/ui/button";

import logoImg from "../../../../../public/logo-ambiental-reciclagem.png"
import { useOrganization } from "@/hooks/use-organization";
import { SidebarActionButton } from "./sidebar-action-button";
import { SidebarNavLink } from "./sidebar-nav-link";

export function SidebarDashboardClient({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { currentOrg } = useOrganization()
    const [isPending, startTransition] = useTransition()
    const logoUrl = currentOrg.logoUrl
    
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    function handleOrganizationAvatar() {
        if (!currentOrg) {
            return
        }

        startTransition(() => {
            router.push(`/org/${currentOrg.slug}/update-avatar-organization`)
        })
    }
    
    function handleOrganizationLogo() {
        if (!currentOrg) {
            return
        }

        startTransition(() => {
            router.push(`/org/${currentOrg.slug}/update-logo-organization`)
        })
    }

    function handleMembers() {
        if (!currentOrg) {
            return
        }

        startTransition(() => {
            router.push(`/org/${currentOrg.slug}/members`)
        })
    }

    function handleProduct() {
        if (!currentOrg) {
            return
        }

        startTransition(() => {
            router.push(`/org/${currentOrg.slug}/products`)
        })
    }    
    
    function handleConfiguration() {
        if (!currentOrg) {
            return
        }

        startTransition(() => {
            router.push(`/org/${currentOrg.slug}/settings`)
        })
    }
    
    function handleAddress() {
        if (!currentOrg) {
            return
        }

        startTransition(() => {
            router.push(`/org/${currentOrg.slug}/address`)
        })
    }
    
    function handleOnboarding() {
        if (!currentOrg) {
            return
        }

        startTransition(() => {
            router.push(`/onboarding`)
        })
    }

    return (
        <div className="flex min-h-screen w-full">
            <aside
              className={clsx("flex flex-col border-r bg-background transition-all duration-300 p-4 h-full", {
                "w-20": isCollapsed,
                "w-64": !isCollapsed,
                "hidden md:flex md:fixed": true
                })}
            >
                <div className="mb-6 mt-4">
                    {!isCollapsed && (
                        <Image 
                          src={logoUrl || logoImg} 
                          alt="Logo da organização" 
                          width={0}
                          height={0}
                          sizes="100vw"
                          priority
                          quality={100}
                          className="w-40 h-auto"
                        />
                    )}
                </div>

                <Button
                   className="bg-gray-100 hover:bg-gray-50 text-zinc-900 self-end mb-2"
                   onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {!isCollapsed ? <ChevronLeft className="w-12 h-12"/> : <ChevronRight className="w-12 h-12"/>}
                </Button>

                {isCollapsed && (
                    <nav className="flex flex-col gap-1 overflow-hidden mt-2">
                       <SidebarActionButton
                            icon={<UserPen className="w-6 h-6" />}
                            label="Avatar"
                            isCollapsed={isCollapsed}
                            onClick={handleOrganizationAvatar}
                        />

                        <SidebarActionButton
                            icon={<Feather className="w-6 h-6" />}
                            label="Logo"
                            isCollapsed={isCollapsed}
                            onClick={handleOrganizationLogo}
                        />

                        <SidebarActionButton
                            icon={<Users className="w-6 h-6" />}
                            label="Membros"
                            isCollapsed={isCollapsed}
                            onClick={handleMembers}
                        />

                        <SidebarActionButton
                            icon={<Warehouse className="w-6 h-6" />}
                            label="Produtos"
                            isCollapsed={isCollapsed}
                            onClick={handleProduct}
                        />

                        <SidebarActionButton
                            icon={<CalendarCheck2 className="w-6 h-6" />}
                            label="Organização"
                            isCollapsed={isCollapsed}
                            onClick={handleConfiguration}
                        />
                            
                        <SidebarNavLink 
                            href="/dashboard/profile"
                            label="Meu perfil"
                            pathname={pathname}
                            isCollapsed={isCollapsed}
                            icon={<Settings className="w-6 h-6" />}
                        />

                        <SidebarNavLink 
                            href="/dashboard/plans"
                            label="Planos"
                            pathname={pathname}
                            isCollapsed={isCollapsed}
                            icon={<Banknote className="w-6 h-6" />}
                        /> 
                    </nav>
                )}

                <Collapsible open={!isCollapsed}>
                  <CollapsibleContent>
                    <nav className="flex flex-col gap-1 overflow-hidden">
                        <span className="text-sm text-gray-400 font-medium mt-1 uppercase">
                            Organização
                        </span>
                        
                        <SidebarActionButton
                            icon={<UserPen className="w-6 h-6" />}
                            label="Avatar"
                            isCollapsed={isCollapsed}
                            onClick={handleOrganizationAvatar}
                        />

                        <SidebarActionButton
                            icon={<Feather className="w-6 h-6" />}
                            label="Logo"
                            isCollapsed={isCollapsed}
                            onClick={handleOrganizationLogo}
                        />

                        <SidebarActionButton
                            icon={<Users className="w-6 h-6" />}
                            label="Membros"
                            isCollapsed={isCollapsed}
                            onClick={handleMembers}
                        />

                        <SidebarActionButton
                            icon={<Warehouse className="w-6 h-6" />}
                            label="Produtos"
                            isCollapsed={isCollapsed}
                            onClick={handleProduct}
                        />

                        <span className="text-sm text-gray-400 font-medium mt-1 uppercase">
                            Configurações
                        </span>

                        <SidebarActionButton
                            icon={<Store className="w-6 h-6" />}
                            label="Organização"
                            isCollapsed={isCollapsed}
                            onClick={handleConfiguration}
                        />
                        
                        <SidebarActionButton
                            icon={<Store className="w-6 h-6" />}
                            label="Endereços"
                            isCollapsed={isCollapsed}
                            onClick={handleAddress}
                        />
                        
                        <SidebarActionButton
                            icon={<Store className="w-6 h-6" />}
                            label="On boarding"
                            isCollapsed={isCollapsed}
                            onClick={handleOnboarding}
                        />

                        <SidebarNavLink 
                            href="/dashboard/profile"
                            label="Meu perfil"
                            pathname={pathname}
                            isCollapsed={isCollapsed}
                            icon={<Settings className="w-6 h-6" />}
                        />

                        <SidebarNavLink 
                            href="/dashboard/plans"
                            label="Planos"
                            pathname={pathname}
                            isCollapsed={isCollapsed}
                            icon={<Banknote className="w-6 h-6" />}
                        />
                    </nav>
                  </CollapsibleContent>
                </Collapsible>
            </aside>

            <div className={clsx("flex flex-1 flex-col transition-all duration-300", {
                "md:ml-20": isCollapsed,
                "md:ml-64": !isCollapsed
            })}>

                <header className="md:hidden flex items-center justify-between border-b px-2 md:px-6 h-14 z-10 sticky top-0 bg-white">
                  <Sheet>
                    <div className="flex items-center gap-4">
                        <SheetTrigger asChild>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="md:hidden"
                                onClick={() => setIsCollapsed(false)}
                            >
                                <List className="w-5 h-5"/>
                            </Button>
                        </SheetTrigger>

                        <h1 className="text-base md:text-lg font-semibold">
                            Menu OdontoPRO
                        </h1>
                    </div>

                    <SheetContent side="right" className="sm:max-w-xs" text-black>
                        <SheetTitle>OdontoPRO</SheetTitle>  
                        <SheetDescription>Menu Administrativo</SheetDescription>

                        <nav className="grid gap-2 text-base pt-5">
                            <SidebarNavLink 
                              href="/dashboard"
                              label="Agendamentos"
                              pathname={pathname}
                              isCollapsed={isCollapsed}
                              icon={<CalendarCheck2 className="w-6 h-6" />}
                            />

                            <SidebarNavLink 
                              href="/dashboard/services"
                              label="Serviços"
                              pathname={pathname}
                              isCollapsed={isCollapsed}
                              icon={<Folder className="w-6 h-6" />}
                            />
                            
                            <SidebarNavLink 
                              href="/dashboard/profile"
                              label="Meu perfil"
                              pathname={pathname}
                              isCollapsed={isCollapsed}
                              icon={<Settings className="w-6 h-6" />}
                            />

                            <SidebarNavLink 
                              href="/dashboard/plans"
                              label="Planos"
                              pathname={pathname}
                              isCollapsed={isCollapsed}
                              icon={<Banknote className="w-6 h-6" />}
                            />
                        </nav>
                    </SheetContent> 
                  </Sheet> 
                </header>

                <main className="flex-1 py-4 px-2 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}