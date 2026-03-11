'use client'

import { useState } from 'react'
import { useGastos } from '@/lib/hooks/useGastos'
import { serverDeleteGasto } from '@/lib/actions/gastos'
import { useMonedas } from '@/lib/hooks/useMonedas'
import { useCurrencyConversion } from '@/lib/hooks/useCurrencyConversion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingDown, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface GastosListProps {
  displayCurrencyId?: string | null
}

export function GastosList({ displayCurrencyId }: GastosListProps) {
  const { gastos, mutate } = useGastos()
  const { monedas } = useMonedas()
  const { baseCurrency, convertToBase, convertFromBase } = useCurrencyConversion()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const monedaMap = new Map(monedas.map((m) => [m.id, m]))

  const displayCurrency = displayCurrencyId
    ? (monedas.find((m) => m.id === displayCurrencyId) ?? baseCurrency)
    : baseCurrency

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    try {
      await serverDeleteGasto(id)
      mutate()
    } catch (error) {
      console.error('Error deleting expense:', error)
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-red-600" />
          Gastos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {gastos.length > 0 ? (
          <div className="space-y-2">
            {gastos.map((gasto) => {
              const monedaOriginal = monedaMap.get(gasto.moneda_id)
              const enBase = convertToBase(gasto.monto, gasto.moneda_id)
              const enDisplay =
                displayCurrency?.id === baseCurrency?.id
                  ? enBase
                  : convertFromBase(enBase, displayCurrency?.id ?? '')
              const mostrarOriginal = gasto.moneda_id !== displayCurrency?.id

              return (
                <div
                  key={gasto.id}
                  className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {gasto.descripcion}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(gasto.fecha), 'dd MMM yyyy', { locale: es })}
                    </p>
                  </div>
                  <div className="text-right mr-3 shrink-0">
                    <p className="font-semibold text-red-600">
                      -{enDisplay.toFixed(2)} {displayCurrency?.descripcion}
                    </p>
                    {mostrarOriginal && (
                      <p className="text-xs text-muted-foreground">
                        {gasto.monto.toFixed(2)} {monedaOriginal?.descripcion}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(gasto.id)}
                    disabled={isDeleting === gasto.id}
                    className="text-destructive hover:text-destructive shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingDown className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Sin gastos registrados</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
