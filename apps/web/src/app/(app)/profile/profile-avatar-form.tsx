"use client"

import { ProfileFormData, useProfileForm } from "./profile-form";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/http/update-profile";
import { AvatarProfile } from "./profile-avatar";

import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";

import { Form } from "@/components/ui/form";
import router from "next/router";

interface ProfileContentProps {
    user: {
        id: string;
        name: string | null;
        avatarUrl: string | null;
    },
    slug: string | undefined
}

export default function ProfileContent({ user, slug }: ProfileContentProps) {
    const form = useProfileForm({
        avatarUrl: user.avatarUrl
    });

    async function onSubmit(values: ProfileFormData) {
        const response = await updateProfile({
            avatarUrl: values.avatarUrl,
        });
    }

    return (
        <div className="mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Minha foto de perfil</CardTitle>
                        </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex justify-center">
                                    <div className="bg-gray-200 relative h-40 w-40 rounded-full overflow-hidden">
                                        <AvatarProfile avatarUrl={user.avatarUrl} userId={user.id} slug={slug} />
                                    </div>
                                </div>

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

