import { v4 as uuidv4 } from "uuid"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { getDb } from "./db"

// Clave secreta para firmar los tokens JWT
const JWT_SECRET = process.env.JWT_SECRET || "propiel-secret-key"

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  createdAt: string
}

export interface AuthResult {
  success: boolean
  message: string
  user?: User
  token?: string
}

// Registrar un nuevo usuario
export async function registerUser(userData: {
  firstName: string
  lastName: string
  email: string
  password: string
  role?: string
}): Promise<AuthResult> {
  try {
    console.log("Iniciando registro de usuario:", { email: userData.email, role: userData.role })

    const db = await getDb()

    // Verificar si el correo ya existe
    const existingUserResult = await db.query("SELECT * FROM users WHERE email = $1", [userData.email])
    console.log("Verificación de correo existente:", { encontrado: existingUserResult.rows.length > 0 })

    if (existingUserResult.rows.length > 0) {
      return {
        success: false,
        message: "El correo electrónico ya está registrado",
      }
    }

    // Hashear la contraseña
    const hashedPassword = await bcryptjs.hash(userData.password, 10)
    console.log("Contraseña hasheada correctamente")

    // Generar un ID único
    const userId = `user_${uuidv4()}`

    // Establecer el rol como paciente por defecto
    const role = userData.role || "patient"

    console.log("Insertando nuevo usuario:", { userId, role })

    // Insertar el nuevo usuario
    await db.query(
      "INSERT INTO users (id, first_name, last_name, email, password, role, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [userId, userData.firstName, userData.lastName, userData.email, hashedPassword, role, new Date().toISOString()],
    )
    console.log("Usuario insertado correctamente")

    // Obtener el usuario recién creado
    const newUserResult = await db.query(
      "SELECT id, first_name, last_name, email, role, created_at FROM users WHERE id = $1",
      [userId],
    )

    if (newUserResult.rows.length === 0) {
      console.error("No se pudo recuperar el usuario recién creado")
      return {
        success: false,
        message: "Error al crear el usuario",
      }
    }

    const newUser = newUserResult.rows[0]
    console.log("Usuario recuperado:", { id: newUser.id, email: newUser.email })

    // Transformar el formato de la base de datos al formato de la aplicación
    const formattedUser = {
      id: newUser.id,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.created_at,
    }

    // Generar un token JWT
    const token = jwt.sign({ id: formattedUser.id, email: formattedUser.email, role: formattedUser.role }, JWT_SECRET, {
      expiresIn: "7d",
    })
    console.log("Token JWT generado correctamente")

    return {
      success: true,
      message: "Usuario registrado exitosamente",
      user: formattedUser,
      token,
    }
  } catch (error) {
    console.error("Error detallado al registrar usuario:", error)
    return {
      success: false,
      message: "Error al registrar usuario: " + (error instanceof Error ? error.message : String(error)),
    }
  }
}

// Iniciar sesión
export async function loginUser(credentials: {
  email: string
  password: string
}): Promise<AuthResult> {
  try {
    const db = await getDb()

    // Buscar el usuario por correo
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [credentials.email])

    if (userResult.rows.length === 0) {
      return {
        success: false,
        message: "Credenciales inválidas",
      }
    }

    const user = userResult.rows[0]

    // Verificar la contraseña
    const passwordMatch = await bcryptjs.compare(credentials.password, user.password)
    if (!passwordMatch) {
      return {
        success: false,
        message: "Credenciales inválidas",
      }
    }

    // Crear un objeto de usuario sin la contraseña
    const formattedUser = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
    }

    // Generar un token JWT
    const token = jwt.sign({ id: formattedUser.id, email: formattedUser.email, role: formattedUser.role }, JWT_SECRET, {
      expiresIn: "7d",
    })

    return {
      success: true,
      message: "Inicio de sesión exitoso",
      user: formattedUser,
      token,
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error)
    return {
      success: false,
      message: "Error al iniciar sesión",
    }
  }
}

// Verificar un token JWT
export async function verifyToken(token: string): Promise<{
  valid: boolean
  user?: User
}> {
  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }

    const db = await getDb()

    // Obtener el usuario de la base de datos
    const userResult = await db.query(
      "SELECT id, first_name, last_name, email, role, created_at FROM users WHERE id = $1",
      [decoded.id],
    )

    if (userResult.rows.length === 0) {
      return { valid: false }
    }

    const user = userResult.rows[0]

    // Formatear el usuario
    const formattedUser = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
    }

    return {
      valid: true,
      user: formattedUser,
    }
  } catch (error) {
    console.error("Error al verificar token:", error)
    return { valid: false }
  }
}

