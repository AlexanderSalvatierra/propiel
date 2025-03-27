// Servicio de autenticación para el cliente

// Guardar token en localStorage
export function saveToken(token: string): void {
  localStorage.setItem("token", token)
}

// Obtener token de localStorage
export function getToken(): string | null {
  return localStorage.getItem("token")
}

// Eliminar token de localStorage
export function removeToken(): void {
  localStorage.removeItem("token")
}

// Guardar usuario en localStorage
export function saveUser(user: any): void {
  localStorage.setItem("user", JSON.stringify(user))
}

// Obtener usuario de localStorage
export function getUser(): any | null {
  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch (error) {
    console.error("Error al parsear usuario:", error)
    return null
  }
}

// Eliminar usuario de localStorage
export function removeUser(): void {
  localStorage.removeItem("user")
}

// Verificar si el usuario está autenticado
export function isAuthenticated(): boolean {
  return !!getToken() && !!getUser()
}

// Cerrar sesión
export function logout(): void {
  removeToken()
  removeUser()
}

// Iniciar sesión
export async function login(
  email: string,
  password: string,
): Promise<{
  success: boolean
  message: string
  user?: any
}> {
  try {
    console.log("Intentando iniciar sesión con:", { email })

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    console.log("Respuesta del servidor:", data)

    if (!response.ok) {
      console.error("Error de inicio de sesión:", data.error || response.statusText)
      return {
        success: false,
        message: data.error || "Error al iniciar sesión",
      }
    }

    // Guardar token y usuario
    saveToken(data.token)
    saveUser(data.user)

    return {
      success: true,
      message: data.message || "Inicio de sesión exitoso",
      user: data.user,
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error)
    return {
      success: false,
      message: "Error al conectar con el servidor",
    }
  }
}

// Registrar usuario
export async function register(userData: {
  firstName: string
  lastName: string
  email: string
  password: string
}): Promise<{
  success: boolean
  message: string
}> {
  try {
    console.log("Intentando registrar usuario:", { email: userData.email })

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()
    console.log("Respuesta del servidor:", data)

    if (!response.ok) {
      console.error("Error de registro:", data.error || response.statusText)
      return {
        success: false,
        message: data.error || "Error al registrar usuario",
      }
    }

    // Si el registro es exitoso y devuelve un token, guardarlo
    if (data.token) {
      saveToken(data.token)

      if (data.user) {
        saveUser(data.user)
      }
    }

    return {
      success: true,
      message: data.message || "Usuario registrado exitosamente",
    }
  } catch (error) {
    console.error("Error al registrar usuario:", error)
    return {
      success: false,
      message: "Error al conectar con el servidor",
    }
  }
}

