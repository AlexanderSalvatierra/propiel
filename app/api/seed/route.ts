import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import bcryptjs from "bcryptjs"
import { sql } from "@vercel/postgres"

// Función para crear usuarios de prueba
async function createTestUsers() {
  try {
    // Verificar si ya existen usuarios con estos correos
    const existingDoctorResult = await sql`SELECT * FROM users WHERE email = 'doctor@propiel.com'`
    const existingNurseResult = await sql`SELECT * FROM users WHERE email = 'enfermera@propiel.com'`

    // Si no existe el doctor, crearlo
    if (existingDoctorResult.rows.length === 0) {
      const doctorId = `user_${uuidv4()}`
      const hashedPassword = await bcryptjs.hash("doctor123", 10)

      await sql`
        INSERT INTO users (id, first_name, last_name, email, password, role, created_at) 
        VALUES (${doctorId}, 'Carlos', 'Rodríguez', 'doctor@propiel.com', ${hashedPassword}, 'doctor', ${new Date().toISOString()})
      `

      console.log("Usuario doctor creado exitosamente")
    } else {
      console.log("El usuario doctor ya existe")
    }

    // Si no existe la enfermera, crearla
    if (existingNurseResult.rows.length === 0) {
      const nurseId = `user_${uuidv4()}`
      const hashedPassword = await bcryptjs.hash("enfermera123", 10)

      await sql`
        INSERT INTO users (id, first_name, last_name, email, password, role, created_at) 
        VALUES (${nurseId}, 'María', 'López', 'enfermera@propiel.com', ${hashedPassword}, 'nurse', ${new Date().toISOString()})
      `

      console.log("Usuario enfermera creado exitosamente")
    } else {
      console.log("El usuario enfermera ya existe")
    }

    return {
      success: true,
      message: "Usuarios de prueba creados exitosamente",
      credentials: [
        { role: "doctor", email: "doctor@propiel.com", password: "doctor123" },
        { role: "nurse", email: "enfermera@propiel.com", password: "enfermera123" },
      ],
    }
  } catch (error) {
    console.error("Error al crear usuarios de prueba:", error)
    throw error
  }
}

export async function GET() {
  try {
    const result = await createTestUsers()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error en la ruta de seed:", error)
    return NextResponse.json({ error: "Error al crear usuarios de prueba" }, { status: 500 })
  }
}

