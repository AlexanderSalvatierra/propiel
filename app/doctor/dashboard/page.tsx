"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, FileText, PlusCircle, Clock } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DoctorAppointmentList } from "@/components/doctor-appointment-list"
import { PatientList } from "@/components/patient-list"
import { DoctorPrescriptionList } from "@/components/doctor-prescription-list"
import { UserManagement } from "@/components/user-management"

export default function DoctorDashboard() {
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

  if (!user || user.role !== "doctor") {
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
          <h1 className="text-3xl font-bold tracking-tight">Bienvenido, Dr. {user.lastName}</h1>
          <p className="text-muted-foreground">Aquí tienes un resumen de tu agenda e información de pacientes.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citas de Hoy</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Próxima: Juan Pérez a las 10:30 AM</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">248</div>
              <p className="text-xs text-muted-foreground">+12 desde el mes pasado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registros Pendientes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Requieren tu revisión</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consulta Promedio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24m</div>
              <p className="text-xs text-muted-foreground">+2m desde la semana pasada</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="schedule">Agenda</TabsTrigger>
            <TabsTrigger value="patients">Pacientes</TabsTrigger>
            <TabsTrigger value="prescriptions">Recetas</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
          </TabsList>
          <TabsContent value="schedule" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Tu Agenda</h2>
              <div className="flex gap-2">
                <Link href="/doctor/appointments/manage">
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Gestionar Agenda
                  </Button>
                </Link>
              </div>
            </div>
            <DoctorAppointmentList />
          </TabsContent>
          <TabsContent value="patients" className="space-y-4">
            <h2 className="text-xl font-semibold">Tus Pacientes</h2>
            <PatientList />
          </TabsContent>
          <TabsContent value="prescriptions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recetas</h2>
              <Link href="/doctor/prescriptions/create">
                <Button className="bg-propiel-600 hover:bg-propiel-700">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Crear Receta
                </Button>
              </Link>
            </div>
            <DoctorPrescriptionList />
          </TabsContent>
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>
            </div>
            <UserManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

