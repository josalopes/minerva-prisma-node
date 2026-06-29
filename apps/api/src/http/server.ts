import {fastify} from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
    ZodTypeProvider
} from 'fastify-type-provider-zod'

import { env } from '@saas/env';
import { organizationMiddleware } from '@/http/middlewares/organization';

import { createAccount } from './routes/auth/create-account'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { authenticateWithLoginCode } from './routes/auth/authenticate-with-login-code'
import { getProfile } from './routes/auth/get-profile'
import { updateProfile } from './routes/auth/update-profile'
import { requestPasswordRecovery } from './routes/auth/request-password-recover'
import { resetPassword } from './routes/auth/reset-password'
import { changePassword } from './routes/auth/change-password'
import { authenticateWithGithub } from './routes/auth/authenticate-with-github'

import { createOrganization } from './routes/orgs/create-organization'
import { getMembership } from '@/http/routes/orgs/get-membership'
import { getOrganization } from './routes/orgs/get-organization'
import { getOrganizationBySlug } from './routes/orgs/get-organization-by-slug'
import { getOrganizations } from './routes/orgs/get-organizations'
import { updateOrganization } from './routes/orgs/update-organization'
import { updateOrganizationAvatar } from './routes/orgs/update-organization-avatar'
import { updateOrganizationLogo } from './routes/orgs/update-organization-logo'
import { shutdownOrganization } from './routes/orgs/shutdown-organization'
import { transferOrganization } from './routes/orgs/transfer-organization'

import { createAddress } from './routes/addresses/create-address'
import { updateAddress } from './routes/addresses/update-address'
import { getAddresses } from './routes/addresses/get-address'
import { deleteAddress } from './routes/addresses/delete-address'
import { setPrimary } from './routes/addresses/set-primary'

import { createCustomer } from './routes/customers/create-customer'

import { getCnpjCache } from './routes/cnpj/get-cnpj-cache'
import { createCnpjCache } from './routes/cnpj/create-cnpj-cache'

import { createProject } from './routes/projects/create-project'
import { deleteProject } from './routes/projects/delete-project'
import { getProject } from './routes/projects/get-project'
import { getProjects } from './routes/projects/get-projects'
import { updateProject } from './routes/projects/update-project'

import { createProduct } from './routes/products/create-product'
import { updateProduct } from './routes/products/update-product'
import { getProduct } from './routes/products/get-product'
import { getProducts } from './routes/products/get-products'
import { deleteProduct } from './routes/products/delete-product'
import { enableProduct } from './routes/products/enable-product'
import { updateProductStock } from './routes/products/update-stock'

import { getMembers } from './routes/members/get-members'
import { getMember } from './routes/members/get-member'
import { updateMember } from './routes/members/update-member'
import { removeMember } from './routes/members/remove-member'

import { createInvite } from './routes/invites/create-invite'
import { getInvite } from './routes/invites/get-invite'
import { getInvites } from './routes/invites/get-invites'
import { acceptInvite } from './routes/invites/accept-invite'
import { rejectInvite } from './routes/invites/reject-invite'
import { revokeInvite } from './routes/invites/revoke-invite'
import { getPendingInvites } from './routes/invites/get-pending-invites'
import { getOrganizationBilling } from './routes/billing/get-organization-billing'
import { errorHandler } from './error-handler'

import { createTransaction } from './routes/transactions/create-transaction'
import { cancelTransaction } from './routes/transactions/cancel-transaction'


const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Next.js Saas',
            description: 'Full-stack Saas with multi-tenant & RBAC',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    transform: jsonSchemaTransform
})

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
})

app.register(fastifyJwt, {
    secret: env.JWT_SECRET
})

app.register(fastifyCors, {
  origin: env.NEXT_PUBLIC_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
})

app.register(organizationMiddleware);

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(authenticateWithLoginCode)
app.register(authenticateWithGithub)
app.register(getProfile)
app.register(updateProfile)
app.register(requestPasswordRecovery)
app.register(resetPassword)
app.register(changePassword)

app.register(createOrganization)
app.register(getMembership)
app.register(getOrganization)
app.register(getOrganizationBySlug)
app.register(getOrganizations)
app.register(updateOrganization)
app.register(updateOrganizationAvatar)
app.register(updateOrganizationLogo)
app.register(shutdownOrganization)
app.register(transferOrganization)

app.register(createAddress)
app.register(updateAddress)
app.register(getAddresses)
app.register(deleteAddress)
app.register(setPrimary)

app.register(createCustomer)

app.register(getCnpjCache)
app.register(createCnpjCache)

app.register(createProject)
app.register(deleteProject)
app.register(getProject)
app.register(getProjects)
app.register(updateProject)

app.register(createProduct)
app.register(updateProduct)
app.register(getProduct)
app.register(getProducts)
app.register(deleteProduct)
app.register(enableProduct)
app.register(updateProductStock)

app.register(getMembers)
app.register(getMember)
app.register(updateMember)
app.register(removeMember)

app.register(createInvite)
app.register(getInvite)
app.register(getInvites)
app.register(acceptInvite)
app.register(rejectInvite)
app.register(revokeInvite)
app.register(getPendingInvites)
app.register(getOrganizationBilling)

app.register(createTransaction)
app.register(cancelTransaction)

app.listen({ port: env.PORT, host:'0.0.0.0'}).then(() => {
    console.log('HTTP server running!')
})



