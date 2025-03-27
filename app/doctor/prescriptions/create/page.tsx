"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Trash2 } from "lucide-react"

export default function CreatePrescription() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [patient, setPatient] = useState("")
  const [medications, setMedications] = useState([{ name: "", dosage: "", frequency: "", duration: "" }])
  const [notes, setNotes] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  // Mock data for patients
  const patients = [
    { id: "1", name: "Alexander Salvatierra" },
    { id: "2", name: "Alfredo Garcia" },
    { id: "3", name: "Asuri Vianney" },
    { id: "4", name: "Eduardo" },
  ]

  useEffect(() => {
    // In a real app, this would fetch user data from an API
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const handleMedicationChange = (index: number, field: string, value: string) => {
    const updatedMedications = [...medications]
    updatedMedications[index] = { ...updatedMedications[index], [field]: value }
    setMedications(updatedMedications)
  }

  const addMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "" }])
  }

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      const updatedMedications = [...medications]
      updatedMedications.splice(index, 1)
      setMedications(updatedMedications)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!patient || medications.some((med) => !med.name || !med.dosage || !med.frequency)) {
      toast({
        title: "Falta información",
        description: "Por favor rellena todos los campos",
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
        title: "Receta creada",
        description: "La receta ha sido creada exitosamente",
      })

      router.push("/doctor/dashboard")
    } catch (error) {
      toast({
        title: "Algo falló al crear tu receta",
        description: "Por favor intenta de nuevo mas tarde",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  if (!user || user.role !== "doctor") {
    router.push("/login")
    return null
  }

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col gap-4 p-4 md:p-8">
        <div className="flex flex-col gap-2 mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Crea una receta</h1>
          <p className="text-muted-foreground">Crea una nueva prescripción para tus paciente</p>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Detalles</CardTitle>
            <CardDescription>Rellena con la información de la receta de tu paciente</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="prescription-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="patient">Selecciona al paciente</Label>
                <Select value={patient} onValueChange={setPatient}>
                  <SelectTrigger id="patient">
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Medicamentos</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                    <Plus className="h-4 w-4 mr-1" /> Agrega medicación
                  </Button>
                </div>

                {medications.map((medication, index) => (
                  <div key={index} className="p-4 border rounded-md space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Medicación {index + 1}</h4>
                      {medications.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeMedication(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`med-name-${index}`}>Nombre del medicamento</Label>
                        <Input
                          id={`med-name-${index}`}
                          value={medication.name}
                          onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                          placeholder="e.g., Amoxicilina"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`med-dosage-${index}`}>Dosis</Label>
                        <Input
                          id={`med-dosage-${index}`}
                          value={medication.dosage}
                          onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                          placeholder="e.g., 500mg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`med-frequency-${index}`}>Frecuencia</Label>
                        <Input
                          id={`med-frequency-${index}`}
                          value={medication.frequency}
                          onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
                          placeholder="e.g., Una pastilla cada 12 hrs."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`med-duration-${index}`}>Duracion</Label>
                        <Input
                          id={`med-duration-${index}`}
                          value={medication.duration}
                          onChange={(e) => handleMedicationChange(index, "duration", e.target.value)}
                          placeholder="e.g., 7 dias"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions or notes for the patient"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" form="prescription-form" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Prescription"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}

