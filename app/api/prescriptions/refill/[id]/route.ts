import { NextResponse } from "next/server"
import { requestPrescriptionRefill, approvePrescriptionRefill } from "@/lib/prescription-service"
import { verifyToken } from "@/lib/auth-service"

// Solicitar recarga de receta
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const auth = await verifyToken(token)

    if (!auth.valid || !auth.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Obtener ID de la receta
    const prescriptionId = params.id

    // Solicitar recarga
    const result = await requestPrescriptionRefill(prescriptionId)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({
      message: result.message,
    })
  } catch (error) {
    console.error("Error al solicitar recarga:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// Aprobar recarga de receta
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const auth = await verifyToken(token)

    if (!auth.valid || !auth.user || auth.user.role !== "doctor") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Obtener ID de la receta
    const prescriptionId = params.id

    // Aprobar recarga
    const result = await approvePrescriptionRefill(prescriptionId)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({
      message: result.message,
    })
  } catch (error) {
    console.error("Error al aprobar recarga:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

