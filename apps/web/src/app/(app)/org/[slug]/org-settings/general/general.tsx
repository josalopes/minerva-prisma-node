import { ability, getCurrentOrg } from '@/auth/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { OrganizationForm } from '../../../organization-form'
import { ShutdownOrganization } from '../shutdown-organization-button'
import { getOrganizationBySlug } from '@/http/organizations/get-organization-by-slug'

export default async function GeneralSettings() {
  const slug = await getCurrentOrg()
  const permissions = await ability()

  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canShutdownOrganization = permissions?.can('delete', 'Organization')

  if (!slug) return

  const organization = await getOrganizationBySlug(slug)
  // const organizationData = await getOrganizationBySlug(slug)

  // const organization = {
  //   id: organizationData.id,
  //   name: organizationData.name,
  //   domain: organizationData.domain,
  //   slug: organizationData.slug,
  //   cpfCnpj: organizationData.cpfCnpj,
  //   personType: organizationData.personType,
  //   shouldAttachUserByDomain: organizationData.shouldAttachUserByDomain,
  // }

  return (
    <div className="space-y-4">
      <h1 className="font-bold] text-2xl">Configurações</h1>

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
                <OrganizationForm
                  isUpdating
                  initialData={{
                    id: organization.id,
                    name: organization.name,
                    slug: organization.slug,
                    cpfCnpj: organization.cpfCnpj,
                    personType: organization.personType,
                    domain: organization.domain,
                    shouldAttachUsersByDomain:
                      organization?.shouldAttachUserByDomain,
                  }}
                />
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
                Esta ação apagará todos os dados da organização, incluindo
                projetos, e não poderá ser desfeita
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
