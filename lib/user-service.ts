import { getDb } from "./db"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  createdAt: string
}

// Obtener todos los usuarios
export async function getAllUsers(): Promise<User[]> {
  try {
    const db = await getDb()

    const users = await db.all(`
      SELECT id, firstName, lastName, email, role, createdAt
      FROM users
      ORDER BY createdAt DESC
    `)

    return users
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return []
  }
}

// Obtener usuarios por rol
export async function getUsersByRole(role: string): Promise<User[]> {
  try {
    const db = await getDb()

    const users = await db.all(
      `
      SELECT id, firstName, lastName, email, role, createdAt
      FROM users
      WHERE role = ?
      ORDER BY createdAt DESC
    `,
      [role],
    )

    return users
  } catch (error) {
    console.error(`Error al obtener usuarios con rol ${role}:`, error)
    return []
  }
}

// Obtener un usuario por ID
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const db = await getDb()

    const user = await db.get(
      `
      SELECT id, firstName, lastName, email, role, createdAt
      FROM users
      WHERE id = ?
    `,
      [userId],
    )

    return user || null
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error)
    return null
  }
}

// Crear un nuevo usuario
export async function createUser(userData: {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
}): Promise<{ success: boolean; user?: User; message: string }> {
  try {
    const db = await getDb()

    // Verificar si el correo ya existe
    const existingUser = await db.get("SELECT * FROM users WHERE email = ?", [userData.email])
    if (existingUser) {
      return {
        success: false,
        message: "El correo electrónico ya está registrado",
      }
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    // Generar un ID único
    const userId = `user_${uuidv4()}`

    // Insertar el nuevo usuario
    await db.run(
      "INSERT INTO users (id, firstName, lastName, email, password, role, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        userData.firstName,
        userData.lastName,
        userData.email,
        hashedPassword,
        userData.role,
        new Date().toISOString(),
      ],
    )

    // Obtener el usuario recién creado (sin la contraseña)
    const newUser = await db.get("SELECT id, firstName, lastName, email, role, createdAt FROM users WHERE id = ?", [
      userId,
    ])

    return {
      success: true,
      user: newUser,
      message: "Usuario creado exitosamente",
    }
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return {
      success: false,
      message: "Error al crear el usuario",
    }
  }
}

// Actualizar un usuario
export async function updateUser(
  userId: string,
  updateData: {
    firstName?: string
    lastName?: string
    email?: string
    role?: string
    password?: string
  },
): Promise<{ success: boolean; message: string }> {
  try {
    const db = await getDb()

    // Verificar si el usuario existe
    const user = await db.get("SELECT * FROM users WHERE id = ?", [userId])
    if (!user) {
      return {
        success: false,
        message: "Usuario no encontrado",
      }
    }

    // Si se está actualizando el correo, verificar que no exista otro usuario con ese correo
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await db.get("SELECT * FROM users WHERE email = ? AND id != ?", [updateData.email, userId])
      if (existingUser) {
        return {
          success: false,
          message: "El correo electrónico ya está registrado por otro usuario",
        }
      }
    }

    // Construir la consulta de actualización
    let updateQuery = "UPDATE users SET "
    const updateValues = []

    if (updateData.firstName) {
      updateQuery += "firstName = ?, "
      updateValues.push(updateData.firstName)
    }

    if (updateData.lastName) {
      updateQuery += "lastName = ?, "
      updateValues.push(updateData.lastName)
    }

    if (updateData.email) {
      updateQuery += "email = ?, "
      updateValues.push(updateData.email)
    }

    if (updateData.role) {
      updateQuery += "role = ?, "
      updateValues.push(updateData.role)
    }

    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(updateData.password, 10)
      updateQuery += "password = ?, "
      updateValues.push(hashedPassword)
    }

    // Eliminar la coma final y agregar la condición WHERE
    updateQuery = updateQuery.slice(0, -2) + " WHERE id = ?"
    updateValues.push(userId)

    // Ejecutar la actualización
    await db.run(updateQuery, updateValues)

    return {
      success: true,
      message: "Usuario actualizado exitosamente",
    }
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    return {
      success: false,
      message: "Error al actualizar el usuario",
    }
  }
}

// Eliminar un usuario
export async function deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    const db = await getDb()

    // Verificar si el usuario existe
    const user = await db.get("SELECT * FROM users WHERE id = ?", [userId])
    if (!user) {
      return {
        success: false,
        message: "Usuario no encontrado",
      }
    }

    // Eliminar el usuario
    await db.run("DELETE FROM users WHERE id = ?", [userId])

    return {
      success: true,
      message: "Usuario eliminado exitosamente",
    }
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    return {
      success: false,
      message: "Error al eliminar el usuario",
    }
  }
}

