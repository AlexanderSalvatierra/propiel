import { NextResponse } from "next/server"
import { getAllPrescriptions, createPrescription } from "@/lib/prescription-service"
import { verifyToken } from "@/lib/auth-service"

// Obtener todas las recetas
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

    // Obtener recetas
    const prescriptions = await getAllPrescriptions()

    return NextResponse.json({ prescriptions })
  } catch (error) {
    console.error("Error al obtener recetas:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// Crear una nueva receta
export async function POST(request: Request) {
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

    // Obtener datos de la receta
    const prescriptionData = await request.json()

    // Validación básica
    if (
      !prescriptionData.patientId ||
      !prescriptionData.doctorId ||
      !prescriptionData.medication ||
      !prescriptionData.dosage ||
      !prescriptionData.frequency ||
      !prescriptionData.expiryDate
    ) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    // Crear receta
    const result = await createPrescription(prescriptionData)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({
      message: result.message,
      prescription: result.prescription,
    })
  } catch (error) {
    console.error("Error al crear receta:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

