import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    // Intentar una consulta simple para verificar la conexión
    const result = await sql`SELECT NOW() as time`

    return NextResponse.json({
      success: true,
      message: "Conexión a la base de datos exitosa",
      time: result.rows[0].time,
      postgresUrl: process.env.POSTGRES_URL ? "Configurado" : "No configurado",
    })
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Error al conectar con la base de datos",
        error: error instanceof Error ? error.message : String(error),
        postgresUrl: process.env.POSTGRES_URL ? "Configurado (pero con error)" : "No configurado",
      },
      { status: 500 },
    )
  }
}

