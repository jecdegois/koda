'use client'

import { useState } from 'react'
import { AddIngresoForm } from '@/components/forms/add-ingreso-form'
import { AddGastoForm } from '@/components/forms/add-gasto-form'
import { AddMonedaForm } from '@/components/forms/add-moneda-form'
import { IngresosList } from '@/components/dashboard/ingresos-list'
import { GastosList } from '@/components/dashboard/gastos-list'
import { MonedasList } from '@/components/dashboard/monedas-list'
import { CurrencyFilter } from '@/components/currency-filter'
import { DatabaseCheck } from '@/components/database-check'
import { useIngresos } from '@/lib/hooks/useIngresos'
import { useGastos } from '@/lib/hooks/useGastos'
import { useMonedas } from '@/lib/hooks/useMonedas'
import { useCurrencyConversion } from '@/lib/hooks/useCurrencyConversion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  const { ingresos } = useIngresos()
  const { gastos } = useGastos()
  const { monedas } = useMonedas()
  const { baseCurrency, convertToBase, convertFromBase } = useCurrencyConversion()
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<string | null>(null)

  const displayCurrency = selectedCurrencyId
    ? (monedas.find((m) => m.id === selectedCurrencyId) ?? baseCurrency)
    : baseCurrency

  const totalIngresos = ingresos.reduce((sum, i) => {
    const enBase = convertToBase(i.monto, i.moneda_id)
    const enDisplay =
      displayCurrency?.id === baseCurrency?.id
        ? enBase
        : convertFromBase(enBase, displayCurrency?.id ?? '')
    return sum + enDisplay
  }, 0)

  const totalGastos = gastos.reduce((sum, g) => {
    const enBase = convertToBase(g.monto, g.moneda_id)
    const enDisplay =
      displayCurrency?.id === baseCurrency?.id
        ? enBase
        : convertFromBase(enBase, displayCurrency?.id ?? '')
    return sum + enDisplay
  }, 0)

  const balance = totalIngresos - totalGastos

  return (
    <div className="space-y-6">
      <DatabaseCheck />

      {/* Resumen + filtro de moneda */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Resumen
          </h2>
          <CurrencyFilter
            selectedCurrencyId={selectedCurrencyId}
            onCurrencyChange={setSelectedCurrencyId}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Ingresos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +{totalIngresos.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {ingresos.length} {ingresos.length === 1 ? 'registro' : 'registros'} &mdash; {displayCurrency?.descripcion}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Gastos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                -{totalGastos.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {gastos.length} {gastos.length === 1 ? 'registro' : 'registros'} &mdash; {displayCurrency?.descripcion}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  balance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {balance >= 0 ? '+' : ''}{balance.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {displayCurrency?.descripcion ?? 'Sin moneda configurada'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Formularios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AddIngresoForm />
        <AddGastoForm />
        <AddMonedaForm />
      </div>

      {/* Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IngresosList displayCurrencyId={selectedCurrencyId} />
        <GastosList displayCurrencyId={selectedCurrencyId} />
      </div>

      {/* Monedas */}
      <MonedasList />
    </div>
  )
}
