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
    Feather,
    ChevronDown
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
    CollapsibleContent,
    CollapsibleTrigger
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

    const [openOperation, setOpenOperation] = useState(false)
    const [openPerson, setOpenPerson] = useState(false)
    const [openAdministration, setOpenAdministration] = useState(false)
    
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

    function handleMember() {
        if (!currentOrg) {
            return
        }

        // startTransition(() => {
        //     router.push(`/org/${currentOrg.slug}/members`)
        // })
    }

    function handleProduct() {
        if (!currentOrg) {
            return
        }

        startTransition(() => {
            router.push(`/org/${currentOrg.slug}/products`)
        })
    }    
    
    function handleStorage() {
        if (!currentOrg) {
            return
        }

        // startTransition(() => {
        //     router.push(`/org/${currentOrg.slug}/settings`)
        // })
    }
    
    function handleAddress() {
        if (!currentOrg) {
            return
        }

        startTransition(() => {
            router.push(`/org/${currentOrg.slug}/address`)
        })
    }
    
    function handleTransaction() {
        if (!currentOrg) {
            return
        }

        startTransition(() => {
            router.push(`/org/${currentOrg.slug}/transactions`)
        })
    }
    
    function handleCustomer() {
        if (!currentOrg) {
            return
        }

        // startTransition(() => {
        //     router.push(`/org/${currentOrg.slug}/transactions`)
        // })
    }
    
    function handleSchedule() {
        if (!currentOrg) {
            return
        }

        // startTransition(() => {
        //     router.push(`/org/${currentOrg.slug}/transactions`)
        // })
    }
    
    function handleOrganization() {
        if (!currentOrg) {
            return
        }

        // startTransition(() => {
        //     router.push(`/org/${currentOrg.slug}/transactions`)
        // })
    }
    
    function handleSupplier() {
        if (!currentOrg) {
            return
        }

        // startTransition(() => {
        //     router.push(`/org/${currentOrg.slug}/transactions`)
        // })
    }

    return (
        <div className="flex h-screen w-full">
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

                <Collapsible 
                  open={openOperation} 
                  onOpenChange={setOpenOperation}
                >
                  <CollapsibleTrigger
                    className="
                      flex
                      items-center
                      justify-between
                      w-full
                      px-2
                      py-2
                      rounded-md
                      hover:bg-accent
                    "
                  >
                    <span>Operação</span>

                    {
                      openOperation
                        ? <ChevronDown className="w-4 h-4" />
                        : <ChevronRight className="w-4 h-4" />
                    }
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarActionButton
                        icon={<Warehouse className="w-6 h-6" />}
                        label="Transações"
                        isCollapsed={isCollapsed}
                        onClick={handleTransaction}
                    />
                    
                    <SidebarActionButton
                        icon={<Warehouse className="w-6 h-6" />}
                        label="Produtos"
                        isCollapsed={isCollapsed}
                        onClick={handleProduct}
                    />

                    <SidebarActionButton
                        icon={<CalendarCheck2 className="w-6 h-6" />}
                        label="Estoque"
                        isCollapsed={isCollapsed}
                        onClick={handleStorage}
                    />
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible 
                  open={openPerson} 
                  onOpenChange={setOpenPerson}
                >
                  <CollapsibleTrigger
                    className="
                      flex
                      items-center
                      justify-between
                      w-full
                      px-2
                      py-2
                      rounded-md
                      hover:bg-accent
                    "
                  >
                    <span>Pessoas</span>

                    {
                      openPerson
                        ? <ChevronDown className="w-4 h-4" />
                        : <ChevronRight className="w-4 h-4" />
                    }
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarActionButton
                        icon={<Warehouse className="w-6 h-6" />}
                        label="Clientes"
                        isCollapsed={isCollapsed}
                        onClick={handleCustomer}
                    />
                    
                    <SidebarActionButton
                        icon={<Warehouse className="w-6 h-6" />}
                        label="Fornecedores"
                        isCollapsed={isCollapsed}
                        onClick={handleSupplier}
                    />

                    <SidebarActionButton
                        icon={<CalendarCheck2 className="w-6 h-6" />}
                        label="Membros"
                        isCollapsed={isCollapsed}
                        onClick={handleMember}
                    />
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible 
                  open={openAdministration} 
                  onOpenChange={setOpenAdministration}
                >
                  <CollapsibleTrigger
                    className="
                      flex
                      items-center
                      justify-between
                      w-full
                      px-2
                      py-2
                      rounded-md
                      hover:bg-accent
                    "
                  >
                    <span>Administração</span>

                    {
                      openAdministration
                        ? <ChevronDown className="w-4 h-4" />
                        : <ChevronRight className="w-4 h-4" />
                    }
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarActionButton
                        icon={<Warehouse className="w-6 h-6" />}
                        label="Organização"
                        isCollapsed={isCollapsed}
                        onClick={handleOrganization}
                    />
                    
                    <SidebarActionButton
                        icon={<Warehouse className="w-6 h-6" />}
                        label="Planos"
                        isCollapsed={isCollapsed}
                        onClick={handleSchedule}
                    />
                  </CollapsibleContent>
                </Collapsible>
            </aside>

            <div className={clsx("flex flex-1 flex-col min-h-0 transition-all duration-300", {
                "md:ml-20": isCollapsed,
                "md:ml-64": !isCollapsed
            })}>

            <main className="flex-1 min-h-0 overflow-y-auto py-4 px-2 md:p-6">
                {children}
            </main>
        </div>
      </div>
    )
}