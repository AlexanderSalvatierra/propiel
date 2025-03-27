import { sql } from "@vercel/postgres"

// Función para ejecutar consultas SQL
export async function query(text: string, params: any[] = []) {
  try {
    const result = await sql.query(text, params)
    return result
  } catch (error) {
    console.error("Error executing query:", error)
    throw error
  }
}

// Función para obtener la conexión a la base de datos (compatibilidad con código existente)
export async function getDb() {
  return {
    query: async (text: string, params: any[] = []) => {
      const result = await query(text, params)
      return result
    },
    all: async (text: string, params: any[] = []) => {
      const result = await query(text, params)
      return result.rows
    },
    get: async (text: string, params: any[] = []) => {
      const result = await query(text, params)
      return result.rows[0] || null
    },
    run: async (text: string, params: any[] = []) => {
      await query(text, params)
      return true
    },
    config: {
      pool: {
        query: async (text: string, params: any[] = []) => {
          return await query(text, params)
        },
      },
    },
  }
}

// Función para cerrar la conexión a la base de datos (no es necesaria con @vercel/postgres)
export async function closeDb() {
  // No es necesario cerrar la conexión con @vercel/postgres
  return true
}

// Función para ejecutar migraciones
export async function runMigrations() {
  console.log("Migrations completed")
}

// Función para verificar si las tablas existen y crearlas si no
export async function initDb() {
  try {
    // Crear tabla de usuarios si no existe
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Crear tabla de citas si no existe
    await query(`
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
    `)

    // Crear tabla de recetas si no existe
    await query(`
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
    `)

    // Crear tabla de registros médicos si no existe
    await query(`
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
    `)

    // Crear tabla de signos vitales si no existe
    await query(`
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
    `)

    console.log("Database tables initialized")
  } catch (error) {
    console.error("Error initializing database tables:", error)
    throw error
  }
}

