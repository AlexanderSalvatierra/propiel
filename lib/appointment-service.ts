import { getDb } from "./db"
import { v4 as uuidv4 } from "uuid"

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  date: string
  time: string
  status: string
  reason?: string
  notes?: string
  location?: string
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

// Obtener todas las citas
export async function getAllAppointments(): Promise<Appointment[]> {
  try {
    const db = await getDb()

    const appointments = await db.all(`
      SELECT 
        a.*,
        p.firstName as patientFirstName,
        p.lastName as patientLastName,
        d.firstName as doctorFirstName,
        d.lastName as doctorLastName
      FROM appointments a
      JOIN users p ON a.patientId = p.id
      JOIN users d ON a.doctorId = d.id
      ORDER BY a.date DESC, a.time ASC
    `)

    return appointments.map((appointment) => ({
      id: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      reason: appointment.reason,
      notes: appointment.notes,
      location: appointment.location,
      createdAt: appointment.createdAt,
      patient: {
        firstName: appointment.patientFirstName,
        lastName: appointment.patientLastName,
      },
      doctor: {
        firstName: appointment.doctorFirstName,
        lastName: appointment.doctorLastName,
      },
    }))
  } catch (error) {
    console.error("Error al obtener citas:", error)
    return []
  }
}

// Obtener citas por ID de paciente
export async function getAppointmentsByPatientId(patientId: string): Promise<Appointment[]> {
  try {
    const db = await getDb()

    const appointments = await db.all(
      `
      SELECT 
        a.*,
        d.firstName as doctorFirstName,
        d.lastName as doctorLastName
      FROM appointments a
      JOIN users d ON a.doctorId = d.id
      WHERE a.patientId = ?
      ORDER BY a.date DESC, a.time ASC
    `,
      [patientId],
    )

    return appointments.map((appointment) => ({
      id: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      reason: appointment.reason,
      notes: appointment.notes,
      location: appointment.location,
      createdAt: appointment.createdAt,
      doctor: {
        firstName: appointment.doctorFirstName,
        lastName: appointment.doctorLastName,
      },
    }))
  } catch (error) {
    console.error("Error al obtener citas del paciente:", error)
    return []
  }
}

// Obtener citas por ID de doctor
export async function getAppointmentsByDoctorId(doctorId: string): Promise<Appointment[]> {
  try {
    const db = await getDb()

    const appointments = await db.all(
      `
      SELECT 
        a.*,
        p.firstName as patientFirstName,
        p.lastName as patientLastName
      FROM appointments a
      JOIN users p ON a.patientId = p.id
      WHERE a.doctorId = ?
      ORDER BY a.date DESC, a.time ASC
    `,
      [doctorId],
    )

    return appointments.map((appointment) => ({
      id: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      reason: appointment.reason,
      notes: appointment.notes,
      location: appointment.location,
      createdAt: appointment.createdAt,
      patient: {
        firstName: appointment.patientFirstName,
        lastName: appointment.patientLastName,
      },
    }))
  } catch (error) {
    console.error("Error al obtener citas del doctor:", error)
    return []
  }
}

