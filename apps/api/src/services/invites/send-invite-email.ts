import { Resend } from "resend"

interface Props {
  email: string
  organizationName: string
  inviteUrl: string
}

export async function sendInviteEmail({
  email,
  organizationName,
  inviteUrl
}: Props) {
  const resend = new Resend('re_YK2A3RkM_QKjjg2oipML8PxBLJipu345i')

  await resend.emails.send({
    from: "convites@seudominio.com",

    to: email,

    subject:
      `Convite para ${organizationName}`,

    html: `
      <h2>Convite</h2>

      <p>
        Você foi convidado para
        ${organizationName}
      </p>

      <a href="${inviteUrl}">
        Aceitar convite
      </a>
    `
  })
}