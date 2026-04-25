import { cnpjSchema } from './cnpj.schema';
import { prisma } from "@/lib/prisma"
import { mapBrasilApi, mapReceitaWS } from "./cnpj.mapper"
import { CnpjData } from "./cnpj.types"

export async function getCnpjData(cnpj: string): Promise<CnpjData> {
  // 🔥 1. cache
  const cached = await prisma.cnpjCache.findUnique({
    where: { cnpj }
  })

  console.log('cache:', cached)

  if (cached) {
    return cnpjSchema.parse(cached.data)
  }

  // 🔥 2. BrasilAPI
  try {
    const res = await fetch(
      `https://www.receitaws.com.br/v1/cnpj/${cnpj}`
    )
    
    // const res = await fetch(
    //   `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`,
    //   {
    //     headers: {
    //       "User-Agent": "Mozilla/5.0",
    //       Accept: "application/json"
    //     }
    //   }
    // )

    if (!res.ok) throw new Error()

    const raw = await res.json()

    const mapped = mapReceitaWS(raw)
    
    // const mapped = mapBrasilApi(raw)

    await prisma.cnpjCache.upsert({
      where: { cnpj },
      update: { data: mapped },
      create: { cnpj, data: mapped }
    })

    return mapped

  } catch {
    // 🔥 fallback
    const res = await fetch(
      `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json"
        }
      }
    )

    // const res = await fetch(
    //   `https://www.receitaws.com.br/v1/cnpj/${cnpj}`
    // )

    if (!res.ok) throw new Error()

    const raw = await res.json()

    // const mapped = mapReceitaWS(raw)
    const mapped = mapBrasilApi(raw)

    await prisma.cnpjCache.upsert({
      where: { cnpj },
      update: { data: mapped },
      create: { cnpj, data: mapped }
    })

    return mapped
  }
}