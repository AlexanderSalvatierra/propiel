import { NextResponse } from "next/server"
import { getAppointmentsByPatientId } from "@/lib/appointment-service"
import { verifyToken } from "@/lib/auth-service"

// Obtener citas por ID de paciente
export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    // Obtener ID del paciente
    const patientId = params.id

    // Obtener citas
    const appointments = await getAppointmentsByPatientId(patientId)

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error("Error al obtener citas del paciente:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

