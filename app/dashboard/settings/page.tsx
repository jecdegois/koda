'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings } from 'lucide-react'
import { useProfile } from '@/lib/hooks/useProfile'
import { useCurrencyConversion } from '@/lib/hooks/useCurrencyConversion'
import { useConfig } from '@/lib/hooks/useConfig'
import { MonedasList } from '@/components/dashboard/monedas-list'
import { AddMonedaForm } from '@/components/forms/add-moneda-form'

export default function SettingsPage() {
  const { profile } = useProfile()
  const { baseCurrency } = useCurrencyConversion()
  const { config } = useConfig()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground mt-1">
          Administra tu perfil y monedas personalizadas
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Información del Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nombre</p>
              <p className="font-semibold text-foreground">
                {profile?.full_name} {profile?.last_name || ''}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Moneda Base</p>
              <p className="font-semibold text-foreground">
                {baseCurrency?.descripcion || 'No seleccionada'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tema</p>
              <p className="font-semibold text-foreground">
                {config?.theme || 'system'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manage Currencies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AddMonedaForm />
        </div>
        <div className="lg:col-span-2">
          <MonedasList />
        </div>
      </div>
    </div>
  )
}
