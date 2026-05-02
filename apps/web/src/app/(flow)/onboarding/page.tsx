import { auth } from "@/auth/auth";
import { CreateOrganizationForm } from "@/components/forms/create-organization/create-organization-form";

export default async function OnBoardingPage() {
    const { user } = await auth()
    return (
      <>
        <div className="flex-1 min-h-0 flex flex-col">
          <CreateOrganizationForm />
        </div>
      </>
    )
}
