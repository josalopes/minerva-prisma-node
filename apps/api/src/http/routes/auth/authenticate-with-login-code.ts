import { compare } from 'bcryptjs';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { prisma } from '@/lib/prisma';
import { BadRequestError } from '../-errors/bad-request-error';

export async function authenticateWithLoginCode(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
        '/sessions/code', 
        {
           schema: {
                tags: ['Auth'],
                summary: 'Autentica usuário com código e senha',
                body: z.object({
                    login: z.string(),
                    password: z.string(),
                }),
                response: {
                    400: z.object({
                        message: z.string(),
                    }),
                    201: z.object({
                        token: z.string(),
                        // organizationSlug: z.string().nullable()
                    })
                }
            }, 
        }, 
        async (request, reply) => {
            const { login, password } = request.body

            const userFromLoginCode = await prisma.user.findUnique({
                where: {
                login,
                },
            })

            if (!userFromLoginCode) {
                throw new BadRequestError('Login/senha inválido.')
            }

            if (userFromLoginCode.passwordHash === null) {
                throw new BadRequestError('Usuário não tenha uma senha, use o login social.')
            }

            const isPasswordValid = await compare(
                password,
                userFromLoginCode.passwordHash,
            )

            if (!isPasswordValid) {
                throw new BadRequestError('Login/senha inválido.')
            }

            const token = await reply.jwtSign(
                {
                    sub: userFromLoginCode.id,
                },
                {
                    sign: {
                        expiresIn: '7d',
                    },
                },
            )
            const member = await prisma.member.findFirst({
            where: {
                userId: userFromLoginCode.id,
                },
            })

            return reply.status(201).send({
                token,
            })
        },
    )
}