// Obtener todos los usuarios
export async function getAllUsers(): Promise<User[]> {
  try {
    const db = await getDb()
    const pool = db.config.pool

    const usersResult = await pool.query(
      "SELECT id, first_name, last_name, email, role, created_at FROM users ORDER BY created_at DESC",
    )

    // Formatear los usuarios
    return usersResult.rows.map((user) => ({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
    }))
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return []
  }
}

// Obtener usuarios por rol
export async function getUsersByRole(role: string): Promise<User[]> {
  try {
    const db = await getDb()
    const pool = db.config.pool

    const usersResult = await pool.query(
      "SELECT id, first_name, last_name, email, role, created_at FROM users WHERE role = $1 ORDER BY created_at DESC",
      [role],
    )

    // Formatear los usuarios
    return usersResult.rows.map((user) => ({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
    }))
  } catch (error) {
    console.error(`Error al obtener usuarios con rol ${role}:`, error)
    return []
  }
}

// Obtener un usuario por ID
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const db = await getDb()
    const pool = db.config.pool

    const userResult = await pool.query(
      "SELECT id, first_name, last_name, email, role, created_at FROM users WHERE id = $1",
      [userId],
    )

    if (userResult.rows.length === 0) {
      return null
    }

    const user = userResult.rows[0]

    // Formatear el usuario
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
    }
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error)
    return null
  }
}

// Crear un nuevo usuario (para administradores)
export async function createUser(userData: {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
}): Promise<{ success: boolean; user?: User; message: string }> {
  try {
    const db = await getDb()
    const pool = db.config.pool

    // Verificar si el correo ya existe
    const existingUserResult = await pool.query("SELECT * FROM users WHERE email = $1", [userData.email])

    if (existingUserResult.rows.length > 0) {
      return {
        success: false,
        message: "El correo electrónico ya está registrado",
      }
    }

    // Hashear la contraseña
    const hashedPassword = await bcryptjs.hash(userData.password, 10)

    // Generar un ID único
    const userId = `user_${uuidv4()}`

    // Insertar el nuevo usuario
    await pool.query(
      "INSERT INTO users (id, first_name, last_name, email, password, role, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)",
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

    // Obtener el usuario recién creado
    const newUserResult = await pool.query(
      "SELECT id, first_name, last_name, email, role, created_at FROM users WHERE id = $1",
      [userId],
    )

    const newUser = newUserResult.rows[0]

    // Formatear el usuario
    const formattedUser = {
      id: newUser.id,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.created_at,
    }

    return {
      success: true,
      user: formattedUser,
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
    const pool = db.config.pool

    // Verificar si el usuario existe
    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [userId])

    if (userResult.rows.length === 0) {
      return {
        success: false,
        message: "Usuario no encontrado",
      }
    }

    const user = userResult.rows[0]

    // Si se está actualizando el correo, verificar que no exista otro usuario con ese correo
    if (updateData.email && updateData.email !== user.email) {
      const existingUserResult = await pool.query("SELECT * FROM users WHERE email = $1 AND id != $2", [
        updateData.email,
        userId,
      ])

      if (existingUserResult.rows.length > 0) {
        return {
          success: false,
          message: "El correo electrónico ya está registrado por otro usuario",
        }
      }
    }

    // Construir la consulta de actualización
    let updateQuery = "UPDATE users SET "
    const updateValues = []
    let paramIndex = 1

    if (updateData.firstName) {
      updateQuery += `first_name = $${paramIndex}, `
      updateValues.push(updateData.firstName)
      paramIndex++
    }

    if (updateData.lastName) {
      updateQuery += `last_name = $${paramIndex}, `
      updateValues.push(updateData.lastName)
      paramIndex++
    }

    if (updateData.email) {
      updateQuery += `email = $${paramIndex}, `
      updateValues.push(updateData.email)
      paramIndex++
    }

    if (updateData.role) {
      updateQuery += `role = $${paramIndex}, `
      updateValues.push(updateData.role)
      paramIndex++
    }

    if (updateData.password) {
      const hashedPassword = await bcryptjs.hash(updateData.password, 10)
      updateQuery += `password = $${paramIndex}, `
      updateValues.push(hashedPassword)
      paramIndex++
    }

    // Eliminar la coma final y agregar la condición WHERE
    updateQuery = updateQuery.slice(0, -2) + ` WHERE id = $${paramIndex}`
    updateValues.push(userId)

    // Ejecutar la actualización
    await pool.query(updateQuery, updateValues)

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
    const pool = db.config.pool

    // Verificar si el usuario existe
    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [userId])

    if (userResult.rows.length === 0) {
      return {
        success: false,
        message: "Usuario no encontrado",
      }
    }

    // Eliminar el usuario
    await pool.query("DELETE FROM users WHERE id = $1", [userId])

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

