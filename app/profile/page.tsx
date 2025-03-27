"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, Phone, Shield, Calendar, MapPin } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    specialization: "",
    dateOfBirth: "",
  })

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // En una aplicación real, esto obtendría datos del usuario de una API
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Simular datos de perfil
      setProfileData({
        firstName: parsedUser.firstName || "",
        lastName: parsedUser.lastName || "",
        email: parsedUser.email || "",
        phone: "+34 612 345 678",
        address: "Calle Principal 123, Madrid, España",
        bio:
          parsedUser.role === "doctor"
            ? "Dermatólogo especializado en tratamientos para el acné y condiciones de la piel."
            : parsedUser.role === "nurse"
              ? "Enfermera con 5 años de experiencia en dermatología."
              : "Paciente desde 2022.",
        specialization: parsedUser.role === "doctor" ? "Dermatología Clínica" : "",
        dateOfBirth: "1985-05-15",
      })
    }
    setLoading(false)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Simular una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Actualizar el usuario en localStorage
      const updatedUser = { ...user, firstName: profileData.firstName, lastName: profileData.lastName }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      toast({
        title: "Perfil actualizado",
        description: "Tu información de perfil ha sido actualizada exitosamente.",
      })
    } catch (error) {
      toast({
        title: "Error al actualizar",
        description: "No se pudo actualizar tu perfil. Intenta nuevamente más tarde.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  if (!user) {
    router.push("/login")
    return null
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "doctor":
        return "Médico"
      case "nurse":
        return "Enfermera"
      case "patient":
        return "Paciente"
      default:
        return role
    }
  }

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col gap-4 md:gap-8 p-4 md:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Tu Perfil</h1>
          <p className="text-muted-foreground">Gestiona tu información personal y configuración de cuenta</p>
        </div>

        <div className="grid gap-6 md:grid-cols-5">
          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt={user.firstName} />
                  <AvatarFallback className="text-2xl">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1 text-center">
                  <h2 className="text-xl font-semibold">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground">{getRoleText(user.role)}</p>
                </div>

                <div className="w-full space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profileData.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profileData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profileData.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Fecha de nacimiento: {new Date(profileData.dateOfBirth).toLocaleDateString("es-ES")}</span>
                  </div>
                  {user.role === "doctor" && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span>Especialización: {profileData.specialization}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Editar Perfil</CardTitle>
              <CardDescription>Actualiza tu información personal</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="profile-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input id="firstName" name="firstName" value={profileData.firstName} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input id="lastName" name="lastName" value={profileData.lastName} onChange={handleChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleChange}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">El correo electrónico no se puede cambiar</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" name="phone" value={profileData.phone} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" name="address" value={profileData.address} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea id="bio" name="bio" value={profileData.bio} onChange={handleChange} rows={4} />
                </div>

                {user.role === "doctor" && (
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Especialización</Label>
                    <Input
                      id="specialization"
                      name="specialization"
                      value={profileData.specialization}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                type="submit"
                form="profile-form"
                className="bg-propiel-600 hover:bg-propiel-700"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="security" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="preferences">Preferencias</TabsTrigger>
          </TabsList>
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cambiar Contraseña</CardTitle>
                <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Contraseña Actual</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva Contraseña</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-propiel-600 hover:bg-propiel-700">Actualizar Contraseña</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>Configura cómo y cuándo quieres recibir notificaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    className="h-4 w-4 rounded border-gray-300"
                    defaultChecked
                  />
                  <Label htmlFor="emailNotifications">Notificaciones por correo electrónico</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    className="h-4 w-4 rounded border-gray-300"
                    defaultChecked
                  />
                  <Label htmlFor="smsNotifications">Notificaciones por SMS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="appointmentReminders"
                    className="h-4 w-4 rounded border-gray-300"
                    defaultChecked
                  />
                  <Label htmlFor="appointmentReminders">Recordatorios de citas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="marketingEmails" className="h-4 w-4 rounded border-gray-300" />
                  <Label htmlFor="marketingEmails">Correos de marketing y promociones</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-propiel-600 hover:bg-propiel-700">Guardar Preferencias</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

