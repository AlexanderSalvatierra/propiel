"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, FileText, PlusCircle, CreditCard } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AppointmentList } from "@/components/appointment-list"
import { MedicalRecordsList } from "@/components/medical-records-list"
import { PrescriptionList } from "@/components/prescription-list"
import { PaymentHistory } from "@/components/payment-history"

export default function PatientDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // En una aplicación real, esto obtendría datos del usuario de una API
    // Por ahora, lo simularemos con localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Autenticación Requerida</h1>
        <p className="mb-4">Por favor inicia sesión para acceder a tu panel.</p>
        <Link href="/login">
          <Button className="bg-propiel-600 hover:bg-propiel-700">Ir a Iniciar Sesión</Button>
        </Link>
      </div>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col gap-4 md:gap-8 p-4 md:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Bienvenido de nuevo, {user.firstName}</h1>
          <p className="text-muted-foreground">Aquí tienes un resumen de tu información de salud y próximas citas.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximas Citas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Próxima: Dr. Smith el 15 de junio</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recetas Activas</CardTitle>
              <PlusCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Última actualización: hace 3 días</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registros Médicos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Última actualización: 28 de mayo, 2024</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pago Pendiente</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$120.00</div>
              <p className="text-xs text-muted-foreground">Vence el: 30 de junio, 2024</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="appointments">Citas</TabsTrigger>
            <TabsTrigger value="records">Registros Médicos</TabsTrigger>
            <TabsTrigger value="prescriptions">Recetas</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
          </TabsList>
          <TabsContent value="appointments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Tus Citas</h2>
              <Link href="/patient/appointments/book">
                <Button className="bg-propiel-600 hover:bg-propiel-700">
                  <Calendar className="mr-2 h-4 w-4" />
                  Reservar Nueva Cita
                </Button>
              </Link>
            </div>
            <AppointmentList />
          </TabsContent>
          <TabsContent value="records" className="space-y-4">
            <h2 className="text-xl font-semibold">Registros Médicos</h2>
            <MedicalRecordsList />
          </TabsContent>
          <TabsContent value="prescriptions" className="space-y-4">
            <h2 className="text-xl font-semibold">Tus Recetas</h2>
            <PrescriptionList />
          </TabsContent>
          <TabsContent value="payments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Historial de Pagos</h2>
              <Link href="/patient/payments/make">
                <Button variant="outline">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Realizar un Pago
                </Button>
              </Link>
            </div>
            <PaymentHistory />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

