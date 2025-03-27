"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { AppointmentReschedule } from "@/components/appointment-reschedule"

// Datos de ejemplo para citas
const mockAppointments = []

export function AppointmentList() {
  const [appointments, setAppointments] = useState(mockAppointments)
  const { toast } = useToast()

  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false)
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<string | null>(null)

  const cancelAppointment = (id: string) => {
    setAppointments(appointments.map((app) => (app.id === id ? { ...app, status: "cancelled" } : app)))

    toast({
      title: "Cita cancelada",
      description: "Tu cita ha sido cancelada exitosamente.",
    })
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada"
      case "pending":
        return "Pendiente"
      case "cancelled":
        return "Cancelada"
      default:
        return "Desconocido"
    }
  }

  const startReschedule = (id: string) => {
    setAppointmentToReschedule(id)
    setRescheduleDialogOpen(true)
  }

  const handleReschedule = (appointmentId: string, newDate: Date, newTime: string) => {
    setAppointments(
      appointments.map((app) =>
        app.id === appointmentId
          ? { ...app, date: newDate.toISOString().split("T")[0], time: newTime, status: "confirmed" }
          : app,
      ),
    )

    toast({
      title: "Cita reprogramada",
      description: `Tu cita ha sido reprogramada para ${newDate.toLocaleDateString("es-ES")} a las ${newTime}.`,
    })

    setRescheduleDialogOpen(false)
    setAppointmentToReschedule(null)
  }

  return (
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No tienes citas programadas.</p>
          </CardContent>
        </Card>
      ) : (
        appointments.map((appointment) => (
          <Card key={appointment.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className={`w-full md:w-2 ${getStatusColor(appointment.status)}`}></div>
                <div className="p-6 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{appointment.doctor}</h3>
                      <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                    </div>
                    <Badge
                      variant={
                        appointment.status === "confirmed"
                          ? "default"
                          : appointment.status === "pending"
                            ? "outline"
                            : "destructive"
                      }
                    >
                      {getStatusText(appointment.status)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.location}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Ver Detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Detalles de la Cita</DialogTitle>
                          <DialogDescription>Información completa sobre tu cita.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">Médico</h4>
                            <p className="text-sm">{appointment.doctor}</p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Especialidad</h4>
                            <p className="text-sm">{appointment.specialty}</p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Fecha y Hora</h4>
                            <p className="text-sm">
                              {formatDate(appointment.date)} a las {appointment.time}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Ubicación</h4>
                            <p className="text-sm">{appointment.location}</p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Notas</h4>
                            <p className="text-sm">{appointment.notes}</p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Estado</h4>
                            <Badge
                              variant={
                                appointment.status === "confirmed"
                                  ? "default"
                                  : appointment.status === "pending"
                                    ? "outline"
                                    : "destructive"
                              }
                            >
                              {getStatusText(appointment.status)}
                            </Badge>
                          </div>
                        </div>
                        <DialogFooter>
                          {appointment.status !== "cancelled" && (
                            <>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  startReschedule(appointment.id)
                                }}
                              >
                                Reprogramar
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  cancelAppointment(appointment.id)
                                }}
                              >
                                Cancelar Cita
                              </Button>
                            </>
                          )}
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {appointment.status !== "cancelled" && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => startReschedule(appointment.id)}>
                          Reprogramar
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => cancelAppointment(appointment.id)}>
                          Cancelar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
      {appointmentToReschedule && (
        <AppointmentReschedule
          isOpen={rescheduleDialogOpen}
          onClose={() => {
            setRescheduleDialogOpen(false)
            setAppointmentToReschedule(null)
          }}
          appointmentId={appointmentToReschedule}
          doctorName={appointments.find((a) => a.id === appointmentToReschedule)?.doctor || ""}
          patientName="Usuario"
          onReschedule={handleReschedule}
        />
      )}
    </div>
  )
}

