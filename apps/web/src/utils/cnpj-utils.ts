// ---- cnpjUtils.ts ----

/**
 * Valida um CNPJ brasileiro.
 */
export function validarCNPJ(cnpj: string): boolean {
  if (!cnpj) return false;

  const clean = cnpj.replace(/\D/g, "");

  if (clean.length !== 14) return false;

  // Rejeita CNPJs com dígitos repetidos
  if (/^(\d)\1{13}$/.test(clean)) return false;

  const calcularDigito = (base: string, pesos: number[]): number => {
    const soma = base
      .split("")
      .reduce((acc, num, idx) => acc + parseInt(num, 10) * pesos[idx], 0);

    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  // Pesos oficiais do CNPJ
  const pesosPrimeiro = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesosSegundo  = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const base = clean.slice(0, 12);
  const digito1 = calcularDigito(base, pesosPrimeiro);
  const digito2 = calcularDigito(base + digito1, pesosSegundo);

  return (
    digito1 === parseInt(clean[12], 10) &&
    digito2 === parseInt(clean[13], 10)
  );
}

/**
 * Aplica máscara no padrão CNPJ: 00.000.000/0000-00
 */
export function maskCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, "");

  let masked = numbers;

  if (numbers.length > 2) {
    masked = numbers.slice(0, 2) + "." + numbers.slice(2);
  }
  if (numbers.length > 5) {
    masked = masked.slice(0, 6) + "." + numbers.slice(5);
  }
  if (numbers.length > 8) {
    masked = masked.slice(0, 10) + "/" + numbers.slice(8);
  }
  if (numbers.length > 12) {
    masked = masked.slice(0, 15) + "-" + numbers.slice(12);
  }

  return masked.slice(0, 18); // Máximo 00.000.000/0000-00
}
