import { prisma } from "@/lib/prisma";

export async function gerarNextVal(seed: String) {
  const nextSeedUserLogin = (await prisma.$queryRaw`SELECT nextval(${seed})`) as Array<{ nextval: bigint }>
  const nextId = nextSeedUserLogin[0].nextval;
  return nextId
}