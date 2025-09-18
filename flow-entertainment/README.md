# Flow Entertainment 🎵

**La plataforma definitiva para eventos y fiestas con DJ**

Flow Entertainment es una plataforma web completa diseñada para revolucionar la forma en que se promocionan, venden y gestionan las entradas a eventos musicales. Con un enfoque especial en fiestas con DJs, ofrece una experiencia única tanto para organizadores como para clientes y agentes de venta.

## 🌟 Características Principales

### Para Organizadores
- **Panel de Administración Completo**: Gestión integral de eventos, agentes y analíticas
- **Diseñador de Locales Interactivo**: Herramienta visual para crear mapas 3D de venues
- **Gestión de Agentes**: Sistema de comisiones y rankings para equipos de venta
- **Analíticas en Tiempo Real**: Métricas detalladas de ventas y rendimiento

### Para Clientes
- **Experiencia Visual Inmersiva**: Mapas interactivos para seleccionar asientos
- **Compra Simplificada**: Proceso de checkout optimizado con múltiples opciones
- **Entradas Digitales**: Códigos QR seguros para acceso sin contacto
- **Productos Adicionales**: Packs de bebidas, merchandising y experiencias VIP

### Para Agentes de Venta
- **Dashboard Personalizado**: Métricas de rendimiento y objetivos
- **Herramientas de Venta**: Generación de enlaces de invitación y QR
- **Sistema de Gamificación**: Rankings y recompensas por rendimiento
- **Gestión de Clientes**: Base de datos de clientes frecuentes

## 🚀 Tecnologías Utilizadas

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Iconos**: Lucide React
- **Animaciones**: Framer Motion
- **Routing**: React Router DOM
- **Build Tool**: Vite

## 📁 Estructura del Proyecto

```
flow-entertainment/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes base de shadcn/ui
│   │   ├── AdminPanel.jsx   # Panel de administración
│   │   ├── VenueDesigner.jsx # Diseñador de locales
│   │   ├── EventPage.jsx    # Página individual de evento
│   │   └── AgentDashboard.jsx # Panel de agentes
│   ├── App.jsx              # Componente principal y routing
│   ├── App.css              # Estilos globales
│   └── main.jsx             # Punto de entrada
├── package.json
└── README.md
```

## 🎨 Páginas y Funcionalidades

### 1. Página Principal (`/`)
- **Hero Section**: Video de fondo con llamadas a la acción
- **Eventos Destacados**: Grid de próximos eventos
- **Cómo Funciona**: Proceso paso a paso
- **Características**: Funcionalidades únicas de la plataforma
- **Descarga de App**: Enlaces a tiendas móviles

### 2. Panel de Administración (`/admin`)
- **Dashboard**: Métricas generales y KPIs
- **Gestión de Eventos**: CRUD completo de eventos
- **Gestión de Agentes**: Control de equipos de venta
- **Analíticas**: Gráficos y reportes detallados
- **Configuración**: Ajustes de la plataforma

### 3. Diseñador de Locales (`/venue-designer`)
- **Herramientas de Diseño**: Mesas, barras, cabinas DJ, zonas VIP
- **Canvas Interactivo**: Arrastrar y soltar elementos
- **Propiedades Configurables**: Precios, capacidad, etiquetas
- **Vista 2D/3D**: Múltiples perspectivas del local
- **Exportación**: Guardar diseños para eventos

### 4. Página de Evento (`/event/:id`)
- **Información Detallada**: Descripción, DJ, horarios
- **Mapa Interactivo**: Selección visual de asientos
- **Productos Adicionales**: Bebidas, merchandising
- **Proceso de Compra**: Checkout integrado
- **Generación de QR**: Entradas digitales instantáneas

### 5. Panel de Agentes (`/agent`)
- **Métricas Personales**: Ventas, comisiones, ranking
- **Eventos Disponibles**: Catálogo para venta
- **Herramientas de Venta**: Enlaces de invitación, QR
- **Clientes VIP**: Base de datos de clientes frecuentes
- **Ranking Global**: Competencia entre agentes

