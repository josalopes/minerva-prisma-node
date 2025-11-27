// ---- cpfUtils.ts ----

/**
 * Valida um CPF brasileiro.
 */
export function validarCPF(cpf: string): boolean {
  if (!cpf) return false;

  const cleanCPF = cpf.replace(/\D/g, "");

  if (cleanCPF.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  const calcularDigito = (base: string, fatorInicial: number): number => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += parseInt(base[i], 10) * (fatorInicial - i);
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const digito1 = calcularDigito(cleanCPF.slice(0, 9), 10);
  const digito2 = calcularDigito(cleanCPF.slice(0, 10), 11);

  return (
    digito1 === parseInt(cleanCPF[9], 10) &&
    digito2 === parseInt(cleanCPF[10], 10)
  );
}

/**
 * Aplica máscara de CPF no padrão 000.000.000-00
 */
export function maskCPF(value: string): string {
  const numbers = value.replace(/\D/g, "");

  let masked = numbers;

  if (numbers.length > 3) {
    masked = numbers.slice(0, 3) + "." + numbers.slice(3);
  }
  if (numbers.length > 6) {
    masked = masked.slice(0, 7) + "." + numbers.slice(6);
  }
  if (numbers.length > 9) {
    masked = masked.slice(0, 11) + "-" + numbers.slice(9);
  }

  return masked.slice(0, 14);
}
