import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Calendar, FileText, PlusCircle, CreditCard, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-propiel-600" />
            <span className="text-xl font-bold">Propiel</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-propiel-600"
            >
              Características
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-propiel-600"
            >
              Acerca de
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-propiel-600"
            >
              Contacto
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-propiel-600 hover:bg-propiel-700">Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-propiel-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Optimiza la Gestión de tu Salud Dermatológica
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Una plataforma integral para médicos, enfermeras y pacientes para gestionar citas, registros médicos
                    y prescripciones dermatológicas.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="w-full bg-propiel-600 hover:bg-propiel-700">
                      Comenzar
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline" className="w-full">
                      Saber Más
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] aspect-video rounded-xl overflow-hidden shadow-lg">
                <img
                  src="/images/doctors-team.png"
                  alt="Equipo médico de Propiel"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Características Principales
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Todo lo que necesitas para gestionar servicios dermatológicos de manera eficiente
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <Card>
                <CardHeader>
                  <Calendar className="h-6 w-6 text-propiel-600 mb-2" />
                  <CardTitle>Sistema de Citas</CardTitle>
                  <CardDescription>Reserva, gestiona y realiza seguimiento de citas con facilidad</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Los pacientes pueden programar citas con los dermatólogos preferidos, mientras que los profesionales
                    pueden gestionar sus calendarios eficientemente.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <FileText className="h-6 w-6 text-propiel-600 mb-2" />
                  <CardTitle>Registros Médicos</CardTitle>
                  <CardDescription>Almacenamiento seguro y acceso a registros de pacientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Mantén historiales médicos completos, resultados de pruebas y planes de tratamiento en un lugar
                    seguro.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <PlusCircle className="h-6 w-6 text-propiel-600 mb-2" />
                  <CardTitle>Gestión de Recetas</CardTitle>
                  <CardDescription>Recetas digitales con seguimiento</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Crea, emite y realiza seguimiento de recetas digitales con historial de medicamentos y recordatorios
                    de reposición.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Clock className="h-6 w-6 text-propiel-600 mb-2" />
                  <CardTitle>Notificaciones en Tiempo Real</CardTitle>
                  <CardDescription>Mantente actualizado con alertas importantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Recibe notificaciones oportunas sobre cambios en citas, reposiciones de recetas y actualizaciones
                    importantes.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CreditCard className="h-6 w-6 text-propiel-600 mb-2" />
                  <CardTitle>Integración de Pagos</CardTitle>
                  <CardDescription>Procesamiento de pagos sin problemas</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Procesa pagos de forma segura a través de la integración con Stripe con seguimiento completo del
                    historial de pagos.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Shield className="h-6 w-6 text-propiel-600 mb-2" />
                  <CardTitle>Acceso Basado en Roles</CardTitle>
                  <CardDescription>Control de acceso seguro</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Diferentes niveles de acceso para médicos, enfermeras y pacientes garantizan la seguridad y
                    privacidad de los datos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-12 bg-propiel-50">
        <div className="container px-4 md:px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-propiel-600" />
                <span className="text-xl font-bold">Propiel</span>
              </div>
              <p className="text-muted-foreground">
                Cuidado dermatológico de alta calidad para toda la familia. Nuestro equipo de especialistas está
                dedicado a la salud de su piel.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-propiel-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-propiel-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-propiel-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-propiel-600">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-propiel-600">
                    Características
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="text-muted-foreground hover:text-propiel-600">
                    Acerca de
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="text-muted-foreground hover:text-propiel-600">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-muted-foreground hover:text-propiel-600">
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-muted-foreground hover:text-propiel-600">
                    Registrarse
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contacto</h3>
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>+34 912 345 678</span>
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <path d="m22 6-10 7L2 6"></path>
                  </svg>
                  <span>info@propiel.com</span>
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>Calle Principal 123, Madrid, España</span>
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>Lun - Vie: 9:00 - 18:00, Sáb: 9:00 - 14:00</span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ubicación</h3>
              <div className="w-full h-48 rounded-lg overflow-hidden border border-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.6575521755805!2d-3.7037974843352596!3d40.41677937936723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422997800a3c81%3A0xc436dec1618c2269!2sPuerta%20del%20Sol%2C%20Madrid%2C%20Espa%C3%B1a!5e0!3m2!1ses!2ses!4v1650000000000!5m2!1ses!2ses"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="border-t pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <p className="text-center md:text-left text-sm text-muted-foreground">
                © 2024 Propiel. Todos los derechos reservados.
              </p>
              <div className="flex items-center justify-center md:justify-end gap-4">
                <Link href="#" className="text-sm text-muted-foreground hover:text-propiel-600">
                  Términos de Servicio
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-propiel-600">
                  Política de Privacidad
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-propiel-600">
                  Aviso Legal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

