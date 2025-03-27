"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { AppointmentReschedule } from "@/components/appointment-reschedule"

// Mock data for doctor appointments
const mockAppointments = []

export function DoctorAppointmentList() {
  const [appointments, setAppointments] = useState(mockAppointments)
  const [notes, setNotes] = useState("")
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  const { toast } = useToast()

  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false)
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<string | null>(null)

  const completeAppointment = (id: string) => {
    setAppointments(
      appointments.map((app) => (app.id === id ? { ...app, status: "completed", completed: true, notes } : app)),
    )

    toast({
      title: "Cita completada",
      description: "La cita ha sido marcada como completada.",
    })

    setNotes("")
    setSelectedAppointment(null)
  }

  const rescheduleAppointment = (id: string) => {
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
      description: `La cita ha sido reprogramada para ${newDate.toLocaleDateString("es-ES")} a las ${newTime}.`,
    })

    setRescheduleDialogOpen(false)
    setAppointmentToReschedule(null)
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500"
      case "completed":
        return "bg-blue-500"
      case "rescheduled":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Encontrar la cita a reprogramar para obtener sus datos
  const appointmentToRescheduleData = appointments.find((a) => a.id === appointmentToReschedule)

  return (
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">You have no appointments scheduled.</p>
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
                      <h3 className="text-lg font-semibold">{appointment.patient}</h3>
                      <p className="text-sm text-muted-foreground">Patient ID: {appointment.patientId}</p>
                    </div>
                    <Badge
                      variant={
                        appointment.status === "confirmed"
                          ? "default"
                          : appointment.status === "completed"
                            ? "secondary"
                            : appointment.status === "rescheduled"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
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
                    <div className="flex items-center gap-2 md:col-span-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.reason}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Ver Paciente
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Información del Paciente</DialogTitle>
                          <DialogDescription>Detalles sobre {appointment.patient}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">Nombre del Paciente</h4>
                            <p className="text-sm">{appointment.patient}</p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">ID del Paciente</h4>
                            <p className="text-sm">{appointment.patientId}</p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Cita</h4>
                            <p className="text-sm">
                              {formatDate(appointment.date)} at {appointment.time}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Motivo de la Visita</h4>
                            <p className="text-sm">{appointment.reason}</p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Historial Médico</h4>
                            <p className="text-sm">View complete medical history in the patient records.</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              Ver Historial Médico
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {appointment.status === "confirmed" && (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={() => setSelectedAppointment(appointment.id)}>
                              Completar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Completar Cita</DialogTitle>
                              <DialogDescription>
                                Agregar notas sobre la cita con {appointment.patient}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <h4 className="font-medium">Notas de la Cita</h4>
                                <Textarea
                                  placeholder="Ingresa tus notas sobre la cita..."
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  rows={5}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={() => completeAppointment(appointment.id)}>
                                Marcar como Completada
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button variant="outline" size="sm" onClick={() => rescheduleAppointment(appointment.id)}>
                          Reprogramar
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
      {appointmentToReschedule && appointmentToRescheduleData && (
        <AppointmentReschedule
          isOpen={rescheduleDialogOpen}
          onClose={() => {
            setRescheduleDialogOpen(false)
            setAppointmentToReschedule(null)
          }}
          appointmentId={appointmentToReschedule}
          doctorName={appointmentToRescheduleData.doctor}
          patientName={appointmentToRescheduleData.patient}
          onReschedule={handleReschedule}
        />
      )}
    </div>
  )
}

