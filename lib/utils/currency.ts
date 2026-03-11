/**
 * Currency formatting and conversion utilities
 */

export const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  VES: { symbol: 'Bs.', name: 'Venezuelan Bolívar' },
  ARS: { symbol: '$', name: 'Argentine Peso' },
  MXN: { symbol: '$', name: 'Mexican Peso' },
  BRL: { symbol: 'R$', name: 'Brazilian Real' },
  COP: { symbol: '$', name: 'Colombian Peso' },
  CLP: { symbol: '$', name: 'Chilean Peso' },
  PEN: { symbol: 'S/', name: 'Peruvian Sol' },
}

export type CurrencyCode = keyof typeof CURRENCIES

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'USD',
  locale: string = 'en-US'
): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return formatter.format(amount)
}

export function formatCurrencyCompact(
  amount: number,
  currency: CurrencyCode = 'USD'
): string {
  const currencySymbol = CURRENCIES[currency].symbol
  const absAmount = Math.abs(amount)

  if (absAmount >= 1_000_000) {
    return `${currencySymbol}${(amount / 1_000_000).toFixed(1)}M`
  } else if (absAmount >= 1_000) {
    return `${currencySymbol}${(amount / 1_000).toFixed(1)}K`
  }
  return `${currencySymbol}${amount.toFixed(2)}`
}

export function getCurrencySymbol(currency: CurrencyCode): string {
  return CURRENCIES[currency].symbol
}

export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
  rate: number
): number {
  return amount * rate
}

export function calculateNetWorth(
  accounts: Array<{ balance: number; currency: string }>,
  exchangeRates: Record<string, number>,
  baseCurrency: CurrencyCode = 'USD'
): number {
  return accounts.reduce((total, account) => {
    const rate = exchangeRates[`${account.currency}/${baseCurrency}`] || 1
    return total + (account.balance * rate)
  }, 0)
}
