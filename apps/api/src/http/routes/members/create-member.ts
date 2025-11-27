import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { auth } from "@/http/middlewares/auth";
import { createSlug } from "@/utils/create-slug";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { roleSchema } from "@saas/auth";
import { BadRequestError } from "../-errors/bad-request-error";
import { gerarNextVal } from "@/utils/generate-next-sequence";

export async function createMember(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .post('/organization/:slug/member', {
        schema: {
            tags: ['Projects'],
            summary: 'Cria um novo membro dentro de uma organização e vincula a um usuário',
            body: z.object({
                name: z.string(),
                email: z.string(),
                role: roleSchema,
            }),
            params: z.object({
                slug: z.string()
            }),
            response: {
                400: z.object({
                        message: z.string(),
                    }),
                401: z.object({
                        message: z.string(),
                    }),
                200: z.object({
                        createdUser: z.object({
                            name: z.string().nullable(),
                            email: z.email(),
                            login: z.string(),
                            role: roleSchema,
                        })
                    }),    
            }
        },
      }, 
      async (request, reply) => {
        const { slug } = request.params
        const { name, email, role } = request.body
        const currentUserId = await request.getCurrentUserid()
        const { organization, membership } = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(currentUserId, membership.role)
        
        if (cannot('create', 'Project')) {
            return reply.status(401).send({ message: 'Você não tem permissão para criar projetos' })
        }  
        

        if (!organization) {
            return reply.status(400).send({ message: 'Organização inexistente' })
        }

        const geradorLoginUsuario = await prisma.seedUserLogin.findFirst({
            where: {
                id: 1,
            }
        })

        const nextValUserLogin = geradorLoginUsuario?.nextValLogin ?? 10000

        const login = (await gerarNextVal('seed_login') + BigInt(nextValUserLogin)).toString()

        const userWithSameEmail = await prisma.user.findUnique({
            where: {
                email
            },
        })

        if (userWithSameEmail) {
            throw new BadRequestError('Este e-mail já está em uso')
        }
        
        
        const passwordHash = await hash(login, 6)
        
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                login,
            },
        })
        
        const createdUser = {
            name: newUser.name,
            email: newUser.email,
            login: newUser.login,
            role,
        }

        const member = await prisma.member.create({
            data: {
                email,
                role,
                organizationId: organization.id,
                userId: newUser.id,
            },
        })  

        return reply.status(200).send({ createdUser })
      })
}