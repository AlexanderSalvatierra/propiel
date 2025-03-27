"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { User, FileText, Calendar, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"

// Mock data for patients
const mockPatients = []

export function PatientList() {
  const [patients] = useState(mockPatients)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Ninguna programada"
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar pacientes por nombre o ID..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredPatients.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No se encontraron pacientes.</p>
          </CardContent>
        </Card>
      ) : (
        filteredPatients.map((patient) => (
          <Card key={patient.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{patient.name}</h3>
                  <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {patient.age} years, {patient.gender}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Last visit: {formatDate(patient.lastVisit)}</span>
                </div>
                <div className="flex items-center gap-2 md:col-span-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {patient.medicalConditions.length > 0
                      ? patient.medicalConditions.join(", ")
                      : "Sin condiciones médicas conocidas"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Información del Paciente</DialogTitle>
                      <DialogDescription>Detalles completos para {patient.name}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">ID de Paciente</h4>
                          <p className="text-sm">{patient.id}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Nombre</h4>
                          <p className="text-sm">{patient.name}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Edad</h4>
                          <p className="text-sm">{patient.age} years</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Género</h4>
                          <p className="text-sm">{patient.gender}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Teléfono</h4>
                          <p className="text-sm">{patient.phone}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Correo</h4>
                          <p className="text-sm">{patient.email}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Última Visita</h4>
                          <p className="text-sm">{formatDate(patient.lastVisit)}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Próxima Cita</h4>
                          <p className="text-sm">{formatDate(patient.upcomingAppointment)}</p>
                        </div>
                        <div className="space-y-2 col-span-2">
                          <h4 className="font-medium">Condiciones Médicas</h4>
                          {patient.medicalConditions.length > 0 ? (
                            <ul className="list-disc list-inside text-sm">
                              {patient.medicalConditions.map((condition, index) => (
                                <li key={index}>{condition}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm">Sin condiciones médicas conocidas</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Link href={`/patient/${patient.id}/records`}>
                  <Button size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Historial Médico
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

