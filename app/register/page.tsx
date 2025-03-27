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
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { register } from "@/lib/auth-client"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Las contraseñas no coinciden",
        description: "Por favor asegúrate de que tus contraseñas coincidan.",
        variant: "destructive",
      })
      return
    }

    if (!agreedToTerms) {
      toast({
        title: "Debes aceptar los términos",
        description: "Para registrarte, debes aceptar el descargo de responsabilidad.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("Iniciando proceso de registro con:", formData.email)
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      })
      console.log("Resultado del registro:", result)

      if (result.success) {
        toast({
          title: "Registro exitoso",
          description: "Ahora puedes iniciar sesión con tus credenciales.",
        })

        router.push("/login")
      } else {
        toast({
          title: "Registro fallido",
          description: result.message || "Por favor intenta nuevamente más tarde.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error en el proceso de registro:", error)
      toast({
        title: "Registro fallido",
        description: "Por favor intenta nuevamente más tarde.",
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
          <CardTitle className="text-2xl text-center">Crear una cuenta</CardTitle>
          <CardDescription className="text-center">
            Ingresa tu información para crear una cuenta en Propiel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="disclaimer">
                  <AccordionTrigger>Descargo de Responsabilidad</AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-muted-foreground bg-muted p-4 rounded-md max-h-60 overflow-y-auto">
                      <h4 className="font-medium mb-2">DESCARGO DE RESPONSABILIDAD LEGAL DE PROPIEL</h4>

                      <p className="mb-2">
                        Este documento constituye un acuerdo legal entre usted y Propiel. Al registrarse y utilizar
                        nuestros servicios, usted acepta los siguientes términos:
                      </p>

                      <ol className="list-decimal pl-5 space-y-2">
                        <li>
                          <strong>Información Médica:</strong> La información proporcionada a través de Propiel es con
                          fines informativos únicamente y no debe considerarse un consejo médico profesional,
                          diagnóstico o tratamiento.
                        </li>
                        <li>
                          <strong>Consulta con Profesionales:</strong> Siempre debe consultar con un dermatólogo
                          calificado u otro profesional de la salud antes de tomar cualquier decisión médica o si tiene
                          preguntas sobre una condición médica.
                        </li>
                        <li>
                          <strong>Emergencias:</strong> En caso de emergencia médica, contacte inmediatamente a los
                          servicios de emergencia locales.
                        </li>
                        <li>
                          <strong>Privacidad:</strong> Su información personal será protegida de acuerdo con nuestra
                          política de privacidad, pero no podemos garantizar la seguridad absoluta de la información
                          transmitida por Internet.
                        </li>
                        <li>
                          <strong>Limitación de Responsabilidad:</strong> Propiel no se hace responsable por cualquier
                          daño directo, indirecto, incidental, consecuente o especial que surja del uso o la
                          imposibilidad de usar nuestros servicios.
                        </li>
                      </ol>

                      <p className="mt-2">
                        Al registrarse, reconoce que ha leído, entendido y aceptado este descargo de responsabilidad.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Acepto el descargo de responsabilidad y los términos de uso
                </label>
              </div>
            </div>
            <Button type="submit" className="w-full bg-propiel-600 hover:bg-propiel-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                "Registrarse"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm text-muted-foreground mt-2">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-propiel-600 hover:underline">
              Iniciar Sesión
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

