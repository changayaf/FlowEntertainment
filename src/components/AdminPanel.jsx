import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { 
  Calendar, 
  MapPin, 
  Music, 
  Users, 
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Settings,
  UserPlus,
  DollarSign,
  Clock,
  Star,
  TrendingUp,
  Activity
} from 'lucide-react'
import { motion } from 'framer-motion'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showCreateEvent, setShowCreateEvent] = useState(false)

  // Datos de ejemplo para el dashboard
  const dashboardStats = {
    totalEvents: 12,
    activeEvents: 5,
    totalSales: 45600,
    totalTickets: 1250,
    topAgent: "Laura García",
    monthlyGrowth: 23.5
  }

  const recentEvents = [
    {
      id: 1,
      title: "Neon Dreams",
      date: "25 Oct 2025",
      venue: "Sala Cosmos",
      sales: 850,
      revenue: 12750,
      status: "active"
    },
    {
      id: 2,
      title: "Urban Groove",
      date: "02 Nov 2025",
      venue: "Warehouse 3",
      sales: 620,
      revenue: 9300,
      status: "active"
    },
    {
      id: 3,
      title: "Techno Dimension",
      date: "15 Nov 2025",
      venue: "The Bunker",
      sales: 1200,
      revenue: 18000,
      status: "sold_out"
    }
  ]

  const agents = [
    {
      id: 1,
      name: "Laura García",
      email: "laura@flowentertainment.com",
      sales: 156,
      revenue: 23400,
      rating: 4.9,
      status: "active"
    },
    {
      id: 2,
      name: "Carlos Mendez",
      email: "carlos@flowentertainment.com",
      sales: 134,
      revenue: 20100,
      rating: 4.7,
      status: "active"
    },
    {
      id: 3,
      name: "Ana Rodriguez",
      email: "ana@flowentertainment.com",
      sales: 98,
      revenue: 14700,
      rating: 4.8,
      status: "inactive"
    }
  ]

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Eventos</CardTitle>
              <Calendar className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardStats.totalEvents}</div>
              <p className="text-xs text-gray-400">
                {dashboardStats.activeEvents} activos
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">€{dashboardStats.totalSales.toLocaleString()}</div>
              <p className="text-xs text-green-400">
                +{dashboardStats.monthlyGrowth}% este mes
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Entradas Vendidas</CardTitle>
              <Users className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardStats.totalTickets}</div>
              <p className="text-xs text-gray-400">
                Este mes
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Top Agente</CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardStats.topAgent}</div>
              <p className="text-xs text-gray-400">
                156 ventas
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Events */}
      <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Eventos Recientes</CardTitle>
          <CardDescription className="text-gray-300">
            Resumen de tus eventos más recientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <Music className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{event.title}</h3>
                    <p className="text-gray-400 text-sm">{event.date} • {event.venue}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">€{event.revenue.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">{event.sales} entradas</div>
                </div>
                <Badge 
                  variant={event.status === 'active' ? 'default' : 'destructive'}
                  className={event.status === 'active' ? 'bg-green-600' : 'bg-red-600'}
                >
                  {event.status === 'active' ? 'Activo' : 'Agotado'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestión de Eventos</h2>
        <Button 
          onClick={() => setShowCreateEvent(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Crear Evento
        </Button>
      </div>

      {showCreateEvent && (
        <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Crear Nuevo Evento</CardTitle>
            <CardDescription className="text-gray-300">
              Completa la información básica del evento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventName" className="text-gray-300">Nombre del Evento</Label>
                <Input 
                  id="eventName" 
                  placeholder="Ej: Neon Dreams"
                  className="bg-slate-800/50 border-purple-500/30 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="djName" className="text-gray-300">DJ Principal</Label>
                <Input 
                  id="djName" 
                  placeholder="Ej: Alex Fusion"
                  className="bg-slate-800/50 border-purple-500/30 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventDate" className="text-gray-300">Fecha</Label>
                <Input 
                  id="eventDate" 
                  type="date"
                  className="bg-slate-800/50 border-purple-500/30 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventTime" className="text-gray-300">Hora</Label>
                <Input 
                  id="eventTime" 
                  type="time"
                  className="bg-slate-800/50 border-purple-500/30 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue" className="text-gray-300">Local</Label>
                <Input 
                  id="venue" 
                  placeholder="Ej: Sala Cosmos"
                  className="bg-slate-800/50 border-purple-500/30 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="basePrice" className="text-gray-300">Precio Base</Label>
                <Input 
                  id="basePrice" 
                  type="number"
                  placeholder="35"
                  className="bg-slate-800/50 border-purple-500/30 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">Descripción</Label>
              <Textarea 
                id="description" 
                placeholder="Describe el evento..."
                className="bg-slate-800/50 border-purple-500/30 text-white"
                rows={3}
              />
            </div>
            <div className="flex space-x-2">
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Crear Evento
                </Button>
                <Button 
                  onClick={() => window.open('/venue-designer', '_blank')}
                  variant="outline"
                  className="border-purple-500/30 text-purple-400 hover:bg-purple-400 hover:text-white"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Diseñar Local
                </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateEvent(false)}
                className="border-purple-500/30 text-purple-400 hover:bg-purple-400 hover:text-white"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {recentEvents.map((event) => (
          <Card key={event.id} className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <Music className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                    <p className="text-gray-400">{event.date} • {event.venue}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-green-400 font-semibold">€{event.revenue.toLocaleString()}</span>
                      <span className="text-gray-400">{event.sales} entradas vendidas</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-400">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-400">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-500/30 text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderAgents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestión de Agentes</h2>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Invitar Agente
        </Button>
      </div>

      <div className="grid gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{agent.name}</h3>
                    <p className="text-gray-400">{agent.email}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-green-400 font-semibold">€{agent.revenue.toLocaleString()}</span>
                      <span className="text-gray-400">{agent.sales} ventas</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-yellow-400">{agent.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge 
                    variant={agent.status === 'active' ? 'default' : 'secondary'}
                    className={agent.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}
                  >
                    {agent.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-400">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-400">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Analíticas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
              Crecimiento Mensual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">+23.5%</div>
            <p className="text-gray-400">Comparado con el mes anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="mr-2 h-5 w-5 text-cyan-400" />
              Eventos Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400">5</div>
            <p className="text-gray-400">De 12 eventos totales</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-purple-400" />
              Promedio por Evento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">€3,800</div>
            <p className="text-gray-400">Ingresos promedio</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Gráfico de Ventas</CardTitle>
          <CardDescription className="text-gray-300">
            Próximamente: Gráficos interactivos con datos en tiempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Gráfico de ventas (En desarrollo)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'agents', label: 'Agentes', icon: Users },
    { id: 'analytics', label: 'Analíticas', icon: TrendingUp },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-black text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-purple-500/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Flow Entertainment - Admin
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Bienvenido, Organizador</span>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'text-gray-300 hover:bg-purple-900/30 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'events' && renderEvents()}
            {activeTab === 'agents' && renderAgents()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'settings' && (
              <div className="text-center py-20">
                <Settings className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Configuración</h3>
                <p className="text-gray-400">Panel de configuración en desarrollo</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
