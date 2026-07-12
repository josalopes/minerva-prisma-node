import { CreateOrganizationForm } from '@/components/forms/create-organization/create-organization-form'

export default async function OnBoardingPage() {
  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col">
        <CreateOrganizationForm />
      </div>
    </>
  )
}
