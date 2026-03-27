"use client"

import { LogoOrganizationFormData, useLogoOrganizationForm } from "./logo-form";
import { Button } from "@/components/ui/button";
import { updateOrganizationLogo } from "@/http/organizations/update-organization-logo";
import { LogoOrganization } from "./organization-logo";

import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";

import { Form } from "@/components/ui/form";
import router from "next/router";
import { Separator } from "@/components/ui/separator";

interface OrganizationLogoContentProps {
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

export default function OrganizationLogoForm({ organization, user }: OrganizationLogoContentProps) {
    const form = useLogoOrganizationForm({
        logoUrl: organization.logoUrl
    });

    async function onSubmit(values: LogoOrganizationFormData) {
        const response = await updateOrganizationLogo({
            logoUrl: values.logoUrl,
            slug: organization.slug
        });
    }

    return (
        <div className="mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Logo</CardTitle>
                        </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex justify-center">
                                    {/* <div className="bg-gray-200 relative w-48"> */}
                                    <div className="bg-gray-200 relative h-40 w-40 rounded-full overflow-hidden">
                                        <LogoOrganization 
                                            organizationId={organization.id} 
                                            logoUrl={organization.logoUrl} 
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

