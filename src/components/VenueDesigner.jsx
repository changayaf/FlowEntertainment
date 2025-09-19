import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { 
  Square,
  Circle,
  Music,
  Wine,
  Users,
  Trash2,
  Save,
  Undo,
  Redo,
  Grid,
  Move,
  RotateCw,
  Settings,
  Eye,
  Download
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const VenueDesigner = () => {
  const [selectedTool, setSelectedTool] = useState('select')
  const [venueElements, setVenueElements] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  const [draggedElement, setDraggedElement] = useState(null)
  const [showGrid, setShowGrid] = useState(true)
  const [venueSize, setVenueSize] = useState({ width: 800, height: 600 })
  const canvasRef = useRef(null)

  // Herramientas disponibles
  const tools = [
    { id: 'select', label: 'Seleccionar', icon: Move },
    { id: 'round-table', label: 'Mesa Redonda', icon: Circle },
    { id: 'square-table', label: 'Mesa Cuadrada', icon: Square },
    { id: 'vip-area', label: 'Zona VIP', icon: Users },
    { id: 'bar', label: 'Barra', icon: Wine },
    { id: 'dj-booth', label: 'Cabina DJ', icon: Music },
    { id: 'dance-floor', label: 'Pista de Baile', icon: Grid }
  ]

  // Tipos de elementos con sus propiedades por defecto
  const elementTypes = {
    'round-table': {
      type: 'round-table',
      width: 60,
      height: 60,
      color: '#8B5CF6',
      label: 'Mesa',
      capacity: 4,
      price: 35
    },
    'square-table': {
      type: 'square-table',
      width: 80,
      height: 80,
      color: '#8B5CF6',
      label: 'Mesa',
      capacity: 6,
      price: 45
    },
    'vip-area': {
      type: 'vip-area',
      width: 120,
      height: 100,
      color: '#F59E0B',
      label: 'VIP',
      capacity: 8,
      price: 120
    },
    'bar': {
      type: 'bar',
      width: 150,
      height: 40,
      color: '#10B981',
      label: 'Barra',
      capacity: 0,
      price: 0
    },
    'dj-booth': {
      type: 'dj-booth',
      width: 100,
      height: 80,
      color: '#EF4444',
      label: 'DJ',
      capacity: 0,
      price: 0
    },
    'dance-floor': {
      type: 'dance-floor',
      width: 200,
      height: 150,
      color: '#6366F1',
      label: 'Pista',
      capacity: 0,
      price: 0
    }
  }

  // Agregar elemento al canvas
  const addElement = useCallback((type, x = 100, y = 100) => {
    if (type === 'select') return

    const newElement = {
      id: Date.now(),
      ...elementTypes[type],
      x,
      y,
      rotation: 0,
      number: venueElements.filter(el => el.type === type).length + 1
    }

    setVenueElements(prev => [...prev, newElement])
    setSelectedElement(newElement.id)
  }, [venueElements])

  // Manejar click en el canvas
  const handleCanvasClick = useCallback((e) => {
    if (selectedTool === 'select') {
      setSelectedElement(null)
      return
    }

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    addElement(selectedTool, x, y)
  }, [selectedTool, addElement])

  // Manejar click en elemento
  const handleElementClick = useCallback((e, elementId) => {
    e.stopPropagation()
    setSelectedElement(elementId)
  }, [])

  // Eliminar elemento seleccionado
  const deleteSelectedElement = useCallback(() => {
    if (selectedElement) {
      setVenueElements(prev => prev.filter(el => el.id !== selectedElement))
      setSelectedElement(null)
    }
  }, [selectedElement])

  // Actualizar propiedades del elemento seleccionado
  const updateElementProperty = useCallback((property, value) => {
    if (!selectedElement) return

    setVenueElements(prev => prev.map(el => 
      el.id === selectedElement 
        ? { ...el, [property]: value }
        : el
    ))
  }, [selectedElement])

  // Obtener elemento seleccionado
  const getSelectedElement = () => {
    return venueElements.find(el => el.id === selectedElement)
  }

  // Renderizar elemento en el canvas
  const renderElement = (element) => {
    const isSelected = selectedElement === element.id
    const borderStyle = isSelected ? '3px solid #F59E0B' : '2px solid rgba(255,255,255,0.3)'

    const commonProps = {
      style: {
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        backgroundColor: element.color,
        border: borderStyle,
        borderRadius: element.type === 'round-table' ? '50%' : '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
        transform: `rotate(${element.rotation}deg)`,
        transition: 'all 0.2s ease'
      },
      onClick: (e) => handleElementClick(e, element.id)
    }

    return (
      <motion.div
        key={element.id}
        {...commonProps}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="text-center">
          <div>{element.label}</div>
          {element.number && (
            <div className="text-xs opacity-80">#{element.number}</div>
          )}
        </div>
        
        {isSelected && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white"></div>
        )}
      </motion.div>
    )
  }

  // Panel de propiedades
  const renderPropertiesPanel = () => {
    const element = getSelectedElement()
    if (!element) return null

    return (
      <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Propiedades</CardTitle>
          <CardDescription className="text-gray-300">
            Configurar elemento seleccionado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Etiqueta</Label>
              <Input
                value={element.label}
                onChange={(e) => updateElementProperty('label', e.target.value)}
                className="bg-slate-800/50 border-purple-500/30 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Número</Label>
              <Input
                type="number"
                value={element.number}
                onChange={(e) => updateElementProperty('number', parseInt(e.target.value))}
                className="bg-slate-800/50 border-purple-500/30 text-white"
              />
            </div>
          </div>

          {(element.type.includes('table') || element.type === 'vip-area') && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Capacidad</Label>
                <Input
                  type="number"
                  value={element.capacity}
                  onChange={(e) => updateElementProperty('capacity', parseInt(e.target.value))}
                  className="bg-slate-800/50 border-purple-500/30 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Precio (€)</Label>
                <Input
                  type="number"
                  value={element.price}
                  onChange={(e) => updateElementProperty('price', parseInt(e.target.value))}
                  className="bg-slate-800/50 border-purple-500/30 text-white"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Ancho</Label>
              <Input
                type="number"
                value={element.width}
                onChange={(e) => updateElementProperty('width', parseInt(e.target.value))}
                className="bg-slate-800/50 border-purple-500/30 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Alto</Label>
              <Input
                type="number"
                value={element.height}
                onChange={(e) => updateElementProperty('height', parseInt(e.target.value))}
                className="bg-slate-800/50 border-purple-500/30 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Color</Label>
            <Input
              type="color"
              value={element.color}
              onChange={(e) => updateElementProperty('color', e.target.value)}
              className="bg-slate-800/50 border-purple-500/30 h-10"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Rotación (grados)</Label>
            <Input
              type="number"
              value={element.rotation}
              onChange={(e) => updateElementProperty('rotation', parseInt(e.target.value))}
              className="bg-slate-800/50 border-purple-500/30 text-white"
            />
          </div>

          <Button
            onClick={deleteSelectedElement}
            variant="destructive"
            className="w-full"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar Elemento
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-black text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-purple-500/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Diseñador de Locales
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-400">
              <Undo className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-400">
              <Redo className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-400">
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Save className="mr-2 h-4 w-4" />
              Guardar
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Herramientas */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Herramientas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        selectedTool === tool.id
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'text-gray-300 hover:bg-purple-900/30 hover:text-white'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-sm">{tool.label}</span>
                    </button>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Configuración</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">Mostrar Grilla</Label>
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      showGrid ? 'bg-purple-600' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      showGrid ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Ancho del Local</Label>
                  <Input
                    type="number"
                    value={venueSize.width}
                    onChange={(e) => setVenueSize(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                    className="bg-slate-800/50 border-purple-500/30 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Alto del Local</Label>
                  <Input
                    type="number"
                    value={venueSize.height}
                    onChange={(e) => setVenueSize(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                    className="bg-slate-800/50 border-purple-500/30 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {renderPropertiesPanel()}
          </div>

          {/* Canvas */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Diseño del Local</CardTitle>
                <CardDescription className="text-gray-300">
                  Haz clic para agregar elementos o selecciona para editar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-auto max-h-[600px] border-2 border-purple-500/30 rounded-lg">
                  <div
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    className="relative bg-slate-800/30 cursor-crosshair"
                    style={{
                      width: venueSize.width,
                      height: venueSize.height,
                      backgroundImage: showGrid 
                        ? 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)'
                        : 'none',
                      backgroundSize: showGrid ? '20px 20px' : 'none'
                    }}
                  >
                    {/* Elementos del venue */}
                    <AnimatePresence>
                      {venueElements.map(renderElement)}
                    </AnimatePresence>

                    {/* Indicador de herramienta activa */}
                    {selectedTool !== 'select' && (
                      <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                        Modo: {tools.find(t => t.id === selectedTool)?.label}
                      </div>
                    )}

                    {/* Información del canvas */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                      {venueElements.length} elementos • {venueSize.width}x{venueSize.height}px
                    </div>
                  </div>
                </div>

                {/* Instrucciones */}
                <div className="mt-4 p-4 bg-slate-800/30 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">Instrucciones:</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Selecciona una herramienta y haz clic en el canvas para agregar elementos</li>
                    <li>• Haz clic en un elemento para seleccionarlo y editarlo</li>
                    <li>• Usa el panel de propiedades para personalizar cada elemento</li>
                    <li>• Guarda tu diseño cuando esté listo</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VenueDesigner
