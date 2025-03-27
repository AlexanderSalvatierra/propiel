import { NextResponse } from "next/server"
import { getUsersByRole } from "@/lib/user-service"
import { verifyToken } from "@/lib/auth-service"

// Obtener usuarios por rol
export async function GET(request: Request, { params }: { params: { role: string } }) {
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

    // Obtener rol
    const role = params.role

    // Validar rol
    if (!["patient", "doctor", "nurse"].includes(role)) {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 })
    }

    // Obtener usuarios
    const users = await getUsersByRole(role)

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error al obtener usuarios por rol:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

