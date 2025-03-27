"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface AppointmentRescheduleProps {
  isOpen: boolean
  onClose: () => void
  appointmentId: string
  doctorName: string
  patientName: string
  onReschedule: (appointmentId: string, newDate: Date, newTime: string) => void
}

export function AppointmentReschedule({
  isOpen,
  onClose,
  appointmentId,
  doctorName,
  patientName,
  onReschedule,
}: AppointmentRescheduleProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [timeSlot, setTimeSlot] = useState("")
  const { toast } = useToast()

  // Slots de tiempo disponibles
  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
  ]

  const handleReschedule = () => {
    if (!date || !timeSlot) {
      toast({
        title: "Información faltante",
        description: "Por favor selecciona una fecha y hora para reprogramar la cita.",
        variant: "destructive",
      })
      return
    }

    onReschedule(appointmentId, date, timeSlot)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reprogramar Cita</DialogTitle>
          <DialogDescription>
            Selecciona una nueva fecha y hora para la cita con {doctorName} para {patientName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Selecciona Fecha</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => {
                // Deshabilitar fines de semana y fechas pasadas
                const day = date.getDay()
                const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0))
                return day === 0 || day === 6 || isPastDate
              }}
              className="border rounded-md p-3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Selecciona Horario</Label>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger id="time">
                <SelectValue placeholder="Selecciona un horario" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleReschedule}>Confirmar Reprogramación</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

