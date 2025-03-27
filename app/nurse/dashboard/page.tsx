"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, ClipboardList, Clock } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { NurseAppointmentList } from "@/components/nurse-appointment-list"
import { PatientList } from "@/components/patient-list"
import { VitalsList } from "@/components/vitals-list"

export default function NurseDashboard() {
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

  if (!user || user.role !== "nurse") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
        <p className="mb-4">No tienes permiso para acceder a esta página.</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Bienvenida, Enfermera {user.lastName}</h1>
          <p className="text-muted-foreground">
            Aquí tienes un resumen de la agenda de hoy e información de pacientes.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pacientes de Hoy</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Próximo: María López a las 9:15 AM</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Signos Vitales Pendientes</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Necesitan ser registrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Médicos Asignados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Dr. Pérez, Dra. García, Dr. Rodríguez</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horas de Turno</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8:00 - 16:00</div>
              <p className="text-xs text-muted-foreground">Turno de hoy</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="schedule">Agenda</TabsTrigger>
            <TabsTrigger value="patients">Pacientes</TabsTrigger>
            <TabsTrigger value="vitals">Signos Vitales</TabsTrigger>
          </TabsList>
          <TabsContent value="schedule" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Agenda de Hoy</h2>
              <Link href="/nurse/schedule">
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Ver Agenda Completa
                </Button>
              </Link>
            </div>
            <NurseAppointmentList />
          </TabsContent>
          <TabsContent value="patients" className="space-y-4">
            <h2 className="text-xl font-semibold">Pacientes Asignados</h2>
            <PatientList />
          </TabsContent>
          <TabsContent value="vitals" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Signos Vitales de Pacientes</h2>
              <Link href="/nurse/vitals/record">
                <Button className="bg-propiel-600 hover:bg-propiel-700">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Registrar Nuevos Signos Vitales
                </Button>
              </Link>
            </div>
            <VitalsList />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

