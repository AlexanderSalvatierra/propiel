"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for prescriptions
const mockPrescriptions = []

export function PrescriptionList() {
  const [prescriptions] = useState(mockPrescriptions)
  const { toast } = useToast()

  const handleDownload = (id: string, medication: string) => {
    // En una aplicación real, esto iniciaría la descarga de la receta en formato PDF

    // Simulación de proceso de descarga
    toast({
      title: "Generando PDF",
      description: "Preparando el documento para descargar...",
    })

    // Simular tiempo de procesamiento
    setTimeout(() => {
      toast({
        title: "Descarga iniciada",
        description: `La receta para ${medication} está siendo descargada en formato PDF.`,
      })

      // En una implementación real, aquí se generaría y descargaría el archivo PDF
      // utilizando una biblioteca como jsPDF o mediante una llamada a la API
    }, 1000)
  }

  const handleRefill = (id: string, medication: string) => {
    // In a real app, this would send a refill request
    toast({
      title: "Recarga solicitada",
      description: `Se ha enviado una solicitud de recarga para ${medication} a tu médico.`,
    })
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount)
  }

  return (
    <div className="space-y-4">
      {prescriptions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No prescriptions available.</p>
          </CardContent>
        </Card>
      ) : (
        prescriptions.map((prescription) => (
          <Card key={prescription.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {prescription.medication} {prescription.dosage}
                  </h3>
                  <p className="text-sm text-muted-foreground">{prescription.doctor}</p>
                </div>
                <Badge variant={prescription.status === "active" ? "default" : "destructive"} className="mt-2 md:mt-0">
                  {prescription.status === "active" ? "Activa" : "Expirada"}
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(prescription.id, prescription.medication)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>

                {prescription.status === "active" && prescription.refillsRemaining > 0 && (
                  <Button size="sm" onClick={() => handleRefill(prescription.id, prescription.medication)}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Solicitar Recarga
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

