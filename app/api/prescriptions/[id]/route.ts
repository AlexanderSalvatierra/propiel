import { NextResponse } from "next/server"
import { updatePrescription } from "@/lib/prescription-service"
import { verifyToken } from "@/lib/auth-service"

// Actualizar una receta
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

    // Verificar si es doctor (solo los doctores pueden actualizar recetas)
    if (auth.user.role !== "doctor") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    // Obtener ID de la receta
    const prescriptionId = params.id

    // Obtener datos de actualización
    const updateData = await request.json()

    // Actualizar receta
    const result = await updatePrescription(prescriptionId, updateData)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({
      message: result.message,
    })
  } catch (error) {
    console.error("Error al actualizar receta:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

