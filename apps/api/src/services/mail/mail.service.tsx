import { resend } from '@/lib/resend'

import { InviteEmail } from '@/mail/templates/invite-email'
import { env } from '@saas/env'

import { createLogger } from '@/lib/logger'

export interface SendInviteMailInput {
  to: string
  organization: string
  invitedBy: string
  role: string
  token: string
}

export class MailService {
  async sendInvite({
    to,
    organization,
    invitedBy,
    role,
    token,
  }: SendInviteMailInput) {
    const logger = createLogger('mail')

    const url = `${env.NEXT_PUBLIC_URL}/invite/${token}`

    const result = await resend.emails.send({
      from: process.env.MAIL_FROM!,
      to,
      subject: `Convite para participar da organização ${organization}`,

      react: (
        <InviteEmail
          organization={organization}
          invitedBy={invitedBy}
          role={role}
          url={url}
          expiresIn={7}
        />
      ),
    })

    if (result.error) {
      logger.error(
        {
          error: result.error,
          to,
        },
        'Failed to send invite email',
      )

      throw new Error(result.error.message)
    }

    logger.info(
      {
        resendId: result.data?.id,
        to,
        organization,
      },
      'Invite email sent',
    )
  }
}

export const mailService = new MailService()
