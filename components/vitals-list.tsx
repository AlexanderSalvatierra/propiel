"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ClipboardList, Edit } from "lucide-react"
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

// Mock data for vitals
const mockVitals = []

export function VitalsList() {
  const [vitals, setVitals] = useState(mockVitals)
  const [editVitals, setEditVitals] = useState({
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    respiratoryRate: "",
    weight: "",
    height: "",
    notes: "",
  })
  const [selectedVitalId, setSelectedVitalId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleEditVitals = (id: string) => {
    const vitalToEdit = vitals.find((vital) => vital.id === id)
    if (vitalToEdit) {
      setEditVitals({
        temperature: vitalToEdit.temperature,
        bloodPressure: vitalToEdit.bloodPressure,
        heartRate: vitalToEdit.heartRate,
        respiratoryRate: vitalToEdit.respiratoryRate,
        weight: vitalToEdit.weight,
        height: vitalToEdit.height,
        notes: vitalToEdit.notes,
      })
      setSelectedVitalId(id)
    }
  }

  const handleSaveVitals = () => {
    if (selectedVitalId) {
      setVitals(vitals.map((vital) => (vital.id === selectedVitalId ? { ...vital, ...editVitals } : vital)))

      toast({
        title: "Vitals updated",
        description: "Patient vitals have been successfully updated.",
      })

      setSelectedVitalId(null)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setEditVitals((prev) => ({ ...prev, [field]: value }))
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  return (
    <div className="space-y-4">
      {vitals.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No vitals recorded.</p>
          </CardContent>
        </Card>
      ) : (
        vitals.map((vital) => (
          <Card key={vital.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{vital.patient}</h3>
                  <p className="text-sm text-muted-foreground">Patient ID: {vital.patientId}</p>
                </div>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatDate(vital.date)} at {vital.time}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Temperature</p>
                  <p className="text-sm font-medium">{vital.temperature} °F</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Blood Pressure</p>
                  <p className="text-sm font-medium">{vital.bloodPressure} mmHg</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Heart Rate</p>
                  <p className="text-sm font-medium">{vital.heartRate} bpm</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Respiratory Rate</p>
                  <p className="text-sm font-medium">{vital.respiratoryRate} breaths/min</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="text-sm font-medium">{vital.weight} lbs</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Height</p>
                  <p className="text-sm font-medium">{vital.height}</p>
                </div>
              </div>

              {vital.notes && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground">Notes</p>
                  <p className="text-sm">{vital.notes}</p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => handleEditVitals(vital.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Vitals
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Patient Vitals</DialogTitle>
                      <DialogDescription>Update vitals for {vital.patient}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="temperature">Temperature (°F)</Label>
                          <Input
                            id="temperature"
                            value={editVitals.temperature}
                            onChange={(e) => handleInputChange("temperature", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
                          <Input
                            id="bloodPressure"
                            value={editVitals.bloodPressure}
                            onChange={(e) => handleInputChange("bloodPressure", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                          <Input
                            id="heartRate"
                            value={editVitals.heartRate}
                            onChange={(e) => handleInputChange("heartRate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
                          <Input
                            id="respiratoryRate"
                            value={editVitals.respiratoryRate}
                            onChange={(e) => handleInputChange("respiratoryRate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (lbs)</Label>
                          <Input
                            id="weight"
                            value={editVitals.weight}
                            onChange={(e) => handleInputChange("weight", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="height">Height</Label>
                          <Input
                            id="height"
                            value={editVitals.height}
                            onChange={(e) => handleInputChange("height", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="notes">Notes</Label>
                          <Input
                            id="notes"
                            value={editVitals.notes}
                            onChange={(e) => handleInputChange("notes", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleSaveVitals}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="sm">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  View Patient
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

