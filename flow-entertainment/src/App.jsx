import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Calendar, 
  MapPin, 
  Music, 
  Users, 
  Smartphone, 
  QrCode, 
  Star,
  Play,
  Download,
  Instagram,
  Facebook,
  Twitter,
  Menu,
  X,
  ChevronRight,
  Clock,
  Ticket,
  Settings,
  BarChart3
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminPanel from './components/AdminPanel.jsx'
import VenueDesigner from './components/VenueDesigner.jsx'
import EventPage from './components/EventPage.jsx'
import AgentDashboard from './components/AgentDashboard.jsx'
import './App.css'

// Componente de la página principal
const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const navigate = useNavigate()

  // Datos de ejemplo para eventos
  const upcomingEvents = [
    {
      id: 1,
      title: "Neon Dreams",
      dj: "Alex Fusion",
      date: "25 de Octubre",
      time: "23:00",
      venue: "Sala Cosmos",
      price: "Desde 35€",
      image: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800",
      genre: "Techno",
      soldOut: false
    },
    {
      id: 2,
      title: "Urban Groove",
      dj: "Nina Flow",
      date: "02 de Noviembre",
      time: "22:30",
      venue: "Warehouse 3",
      price: "Desde 40€",
      image: "https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=800",
      genre: "House",
      soldOut: false
    },
    {
      id: 3,
      title: "Techno Dimension",
      dj: "Marco V",
      date: "15 de Noviembre",
      time: "23:30",
      venue: "The Bunker",
      price: "Desde 45€",
      image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800",
      genre: "Techno",
      soldOut: true
    }
  ]

  // Videos de fondo para el hero
  const heroVideos = [
    "https://assets.mixkit.co/videos/preview/mixkit-dj-mixing-at-a-party-31404-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-people-dancing-at-a-party-4640-large.mp4"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % heroVideos.length)
    }, 10000) // Cambiar video cada 10 segundos

    return () => clearInterval(interval)
  }, [])

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Flow Entertainment
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('events')} className="hover:text-purple-400 transition-colors">
              Eventos
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-purple-400 transition-colors">
              Cómo Funciona
            </button>
            <button onClick={() => scrollToSection('features')} className="hover:text-purple-400 transition-colors">
              Características
            </button>
            <button onClick={() => scrollToSection('download')} className="hover:text-purple-400 transition-colors">
              Descargar
            </button>
            <Link to="/admin" className="hover:text-purple-400 transition-colors flex items-center">
              <Settings className="mr-1 h-4 w-4" />
              Admin
            </Link>
            <Link to="/agent" className="hover:text-purple-400 transition-colors flex items-center">
              <Users className="mr-1 h-4 w-4" />
              Agentes
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/90 backdrop-blur-md"
            >
              <nav className="container mx-auto px-4 py-4 space-y-4">
                <button onClick={() => scrollToSection('events')} className="block hover:text-purple-400 transition-colors">
                  Eventos
                </button>
                <button onClick={() => scrollToSection('how-it-works')} className="block hover:text-purple-400 transition-colors">
                  Cómo Funciona
                </button>
                <button onClick={() => scrollToSection('features')} className="block hover:text-purple-400 transition-colors">
                  Características
                </button>
                <button onClick={() => scrollToSection('download')} className="block hover:text-purple-400 transition-colors">
                  Descargar
                </button>
                <Link to="/admin" className="block hover:text-purple-400 transition-colors">
                  Panel Admin
                </Link>
                <Link to="/agent" className="block hover:text-purple-400 transition-colors">
                  Panel Agentes
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            key={currentVideoIndex}
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
          >
            <source src={heroVideos[currentVideoIndex]} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-purple-900/30 to-black/70"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            La Fiesta a Tu Manera
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explora los mejores eventos, elige tu sitio perfecto y vive una noche inolvidable. 
            Tu acceso exclusivo a la fiesta está a un clic.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
              onClick={() => scrollToSection('events')}
            >
              <Play className="mr-2" size={20} />
              Ver Próximos Eventos
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3 text-lg"
              onClick={() => scrollToSection('download')}
            >
              <Download className="mr-2" size={20} />
              Descargar App
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronRight className="rotate-90 text-purple-400" size={32} />
        </motion.div>
      </section>

      {/* Upcoming Events Section */}
      <section id="events" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Próximos Eventos
            </h2>
            <p className="text-xl text-gray-300">
              Los mejores DJs y las fiestas más exclusivas te esperan
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 overflow-hidden">
                  <div className="relative">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-purple-600/80 text-white">
                        {event.genre}
                      </Badge>
                    </div>
                    {event.soldOut && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="destructive" className="bg-red-600/80 text-white">
                          Agotado
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl text-white">{event.title}</CardTitle>
                    <CardDescription className="text-purple-300">
                      DJ {event.dj}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="mr-2" size={16} />
                      <span>{event.date}</span>
                      <Clock className="ml-4 mr-2" size={16} />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <MapPin className="mr-2" size={16} />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-lg font-bold text-purple-400">{event.price}</span>
                      <Button 
                        className={`${event.soldOut 
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        }`}
                        disabled={event.soldOut}
                        onClick={() => !event.soldOut && navigate(`/event/${event.id}`)}
                      >
                        <Ticket className="mr-2" size={16} />
                        {event.soldOut ? 'Agotado' : 'Reservar'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-gradient-to-r from-purple-900/20 to-slate-900/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Vive la Experiencia
            </h2>
            <p className="text-xl text-gray-300">
              Tres simples pasos para una noche perfecta
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Smartphone size={48} />,
                title: "1. Explora",
                description: "Descarga la app y descubre los eventos más top de tu ciudad. Filtra por música, DJ o fecha."
              },
              {
                icon: <MapPin size={48} />,
                title: "2. Elige",
                description: "Visualiza el local en 3D, elige tu mesa o zona perfecta y asegura tu lugar al instante."
              },
              {
                icon: <QrCode size={48} />,
                title: "3. Disfruta",
                description: "Accede al evento con tu QR, sin colas ni complicaciones. Tu única preocupación será disfrutar la noche."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="mb-6 text-purple-400 flex justify-center">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Características Únicas
            </h2>
            <p className="text-xl text-gray-300">
              Tecnología innovadora para una experiencia sin igual
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                {[
                  {
                    icon: <MapPin className="text-purple-400" size={24} />,
                    title: "Mapas 3D Interactivos",
                    description: "Explora el local en una vista tridimensional realista antes de elegir tu sitio perfecto."
                  },
                  {
                    icon: <QrCode className="text-cyan-400" size={24} />,
                    title: "Entradas Digitales Seguras",
                    description: "Códigos QR únicos con tecnología anti-fraude para un acceso rápido y seguro."
                  },
                  {
                    icon: <Users className="text-pink-400" size={24} />,
                    title: "Gestión de Agentes",
                    description: "Sistema completo para que los organizadores gestionen sus equipos de venta."
                  },
                  {
                    icon: <Star className="text-yellow-400" size={24} />,
                    title: "Gamificación",
                    description: "Rankings y recompensas para agentes de venta que motivan el rendimiento."
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-2 bg-gradient-to-br from-purple-900/50 to-slate-900/50 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-8 backdrop-blur-sm border border-purple-500/30">
                <img 
                  src="https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="App mockup"
                  className="w-full rounded-lg shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-20 px-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              La Noche Te Espera
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Descarga la app y transforma tu forma de salir de fiesta. Disponible para iOS y Android.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-3">
                <Download className="mr-2" size={20} />
                App Store
              </Button>
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-3">
                <Download className="mr-2" size={20} />
                Google Play
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">50K+</div>
                <div className="text-gray-300">Usuarios Activos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-2">1000+</div>
                <div className="text-gray-300">Eventos Realizados</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-400 mb-2">4.8★</div>
                <div className="text-gray-300">Valoración Media</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-purple-500/20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Flow Entertainment
              </div>
              <p className="text-gray-400">
                La plataforma líder para eventos y fiestas con DJ. Tu acceso exclusivo a la mejor vida nocturna.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Eventos</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Próximos Eventos</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Eventos Pasados</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Organizadores</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Términos y Condiciones</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Instagram size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Facebook size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Twitter size={24} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-purple-500/20 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Flow Entertainment. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Componente principal de la aplicación con enrutamiento
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/venue-designer" element={<VenueDesigner />} />
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/agent" element={<AgentDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
