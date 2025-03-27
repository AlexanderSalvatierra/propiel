import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

// Función para inicializar la base de datos
async function initializeDatabase() {
  try {
    console.log("Iniciando inicialización de la base de datos...")

    // Crear tabla de usuarios si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("Tabla 'users' creada o verificada")

    // Crear tabla de citas si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        doctor_id TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        status TEXT NOT NULL,
        reason TEXT,
        notes TEXT,
        location TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users (id),
        FOREIGN KEY (doctor_id) REFERENCES users (id)
      )
    `
    console.log("Tabla 'appointments' creada o verificada")

    // Crear tabla de recetas si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        doctor_id TEXT NOT NULL,
        medication TEXT NOT NULL,
        dosage TEXT NOT NULL,
        frequency TEXT NOT NULL,
        date_issued TEXT NOT NULL,
        expiry_date TEXT NOT NULL,
        refills_remaining INTEGER NOT NULL,
        instructions TEXT,
        status TEXT NOT NULL,
        refill_requested BOOLEAN NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users (id),
        FOREIGN KEY (doctor_id) REFERENCES users (id)
      )
    `
    console.log("Tabla 'prescriptions' creada o verificada")

    // Crear tabla de registros médicos si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS medical_records (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        doctor_id TEXT NOT NULL,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        summary TEXT,
        details TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users (id),
        FOREIGN KEY (doctor_id) REFERENCES users (id)
      )
    `
    console.log("Tabla 'medical_records' creada o verificada")

    // Crear tabla de signos vitales si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS vitals (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        nurse_id TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        temperature TEXT,
        blood_pressure TEXT,
        heart_rate TEXT,
        respiratory_rate TEXT,
        weight TEXT,
        height TEXT,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users (id),
        FOREIGN KEY (nurse_id) REFERENCES users (id)
      )
    `
    console.log("Tabla 'vitals' creada o verificada")

    return {
      success: true,
      message: "Base de datos inicializada correctamente",
    }
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error)
    throw error
  }
}

export async function GET() {
  try {
    const result = await initializeDatabase()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error en la ruta de inicialización de la base de datos:", error)
    return NextResponse.json(
      {
        error: "Error al inicializar la base de datos",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

