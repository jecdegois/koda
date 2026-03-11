'use client'

import { useState } from 'react'
import { serverCreateMoneda } from '@/lib/actions/monedas'
import { setBaseCurrency } from '@/lib/actions/set-base-currency'
import { useMonedas } from '@/lib/hooks/useMonedas'
import { useCurrencyConversion } from '@/lib/hooks/useCurrencyConversion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Star } from 'lucide-react'

interface AddMonedaFormProps {
  onSuccess?: () => void
}

export function AddMonedaForm({ onSuccess }: AddMonedaFormProps) {
  const { mutate } = useMonedas()
  const { baseCurrency } = useCurrencyConversion()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    descripcion: '',
    precio: '',
  })

  // Si no hay moneda principal, el formulario crea la moneda principal (sin tipo de cambio)
  const isCreatingPrincipal = !baseCurrency

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.descripcion.trim()) {
      alert('Por favor escribe el nombre de la moneda')
      return
    }

    let precio = 1.0
    if (!isCreatingPrincipal) {
      const parsed = parseFloat(formData.precio)
      if (isNaN(parsed) || parsed <= 0) {
        alert('El tipo de cambio debe ser un número mayor a 0')
        return
      }
      precio = parsed
    }

    setIsLoading(true)
    try {
      const moneda = await serverCreateMoneda({
        descripcion: formData.descripcion.trim(),
        precio,
      })

      // If creating the principal currency, set it as base immediately
      if (isCreatingPrincipal) {
        await setBaseCurrency(moneda.id)
      }

      setFormData({ descripcion: '', precio: '' })
      setIsOpen(false)
      await mutate()
      onSuccess?.()
    } catch (error) {
      console.error('Error adding currency:', error)
      alert('Error al agregar moneda')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full gap-2" variant="outline">
        <Plus className="w-4 h-4" />
        {isCreatingPrincipal ? 'Crear Moneda Principal' : 'Nueva Moneda'}
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isCreatingPrincipal && <Star className="w-4 h-4 text-amber-500" />}
          {isCreatingPrincipal ? 'Crear Moneda Principal' : 'Nueva Moneda Secundaria'}
        </CardTitle>
        {isCreatingPrincipal && (
          <p className="text-xs text-muted-foreground">
            Esta es la moneda de referencia del sistema. Todas las demás monedas tendrán
            un tipo de cambio relativo a esta.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="descripcion">Nombre de la Moneda</Label>
            <Input
              id="descripcion"
              placeholder={isCreatingPrincipal ? 'Ej: BS, ARS, COP' : 'Ej: USD, EUR'}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            />
          </div>

          {!isCreatingPrincipal && (
            <div>
              <Label htmlFor="precio">
                Tipo de cambio respecto a {baseCurrency?.descripcion}
              </Label>
              <Input
                id="precio"
                type="number"
                step="0.000001"
                min="0.000001"
                placeholder="Ej: 500"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                ¿Cuántos {baseCurrency?.descripcion} equivale 1 unidad de esta moneda?
                {formData.precio && parseFloat(formData.precio) > 0 && (
                  <span className="font-semibold text-foreground ml-1">
                    → 1 {formData.descripcion || '?'} = {formData.precio} {baseCurrency?.descripcion}
                  </span>
                )}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Guardando...' : isCreatingPrincipal ? 'Crear como Principal' : 'Crear Moneda'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}


