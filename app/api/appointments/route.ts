import { NextResponse } from "next/server"
import { getAllAppointments, createAppointment } from "@/lib/appointment-service"
import { verifyToken } from "@/lib/auth-service"

// Obtener todas las citas
export async function GET(request: Request) {
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

    // Obtener citas
    const appointments = await getAllAppointments()

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error("Error al obtener citas:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// Crear una nueva cita
export async function POST(request: Request) {
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

    // Obtener datos de la cita
    const appointmentData = await request.json()

    // Validación básica
    if (!appointmentData.patientId || !appointmentData.doctorId || !appointmentData.date || !appointmentData.time) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    // Crear cita
    const result = await createAppointment(appointmentData)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({
      message: result.message,
      appointment: result.appointment,
    })
  } catch (error) {
    console.error("Error al crear cita:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

