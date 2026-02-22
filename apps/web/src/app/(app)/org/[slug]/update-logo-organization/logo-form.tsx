"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";

interface LogoOrganizationFormProps {
    logoUrl: string | null;
}

const organizationSchema = z.object({
    logoUrl: z.string().optional(),
});

export type LogoOrganizationFormData = z.infer<typeof organizationSchema>;

export function useLogoOrganizationForm({ logoUrl }: LogoOrganizationFormProps) {
    return useForm<LogoOrganizationFormData>({
        resolver: zodResolver(organizationSchema),
        defaultValues: {
            logoUrl: logoUrl || "",
        }
    });
}