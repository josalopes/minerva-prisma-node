"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";

interface UserProfileFormProps {
    avatarUrl: string | null;
}

const profileSchema = z.object({
    avatarUrl: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfileForm({ avatarUrl }: UserProfileFormProps) {
    return useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            avatarUrl: avatarUrl || "",
        }
    });
}