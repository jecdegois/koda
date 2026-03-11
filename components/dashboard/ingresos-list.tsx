'use client'

import { useState } from 'react'
import { useIngresos } from '@/lib/hooks/useIngresos'
import { serverDeleteIngreso } from '@/lib/actions/ingresos'
import { useMonedas } from '@/lib/hooks/useMonedas'
import { useCurrencyConversion } from '@/lib/hooks/useCurrencyConversion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface IngresosListProps {
  displayCurrencyId?: string | null
}

export function IngresosList({ displayCurrencyId }: IngresosListProps) {
  const { ingresos, mutate } = useIngresos()
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
      await serverDeleteIngreso(id)
      mutate()
    } catch (error) {
      console.error('Error deleting income:', error)
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Ingresos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ingresos.length > 0 ? (
          <div className="space-y-2">
            {ingresos.map((ingreso) => {
              const monedaOriginal = monedaMap.get(ingreso.moneda_id)
              const enBase = convertToBase(ingreso.monto, ingreso.moneda_id)
              const enDisplay =
                displayCurrency?.id === baseCurrency?.id
                  ? enBase
                  : convertFromBase(enBase, displayCurrency?.id ?? '')
              const mostrarOriginal = ingreso.moneda_id !== displayCurrency?.id

              return (
                <div
                  key={ingreso.id}
                  className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {ingreso.descripcion}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(ingreso.fecha), 'dd MMM yyyy', { locale: es })}
                    </p>
                  </div>
                  <div className="text-right mr-3 shrink-0">
                    <p className="font-semibold text-green-600">
                      +{enDisplay.toFixed(2)} {displayCurrency?.descripcion}
                    </p>
                    {mostrarOriginal && (
                      <p className="text-xs text-muted-foreground">
                        {ingreso.monto.toFixed(2)} {monedaOriginal?.descripcion}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(ingreso.id)}
                    disabled={isDeleting === ingreso.id}
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
            <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Sin ingresos registrados</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
