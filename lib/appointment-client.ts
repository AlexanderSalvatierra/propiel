import { getToken } from "./auth-client"
import type { Appointment } from "./appointment-service"

// Obtener todas las citas
export async function fetchAllAppointments(): Promise<{
  success: boolean
  appointments?: Appointment[]
  message?: string
}> {
  try {
    const token = getToken()
    if (!token) {
      return {
        success: false,
        message: "No autorizado",
      }
    }

    const response = await fetch("/api/appointments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Error al obtener citas",
      }
    }

    return {
      success: true,
      appointments: data.appointments,
    }
  } catch (error) {
    console.error("Error al obtener citas:", error)
    return {
      success: false,
      message: "Error al conectar con el servidor",
    }
  }
}

// Obtener citas por ID de paciente
export async function fetchPatientAppointments(patientId: string): Promise<{
  success: boolean
  appointments?: Appointment[]
  message?: string
}> {
  try {
    const token = getToken()
    if (!token) {
      return {
        success: false,
        message: "No autorizado",
      }
    }

    const response = await fetch(`/api/appointments/patient/${patientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Error al obtener citas",
      }
    }

    return {
      success: true,
      appointments: data.appointments,
    }
  } catch (error) {
    console.error("Error al obtener citas del paciente:", error)
    return {
      success: false,
      message: "Error al conectar con el servidor",
    }
  }
}

// Obtener citas por ID de doctor
export async function fetchDoctorAppointments(doctorId: string): Promise<{
  success: boolean
  appointments?: Appointment[]
  message?: string
}> {
  try {
    const token = getToken()
    if (!token) {
      return {
        success: false,
        message: "No autorizado",
      }
    }

    const response = await fetch(`/api/appointments/doctor/${doctorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Error al obtener citas",
      }
    }

    return {
      success: true,
      appointments: data.appointments,
    }
  } catch (error) {
    console.error("Error al obtener citas del doctor:", error)
    return {
      success: false,
      message: "Error al conectar con el servidor",
    }
  }
}

// Crear una nueva cita
export async function createNewAppointment(appointmentData: {
  patientId: string
  doctorId: string
  date: string
  time: string
  reason?: string
  location?: string
}): Promise<{
  success: boolean
  appointment?: Appointment
  message: string
}> {
  try {
    const token = getToken()
    if (!token) {
      return {
        success: false,
        message: "No autorizado",
      }
    }

    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Error al crear cita",
      }
    }

    return {
      success: true,
      appointment: data.appointment,
      message: data.message || "Cita creada exitosamente",
    }
  } catch (error) {
    console.error("Error al crear cita:", error)
    return {
      success: false,
      message: "Error al conectar con el servidor",
    }
  }
}

// Actualizar una cita
export async function updateExistingAppointment(
  appointmentId: string,
  updateData: {
    date?: string
    time?: string
    status?: string
    reason?: string
    notes?: string
    location?: string
  },
): Promise<{
  success: boolean
  message: string
}> {
  try {
    const token = getToken()
    if (!token) {
      return {
        success: false,
        message: "No autorizado",
      }
    }

    const response = await fetch(`/api/appointments/${appointmentId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Error al actualizar cita",
      }
    }

    return {
      success: true,
      message: data.message || "Cita actualizada exitosamente",
    }
  } catch (error) {
    console.error("Error al actualizar cita:", error)
    return {
      success: false,
      message: "Error al conectar con el servidor",
    }
  }
}

// Eliminar una cita
export async function deleteExistingAppointment(appointmentId: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    const token = getToken()
    if (!token) {
      return {
        success: false,
        message: "No autorizado",
      }
    }

    const response = await fetch(`/api/appointments/${appointmentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Error al eliminar cita",
      }
    }

    return {
      success: true,
      message: data.message || "Cita eliminada exitosamente",
    }
  } catch (error) {
    console.error("Error al eliminar cita:", error)
    return {
      success: false,
      message: "Error al conectar con el servidor",
    }
  }
}

