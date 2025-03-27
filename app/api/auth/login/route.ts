import { NextResponse } from "next/server"
import { loginUser } from "@/lib/auth-service"
import { initializeDatabase } from "@/lib/init-db"

// Inicializar la base de datos
initializeDatabase().catch(console.error)

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validación básica
    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    // Iniciar sesión
    const result = await loginUser({ email, password })

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 401 })
    }

    return NextResponse.json({
      token: result.token,
      user: result.user,
      message: result.message,
    })
  } catch (error) {
    console.error("Error de inicio de sesión:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

