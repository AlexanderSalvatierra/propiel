"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CreditCard, Download, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

// Mock data for payment history
const mockPayments = []

export function PaymentHistory() {
  const [payments] = useState(mockPayments)
  const { toast } = useToast()

  const handleDownload = (id: string, invoiceNumber: string) => {
    // In a real app, this would trigger a download of the invoice
    toast({
      title: "Download started",
      description: `Invoice ${invoiceNumber} is being downloaded as a PDF.`,
    })
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  }

  return (
    <div className="space-y-4">
      {payments.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No payment history available.</p>
          </CardContent>
        </Card>
      ) : (
        payments.map((payment) => (
          <Card key={payment.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{payment.description}</h3>
                  <p className="text-sm text-muted-foreground">Invoice: {payment.invoiceNumber}</p>
                </div>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <Badge variant={payment.status === "paid" ? "default" : "outline"}>
                    {payment.status === "paid" ? "Paid" : "Pending"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatDate(payment.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{payment.paymentMethod || "Not paid yet"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{formatCurrency(payment.amount)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invoice Details</DialogTitle>
                      <DialogDescription>
                        {payment.invoiceNumber} - {formatDate(payment.date)}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Services</h4>
                        <div className="border rounded-md">
                          <table className="w-full">
                            <thead className="bg-muted">
                              <tr>
                                <th className="text-left p-2 text-xs font-medium">Description</th>
                                <th className="text-right p-2 text-xs font-medium">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {payment.details.items.map((item, index) => (
                                <tr key={index} className="border-t">
                                  <td className="p-2 text-sm">{item.description}</td>
                                  <td className="p-2 text-sm text-right">{formatCurrency(item.amount)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Summary</h4>
                        <div className="border rounded-md p-3 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Subtotal:</span>
                            <span className="text-sm">{formatCurrency(payment.details.subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Insurance Coverage:</span>
                            <span className="text-sm">-{formatCurrency(payment.details.insurance)}</span>
                          </div>
                          <div className="flex justify-between font-medium pt-2 border-t">
                            <span className="text-sm">Patient Responsibility:</span>
                            <span className="text-sm">{formatCurrency(payment.details.patientResponsibility)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Status</h4>
                        <Badge variant={payment.status === "paid" ? "default" : "outline"}>
                          {payment.status === "paid" ? "Paid" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant={payment.status === "paid" ? "outline" : "default"}
                  size="sm"
                  onClick={() => (payment.status === "paid" ? handleDownload(payment.id, payment.invoiceNumber) : null)}
                >
                  {payment.status === "paid" ? (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download Receipt
                    </>
                  ) : (
                    "Pay Now"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

