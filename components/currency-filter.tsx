'use client'

import { useMonedas } from '@/lib/hooks/useMonedas'
import { useCurrencyConversion } from '@/lib/hooks/useCurrencyConversion'
import { DollarSign } from 'lucide-react'

interface CurrencyFilterProps {
  selectedCurrencyId: string | null
  onCurrencyChange: (currencyId: string | null) => void
}

export function CurrencyFilter({
  selectedCurrencyId,
  onCurrencyChange,
}: CurrencyFilterProps) {
  const { monedas } = useMonedas()
  const { baseCurrency } = useCurrencyConversion()

  if (!baseCurrency || monedas.length === 0) return null

  const activeCurrencyId = selectedCurrencyId ?? baseCurrency.id

  return (
    <div className="flex items-center gap-3">
      <DollarSign className="w-4 h-4 text-muted-foreground shrink-0" />
      <span className="text-sm text-muted-foreground shrink-0">Ver en:</span>
      <div className="flex flex-wrap gap-2">
        {monedas.map((moneda) => {
          const isActive = moneda.id === activeCurrencyId
          const isPrincipal = moneda.id === baseCurrency.id
          return (
            <button
              key={moneda.id}
              onClick={() => onCurrencyChange(moneda.id === baseCurrency.id ? null : moneda.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                isActive
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground'
              }`}
            >
              {moneda.descripcion}
              {isPrincipal && (
                <span className={`ml-1.5 text-xs ${isActive ? 'opacity-70' : 'text-muted-foreground'}`}>
                  principal
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
