'use client'

import { useMonedas } from '@/lib/hooks/useMonedas'
import { useCurrencyConversion } from '@/lib/hooks/useCurrencyConversion'
import { serverDeleteMoneda } from '@/lib/actions/monedas'
import { setBaseCurrency } from '@/lib/actions/set-base-currency'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, Trash2, Star } from 'lucide-react'
import { useState } from 'react'

export function MonedasList() {
  const { monedas, mutate } = useMonedas()
  const { baseCurrency } = useCurrencyConversion()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isSettingBase, setIsSettingBase] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    try {
      await serverDeleteMoneda(id)
      mutate()
    } catch (error) {
      console.error('Error deleting currency:', error)
    } finally {
      setIsDeleting(null)
    }
  }

  const handleSetBase = async (id: string) => {
    setIsSettingBase(id)
    try {
      await setBaseCurrency(id)
      mutate()
    } catch (error) {
      console.error('Error setting base currency:', error)
    } finally {
      setIsSettingBase(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Mis Monedas
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-2">
          Moneda principal: <span className="font-semibold text-foreground">{baseCurrency?.descripcion || 'No configurada'}</span>
        </p>
      </CardHeader>
      <CardContent>
        {monedas.length > 0 ? (
          <div className="space-y-2">
            {monedas.map((moneda) => {
              const isBase = moneda.id === baseCurrency?.id
              return (
                <div
                  key={moneda.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    isBase
                      ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900'
                      : 'bg-secondary/50 border-border'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {isBase && <Star className="w-4 h-4 text-amber-600 fill-amber-600" />}
                      <p className="font-semibold text-foreground">
                        {moneda.descripcion}
                      </p>
                      {isBase && (
                        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 text-xs rounded-full">
                          Principal
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isBase ? (
                        'Moneda de referencia'
                      ) : (
                        <>
                          1 {moneda.descripcion} = {moneda.precio.toFixed(6)} {baseCurrency?.descripcion}
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!isBase && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetBase(moneda.id)}
                        disabled={isSettingBase === moneda.id}
                      >
                        {isSettingBase === moneda.id ? 'Configurando...' : 'Usar como Principal'}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(moneda.id)}
                      disabled={isDeleting === moneda.id || isBase}
                      className="text-destructive hover:text-destructive"
                      title={isBase ? 'No se puede eliminar la moneda principal' : 'Eliminar'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <DollarSign className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Sin monedas creadas</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

