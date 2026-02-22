
/**
 * Converte um valor monetário em reais (BRL) para centavos
 * @param {string} amount  - o valor monetário em reais (BRL) a ser convertido
 * @returns {number} o valor convertido em centavos
 * @example
 * const realAmount = "1.350,00"
 * const centsAmount = convertRealToCents(realAmount)
 * console.log(centsAmount);  // 135000 cents
 */
export function ConvertRealToCents(amount: string): number {
    const numericPrice = parseFloat(amount.replace(/\./g, "").replace(",", "."));
    const priceInCents = Math.round(numericPrice * 100);

    return priceInCents;
}