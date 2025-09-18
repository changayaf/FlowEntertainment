# Documentación Técnica - Flow Entertainment

## 🏗️ Arquitectura del Sistema

### Frontend (React SPA)
La aplicación está construida como una Single Page Application (SPA) usando React 18 con las siguientes características:

- **Routing**: React Router DOM para navegación client-side
- **State Management**: React Hooks (useState, useEffect, useRef)
- **Styling**: Tailwind CSS con componentes shadcn/ui
- **Animations**: Framer Motion para transiciones fluidas
- **Build Tool**: Vite para desarrollo y build optimizado

### Estructura de Componentes

```
src/
├── components/
│   ├── ui/                    # Componentes base reutilizables
│   │   ├── button.jsx         # Botón personalizable
│   │   ├── card.jsx           # Tarjetas de contenido
│   │   ├── input.jsx          # Campos de entrada
│   │   ├── label.jsx          # Etiquetas de formulario
│   │   └── badge.jsx          # Insignias y etiquetas
│   ├── AdminPanel.jsx         # Panel administrativo
│   ├── VenueDesigner.jsx      # Diseñador de locales
│   ├── EventPage.jsx          # Página de evento individual
│   └── AgentDashboard.jsx     # Dashboard de agentes
├── App.jsx                    # Componente raíz y routing
├── App.css                    # Estilos globales
└── main.jsx                   # Punto de entrada
```

## 🎨 Sistema de Diseño

### Tokens de Diseño

```css
/* Colores Principales */
--purple-primary: #8B5CF6
--pink-primary: #EC4899
--cyan-accent: #06B6D4
--yellow-accent: #F59E0B

/* Gradientes */
--gradient-primary: linear-gradient(to right, #8B5CF6, #EC4899)
--gradient-background: linear-gradient(to bottom right, #1E1B4B, #0F172A)

/* Espaciado */
--spacing-xs: 0.25rem
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
--spacing-xl: 2rem

/* Tipografía */
--font-heading: 'Inter', sans-serif
--font-body: 'Inter', sans-serif
```

### Componentes UI Base

#### Button Component
```jsx
// Variantes disponibles
<Button variant="default">Primario</Button>
<Button variant="outline">Secundario</Button>
<Button variant="ghost">Fantasma</Button>
<Button variant="destructive">Destructivo</Button>

// Tamaños
<Button size="sm">Pequeño</Button>
<Button size="default">Normal</Button>
<Button size="lg">Grande</Button>
```

#### Card Component
```jsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>
    Contenido de la tarjeta
  </CardContent>
</Card>
```

## 🔄 Gestión de Estado

### Estado Local con Hooks

```jsx
// Ejemplo de gestión de estado en EventPage
const [selectedSeats, setSelectedSeats] = useState([])
const [showCheckout, setShowCheckout] = useState(false)
const [cart, setCart] = useState([])

// Funciones de actualización
const handleSeatSelect = (seat) => {
  setSelectedSeats(prev => {
    const isSelected = prev.find(s => s.id === seat.id)
    return isSelected 
      ? prev.filter(s => s.id !== seat.id)
      : [...prev, seat]
  })
}
```

### Patrones de Estado Comunes

1. **Toggle States**: Para modales y overlays
2. **Array States**: Para selecciones múltiples
3. **Object States**: Para formularios complejos
4. **Derived State**: Calculado a partir de otros estados

## 🎭 Animaciones con Framer Motion

### Configuraciones Estándar

```jsx
// Fade in desde abajo
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

// Escala desde el centro
const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 }
}

// Stagger para listas
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}
```

### Componentes Animados

```jsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
>
  Contenido animado
</motion.div>
```

## 🗺️ Sistema de Routing

### Configuración de Rutas

```jsx
<Router>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/admin" element={<AdminPanel />} />
    <Route path="/venue-designer" element={<VenueDesigner />} />
    <Route path="/event/:id" element={<EventPage />} />
    <Route path="/agent" element={<AgentDashboard />} />
  </Routes>
</Router>
```

### Navegación Programática

```jsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

// Navegación simple
navigate('/event/1')

// Navegación con estado
navigate('/checkout', { state: { selectedSeats } })

// Navegación con reemplazo
navigate('/success', { replace: true })
```

## 🎨 Diseñador de Locales - Arquitectura

### Estructura de Datos

```jsx
// Elemento del venue
const venueElement = {
  id: unique_id,
  type: 'table' | 'vip' | 'dj-booth' | 'bar' | 'dance-floor',
  x: number,        // Posición X
  y: number,        // Posición Y
  width: number,    // Ancho
  height: number,   // Alto
  rotation: number, // Rotación en grados
  label: string,    // Etiqueta visible
  capacity: number, // Capacidad de personas
  price: number,    // Precio por entrada
  color: string,    // Color del elemento
  status: 'available' | 'occupied' | 'selected'
}
```

### Herramientas de Diseño

```jsx
const tools = [
  { id: 'select', label: 'Seleccionar', icon: Move },
  { id: 'round-table', label: 'Mesa Redonda', icon: Circle },
  { id: 'square-table', label: 'Mesa Cuadrada', icon: Square },
  { id: 'vip-area', label: 'Zona VIP', icon: Users },
  { id: 'bar', label: 'Barra', icon: Wine },
  { id: 'dj-booth', label: 'Cabina DJ', icon: Music },
  { id: 'dance-floor', label: 'Pista de Baile', icon: Grid }
]
```

### Interacciones del Canvas

