import { getDb } from "./db"
import { v4 as uuidv4 } from "uuid"

export interface Prescription {
  id: string
  patientId: string
  doctorId: string
  medication: string
  dosage: string
  frequency: string
  dateIssued: string
  expiryDate: string
  refillsRemaining: number
  instructions?: string
  status: string
  refillRequested: boolean
  createdAt: string
  patient?: {
    firstName: string
    lastName: string
  }
  doctor?: {
    firstName: string
    lastName: string
  }
}

// Obtener todas las recetas
export async function getAllPrescriptions(): Promise<Prescription[]> {
  try {
    const db = await getDb()

    const prescriptions = await db.all(`
      SELECT 
        p.*,
        pat.firstName as patientFirstName,
        pat.lastName as patientLastName,
        doc.firstName as doctorFirstName,
        doc.lastName as doctorLastName
      FROM prescriptions p
      JOIN users pat ON p.patientId = pat.id
      JOIN users doc ON p.doctorId = doc.id
      ORDER BY p.dateIssued DESC
    `)

    return prescriptions.map((prescription) => ({
      id: prescription.id,
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
      medication: prescription.medication,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      dateIssued: prescription.dateIssued,
      expiryDate: prescription.expiryDate,
      refillsRemaining: prescription.refillsRemaining,
      instructions: prescription.instructions,
      status: prescription.status,
      refillRequested: Boolean(prescription.refillRequested),
      createdAt: prescription.createdAt,
      patient: {
        firstName: prescription.patientFirstName,
        lastName: prescription.patientLastName,
      },
      doctor: {
        firstName: prescription.doctorFirstName,
        lastName: prescription.doctorLastName,
      },
    }))
  } catch (error) {
    console.error("Error al obtener recetas:", error)
    return []
  }
}

// Obtener recetas por ID de paciente
export async function getPrescriptionsByPatientId(patientId: string): Promise<Prescription[]> {
  try {
    const db = await getDb()

    const prescriptions = await db.all(
      `
      SELECT 
        p.*,
        doc.firstName as doctorFirstName,
        doc.lastName as doctorLastName
      FROM prescriptions p
      JOIN users doc ON p.doctorId = doc.id
      WHERE p.patientId = ?
      ORDER BY p.dateIssued DESC
    `,
      [patientId],
    )

    return prescriptions.map((prescription) => ({
      id: prescription.id,
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
      medication: prescription.medication,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      dateIssued: prescription.dateIssued,
      expiryDate: prescription.expiryDate,
      refillsRemaining: prescription.refillsRemaining,
      instructions: prescription.instructions,
      status: prescription.status,
      refillRequested: Boolean(prescription.refillRequested),
      createdAt: prescription.createdAt,
      doctor: {
        firstName: prescription.doctorFirstName,
        lastName: prescription.doctorLastName,
      },
    }))
  } catch (error) {
    console.error("Error al obtener recetas del paciente:", error)
    return []
  }
}

// Obtener recetas por ID de doctor
export async function getPrescriptionsByDoctorId(doctorId: string): Promise<Prescription[]> {
  try {
    const db = await getDb()

    const prescriptions = await db.all(
      `
      SELECT 
        p.*,
        pat.firstName as patientFirstName,
        pat.lastName as patientLastName
      FROM prescriptions p
      JOIN users pat ON p.patientId = pat.id
      WHERE p.doctorId = ?
      ORDER BY p.dateIssued DESC
    `,
      [doctorId],
    )

    return prescriptions.map((prescription) => ({
      id: prescription.id,
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
      medication: prescription.medication,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      dateIssued: prescription.dateIssued,
      expiryDate: prescription.expiryDate,
      refillsRemaining: prescription.refillsRemaining,
      instructions: prescription.instructions,
      status: prescription.status,
      refillRequested: Boolean(prescription.refillRequested),
      createdAt: prescription.createdAt,
      patient: {
        firstName: prescription.patientFirstName,
        lastName: prescription.patientLastName,
      },
    }))
  } catch (error) {
    console.error("Error al obtener recetas del doctor:", error)
    return []
  }
}

