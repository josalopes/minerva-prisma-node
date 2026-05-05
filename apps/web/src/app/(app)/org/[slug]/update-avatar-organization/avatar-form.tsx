// "use client";

// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod";

// interface UserAvatarOrganizationFormProps {
//     avatarUrl: string | null;
// }

// const organizationSchema = z.object({
//     avatarUrl: z.string().optional(),
// });

// export type AvatarOrganizationFormData = z.infer<typeof organizationSchema>;

// export function useAvatarOrganizationForm({ avatarUrl }: UserAvatarOrganizationFormProps) {
//     return useForm<AvatarOrganizationFormData>({
//         resolver: zodResolver(organizationSchema),
//         defaultValues: {
//             avatarUrl: avatarUrl || "",
//         }
//     });
// }