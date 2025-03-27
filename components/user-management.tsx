"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { User, Search, Edit, Trash, Plus, UserCheck } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

// Datos de ejemplo para usuarios
const mockUsers = [
  {
    id: "u1",
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan@example.com",
    role: "patient",
    createdAt: "2024-01-15",
  },
  {
    id: "u2",
    firstName: "María",
    lastName: "García",
    email: "maria@example.com",
    role: "nurse",
    createdAt: "2024-02-10",
  },
  {
    id: "u3",
    firstName: "Carlos",
    lastName: "Rodríguez",
    email: "carlos@example.com",
    role: "patient",
    createdAt: "2024-03-22",
  },
  {
    id: "u4",
    firstName: "Ana",
    lastName: "López",
    email: "ana@example.com",
    role: "nurse",
    createdAt: "2024-02-28",
  },
]

export function UserManagement() {
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false)
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "patient",
  })
  const { toast } = useToast()

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = () => {
    // Validación básica
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password) {
      toast({
        title: "Datos incompletos",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive",
      })
      return
    }

    // Simular creación de usuario (en una app real, esto sería una llamada a la API)
    const newId = `u${users.length + 1}`
    const createdUser = {
      id: newId,
      ...newUser,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setUsers([...users, createdUser])
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "patient",
    })
    setIsAddUserDialogOpen(false)

    toast({
      title: "Usuario creado",
      description: `${newUser.firstName} ${newUser.lastName} ha sido añadido como ${
        newUser.role === "patient" ? "paciente" : "enfermera"
      }.`,
    })
  }

  const handleEditUser = () => {
    if (!selectedUser) return

    // Validación básica
    if (!selectedUser.firstName || !selectedUser.lastName || !selectedUser.email) {
      toast({
        title: "Datos incompletos",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive",
      })
      return
    }

    // Actualizar el usuario
    setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, ...selectedUser } : user)))
    setIsEditUserDialogOpen(false)

    toast({
      title: "Usuario actualizado",
      description: `La información de ${selectedUser.firstName} ${selectedUser.lastName} ha sido actualizada.`,
    })
  }

  const handleDeleteUser = () => {
    if (!selectedUser) return

    // Eliminar el usuario
    setUsers(users.filter((user) => user.id !== selectedUser.id))
    setIsDeleteUserDialogOpen(false)

    toast({
      title: "Usuario eliminado",
      description: `${selectedUser.firstName} ${selectedUser.lastName} ha sido eliminado del sistema.`,
    })
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "patient":
        return "Paciente"
      case "nurse":
        return "Enfermera"
      case "doctor":
        return "Médico"
      default:
        return role
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre, email o rol..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-propiel-600 hover:bg-propiel-700">
              <Plus className="h-4 w-4 mr-2" />
              Añadir Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Usuario</DialogTitle>
              <DialogDescription>Completa la información para crear un nuevo usuario.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Paciente</SelectItem>
                    <SelectItem value="nurse">Enfermera</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddUser} className="bg-propiel-600 hover:bg-propiel-700">
                Crear Usuario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No se encontraron usuarios.</p>
          </CardContent>
        </Card>
      ) : (
        filteredUsers.map((user) => (
          <Card key={user.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-propiel-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-propiel-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end mt-4 md:mt-0 space-y-2">
                  <div className="flex items-center">
                    <UserCheck className="h-4 w-4 text-muted-foreground mr-1" />
                    <span className="text-sm">{getRoleText(user.role)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Creado el {formatDate(user.createdAt)}</p>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Dialog
                  open={isEditUserDialogOpen && selectedUser?.id === user.id}
                  onOpenChange={(open) => {
                    setIsEditUserDialogOpen(open)
                    if (!open) setSelectedUser(null)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser({ ...user })
                        setIsEditUserDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </DialogTrigger>
                  {selectedUser && (
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Usuario</DialogTitle>
                        <DialogDescription>Actualiza la información del usuario.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-firstName">Nombre</Label>
                            <Input
                              id="edit-firstName"
                              value={selectedUser.firstName}
                              onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-lastName">Apellido</Label>
                            <Input
                              id="edit-lastName"
                              value={selectedUser.lastName}
                              onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-email">Correo Electrónico</Label>
                          <Input
                            id="edit-email"
                            type="email"
                            value={selectedUser.email}
                            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-role">Rol</Label>
                          <Select
                            value={selectedUser.role}
                            onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}
                          >
                            <SelectTrigger id="edit-role">
                              <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="patient">Paciente</SelectItem>
                              <SelectItem value="nurse">Enfermera</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleEditUser} className="bg-propiel-600 hover:bg-propiel-700">
                          Guardar Cambios
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  )}
                </Dialog>

                <Dialog
                  open={isDeleteUserDialogOpen && selectedUser?.id === user.id}
                  onOpenChange={(open) => {
                    setIsDeleteUserDialogOpen(open)
                    if (!open) setSelectedUser(null)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedUser({ ...user })
                        setIsDeleteUserDialogOpen(true)
                      }}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  </DialogTrigger>
                  {selectedUser && (
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar Eliminación</DialogTitle>
                        <DialogDescription>
                          ¿Estás seguro de que deseas eliminar a {selectedUser.firstName} {selectedUser.lastName}? Esta
                          acción no se puede deshacer.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteUserDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteUser}>
                          Eliminar Usuario
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  )}
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

