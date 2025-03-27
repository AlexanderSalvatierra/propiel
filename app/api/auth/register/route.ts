import { NextResponse } from "next/server"
import { registerUser } from "@/lib/auth-service"
import { initializeDatabase } from "@/lib/init-db"

// Inicializar la base de datos
initializeDatabase().catch(console.error)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Datos de registro recibidos:", body)

    const { firstName, lastName, email, password } = body

    // Validación básica
    if (!firstName || !lastName || !email || !password) {
      console.log("Validación fallida: campos faltantes")
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Registrar el usuario (siempre como paciente)
    const result = await registerUser({
      firstName,
      lastName,
      email,
      password,
      role: "patient",
    })

    console.log("Resultado del registro:", { success: result.success, message: result.message })

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({
      message: result.message,
      user: result.user,
      token: result.token, // Asegurarse de devolver el token
    })
  } catch (error) {
    console.error("Error de registro:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

