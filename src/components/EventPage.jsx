import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Calendar, 
  MapPin, 
  Music, 
  Users, 
  Clock,
  Star,
  Share2,
  Heart,
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  QrCode,
  Check,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const EventPage = ({ eventId = 1 }) => {
  const [selectedSeats, setSelectedSeats] = useState([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [viewMode, setViewMode] = useState('2d') // '2d' or '3d'
  const canvasRef = useRef(null)

  // Datos del evento (normalmente vendría de una API)
  const eventData = {
    id: 1,
    title: "Neon Dreams",
    dj: "Alex Fusion",
    date: "25 de Octubre, 2025",
    time: "23:00",
    venue: "Sala Cosmos",
    address: "Calle Principal 123, Madrid",
    description: "Una noche épica de música techno con Alex Fusion, uno de los DJs más reconocidos de la escena underground europea. Prepárate para una experiencia sonora única en un ambiente futurista lleno de luces neón.",
    image: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1200",
    genre: "Techno",
    duration: "6 horas",
    ageLimit: "18+",
    dresscode: "Casual/Futurista",
    rating: 4.8,
    attendees: 850,
    maxCapacity: 1200
  }

  // Mapa del local con mesas/zonas (simulado)
  const venueLayout = [
    { id: 1, type: 'table', x: 100, y: 150, width: 60, height: 60, label: 'Mesa 1', capacity: 4, price: 35, status: 'available' },
    { id: 2, type: 'table', x: 200, y: 150, width: 60, height: 60, label: 'Mesa 2', capacity: 4, price: 35, status: 'available' },
    { id: 3, type: 'table', x: 300, y: 150, width: 60, height: 60, label: 'Mesa 3', capacity: 4, price: 35, status: 'occupied' },
    { id: 4, type: 'table', x: 400, y: 150, width: 60, height: 60, label: 'Mesa 4', capacity: 4, price: 35, status: 'available' },
    { id: 5, type: 'vip', x: 150, y: 50, width: 120, height: 80, label: 'VIP 1', capacity: 8, price: 120, status: 'available' },
    { id: 6, type: 'vip', x: 350, y: 50, width: 120, height: 80, label: 'VIP 2', capacity: 8, price: 120, status: 'available' },
    { id: 7, type: 'dj-booth', x: 250, y: 350, width: 100, height: 80, label: 'DJ', capacity: 0, price: 0, status: 'occupied' },
    { id: 8, type: 'dance-floor', x: 150, y: 250, width: 200, height: 80, label: 'Pista', capacity: 0, price: 0, status: 'available' },
    { id: 9, type: 'bar', x: 50, y: 300, width: 80, height: 40, label: 'Barra', capacity: 0, price: 0, status: 'available' }
  ]

  // Productos adicionales
  const additionalProducts = [
    { id: 1, name: 'Pack 4 Bebidas', price: 25, description: 'Incluye 4 bebidas a elegir' },
    { id: 2, name: 'Pack VIP Bottle', price: 80, description: 'Botella premium + mixers' },
    { id: 3, name: 'Merchandising', price: 15, description: 'Camiseta oficial del evento' }
  ]

  const [cart, setCart] = useState([])

  // Manejar selección de asiento/mesa
  const handleSeatSelect = (seat) => {
    if (seat.status === 'occupied') return

    setSelectedSeats(prev => {
      const isSelected = prev.find(s => s.id === seat.id)
      if (isSelected) {
        return prev.filter(s => s.id !== seat.id)
      } else {
        return [...prev, seat]
      }
    })
  }

  // Agregar producto al carrito
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [...prev, { ...product, quantity }]
      }
    })
  }

  // Calcular total
  const calculateTotal = () => {
    const seatsTotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
    const productsTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    return seatsTotal + productsTotal
  }

  // Procesar compra
  const handlePurchase = () => {
    // Simular procesamiento de pago
    setTimeout(() => {
      setShowCheckout(false)
      setShowQR(true)
    }, 2000)
  }

  // Renderizar elemento del mapa
  const renderVenueElement = (element) => {
    const isSelected = selectedSeats.find(s => s.id === element.id)
    const isSelectable = element.type === 'table' || element.type === 'vip'
    
    let backgroundColor = '#6366F1'
    if (element.type === 'vip') backgroundColor = '#F59E0B'
    if (element.type === 'dj-booth') backgroundColor = '#EF4444'
    if (element.type === 'bar') backgroundColor = '#10B981'
    if (element.type === 'dance-floor') backgroundColor = '#8B5CF6'
    if (element.status === 'occupied') backgroundColor = '#6B7280'
    if (isSelected) backgroundColor = '#F59E0B'

    return (
      <motion.div
        key={element.id}
        className={`absolute flex items-center justify-center text-white text-xs font-bold rounded-lg border-2 transition-all duration-200 ${
          isSelectable && element.status === 'available' 
            ? 'cursor-pointer hover:scale-105 border-white/30' 
            : 'cursor-not-allowed border-gray-500/30'
        } ${isSelected ? 'border-yellow-400 shadow-lg' : ''}`}
        style={{
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          backgroundColor,
          borderRadius: element.type === 'table' ? '50%' : '8px'
        }}
        onClick={() => isSelectable && handleSeatSelect(element)}
        whileHover={isSelectable && element.status === 'available' ? { scale: 1.05 } : {}}
        whileTap={isSelectable && element.status === 'available' ? { scale: 0.95 } : {}}
      >
        <div className="text-center">
          <div>{element.label}</div>
          {element.capacity > 0 && (
            <div className="text-xs opacity-80">{element.capacity}p</div>
          )}
          {element.price > 0 && (
            <div className="text-xs opacity-80">€{element.price}</div>
          )}
        </div>
        
        {element.status === 'occupied' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <X className="h-6 w-6 text-red-400" />
          </div>
        )}
        
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
            <Check className="h-3 w-3 text-black" />
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-black text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-purple-500/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Button variant="ghost" className="text-purple-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Eventos
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-purple-400">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-purple-400">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Event Info Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src={eventData.image} 
                alt={eventData.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </motion.div>
          </div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <Badge className="bg-purple-600 mb-4">{eventData.genre}</Badge>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {eventData.title}
              </h1>
              <p className="text-xl text-purple-300 mb-4">DJ {eventData.dj}</p>
              
              <div className="grid grid-cols-2 gap-4 text-gray-300">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-purple-400" />
                  <span>{eventData.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-purple-400" />
                  <span>{eventData.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-purple-400" />
                  <span>{eventData.venue}</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-purple-400" />
                  <span>{eventData.attendees}/{eventData.maxCapacity}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Descripción</h3>
              <p className="text-gray-300 leading-relaxed">{eventData.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-400">{eventData.duration}</div>
                <div className="text-sm text-gray-400">Duración</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">{eventData.ageLimit}</div>
                <div className="text-sm text-gray-400">Edad mínima</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center">
                  <Star className="h-5 w-5 mr-1" />
                  {eventData.rating}
                </div>
                <div className="text-sm text-gray-400">Valoración</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Venue Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Elige Tu Sitio</CardTitle>
                  <CardDescription className="text-gray-300">
                    Selecciona tu mesa o zona preferida en el mapa interactivo
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={viewMode === '2d' ? 'default' : 'outline'}
                    onClick={() => setViewMode('2d')}
                    className={viewMode === '2d' ? 'bg-purple-600' : 'border-purple-500/30 text-purple-400'}
                  >
                    2D
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === '3d' ? 'default' : 'outline'}
                    onClick={() => setViewMode('3d')}
                    className={viewMode === '3d' ? 'bg-purple-600' : 'border-purple-500/30 text-purple-400'}
                  >
                    3D
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative bg-slate-800/30 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                <div
                  ref={canvasRef}
                  className="relative w-full h-full"
                  style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                >
                  {venueLayout.map(renderVenueElement)}
                </div>

                {/* Leyenda */}
                <div className="absolute top-4 left-4 bg-black/70 p-3 rounded-lg text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                      <span>Disponible</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-500 rounded mr-2"></div>
                      <span>Ocupado</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                      <span>Seleccionado</span>
                    </div>
                  </div>
                </div>

                {/* Información de selección */}
                {selectedSeats.length > 0 && (
                  <div className="absolute bottom-4 right-4 bg-black/70 p-3 rounded-lg">
                    <div className="text-sm">
                      <div className="font-semibold">Seleccionado:</div>
                      {selectedSeats.map(seat => (
                        <div key={seat.id} className="flex justify-between">
                          <span>{seat.label}</span>
                          <span>€{seat.price}</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-500 mt-2 pt-2 font-bold">
                        Total: €{selectedSeats.reduce((sum, seat) => sum + seat.price, 0)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Productos Adicionales</CardTitle>
              <CardDescription className="text-gray-300">
                Mejora tu experiencia con estos extras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {additionalProducts.map(product => (
                  <div key={product.id} className="bg-slate-800/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">{product.name}</h4>
                    <p className="text-gray-400 text-sm mb-3">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-purple-400">€{product.price}</span>
                      <Button
                        size="sm"
                        onClick={() => addToCart(product)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Checkout Button */}
        {(selectedSeats.length > 0 || cart.length > 0) && (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              size="lg"
              onClick={() => setShowCheckout(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Comprar (€{calculateTotal()})
            </Button>
          </motion.div>
        )}
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
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
              <h3 className="text-xl font-bold text-white mb-4">Confirmar Compra</h3>
              
              <div className="space-y-3 mb-6">
                {selectedSeats.map(seat => (
                  <div key={seat.id} className="flex justify-between text-gray-300">
                    <span>{seat.label} ({seat.capacity} personas)</span>
                    <span>€{seat.price}</span>
                  </div>
                ))}
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-gray-300">
                    <span>{item.name} x{item.quantity}</span>
                    <span>€{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-gray-500 pt-3 flex justify-between font-bold text-white">
                  <span>Total:</span>
                  <span>€{calculateTotal()}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 border-purple-500/30 text-purple-400"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handlePurchase}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pagar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
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
                <h3 className="text-xl font-bold text-white">¡Compra Exitosa!</h3>
                <p className="text-gray-300">Tu entrada está lista</p>
              </div>

              <div className="bg-white p-6 rounded-lg mb-4">
                <QrCode className="h-24 w-24 text-black mx-auto" />
              </div>

              <div className="text-sm text-gray-300 mb-6">
                <p className="font-semibold text-white">{eventData.title}</p>
                <p>{eventData.date} • {eventData.time}</p>
                <p>{selectedSeats.map(s => s.label).join(', ')}</p>
              </div>

              <Button
                onClick={() => setShowQR(false)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Cerrar
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EventPage
