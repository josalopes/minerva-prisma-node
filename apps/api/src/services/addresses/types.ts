export type AddressOwnerType = "organization" | "member";

export interface CreateAddressInput {
  ownerType: AddressOwnerType;
  ownerId: string;
  type: string;
  
  street?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}