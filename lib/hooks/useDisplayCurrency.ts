'use client'

import { useState } from 'react'

export function useDisplayCurrency() {
  const [displayCurrencyId, setDisplayCurrencyId] = useState<string | null>(null)

  return {
    displayCurrencyId,
    setDisplayCurrencyId,
  }
}
