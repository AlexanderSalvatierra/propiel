import { NextResponse } from "next/server"
import { getAllUsers, createUser } from "@/lib/user-service"
import { verifyToken } from "@/lib/auth-service"

// Obtener todos los usuarios
export async function GET(request: Request) {
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

    // Obtener usuarios
    const users = await getAllUsers()

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// Crear un nuevo usuario
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

    // Obtener datos del usuario
    const userData = await request.json()

    // Validación básica
    if (!userData.firstName || !userData.lastName || !userData.email || !userData.password || !userData.role) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    // Crear usuario
    const result = await createUser(userData)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({
      message: result.message,
      user: result.user,
    })
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

