import { NextResponse } from "next/server"
import { getPrescriptionsByPatientId } from "@/lib/prescription-service"
import { verifyToken } from "@/lib/auth-service"

// Obtener recetas por ID de paciente
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

    // Verificar si el usuario es el paciente o un doctor/enfermera
    if (auth.user.role === "patient" && auth.user.id !== patientId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    // Obtener recetas
    const prescriptions = await getPrescriptionsByPatientId(patientId)

    return NextResponse.json({ prescriptions })
  } catch (error) {
    console.error("Error al obtener recetas del paciente:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

