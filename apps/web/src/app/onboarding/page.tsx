import { auth } from "@/auth/auth";
import { CreateOrganizationForm } from "@/components/forms/create-organization/create-organization-form";
import Header from "@/components/header";
import { redirect } from "next/navigation";

export default async function CreateProject() {
    const { user } = await auth()
    return (
        <div className="space-y-4">
            <Header />
            <h1 className="text-2xl font-bold">Onboarding da Organização</h1>    
        
            <CreateOrganizationForm
                // id={user.id}
                // name={user.name ?? ""}
                // email={user.email}
                // login={user.login}
                // avatarUrl={user.avatarUrl}
            />
        </div>
    )
}
