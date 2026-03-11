'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function DatabaseCheck() {
  const [status, setStatus] = useState<'checking' | 'ready' | 'error'>('checking')
  const [message, setMessage] = useState('Verificando base de datos...')

  useEffect(() => {
    async function checkDatabase() {
      try {
        const response = await fetch('/api/migrate', { method: 'POST' })
        const data = await response.json()

        if (data.status === 'tables_exist') {
          setStatus('ready')
          setMessage('Base de datos lista ✓')
        } else if (data.status === 'manual_setup_required') {
          setStatus('error')
          setMessage(
            'Se requiere configuración manual de la base de datos. Ejecuta los scripts SQL en tu panel de Supabase SQL Editor.'
          )
        }
      } catch (error) {
        setStatus('error')
        setMessage('Error verificando la base de datos')
        console.error('[v0] Database check error:', error)
      }
    }

    checkDatabase()
  }, [])

  if (status === 'ready') {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle>Base de datos lista</AlertTitle>
        <AlertDescription className="text-green-700">
          {message}
        </AlertDescription>
      </Alert>
    )
  }

  if (status === 'error') {
    return (
      <Alert className="bg-red-50 border-red-200">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertTitle>Setup de base de datos requerido</AlertTitle>
        <AlertDescription className="text-red-700 space-y-3">
          <p>{message}</p>
          <div className="text-sm">
            <p className="font-semibold mb-2">Instrucciones:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Ve a tu proyecto en Supabase</li>
              <li>Abre la sección "SQL Editor"</li>
              <li>Copia y ejecuta el contenido de estos archivos en orden:</li>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>scripts/001_create_tables.sql</li>
                <li>scripts/002_create_rls_policies.sql</li>
                <li>scripts/003_profile_trigger.sql</li>
                <li>scripts/004_create_simple_tables.sql</li>
              </ul>
            </ol>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Verificando...</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
