export type AddressOwnerType = "organization" | "member" | "customer";

export interface CreateAddressInput {
  ownerType: AddressOwnerType;
  ownerId: string;
  type: string;
  isPrimary: boolean;
  street?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}