import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  Phone,
  Mail,
  MessageCircle,
  QrCode,
  Share2,
  Trophy,
  Star,
  Calendar,
  Clock,
  MapPin,
  Plus,
  Search,
  Filter,
  Download,
  Send,
  Copy,
  Check,
  Award,
  Zap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const AgentDashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showSaleModal, setShowSaleModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [saleData, setSaleData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    seats: [],
    total: 0
  })

  // Datos del agente (normalmente vendría de una API)
  const agentData = {
    id: 1,
    name: "María González",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
    level: "Gold Agent",
    totalSales: 45600,
    monthSales: 8900,
    salesCount: 156,
    monthSalesCount: 23,
    commission: 12.5,
    ranking: 3,
    badge: "Top Performer"
  }

  // Eventos disponibles para venta
  const availableEvents = [
    {
      id: 1,
      title: "Neon Dreams",
      dj: "Alex Fusion",
      date: "25 Oct 2025",
      time: "23:00",
      venue: "Sala Cosmos",
      commission: 15,
      availableSeats: 45,
      priceRange: "35-120€",
      status: "active"
    },
    {
      id: 2,
      title: "Urban Groove",
      dj: "Nina Flow",
      date: "02 Nov 2025",
      time: "22:30",
      venue: "Warehouse 3",
      commission: 12,
      availableSeats: 67,
      priceRange: "40-150€",
      status: "active"
    },
    {
      id: 3,
      title: "Techno Dimension",
      dj: "Marco V",
      date: "15 Nov 2025",
      time: "23:30",
      venue: "The Bunker",
      commission: 18,
      availableSeats: 0,
      priceRange: "45-180€",
      status: "sold_out"
    }
  ]

  // Ventas recientes
  const recentSales = [
    {
      id: 1,
      customerName: "Carlos Ruiz",
      event: "Neon Dreams",
      seats: "Mesa 5",
      amount: 140,
      commission: 21,
      date: "2025-10-20",
      status: "confirmed"
    },
    {
      id: 2,
      customerName: "Ana López",
      event: "Urban Groove",
      seats: "VIP 2",
      amount: 240,
      commission: 28.8,
      date: "2025-10-19",
      status: "confirmed"
    },
    {
      id: 3,
      customerName: "Pedro Martín",
      event: "Neon Dreams",
      seats: "Mesa 12",
      amount: 70,
      commission: 10.5,
      date: "2025-10-18",
      status: "pending"
    }
  ]

  // Clientes frecuentes
  const frequentCustomers = [
    {
      id: 1,
      name: "Laura Sánchez",
      email: "laura@email.com",
      phone: "+34 666 123 456",
      totalSpent: 890,
      eventsAttended: 8,
      lastPurchase: "2025-10-15"
    },
    {
      id: 2,
      name: "Miguel Torres",
      email: "miguel@email.com",
      phone: "+34 677 234 567",
      totalSpent: 1240,
      eventsAttended: 12,
      lastPurchase: "2025-10-10"
    }
  ]

  // Ranking de agentes
  const agentRanking = [
    { position: 1, name: "Elena Rodríguez", sales: 12400, badge: "🥇" },
    { position: 2, name: "David Morales", sales: 10800, badge: "🥈" },
    { position: 3, name: "María González", sales: 8900, badge: "🥉" },
    { position: 4, name: "Carlos Vega", sales: 7600, badge: "⭐" },
    { position: 5, name: "Ana Jiménez", sales: 6900, badge: "⭐" }
  ]

  // Procesar venta
  const handleSale = () => {
    // Simular procesamiento de venta
    setTimeout(() => {
      setShowSaleModal(false)
      setShowQRModal(true)
    }, 1500)
  }

  // Generar enlace de invitación
  const generateInviteLink = (eventId) => {
    const baseUrl = window.location.origin
    return `${baseUrl}/event/${eventId}?agent=${agentData.id}`
  }

  // Copiar enlace
  const copyInviteLink = (eventId) => {
    const link = generateInviteLink(eventId)
    navigator.clipboard.writeText(link)
    // Mostrar notificación de copiado
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-black text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-purple-500/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={agentData.avatar} 
              alt={agentData.name}
              className="w-10 h-10 rounded-full border-2 border-purple-400"
            />
            <div>
              <h1 className="text-xl font-bold text-white">{agentData.name}</h1>
              <p className="text-purple-300 text-sm">{agentData.level}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
              <Trophy className="mr-1 h-3 w-3" />
              #{agentData.ranking}
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
              {agentData.badge}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Ventas del Mes</p>
                    <p className="text-2xl font-bold text-white">€{agentData.monthSales.toLocaleString()}</p>
                    <p className="text-green-400 text-sm">+23% vs mes anterior</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Entradas Vendidas</p>
                    <p className="text-2xl font-bold text-white">{agentData.monthSalesCount}</p>
                    <p className="text-blue-400 text-sm">Este mes</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Comisión</p>
                    <p className="text-2xl font-bold text-white">{agentData.commission}%</p>
                    <p className="text-purple-400 text-sm">Tasa actual</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Ranking</p>
                    <p className="text-2xl font-bold text-white">#{agentData.ranking}</p>
                    <p className="text-yellow-400 text-sm">Top 5 nacional</p>
                  </div>
                  <Award className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Available Events */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Eventos Disponibles</CardTitle>
                      <CardDescription className="text-gray-300">
                        Eventos activos para venta
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => setShowSaleModal(true)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Nueva Venta
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {availableEvents.map(event => (
                      <div 
                        key={event.id}
                        className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20 hover:border-purple-400/40 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-white">{event.title}</h3>
                            <p className="text-purple-300 text-sm">DJ {event.dj}</p>
                          </div>
                          <Badge 
                            className={event.status === 'active' ? 'bg-green-600' : 'bg-red-600'}
                          >
                            {event.status === 'active' ? 'Activo' : 'Agotado'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mb-4">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-purple-400" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-purple-400" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-purple-400" />
                            <span>{event.venue}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4 text-purple-400" />
                            <span>{event.availableSeats} disponibles</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-gray-400">Comisión: </span>
                            <span className="text-green-400 font-semibold">{event.commission}%</span>
                            <span className="text-gray-400 ml-2">Precio: </span>
                            <span className="text-purple-400 font-semibold">{event.priceRange}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyInviteLink(event.id)}
                              className="border-purple-500/30 text-purple-400 hover:bg-purple-400 hover:text-white"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedEvent(event)
                                setShowSaleModal(true)
                              }}
                              disabled={event.status !== 'active'}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                            >
                              Vender
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Sales */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Ventas Recientes</CardTitle>
                  <CardDescription className="text-gray-300">
                    Tus últimas transacciones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentSales.map(sale => (
                      <div 
                        key={sale.id}
                        className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-white">{sale.customerName}</p>
                          <p className="text-sm text-gray-400">{sale.event} • {sale.seats}</p>
                          <p className="text-xs text-gray-500">{sale.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white">€{sale.amount}</p>
                          <p className="text-sm text-green-400">+€{sale.commission}</p>
                          <Badge 
                            size="sm"
                            className={sale.status === 'confirmed' ? 'bg-green-600' : 'bg-yellow-600'}
                          >
                            {sale.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Ranking */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Trophy className="mr-2 h-5 w-5 text-yellow-400" />
                    Ranking de Agentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {agentRanking.map(agent => (
                      <div 
                        key={agent.position}
                        className={`flex items-center justify-between p-2 rounded-lg ${
                          agent.name === agentData.name ? 'bg-purple-600/30 border border-purple-400/50' : 'bg-slate-800/30'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{agent.badge}</span>
                          <div>
                            <p className={`font-semibold ${agent.name === agentData.name ? 'text-purple-300' : 'text-white'}`}>
                              {agent.name}
                            </p>
                            <p className="text-xs text-gray-400">€{agent.sales.toLocaleString()}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-gray-400">#{agent.position}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Frequent Customers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Star className="mr-2 h-5 w-5 text-yellow-400" />
                    Clientes VIP
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {frequentCustomers.map(customer => (
                      <div 
                        key={customer.id}
                        className="p-3 bg-slate-800/30 rounded-lg cursor-pointer hover:bg-slate-700/30 transition-colors"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <p className="font-semibold text-white">{customer.name}</p>
                        <p className="text-sm text-gray-400">{customer.eventsAttended} eventos</p>
                        <p className="text-sm text-green-400">€{customer.totalSpent} gastados</p>
                        <div className="flex space-x-2 mt-2">
                          <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                            <MessageCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Sale Modal */}
      <AnimatePresence>
        {showSaleModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-purple-900/90 to-slate-900/90 rounded-lg p-6 max-w-md w-full border border-purple-500/30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Nueva Venta</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Nombre del Cliente</Label>
                  <Input
                    value={saleData.customerName}
                    onChange={(e) => setSaleData(prev => ({ ...prev, customerName: e.target.value }))}
                    className="bg-slate-800/50 border-purple-500/30 text-white"
                    placeholder="Nombre completo"
                  />
                </div>
                
                <div>
                  <Label className="text-gray-300">Email</Label>
                  <Input
                    type="email"
                    value={saleData.customerEmail}
                    onChange={(e) => setSaleData(prev => ({ ...prev, customerEmail: e.target.value }))}
                    className="bg-slate-800/50 border-purple-500/30 text-white"
                    placeholder="email@ejemplo.com"
                  />
                </div>
                
                <div>
                  <Label className="text-gray-300">Teléfono</Label>
                  <Input
                    value={saleData.customerPhone}
                    onChange={(e) => setSaleData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    className="bg-slate-800/50 border-purple-500/30 text-white"
                    placeholder="+34 666 123 456"
                  />
                </div>

                {selectedEvent && (
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <p className="font-semibold text-white">{selectedEvent.title}</p>
                    <p className="text-sm text-gray-400">{selectedEvent.date} • {selectedEvent.venue}</p>
                    <p className="text-sm text-green-400">Comisión: {selectedEvent.commission}%</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowSaleModal(false)}
                  className="flex-1 border-purple-500/30 text-purple-400"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSale}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Procesar Venta
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Modal */}
      <AnimatePresence>
        {showQRModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-purple-900/90 to-slate-900/90 rounded-lg p-6 max-w-sm w-full border border-purple-500/30 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="mb-4">
                <Check className="h-12 w-12 text-green-400 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-white">¡Venta Exitosa!</h3>
                <p className="text-gray-300">QR generado para el cliente</p>
              </div>

              <div className="bg-white p-6 rounded-lg mb-4">
                <QrCode className="h-24 w-24 text-black mx-auto" />
              </div>

              <div className="text-sm text-gray-300 mb-6">
                <p className="font-semibold text-white">{saleData.customerName}</p>
                <p>{selectedEvent?.title}</p>
                <p className="text-green-400">Comisión: €{((selectedEvent?.commission || 0) * 35 / 100).toFixed(2)}</p>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1 border-purple-500/30 text-purple-400"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Enviar
                </Button>
                <Button
                  onClick={() => setShowQRModal(false)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Cerrar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AgentDashboard
