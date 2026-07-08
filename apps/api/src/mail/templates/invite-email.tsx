import {
  Button,
  Heading,
  Hr,
  Section,
  Text,
} from "@react-email/components"

import { EmailLayout } from "../components/email-layout"

export interface InviteEmailProps {
  organization: string
  invitedBy: string
  role: string
  url: string
  expiresIn: number
}

export function InviteEmail({
  organization,
  invitedBy,
  role,
  url,
  expiresIn,
}: InviteEmailProps) {
  return (
    <EmailLayout
      preview={`Você foi convidado para participar da organização ${organization}`}
    >
      <Heading
        style={{
          fontSize: 28,
          marginBottom: 24,
        }}
      >
        Você foi convidado 🎉
      </Heading>

      <Text
        style={{
          fontSize: 16,
          lineHeight: 1.6,
        }}
      >
        Olá,
      </Text>

      <Text
        style={{
          fontSize: 16,
          lineHeight: 1.6,
        }}
      >
        <strong>{invitedBy}</strong> convidou você para participar da
        organização <strong>{organization}</strong>.
      </Text>

      <Section
        style={{
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
          borderRadius: 8,
          padding: 20,
          margin: "24px 0",
        }}
      >
        <Text
          style={{
            margin: 0,
            color: "#64748B",
            fontSize: 14,
          }}
        >
          Perfil atribuído
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          {role}
        </Text>
      </Section>

      <Section
        style={{
          textAlign: "center",
          margin: "32px 0",
        }}
      >
        <Button
          href={url}
          style={{
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
            borderRadius: 8,
            padding: "14px 28px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Aceitar convite
        </Button>
      </Section>

      <Hr />

      <Text
        style={{
          color: "#64748B",
          fontSize: 14,
          lineHeight: 1.5,
        }}
      >
        Este convite permanecerá válido por{" "}
        <strong>{expiresIn} dias</strong>.
      </Text>

      <Text
        style={{
          color: "#64748B",
          fontSize: 14,
          lineHeight: 1.5,
        }}
      >
        Caso o botão acima não funcione, copie e cole o endereço abaixo
        em seu navegador:
      </Text>

      <Text
        style={{
          fontSize: 13,
          color: "#2563EB",
          wordBreak: "break-all",
        }}
      >
        {url}
      </Text>

      <Hr />

      <Text
        style={{
          color: "#94A3B8",
          fontSize: 12,
          textAlign: "center",
        }}
      >
        Minerva © {new Date().getFullYear()}
      </Text>
    </EmailLayout>
  )
}
