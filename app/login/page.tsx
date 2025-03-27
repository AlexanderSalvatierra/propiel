"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { login } from "@/lib/auth-client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("Iniciando proceso de login con:", email)
      const result = await login(email, password)
      console.log("Resultado del login:", result)

      if (result.success && result.user) {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Redirigiendo al panel de control...",
        })

        // Redirigir según el rol del usuario
        if (result.user.role === "doctor") {
          router.push("/doctor/dashboard")
        } else if (result.user.role === "nurse") {
          router.push("/nurse/dashboard")
        } else {
          router.push("/patient/dashboard")
        }
      } else {
        toast({
          title: "Inicio de sesión fallido",
          description: result.message || "Por favor verifica tus credenciales e intenta nuevamente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error en el proceso de login:", error)
      toast({
        title: "Inicio de sesión fallido",
        description: "Por favor verifica tus credenciales e intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-propiel-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Shield className="h-8 w-8 text-propiel-600" />
          </div>
          <CardTitle className="text-2xl text-center">Iniciar Sesión en Propiel</CardTitle>
          <CardDescription className="text-center">
            Ingresa tu correo electrónico y contraseña para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="/forgot-password" className="text-sm text-propiel-600 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-propiel-600 hover:bg-propiel-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm text-muted-foreground mt-2">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-propiel-600 hover:underline">
              Regístrate
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

