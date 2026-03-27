import { CreateOrganizationForm } from "@/components/forms/create-organization/create-organization-form";
import Header from "@/components/header";
import { redirect } from "next/navigation";

export default async function CreateProject() {
    return (
        <div className="space-y-4">
            <Header />
            {/* <main className="mx-auto w-full max-w-[1200px] space-y-4"> */}
                <h1 className="text-2xl font-bold">Onboarding da Organização</h1>    
            
                <CreateOrganizationForm />
            {/* </main> */}
        </div>
    )
}
