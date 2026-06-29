import { ability, getCurrentOrg } from "@/auth/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OrganizationForm } from "../../../organization-form"
import { Divide } from "lucide-react"
import { ShutdownOrganization } from "../shutdown-organization-button"
import { getOrganization } from "@/http/organizations/get-organization"
import { getOrganizationBySlug } from "@/http/organizations/get-organization-by-slug"

export default async function GeneralSettings() {
    const currentOrg = await getCurrentOrg()
    const slug = await getCurrentOrg()
    const permissions = await ability()

    const canUpdateOrganization = permissions?.can('update', 'Organization')
    const canGetBilling = permissions?.can('get', 'Billing')
    const canShutdownOrganization = permissions?.can('delete', 'Organization')

    let organizationData = null
    let organization = null
  
    if (slug) {
      organizationData = (await getOrganizationBySlug(slug)).organization;
      organization = {
        id: organizationData.id,
        name: organizationData.name,
        domain: organizationData.domain,
        slug: organizationData.slug,
        cpfCnpj: organizationData.cpfCnpj,
        personType: organizationData.personType,
        shouldAttachUserByDomain: organizationData.shouldAttachUserByDomain,
      }
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold]">Configurações</h1>

            <div className="space-y-4">
                {canUpdateOrganization && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Configurações da organização</CardTitle>
                            <CardDescription>
                                Atualizar detalhes de sua organização
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {organization && (
                            <OrganizationForm isUpdating initialData={{
                                id: organization.id,
                                name: organization.name,
                                slug: organization.slug,
                                cpfCnpj: organization.cpfCnpj,
                                personType: organization.personType,
                                domain: organization.domain,
                                shouldAttachUsersByDomain: organization?.shouldAttachUserByDomain,
                            }}/>

                          )}
                        </CardContent>
                    </Card>
                )}
                
                {/* {canGetBilling && <Billing />} */}

                {canShutdownOrganization && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Excluir a organização</CardTitle>
                            <CardDescription>
                                Esta ação apagará todos os dados da organização, incluindo projetos, e não poderá ser desfeita
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ShutdownOrganization />
                        </CardContent>
                    </Card>
                )}

            </div>

        </div>
    )
}