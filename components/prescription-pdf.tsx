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
import { useToast } from "@/hooks/use-toast"
import { Shield, Download } from "lucide-react"

interface PrescriptionPdfProps {
  prescription: any
  doctorName: string
  isOpen: boolean
  onClose: () => void
}

export function PrescriptionPdf({ prescription, doctorName, isOpen, onClose }: PrescriptionPdfProps) {
  const { toast } = useToast()
  const [downloading, setDownloading] = useState(false)

  const handleDownload = () => {
    setDownloading(true)

    // En una aplicación real, esto llamaría a una API para generar el PDF
    // Aquí simulamos el proceso de descarga

    try {
      // Crear un elemento <a> para iniciar la descarga
      const downloadLink = document.createElement("a")

      // En una aplicación real, esto sería una URL a un endpoint que genera el PDF
      // Por ahora, simulamos la descarga con un timeout
      setTimeout(() => {
        // Simulación de descarga completada
        toast({
          title: "PDF descargado",
          description: "La receta ha sido descargada exitosamente.",
        })

        // En una implementación real, aquí asignaríamos:
        // downloadLink.href = url_al_pdf_generado;
        // downloadLink.download = `receta-${prescription.id}.pdf`;
        // downloadLink.click();

        setDownloading(false)
        onClose()
      }, 1500)
    } catch (error) {
      toast({
        title: "Error al descargar",
        description: "No se pudo generar el PDF. Intente nuevamente.",
        variant: "destructive",
      })
      setDownloading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Receta Médica</DialogTitle>
          <DialogDescription>Vista previa de la receta</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-b pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-propiel-600" />
              <span className="text-xl font-bold">Propiel</span>
            </div>
            <div className="text-sm text-right">
              <p>Receta N°: {prescription.id}</p>
              <p>Fecha: {formatDate(prescription.dateIssued)}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Paciente:</h3>
            <p>{prescription.patient}</p>
            <p className="text-sm text-muted-foreground">ID: {prescription.patientId}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Medicamento:</h3>
            <div className="bg-muted p-3 rounded-md">
              <p className="font-medium">
                {prescription.medication} {prescription.dosage}
              </p>
              <p className="text-sm">Frecuencia: {prescription.frequency}</p>
              <p className="text-sm">Duración: Hasta {formatDate(prescription.expiryDate)}</p>
              <p className="text-sm">Recargas permitidas: {prescription.refillsRemaining}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Instrucciones:</h3>
            <p className="text-sm">{prescription.instructions}</p>
          </div>

          <div className="pt-4 border-t">
            <p className="font-semibold">{doctorName}</p>
            <p className="text-sm text-muted-foreground">Médico Dermatólogo</p>
            <div className="mt-2 border-b border-dashed border-gray-400 pt-6">
              <p className="text-center text-xs text-muted-foreground">Firma digital</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleDownload} disabled={downloading}>
            <Download className="mr-2 h-4 w-4" />
            {downloading ? "Descargando..." : "Descargar PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

