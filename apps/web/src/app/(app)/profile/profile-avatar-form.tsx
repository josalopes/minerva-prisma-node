'use client'

import { ProfileFormData, useProfileForm } from './profile-form'
import { updateProfile } from '@/http/profile/update-profile'
import { AvatarProfile } from './profile-avatar'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Form } from '@/components/ui/form'

interface ProfileContentProps {
  user: {
    id: string
    name: string | null
    avatarUrl: string | null
  }
  slug: string | undefined
}

export default function ProfileContent({ user, slug }: ProfileContentProps) {
  const form = useProfileForm({
    avatarUrl: user.avatarUrl,
  })

  async function onSubmit(values: ProfileFormData) {
    await updateProfile({
      avatarUrl: values.avatarUrl,
    })
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
                <div className="relative h-40 w-40 overflow-hidden rounded-full bg-gray-200">
                  <AvatarProfile
                    avatarUrl={user.avatarUrl}
                    userId={user.id}
                    slug={slug}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
