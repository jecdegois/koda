'use client'

import { useMonedas } from './useMonedas'
import { useEffect, useState } from 'react'

export interface CurrencyConversion {
  baseCurrency: any | null
  isLoading: boolean
  error: Error | null
  convertToBase: (amount: number, fromCurrencyId: string) => number
  convertFromBase: (amount: number, toCurrencyId: string) => number
  getBaseCurrencyId: () => string | null
}

export function useCurrencyConversion(): CurrencyConversion {
  const { monedas, isLoading: monedasLoading, error: monedasError } = useMonedas()
  const [baseCurrency, setBaseCurrency] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Load base currency from monedas directly
  useEffect(() => {
    if (monedasError) {
      setError(monedasError)
      setIsLoading(false)
      return
    }

    if (monedasLoading) {
      setIsLoading(true)
      return
    }

    try {
      if (monedas && monedas.length > 0) {
        // Find the moneda marked as base, or fallback to the first one
        const base = monedas.find((m) => m.is_base) || monedas[0]
        setBaseCurrency(base || null)
      } else {
        setBaseCurrency(null)
      }
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }, [monedas, monedasLoading, monedasError])

  const convertToBase = (amount: number, fromCurrencyId: string): number => {
    if (!baseCurrency) return amount
    // Already in base currency — no conversion needed
    if (fromCurrencyId === baseCurrency.id) return amount

    const fromCurrency = monedas?.find((m) => m.id === fromCurrencyId)
    if (!fromCurrency) return amount

    // precio = how many base units equal 1 unit of this currency
    // e.g. precio=500 means 1 USD = 500 BS → amount * 500
    return amount * fromCurrency.precio
  }

  const convertFromBase = (amount: number, toCurrencyId: string): number => {
    if (!baseCurrency) return amount
    // Already in the target currency — no conversion needed
    if (toCurrencyId === baseCurrency.id) return amount

    const toCurrency = monedas?.find((m) => m.id === toCurrencyId)
    if (!toCurrency || toCurrency.precio === 0) return amount

    // Reverse: amount in base / exchange rate → amount in target
    // e.g. 500 BS / 500 = 1 USD
    return amount / toCurrency.precio
  }

  const getBaseCurrencyId = (): string | null => {
    return baseCurrency?.id || null
  }

  return {
    baseCurrency,
    isLoading,
    error,
    convertToBase,
    convertFromBase,
    getBaseCurrencyId,
  }
}

