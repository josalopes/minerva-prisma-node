import { FastifyInstance } from "fastify";
import { z } from "zod";

import { createAddressService } from "@/services/addresses/create-address";
import { updateAddressService } from "@/services/addresses/update-address";
import { getAddressesByOwner } from "@/services/addresses/get-addresses-by-owner";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { AddressType } from "@prisma/client";

export async function addressRoutes(app: FastifyInstance) {
  app.post("/addresses", async (request, reply) => {
    const bodySchema = z.object({
      ownerType: z.enum(["organization", "member"]),
      ownerId: z.string(),
      type: z.nativeEnum(AddressType).optional(),
      street: z.string().optional(),
      number: z.string().optional(),
      complement: z.string().optional(),
      district: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
    });

    const data = bodySchema.parse(request.body);

    const address = await createAddressService(data);

    return reply.status(201).send(address)
  });

  app.withTypeProvider<ZodTypeProvider>()
  .get("/addresses", async (request) => {
    const querySchema = z.object({
      ownerType: z.enum(["organization", "member"]),
      ownerId: z.string(),
    });

    const { ownerType, ownerId } = querySchema.parse(request.query);

    const addresses = await getAddressesByOwner(ownerType, ownerId);

    return { addresses };
  });

  // app.withTypeProvider<ZodTypeProvider>()
  // .put("/addresses/:id", async (request) => {
  //   const paramsSchema = z.object({
  //     id: z.coerce.number(),
  //   });

  //   const bodySchema = z.object({
  //     street: z.string().optional(),
  //     number: z.string().optional(),
  //     complement: z.string().optional(),
  //     district: z.string().optional(),
  //     city: z.string().optional(),
  //     state: z.string().optional(),
  //     zipCode: z.string().optional(),
  //   });

  //   const { id } = paramsSchema.parse(request.params);
  //   const data = bodySchema.parse(request.body);

  //   const address = await updateAddressService({
  //   //   addressId: id,
  //     id,
  //     ...data,
  //   });

  //   return { address };
  // });

  // app.delete("/addresses/:id", async (request) => {
  //   const paramsSchema = z.object({
  //     id: z.coerce.number(),
  //   });

  //   const { id } = paramsSchema.parse(request.params);

  //   await deleteAddress(id);

  //   return { success: true };
  // });
}