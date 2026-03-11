'use client'

import { useState } from 'react'
import { serverCreateIngreso } from '@/lib/actions/ingresos'
import { useMonedas } from '@/lib/hooks/useMonedas'
import { useIngresos } from '@/lib/hooks/useIngresos'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'

interface AddIngresoFormProps {
  onSuccess?: () => void
}

export function AddIngresoForm({ onSuccess }: AddIngresoFormProps) {
  const { monedas } = useMonedas()
  const { mutate } = useIngresos()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    descripcion: '',
    monto: '',
    moneda_id: '',
    fecha: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.descripcion || !formData.monto || !formData.moneda_id) {
      alert('Por favor completa todos los campos')
      return
    }

    setIsLoading(true)
    try {
      await serverCreateIngreso({
        descripcion: formData.descripcion,
        monto: parseFloat(formData.monto),
        moneda_id: formData.moneda_id,
        fecha: formData.fecha,
      })
      setFormData({
        descripcion: '',
        monto: '',
        moneda_id: '',
        fecha: new Date().toISOString().split('T')[0],
      })
      setIsOpen(false)
      // Refresh SWR data
      await mutate()
      onSuccess?.()
    } catch (error) {
      console.error('Error adding income:', error)
      alert('Error al agregar ingreso')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full gap-2">
        <Plus className="w-4 h-4" />
        Agregar Ingreso
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo Ingreso</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              placeholder="Ej: Salario, Venta de producto"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="monto">Monto</Label>
            <Input
              id="monto"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="moneda">Moneda</Label>
            <Select value={formData.moneda_id} onValueChange={(value) =>
              setFormData({ ...formData, moneda_id: value })
            }>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una moneda" />
              </SelectTrigger>
              <SelectContent>
                {monedas.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.descripcion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar Ingreso'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
