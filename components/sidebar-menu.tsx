import type React from "react"
import {
  Calendar,
  FileText,
  Home,
  MessageSquare,
  PlusCircle,
  CreditCard,
  Users,
  ClipboardList,
  User,
} from "lucide-react"

interface MenuItemType {
  href: string
  label: string
  icon: React.ElementType
}

export const getPatientMenu = (): MenuItemType[] => [
  { href: "/patient/dashboard", label: "Panel", icon: Home },
  { href: "/patient/appointments", label: "Citas", icon: Calendar },
  { href: "/patient/records", label: "Historial Médico", icon: FileText },
  { href: "/patient/prescriptions", label: "Recetas", icon: PlusCircle },
  { href: "/patient/payments", label: "Pagos", icon: CreditCard },
  { href: "/patient/messages", label: "Mensajes", icon: MessageSquare },
  { href: "/profile", label: "Perfil", icon: User },
]

export const getDoctorMenu = (): MenuItemType[] => [
  { href: "/doctor/dashboard", label: "Panel", icon: Home },
  { href: "/doctor/appointments", label: "Citas", icon: Calendar },
  { href: "/doctor/patients", label: "Pacientes", icon: Users },
  { href: "/doctor/prescriptions", label: "Recetas", icon: FileText },
  { href: "/doctor/messages", label: "Mensajes", icon: MessageSquare },
  { href: "/profile", label: "Perfil", icon: User },
]

export const getNurseMenu = (): MenuItemType[] => [
  { href: "/nurse/dashboard", label: "Panel", icon: Home },
  { href: "/nurse/schedule", label: "Horario", icon: Calendar },
  { href: "/nurse/patients", label: "Pacientes", icon: Users },
  { href: "/nurse/vitals", label: "Signos Vitales", icon: ClipboardList },
  { href: "/profile", label: "Perfil", icon: User },
]

