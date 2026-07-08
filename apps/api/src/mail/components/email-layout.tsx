import {
    Body,
    Container,
    Head,
    Html,
    Preview,
  } from "@react-email/components"
  
  import { ReactNode } from "react"
  
  type Props = {
    preview: string
    children: ReactNode
  }
  
  export function EmailLayout({
    preview,
    children,
  }: Props) {
  
    return (
      <Html>
        <Head />
        <Preview>
          {preview}
        </Preview>
  
        <Body
          style={{
            background: "#f6f6f6",
            fontFamily:
              "Arial, sans-serif",
          }}
        >
  
          <Container
            style={{
              maxWidth: 600,
              margin: "40px auto",
              background: "#fff",
              padding: 40,
              borderRadius: 8,
            }}
          >
  
            {children}
  
          </Container>
  
        </Body>
  
      </Html>
  
    )
  }