```jsx
// Agregar elemento
const addElement = (type, x, y) => {
  const newElement = {
    id: Date.now(),
    ...elementTypes[type],
    x, y,
    number: venueElements.filter(el => el.type === type).length + 1
  }
  setVenueElements(prev => [...prev, newElement])
}

// Seleccionar elemento
const handleElementClick = (e, elementId) => {
  e.stopPropagation()
  setSelectedElement(elementId)
}

// Actualizar propiedades
const updateElementProperty = (property, value) => {
  setVenueElements(prev => prev.map(el => 
    el.id === selectedElement 
      ? { ...el, [property]: value }
      : el
  ))
}
```

## 💳 Sistema de Compras

### Flujo de Checkout

```jsx
// Estado del carrito
const [cart, setCart] = useState([])
const [selectedSeats, setSelectedSeats] = useState([])

// Calcular total
const calculateTotal = () => {
  const seatsTotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
  const productsTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  return seatsTotal + productsTotal
}

// Procesar compra
const handlePurchase = async () => {
  try {
    // Simular API call
    const response = await processPayment({
      seats: selectedSeats,
      products: cart,
      total: calculateTotal()
    })
    
    if (response.success) {
      setShowQR(true)
    }
  } catch (error) {
    console.error('Error en el pago:', error)
  }
}
```

### Generación de QR

```jsx
// Datos del QR
const qrData = {
  eventId: event.id,
  customerId: customer.id,
  seats: selectedSeats.map(s => s.id),
  purchaseId: purchase.id,
  timestamp: Date.now()
}

// Componente QR
<div className="bg-white p-6 rounded-lg">
  <QrCode className="h-24 w-24 text-black mx-auto" />
</div>
```

## 📊 Sistema de Agentes

### Métricas y KPIs

```jsx
// Datos del agente
const agentMetrics = {
  totalSales: number,      // Ventas totales
  monthSales: number,      // Ventas del mes
  salesCount: number,      // Número de ventas
  commission: number,      // Porcentaje de comisión
  ranking: number,         // Posición en ranking
  conversionRate: number   // Tasa de conversión
}

// Cálculo de comisiones
const calculateCommission = (saleAmount, commissionRate) => {
  return (saleAmount * commissionRate) / 100
}
```

### Generación de Enlaces

```jsx
// Generar enlace de invitación
const generateInviteLink = (eventId, agentId) => {
  const baseUrl = window.location.origin
  return `${baseUrl}/event/${eventId}?agent=${agentId}&ref=invite`
}

// Tracking de conversiones
const trackConversion = (agentId, eventId, saleAmount) => {
  // Enviar datos a analytics
  analytics.track('agent_sale', {
    agentId,
    eventId,
    amount: saleAmount,
    timestamp: Date.now()
  })
}
```

## 🔧 Optimizaciones de Rendimiento

### Code Splitting

```jsx
// Lazy loading de componentes
const AdminPanel = lazy(() => import('./components/AdminPanel.jsx'))
const VenueDesigner = lazy(() => import('./components/VenueDesigner.jsx'))

// Suspense wrapper
<Suspense fallback={<LoadingSpinner />}>
  <AdminPanel />
</Suspense>
```

### Memoización

```jsx
// Memoizar cálculos costosos
const expensiveCalculation = useMemo(() => {
  return complexCalculation(data)
}, [data])

// Memoizar callbacks
const handleClick = useCallback((id) => {
  setSelected(id)
}, [])
```

### Optimización de Imágenes

```jsx
// Lazy loading de imágenes
<img 
  src={imageUrl}
  loading="lazy"
  alt="Descripción"
  className="w-full h-64 object-cover"
/>
```

## 🧪 Testing

### Estructura de Tests

```javascript
// Ejemplo de test para componente
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button Component', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## 🚀 Build y Deployment

### Configuración de Vite

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    }
  }
})
```

### Variables de Entorno

```bash
# .env.production
VITE_API_URL=https://api.flowentertainment.com
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

## 📱 Responsive Design

### Breakpoints

```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Móvil grande */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop pequeño */
xl: 1280px  /* Desktop grande */
2xl: 1536px /* Desktop extra grande */
```

### Patrones Responsive

```jsx
// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Texto responsive
<h1 className="text-2xl md:text-4xl lg:text-6xl font-bold">

// Espaciado responsive
<div className="p-4 md:p-6 lg:p-8">

// Visibilidad responsive
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>
```

## 🔒 Seguridad

### Validación de Datos

```jsx
// Validación de formularios
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const validatePhone = (phone) => {
  const regex = /^\+?[\d\s-()]+$/
  return regex.test(phone)
}
```

### Sanitización

```jsx
// Sanitizar entrada de usuario
const sanitizeInput = (input) => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover caracteres peligrosos
    .substring(0, 255)    // Limitar longitud
}
```

## 📈 Analytics y Tracking

### Eventos de Analytics

```jsx
// Tracking de eventos importantes
const trackEvent = (eventName, properties) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, properties)
  }
}

// Ejemplos de uso
trackEvent('purchase_completed', {
  event_id: eventId,
  value: totalAmount,
  currency: 'EUR'
})

trackEvent('seat_selected', {
  event_id: eventId,
  seat_type: seatType,
  price: seatPrice
})
```

## 🔄 Estado Global (Futuro)

### Context API Setup

```jsx
// EventContext.js
const EventContext = createContext()

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)

  return (
    <EventContext.Provider value={{
      events,
      selectedEvent,
      setEvents,
      setSelectedEvent
    }}>
      {children}
    </EventContext.Provider>
  )
}

// Hook personalizado
export const useEvents = () => {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error('useEvents must be used within EventProvider')
  }
  return context
}
```

---

Esta documentación técnica proporciona una base sólida para el desarrollo y mantenimiento de Flow Entertainment. Se recomienda actualizarla conforme evolucione el proyecto.
