"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, FileText, ClipboardList } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

// Mock data for nurse appointments
const mockAppointments = []

export function NurseAppointmentList() {
  const [appointments, setAppointments] = useState(mockAppointments)
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  const [vitals, setVitals] = useState({
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    respiratoryRate: "",
    weight: "",
    height: "",
  })
  const { toast } = useToast()

  const recordVitals = (id: string) => {
    setAppointments(
      appointments.map((app) => (app.id === id ? { ...app, status: "completed", vitals: { ...vitals } } : app)),
    )

    toast({
      title: "Vitals recorded",
      description: "Patient vitals have been successfully recorded.",
    })

    setVitals({
      temperature: "",
      bloodPressure: "",
      heartRate: "",
      respiratoryRate: "",
      weight: "",
      height: "",
    })
    setSelectedAppointment(null)
  }

  const handleVitalsChange = (field: string, value: string) => {
    setVitals((prev) => ({ ...prev, [field]: value }))
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  return (
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No appointments scheduled for today.</p>
          </CardContent>
        </Card>
      ) : (
        appointments.map((appointment) => (
          <Card key={appointment.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div
                  className={`w-full md:w-2 ${appointment.status === "completed" ? "bg-green-500" : "bg-blue-500"}`}
                ></div>
                <div className="p-6 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{appointment.patient}</h3>
                      <p className="text-sm text-muted-foreground">Patient ID: {appointment.patientId}</p>
                    </div>
                    <Badge variant={appointment.status === "completed" ? "default" : "outline"}>
                      {appointment.status === "completed" ? "Completed" : "Pending"}
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
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.doctor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.reason}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    {appointment.status === "completed" ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            View Vitals
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Patient Vitals</DialogTitle>
                            <DialogDescription>Recorded vitals for {appointment.patient}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium">Temperature</h4>
                                <p className="text-sm">{appointment.vitals?.temperature} °F</p>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-medium">Blood Pressure</h4>
                                <p className="text-sm">{appointment.vitals?.bloodPressure} mmHg</p>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-medium">Heart Rate</h4>
                                <p className="text-sm">{appointment.vitals?.heartRate} bpm</p>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-medium">Respiratory Rate</h4>
                                <p className="text-sm">{appointment.vitals?.respiratoryRate} breaths/min</p>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-medium">Weight</h4>
                                <p className="text-sm">{appointment.vitals?.weight} lbs</p>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-medium">Height</h4>
                                <p className="text-sm">{appointment.vitals?.height}</p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedAppointment(appointment.id)}>
                            <ClipboardList className="h-4 w-4 mr-2" />
                            Record Vitals
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Record Patient Vitals</DialogTitle>
                            <DialogDescription>Enter vitals for {appointment.patient}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="temperature">Temperature (°F)</Label>
                                <Input
                                  id="temperature"
                                  value={vitals.temperature}
                                  onChange={(e) => handleVitalsChange("temperature", e.target.value)}
                                  placeholder="98.6"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
                                <Input
                                  id="bloodPressure"
                                  value={vitals.bloodPressure}
                                  onChange={(e) => handleVitalsChange("bloodPressure", e.target.value)}
                                  placeholder="120/80"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                                <Input
                                  id="heartRate"
                                  value={vitals.heartRate}
                                  onChange={(e) => handleVitalsChange("heartRate", e.target.value)}
                                  placeholder="72"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
                                <Input
                                  id="respiratoryRate"
                                  value={vitals.respiratoryRate}
                                  onChange={(e) => handleVitalsChange("respiratoryRate", e.target.value)}
                                  placeholder="16"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="weight">Weight (lbs)</Label>
                                <Input
                                  id="weight"
                                  value={vitals.weight}
                                  onChange={(e) => handleVitalsChange("weight", e.target.value)}
                                  placeholder="165"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="height">Height</Label>
                                <Input
                                  id="height"
                                  value={vitals.height}
                                  onChange={(e) => handleVitalsChange("height", e.target.value)}
                                  placeholder="5'10"
                                />
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={() => recordVitals(appointment.id)}>Save Vitals</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}

                    <Button variant="outline" size="sm">
                      View Patient
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