// Crear una nueva receta
export async function createPrescription(prescriptionData: {
  patientId: string
  doctorId: string
  medication: string
  dosage: string
  frequency: string
  expiryDate: string
  refillsRemaining: number
  instructions?: string
}): Promise<{ success: boolean; prescription?: Prescription; message: string }> {
  try {
    const db = await getDb()

    // Generar un ID único
    const prescriptionId = `prescription_${uuidv4()}`
    const dateIssued = new Date().toISOString().split("T")[0]

    // Insertar la nueva receta
    await db.run(
      `INSERT INTO prescriptions 
       (id, patientId, doctorId, medication, dosage, frequency, dateIssued, expiryDate, refillsRemaining, instructions, status, refillRequested, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        prescriptionId,
        prescriptionData.patientId,
        prescriptionData.doctorId,
        prescriptionData.medication,
        prescriptionData.dosage,
        prescriptionData.frequency,
        dateIssued,
        prescriptionData.expiryDate,
        prescriptionData.refillsRemaining,
        prescriptionData.instructions || null,
        "active",
        0, // refillRequested = false
        new Date().toISOString(),
      ],
    )

    // Obtener la receta recién creada
    const newPrescription = await db.get("SELECT * FROM prescriptions WHERE id = ?", [prescriptionId])

    return {
      success: true,
      prescription: {
        ...newPrescription,
        refillRequested: Boolean(newPrescription.refillRequested),
      },
      message: "Receta creada exitosamente",
    }
  } catch (error) {
    console.error("Error al crear receta:", error)
    return {
      success: false,
      message: "Error al crear la receta",
    }
  }
}

// Actualizar una receta
export async function updatePrescription(
  prescriptionId: string,
  updateData: {
    medication?: string
    dosage?: string
    frequency?: string
    expiryDate?: string
    refillsRemaining?: number
    instructions?: string
    status?: string
    refillRequested?: boolean
  },
): Promise<{ success: boolean; message: string }> {
  try {
    const db = await getDb()

    // Verificar si la receta existe
    const prescription = await db.get("SELECT * FROM prescriptions WHERE id = ?", [prescriptionId])
    if (!prescription) {
      return {
        success: false,
        message: "Receta no encontrada",
      }
    }

    // Construir la consulta de actualización
    let updateQuery = "UPDATE prescriptions SET "
    const updateValues = []

    if (updateData.medication) {
      updateQuery += "medication = ?, "
      updateValues.push(updateData.medication)
    }

    if (updateData.dosage) {
      updateQuery += "dosage = ?, "
      updateValues.push(updateData.dosage)
    }

    if (updateData.frequency) {
      updateQuery += "frequency = ?, "
      updateValues.push(updateData.frequency)
    }

    if (updateData.expiryDate) {
      updateQuery += "expiryDate = ?, "
      updateValues.push(updateData.expiryDate)
    }

    if (updateData.refillsRemaining !== undefined) {
      updateQuery += "refillsRemaining = ?, "
      updateValues.push(updateData.refillsRemaining)
    }

    if (updateData.instructions !== undefined) {
      updateQuery += "instructions = ?, "
      updateValues.push(updateData.instructions)
    }

    if (updateData.status) {
      updateQuery += "status = ?, "
      updateValues.push(updateData.status)
    }

    if (updateData.refillRequested !== undefined) {
      updateQuery += "refillRequested = ?, "
      updateValues.push(updateData.refillRequested ? 1 : 0)
    }

    // Eliminar la coma final y agregar la condición WHERE
    updateQuery = updateQuery.slice(0, -2) + " WHERE id = ?"
    updateValues.push(prescriptionId)

    // Ejecutar la actualización
    await db.run(updateQuery, updateValues)

    return {
      success: true,
      message: "Receta actualizada exitosamente",
    }
  } catch (error) {
    console.error("Error al actualizar receta:", error)
    return {
      success: false,
      message: "Error al actualizar la receta",
    }
  }
}

// Solicitar recarga de receta
export async function requestPrescriptionRefill(
  prescriptionId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const db = await getDb()

    // Verificar si la receta existe
    const prescription = await db.get("SELECT * FROM prescriptions WHERE id = ?", [prescriptionId])
    if (!prescription) {
      return {
        success: false,
        message: "Receta no encontrada",
      }
    }

    // Verificar si la receta está activa
    if (prescription.status !== "active") {
      return {
        success: false,
        message: "Solo se pueden solicitar recargas para recetas activas",
      }
    }

    // Verificar si quedan recargas disponibles
    if (prescription.refillsRemaining <= 0) {
      return {
        success: false,
        message: "No quedan recargas disponibles para esta receta",
      }
    }

    // Actualizar el estado de solicitud de recarga
    await db.run("UPDATE prescriptions SET refillRequested = ? WHERE id = ?", [1, prescriptionId])

    return {
      success: true,
      message: "Solicitud de recarga enviada exitosamente",
    }
  } catch (error) {
    console.error("Error al solicitar recarga:", error)
    return {
      success: false,
      message: "Error al solicitar la recarga",
    }
  }
}

// Aprobar recarga de receta
export async function approvePrescriptionRefill(
  prescriptionId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const db = await getDb()

    // Verificar si la receta existe
    const prescription = await db.get("SELECT * FROM prescriptions WHERE id = ?", [prescriptionId])
    if (!prescription) {
      return {
        success: false,
        message: "Receta no encontrada",
      }
    }

    // Verificar si hay una solicitud de recarga pendiente
    if (!prescription.refillRequested) {
      return {
        success: false,
        message: "No hay solicitud de recarga pendiente para esta receta",
      }
    }

    // Actualizar la receta
    await db.run("UPDATE prescriptions SET refillRequested = ?, refillsRemaining = ? WHERE id = ?", [
      0,
      prescription.refillsRemaining - 1,
      prescriptionId,
    ])

    return {
      success: true,
      message: "Recarga aprobada exitosamente",
    }
  } catch (error) {
    console.error("Error al aprobar recarga:", error)
    return {
      success: false,
      message: "Error al aprobar la recarga",
    }
  }
}

