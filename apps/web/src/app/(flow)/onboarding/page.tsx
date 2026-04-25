import { auth } from "@/auth/auth";
import { CreateOrganizationForm } from "@/components/forms/create-organization/create-organization-form";
import TestScrollPage from "@/components/forms/create-organization/test-scroll-page";
import { FormFlowProvider } from "@/lib/form-flow-provider";
import { redirect } from "next/navigation";

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
