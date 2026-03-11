'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, DollarSign } from 'lucide-react'

export function CurrencyExchangeHelp() {
  return (
    <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          Cómo funciona el tipo de cambio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="font-semibold text-foreground mb-2">Ejemplo:</p>
          <div className="bg-white dark:bg-slate-900 rounded p-3 space-y-2">
            <p>• Tu moneda base es: <span className="font-semibold">BS (Bolívares)</span></p>
            <p>• Quieres agregar: <span className="font-semibold">USD (Dólares)</span></p>
            <p>• El tipo de cambio es: <span className="font-semibold">1 USD = 500 BS</span></p>
          </div>
        </div>

        <div>
          <p className="font-semibold text-foreground mb-2">Qué debes hacer:</p>
          <div className="bg-white dark:bg-slate-900 rounded p-3 space-y-2">
            <p>1. Nombre: <span className="font-semibold">USD</span></p>
            <p>2. Tipo de cambio: <span className="font-semibold">500</span></p>
            <p className="text-xs text-muted-foreground italic">
              (significa que 1 USD = 500 BS)
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded p-3 border-l-4 border-green-500">
          <p className="font-semibold text-green-700 dark:text-green-400 mb-2">Resultado:</p>
          <p>Si registras un gasto de 1 USD:</p>
          <p className="font-semibold text-green-600 dark:text-green-400">
            1 USD × 500 = 500 BS (en tu moneda base)
          </p>
        </div>

        <div className="text-xs text-muted-foreground bg-white dark:bg-slate-900 rounded p-2">
          <p className="font-semibold mb-1">Nota:</p>
          <p>El campo de tipo de cambio no puede ser 1. Solo es 1 para tu moneda base.</p>
        </div>
      </CardContent>
    </Card>
  )
}
