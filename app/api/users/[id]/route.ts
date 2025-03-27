import { NextResponse } from "next/server"
import { updateUser, deleteUser } from "@/lib/user-service"
import { verifyToken } from "@/lib/auth-service"

// Actualizar un usuario
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

    // Obtener ID del usuario
    const userId = params.id

    // Verificar si el usuario es el mismo o un doctor
    if (auth.user.role !== "doctor" && auth.user.id !== userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    // Obtener datos de actualización
    const updateData = await request.json()

    // Si no es doctor, no puede cambiar el rol
    if (auth.user.role !== "doctor" && updateData.role) {
      delete updateData.role
    }

    // Actualizar usuario
    const result = await updateUser(userId, updateData)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({
      message: result.message,
    })
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// Eliminar un usuario
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

    // Obtener ID del usuario
    const userId = params.id

    // Eliminar usuario
    const result = await deleteUser(userId)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({
      message: result.message,
    })
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

