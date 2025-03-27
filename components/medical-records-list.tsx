"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

// Mock data for medical records
const mockRecords = []

export function MedicalRecordsList() {
  const [records] = useState(mockRecords)
  const { toast } = useToast()

  const handleDownload = (id: string, title: string) => {
    // In a real app, this would trigger a download of the medical record
    toast({
      title: "Download started",
      description: `${title} is being downloaded as a PDF.`,
    })
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  return (
    <div className="space-y-4">
      {records.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No medical records available.</p>
          </CardContent>
        </Card>
      ) : (
        records.map((record) => (
          <Card key={record.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{record.title}</h3>
                  <p className="text-sm text-muted-foreground">{record.doctor}</p>
                </div>
                <Badge variant="outline" className="mt-2 md:mt-0">
                  {record.type}
                </Badge>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(record.date)}</span>
              </div>

              <p className="text-sm mb-4">{record.summary}</p>

              <div className="flex justify-end gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{record.title}</DialogTitle>
                      <DialogDescription>
                        {record.doctor} - {formatDate(record.date)}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Type</h4>
                        <Badge variant="outline">{record.type}</Badge>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Details</h4>
                        <p className="text-sm whitespace-pre-line">{record.details}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button size="sm" onClick={() => handleDownload(record.id, record.title)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

