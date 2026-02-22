export async function fetchCep(cep: string) {
  const cleanCep = cep.replace(/\D/g, '')

  if (cleanCep.length !== 8) return null

  const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)

  const data = await res.json()

  if (data.erro) return null

  return {
    street: data.logradouro,
    district: data.bairro,
    city: data.localidade,
    state: data.uf,
  }
}