// Crear una nueva cita
export async function createAppointment(appointmentData: {
  patientId: string
  doctorId: string
  date: string
  time: string
  reason?: string
  location?: string
}): Promise<{ success: boolean; appointment?: Appointment; message: string }> {
  try {
    const db = await getDb()

    // Verificar si ya existe una cita para ese doctor en esa fecha y hora
    const existingAppointment = await db.get(
      'SELECT * FROM appointments WHERE doctorId = ? AND date = ? AND time = ? AND status != "cancelled"',
      [appointmentData.doctorId, appointmentData.date, appointmentData.time],
    )

    if (existingAppointment) {
      return {
        success: false,
        message: "Ya existe una cita programada para esta fecha y hora",
      }
    }

    // Generar un ID único
    const appointmentId = `appointment_${uuidv4()}`

    // Insertar la nueva cita
    await db.run(
      `INSERT INTO appointments 
       (id, patientId, doctorId, date, time, status, reason, location, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        appointmentId,
        appointmentData.patientId,
        appointmentData.doctorId,
        appointmentData.date,
        appointmentData.time,
        "confirmed",
        appointmentData.reason || null,
        appointmentData.location || null,
        new Date().toISOString(),
      ],
    )

    // Obtener la cita recién creada
    const newAppointment = await db.get("SELECT * FROM appointments WHERE id = ?", [appointmentId])

    return {
      success: true,
      appointment: newAppointment,
      message: "Cita creada exitosamente",
    }
  } catch (error) {
    console.error("Error al crear cita:", error)
    return {
      success: false,
      message: "Error al crear la cita",
    }
  }
}

// Actualizar una cita
export async function updateAppointment(
  appointmentId: string,
  updateData: {
    date?: string
    time?: string
    status?: string
    reason?: string
    notes?: string
    location?: string
  },
): Promise<{ success: boolean; message: string }> {
  try {
    const db = await getDb()

    // Verificar si la cita existe
    const appointment = await db.get("SELECT * FROM appointments WHERE id = ?", [appointmentId])
    if (!appointment) {
      return {
        success: false,
        message: "Cita no encontrada",
      }
    }

    // Si se está cambiando la fecha/hora, verificar disponibilidad
    if ((updateData.date || updateData.time) && updateData.status !== "cancelled") {
      const newDate = updateData.date || appointment.date
      const newTime = updateData.time || appointment.time

      const existingAppointment = await db.get(
        'SELECT * FROM appointments WHERE doctorId = ? AND date = ? AND time = ? AND id != ? AND status != "cancelled"',
        [appointment.doctorId, newDate, newTime, appointmentId],
      )

      if (existingAppointment) {
        return {
          success: false,
          message: "Ya existe una cita programada para esta fecha y hora",
        }
      }
    }

    // Construir la consulta de actualización
    let updateQuery = "UPDATE appointments SET "
    const updateValues = []

    if (updateData.date) {
      updateQuery += "date = ?, "
      updateValues.push(updateData.date)
    }

    if (updateData.time) {
      updateQuery += "time = ?, "
      updateValues.push(updateData.time)
    }

    if (updateData.status) {
      updateQuery += "status = ?, "
      updateValues.push(updateData.status)
    }

    if (updateData.reason !== undefined) {
      updateQuery += "reason = ?, "
      updateValues.push(updateData.reason)
    }

    if (updateData.notes !== undefined) {
      updateQuery += "notes = ?, "
      updateValues.push(updateData.notes)
    }

    if (updateData.location !== undefined) {
      updateQuery += "location = ?, "
      updateValues.push(updateData.location)
    }

    // Eliminar la coma final y agregar la condición WHERE
    updateQuery = updateQuery.slice(0, -2) + " WHERE id = ?"
    updateValues.push(appointmentId)

    // Ejecutar la actualización
    await db.run(updateQuery, updateValues)

    return {
      success: true,
      message: "Cita actualizada exitosamente",
    }
  } catch (error) {
    console.error("Error al actualizar cita:", error)
    return {
      success: false,
      message: "Error al actualizar la cita",
    }
  }
}

// Eliminar una cita
export async function deleteAppointment(appointmentId: string): Promise<{ success: boolean; message: string }> {
  try {
    const db = await getDb()

    // Verificar si la cita existe
    const appointment = await db.get("SELECT * FROM appointments WHERE id = ?", [appointmentId])
    if (!appointment) {
      return {
        success: false,
        message: "Cita no encontrada",
      }
    }

    // Eliminar la cita
    await db.run("DELETE FROM appointments WHERE id = ?", [appointmentId])

    return {
      success: true,
      message: "Cita eliminada exitosamente",
    }
  } catch (error) {
    console.error("Error al eliminar cita:", error)
    return {
      success: false,
      message: "Error al eliminar la cita",
    }
  }
}

