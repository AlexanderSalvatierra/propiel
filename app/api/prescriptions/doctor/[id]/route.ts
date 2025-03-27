import { NextResponse } from "next/server"
import { getPrescriptionsByDoctorId } from "@/lib/prescription-service"
import { verifyToken } from "@/lib/auth-service"

// Obtener recetas por ID de doctor
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

    // Obtener ID del doctor
    const doctorId = params.id

    // Verificar si el usuario es el doctor o un administrador
    if (auth.user.role === "doctor" && auth.user.id !== doctorId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    // Obtener recetas
    const prescriptions = await getPrescriptionsByDoctorId(doctorId)

    return NextResponse.json({ prescriptions })
  } catch (error) {
    console.error("Error al obtener recetas del doctor:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

