import { hash } from 'bcryptjs'
import { faker } from '@faker-js/faker'

import { PrismaClient } from '@prisma/client'
import { gerarNextVal } from '../src/utils/generate-next-sequence'

const prisma = new PrismaClient()

async function seed() {
    await prisma.project.deleteMany()
    await prisma.invite.deleteMany()
    await prisma.member.deleteMany()
    await prisma.organization.deleteMany()
    await prisma.user.deleteMany()

    const passwordHash = await hash('123456', 1)

     const geradorLoginUsuario = await prisma.seedUserLogin.findFirst({
    where: {
      id: 1,
    }
  })

  const nextValUserLogin = geradorLoginUsuario?.nextValLogin ?? 10000

  const geradorCodigoEmpresa = await prisma.seedOrganization.findFirst({
    where: {
      id: 1,
    }
  })

  const nextValOrg = geradorCodigoEmpresa?.nextValOrg ?? 100000

    const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@acme.com',
      login: (await gerarNextVal('seed_login') + BigInt(nextValUserLogin)).toString(),
      avatarUrl: 'https://github.com/diego3g.png',
      passwordHash,
    },
  })

  const anotherUser = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      login: (await gerarNextVal('seed_login') + BigInt(nextValUserLogin)).toString(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  const anotherUser2 = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      login: (await gerarNextVal('seed_login') + BigInt(nextValUserLogin)).toString(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

    await prisma.organization.create({
        data: {
            name: 'Acme Inc (Admin)',
            domain: 'acme.com',
            slug: 'acme-domain',
            loginCode: (await gerarNextVal('seed_org') + BigInt(nextValOrg)).toString(),
            avatarUrl: faker.image.avatarGitHub(),
            shouldAttachUserByDomain: true,
            ownerId: user.id,
            projects: {
                createMany: {
                data: [
                    {
                    name: faker.lorem.words(5),
                    slug: faker.lorem.slug(5),
                    description: faker.lorem.paragraph(),
                    avatarUrl: faker.image.avatarGitHub(),
                    ownerId: faker.helpers.arrayElement([
                        user.id,
                        anotherUser.id,
                        anotherUser2.id,
                    ]),
                    },
                    {
                    name: faker.lorem.words(5),
                    slug: faker.lorem.slug(5),
                    description: faker.lorem.paragraph(),
                    avatarUrl: faker.image.avatarGitHub(),
                    ownerId: faker.helpers.arrayElement([
                        user.id,
                        anotherUser.id,
                        anotherUser2.id,
                    ]),
                    },
                    {
                    name: faker.lorem.words(5),
                    slug: faker.lorem.slug(5),
                    description: faker.lorem.paragraph(),
                    avatarUrl: faker.image.avatarGitHub(),
                    ownerId: faker.helpers.arrayElement([
                        user.id,
                        anotherUser.id,
                        anotherUser2.id,
                    ]),
                    },
                ],
                },
            },
            members: {
                createMany: {
                    data: [
                        {
                            userId: user.id,
                            role: 'ADMIN',
                        },
                        {
                            userId: anotherUser.id,
                            role: 'MEMBER',
                        },
                        {
                            userId: anotherUser2.id,
                            role: 'MEMBER',
                        },

                    ]
                }
            }

        }
    })

    await prisma.organization.create({
    data: {
      name: 'Acme Inc (Member)',
      slug: 'acme-member',
      loginCode: (await gerarNextVal('seed_org') + BigInt(nextValOrg)).toString(),
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id,
                anotherUser2.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'MEMBER',
            },
            {
              userId: anotherUser.id,
              role: 'ADMIN',
            },
            {
              userId: anotherUser2.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })

    
}

seed().then(() => {
    console.log('Database seeded!')
})