"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function BookAppointment() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [doctor, setDoctor] = useState("")
  const [timeSlot, setTimeSlot] = useState("")
  const [reason, setReason] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  // Mock data for doctors and time slots
  const doctors = [
    { id: "1", name: "Dr. Pepe", specialty: "Derma" },
    { id: "2", name: "Dra. Sara", specialty: "Derma" },
    { id: "3", name: "Dr.  Isai", specialty: "Derma" },
    { id: "4", name: "Dr. Emilia", specialty: "Derma" },
  ]

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

  useEffect(() => {
    // In a real app, this would fetch user data from an API
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !doctor || !timeSlot) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      // In a real app, this would be an API call to your backend
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Appointment booked",
        description: `Your appointment has been scheduled for ${date.toLocaleDateString()} at ${timeSlot}.`,
      })

      router.push("/patient/dashboard")
    } catch (error) {
      toast({
        title: "Failed to book appointment",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col gap-4 p-4 md:p-8">
        <div className="flex flex-col gap-2 mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Realiza una cita</h1>
          <p className="text-muted-foreground">Agenda una cita con uno de nuestros especialistas</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Detalles</CardTitle>
            <CardDescription>Por favor selecciona tu doctor, dia y fecha</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="appointment-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="doctor">Selecciona tu doctor</Label>
                <Select value={doctor} onValueChange={setDoctor}>
                  <SelectTrigger id="doctor">
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.name} - {doc.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Selecciona una fecha</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => {
                    // Disable weekends and past dates
                    const day = date.getDay()
                    const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0))
                    return day === 0 || day === 6 || isPastDate
                  }}
                  className="border rounded-md p-3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Selecciona un horario disponible</Label>
                <Select value={timeSlot} onValueChange={setTimeSlot}>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select a time slot" />
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

              <div className="space-y-2">
                <Label htmlFor="reason">Razón de tu visita</Label>
                <Textarea
                  id="reason"
                  placeholder="Please briefly describe your symptoms or reason for the appointment"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" form="appointment-form" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                "Book Appointment"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}

