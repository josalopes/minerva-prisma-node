import { CnpjData } from "./cnpj.types"

export function mapBrasilApi(data: any): CnpjData {
  return {
    document: data.cnpj,
    name: data.razao_social,    
    tradeName: data.nome_fantasia ?? undefined,
    cnae: data.nome_fiscal_descricao ?? undefined,
    email: data.email ?? undefined,
    phone: data.telefone ?? undefined,

    address: {
      street: data.logradouro,
      number: data.numero,
      complement: data.complemento,
      district: data.bairro,
      city: data.municipio,
      state: data.uf,
      zipCode: data.cep
    }
  }
}

export function mapReceitaWS(data: any): CnpjData {
  return {
    document: data.cnpj,
    name: data.nome,
    tradeName: data.fantasia ?? undefined,
    cnae: data.atividade_principal[0].text ?? undefined,
    email: data.email ?? undefined,
    phone: data.telefone ?? undefined,

    address: {
      street: data.logradouro,
      number: data.numero,
      complement: data.complemento,
      district: data.bairro,
      city: data.municipio,
      state: data.uf,
      zipCode: data.cep
    }
  }
}