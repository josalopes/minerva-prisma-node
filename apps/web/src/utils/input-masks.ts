export const masks = {
  cep: (value: string) => {
    let v = value.replace(/\D/g, "")
    return v.replace(/^(\d{5})(\d)/, "$1-$2")
  },

  cpfCnpj: (value: string) => {
    const digits = value.replace(/\D/g, "")

    if (digits.length <= 11) {
      return digits
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    }

    return digits
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
  },

  phone: (value: string) => {
    let v = value.replace(/\D/g, "")
    return v
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
  }
}