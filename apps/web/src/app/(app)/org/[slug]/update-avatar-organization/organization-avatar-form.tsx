"use client"

import { AvatarOrganizationFormData, useAvatarOrganizationForm } from "./avatar-form";
import { Button } from "@/components/ui/button";
import { updateOrganizationAvatar } from "@/http/organizations/update-organization-avatar";
import { AvatarOrganization } from "./organization-avatar";

import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";

import { Form } from "@/components/ui/form";
import router from "next/router";
import { Separator } from "@/components/ui/separator";

interface OrganizationAvatarContentProps {
    organization: {
        id: string;
        name: string;
        slug: string;
        avatarUrl: string | null;
        logoUrl: string | null;
    },
    user: {
        id: string;
        name: string | null;
        avatarUrl: string | null;
    }
}

export default function OrganizationAvatarForm({ organization, user }: OrganizationAvatarContentProps) {
    const form = useAvatarOrganizationForm({
        avatarUrl: organization.avatarUrl
    });

    async function onSubmit(values: AvatarOrganizationFormData) {
        const response = await updateOrganizationAvatar({
            avatarUrl: values.avatarUrl,
            slug: organization.slug
        });
    }

    return (
        <div className="mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Avatar</CardTitle>
                        </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex justify-center">
                                    <div className="bg-gray-200 relative h-40 w-40 rounded-full overflow-hidden">
                                        <AvatarOrganization 
                                            organizationId={organization.id} 
                                            avatarUrl={organization.avatarUrl} 
                                            slug={organization.slug} 
                                            userId={user.id} 
                                        />
                                    </div>
                                </div>

                                {/* <Separator />

                                <h1>Logo</h1>

                                <div className="flex justify-center">
                                    <div className="bg-gray-200 relative h-40 w-40 rounded-full overflow-hidden">
                                        <AvatarOrganization avatarUrl={organization.logoUrl} slug={organization.slug} />
                                    </div>
                                </div> */}

                                {/* <div className="space-y-4">
                                    <Button
                                      type="submit"
                                      className="w-full bg-emerald-500 hover:bg-emerald-400"
                                    >
                                      Salvar alteração  
                                    </Button>
                                </div> */}
                            </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    )
}

