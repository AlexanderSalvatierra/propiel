import { NextResponse } from "next/server"
import { updateAppointment, deleteAppointment } from "@/lib/appointment-service"
import { verifyToken } from "@/lib/auth-service"

// Actualizar una cita
export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    // Obtener ID de la cita
    const appointmentId = params.id

    // Obtener datos de actualización
    const updateData = await request.json()

    // Actualizar cita
    const result = await updateAppointment(appointmentId, updateData)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({
      message: result.message,
    })
  } catch (error) {
    console.error("Error al actualizar cita:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// Eliminar una cita
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

    // Obtener ID de la cita
    const appointmentId = params.id

    // Eliminar cita
    const result = await deleteAppointment(appointmentId)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({
      message: result.message,
    })
  } catch (error) {
    console.error("Error al eliminar cita:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