## 🎯 Flujos de Usuario

### Flujo de Compra del Cliente
1. **Descubrimiento**: Navegación por eventos en la página principal
2. **Selección**: Click en evento de interés
3. **Exploración**: Visualización del local y opciones disponibles
4. **Personalización**: Selección de asientos y productos adicionales
5. **Compra**: Proceso de checkout simplificado
6. **Confirmación**: Recepción de QR para acceso al evento

### Flujo de Venta del Agente
1. **Login**: Acceso al panel personalizado
2. **Selección de Evento**: Elección del evento a promocionar
3. **Generación de Enlace**: Creación de link personalizado
4. **Promoción**: Envío por WhatsApp, email o redes sociales
5. **Seguimiento**: Monitoreo de conversiones y comisiones

### Flujo de Gestión del Organizador
1. **Creación de Evento**: Información básica y detalles
2. **Diseño del Local**: Uso del diseñador interactivo
3. **Configuración de Precios**: Establecimiento de tarifas por zona
4. **Gestión de Agentes**: Asignación de equipos de venta
5. **Monitoreo**: Seguimiento de ventas y analíticas

## 🎨 Diseño y UX

### Paleta de Colores
- **Primario**: Gradientes púrpura a rosa (#8B5CF6 → #EC4899)
- **Secundario**: Cian y amarillo para acentos (#06B6D4, #F59E0B)
- **Fondo**: Gradientes oscuros (#1E1B4B → #0F172A)
- **Texto**: Blanco y grises para contraste óptimo

### Principios de Diseño
- **Tema Nocturno**: Colores oscuros que evocan la vida nocturna
- **Gradientes Vibrantes**: Efectos visuales que transmiten energía
- **Animaciones Fluidas**: Transiciones suaves con Framer Motion
- **Tipografía Moderna**: Jerarquía clara y legibilidad óptima
- **Responsive Design**: Adaptación perfecta a todos los dispositivos

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm o pnpm

### Instalación
```bash
# Clonar el repositorio
git clone [repository-url]
cd flow-entertainment

# Instalar dependencias
npm install
# o
pnpm install

# Iniciar servidor de desarrollo
npm run dev
# o
pnpm dev
```

### Scripts Disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Linting del código
```

## 🌐 Despliegue

El proyecto está optimizado para despliegue en:
- **Vercel** (recomendado para React)
- **Netlify**
- **AWS S3 + CloudFront**
- **GitHub Pages**

### Build de Producción
```bash
npm run build
```

Los archivos optimizados se generan en la carpeta `dist/`.

## 🔮 Roadmap Futuro

### Funcionalidades Planificadas
- **App Móvil**: Versión nativa para iOS y Android
- **Pagos Integrados**: Stripe, PayPal, criptomonedas
- **Realidad Aumentada**: Vista AR del local desde el móvil
- **IA Personalizada**: Recomendaciones basadas en gustos musicales
- **Streaming en Vivo**: Transmisión de eventos en tiempo real
- **NFT Tickets**: Entradas como tokens no fungibles

### Integraciones
- **WhatsApp Business API**: Envío automático de entradas
- **Telegram Bot**: Notificaciones y soporte al cliente
- **Spotify/Apple Music**: Integración con playlists de DJs
- **Google Maps**: Navegación al venue
- **Uber/Cabify**: Transporte integrado

## 🤝 Contribución

Este proyecto está diseñado como una demostración completa de una plataforma de eventos. Para contribuir:

1. Fork del repositorio
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto es una demostración y está disponible bajo licencia MIT.

## 🎵 Créditos

- **Diseño**: Inspirado en las mejores prácticas de UX para plataformas de entretenimiento
- **Imágenes**: Pexels y Unsplash para contenido de demostración
- **Videos**: Mixkit para videos de fondo
- **Iconos**: Lucide React para iconografía consistente

---

**Flow Entertainment** - *Donde la música cobra vida* 🎶✨
