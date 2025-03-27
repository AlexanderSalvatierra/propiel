"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Edit, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
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
import { Textarea } from "@/components/ui/textarea"
import { PrescriptionPdf } from "@/components/prescription-pdf"

// Mock data for doctor prescriptions
const mockPrescriptions = []

export function DoctorPrescriptionList() {
  const [prescriptions, setPrescriptions] = useState(mockPrescriptions)
  const { toast } = useToast()
  const [editingPrescription, setEditingPrescription] = useState<any>(null)
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null)

  const approveRefill = (id: string) => {
    setPrescriptions(
      prescriptions.map((prescription) =>
        prescription.id === id ? { ...prescription, refillRequested: false } : prescription,
      ),
    )

    toast({
      title: "Recarga aprobada",
      description: "La recarga de la receta ha sido aprobada.",
    })
  }

  const updatePrescription = (id: string) => {
    setPrescriptions(
      prescriptions.map((prescription) =>
        prescription.id === id ? { ...prescription, ...editingPrescription } : prescription,
      ),
    )

    toast({
      title: "Receta actualizada",
      description: "La receta ha sido actualizada exitosamente.",
    })

    setEditingPrescription(null)
  }

  const downloadPrescription = (prescription: any) => {
    setSelectedPrescription(prescription)
    setPdfDialogOpen(true)

    // Registrar el evento de descarga
    toast({
      title: "Preparando documento",
      description: "Generando el PDF de la receta...",
    })
  }

  const startEditing = (prescription: any) => {
    setEditingPrescription({ ...prescription })
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  const user = { lastName: "Smith" }

  return (
    <div className="space-y-4">
      {prescriptions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No prescriptions issued.</p>
          </CardContent>
        </Card>
      ) : (
        prescriptions.map((prescription) => (
          <Card
            key={prescription.id}
            className={`overflow-hidden ${prescription.refillRequested ? "border-primary" : ""}`}
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{prescription.patient}</h3>
                    {prescription.refillRequested && (
                      <Badge variant="outline" className="bg-primary text-primary-foreground">
                        Recarga Solicitada
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Patient ID: {prescription.patientId}</p>
                </div>
                <Badge variant="default" className="mt-2 md:mt-0">
                  {prescription.medication} {prescription.dosage}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Frecuencia:</span>
                  <span className="text-sm">{prescription.frequency}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Recargas:</span>
                  <span className="text-sm">{prescription.refillsRemaining}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Emitida:</span>
                  <span className="text-sm">{formatDate(prescription.dateIssued)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Expira:</span>
                  <span className="text-sm">{formatDate(prescription.expiryDate)}</span>
                </div>
              </div>

              <p className="text-sm mb-4">{prescription.instructions}</p>

              <div className="flex justify-end gap-2">
                {prescription.refillRequested && (
                  <Button size="sm" onClick={() => approveRefill(prescription.id)}>
                    <Check className="h-4 w-4 mr-2" />
                    Aprobar Recarga
                  </Button>
                )}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => startEditing(prescription)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Receta</DialogTitle>
                      <DialogDescription>
                        Modifica los detalles de la receta para {prescription.patient}
                      </DialogDescription>
                    </DialogHeader>
                    {editingPrescription && (
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="medication">Medicamento</Label>
                          <Input
                            id="medication"
                            value={editingPrescription.medication}
                            onChange={(e) =>
                              setEditingPrescription({ ...editingPrescription, medication: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dosage">Dosis</Label>
                          <Input
                            id="dosage"
                            value={editingPrescription.dosage}
                            onChange={(e) => setEditingPrescription({ ...editingPrescription, dosage: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="frequency">Frecuencia</Label>
                          <Input
                            id="frequency"
                            value={editingPrescription.frequency}
                            onChange={(e) =>
                              setEditingPrescription({ ...editingPrescription, frequency: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="refills">Número de recargas</Label>
                          <Input
                            id="refills"
                            type="number"
                            value={editingPrescription.refillsRemaining}
                            onChange={(e) =>
                              setEditingPrescription({
                                ...editingPrescription,
                                refillsRemaining: Number.parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="instructions">Instrucciones</Label>
                          <Textarea
                            id="instructions"
                            value={editingPrescription.instructions}
                            onChange={(e) =>
                              setEditingPrescription({ ...editingPrescription, instructions: e.target.value })
                            }
                            rows={3}
                          />
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button onClick={() => updatePrescription(prescription.id)}>Guardar Cambios</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="sm" onClick={() => downloadPrescription(prescription)}>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
      {selectedPrescription && (
        <PrescriptionPdf
          prescription={selectedPrescription}
          doctorName={`Dr. ${user?.lastName || "Smith"}`}
          isOpen={pdfDialogOpen}
          onClose={() => {
            setPdfDialogOpen(false)
            setSelectedPrescription(null)
          }}
        />
      )}
    </div>
  )
}

