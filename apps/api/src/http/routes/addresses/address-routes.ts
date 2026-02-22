import { FastifyInstance } from "fastify";
import { z } from "zod";

import { createAddress } from "@/services/addresses/create-address";
import { updateAddress } from "@/services/addresses/update-address";
import { deleteAddress } from "@/services/addresses/delete-address";
import { getAddressesByOwner } from "@/services/addresses/get-addresses-by-owner";

export async function addressRoutes(app: FastifyInstance) {
  app.post("/addresses", async (request, reply) => {
    const bodySchema = z.object({
      ownerType: z.enum(["organization", "member"]),
      ownerId: z.string(),
      type: z.string(),
      street: z.string().optional(),
      number: z.string().optional(),
      complement: z.string().optional(),
      district: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
    });

    const data = bodySchema.parse(request.body);

    const address = await createAddress(data);

    return reply.status(201).send(address)
  });

  app.get("/addresses", async (request) => {
    const querySchema = z.object({
      ownerType: z.enum(["organization", "member"]),
      ownerId: z.string(),
    });

    const { ownerType, ownerId } = querySchema.parse(request.query);

    const addresses = await getAddressesByOwner(ownerType, ownerId);

    return { addresses };
  });

  app.put("/addresses/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    });

    const bodySchema = z.object({
      street: z.string().optional(),
      number: z.string().optional(),
      complement: z.string().optional(),
      district: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
    });

    const { id } = paramsSchema.parse(request.params);
    const data = bodySchema.parse(request.body);

    const address = await updateAddress({
    //   addressId: id,
      id,
      ...data,
    });

    return { address };
  });

  app.delete("/addresses/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    });

    const { id } = paramsSchema.parse(request.params);

    await deleteAddress(id);

    return { success: true };
  });
}