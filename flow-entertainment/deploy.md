# Guía de Despliegue - Flow Entertainment

## 🚀 Opciones de Despliegue

### 1. Vercel (Recomendado)

Vercel es la opción más sencilla para desplegar aplicaciones React:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desde el directorio del proyecto
vercel

# Para producción
vercel --prod
```

**Configuración automática:**
- Detección automática de React/Vite
- HTTPS automático
- CDN global
- Previews automáticos en PRs

### 2. Netlify

```bash
# Build local
npm run build

# Subir carpeta dist/ a Netlify
# O conectar repositorio Git para deploy automático
```

**Configuración en netlify.toml:**
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. GitHub Pages

```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Agregar script en package.json
"scripts": {
  "deploy": "gh-pages -d dist"
}

# Build y deploy
npm run build
npm run deploy
```

### 4. AWS S3 + CloudFront

```bash
# Build
npm run build

# Subir a S3
aws s3 sync dist/ s3://tu-bucket-name --delete

# Invalidar CloudFront
aws cloudfront create-invalidation --distribution-id EDFDVBD6EXAMPLE --paths "/*"
```

## 🔧 Configuración de Producción

### Variables de Entorno

Crear archivo `.env.production`:

```bash
# API URLs
VITE_API_URL=https://api.flowentertainment.com
VITE_WS_URL=wss://ws.flowentertainment.com

# Servicios externos
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_GOOGLE_MAPS_API_KEY=AIza...

# Configuración de app
VITE_APP_NAME=Flow Entertainment
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
```

### Optimizaciones de Build

El proyecto ya incluye optimizaciones en `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Desactivar en producción
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

## 📊 Monitoreo y Analytics

### Google Analytics 4

Agregar en `index.html`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Sentry (Error Tracking)

```bash
npm install @sentry/react @sentry/tracing
```

```javascript
// main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.VITE_ENVIRONMENT,
});
```

## 🔒 Seguridad

### Headers de Seguridad

Para Netlify (`_headers` file):
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;
```

### HTTPS

Todos los proveedores recomendados incluyen HTTPS automático:
- Vercel: Automático
- Netlify: Automático  
- GitHub Pages: Automático con dominio personalizado
- AWS: Configurar CloudFront con certificado SSL

## 🌐 CDN y Performance

### Optimización de Imágenes

```javascript
// Usar servicios de optimización
const optimizedImageUrl = (url, width = 800) => {
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=${width}&q=80&output=webp`
}
```

### Lazy Loading

```jsx
// Componentes lazy
const AdminPanel = lazy(() => import('./components/AdminPanel.jsx'))

// Imágenes lazy
<img loading="lazy" src={imageUrl} alt="..." />
```

## 📱 PWA (Progressive Web App)

### Configuración básica

Instalar Vite PWA plugin:
```bash
npm install -D vite-plugin-pwa
```

```javascript
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'Flow Entertainment',
        short_name: 'Flow',
        description: 'La plataforma definitiva para eventos con DJ',
        theme_color: '#8B5CF6',
        background_color: '#1E1B4B',
        display: 'standalone',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.VITE_API_URL }}
        VITE_STRIPE_PUBLIC_KEY: ${{ secrets.VITE_STRIPE_PUBLIC_KEY }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 📈 Performance Monitoring

### Web Vitals

```javascript
// main.jsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_category: 'Web Vitals',
    event_label: metric.id,
    non_interaction: true,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## 🔧 Troubleshooting

### Problemas Comunes

1. **Rutas no funcionan en producción**
   - Configurar redirects para SPA
   - Verificar configuración del servidor

2. **Variables de entorno no se cargan**
   - Verificar prefijo `VITE_`
   - Comprobar archivo `.env.production`

3. **Imágenes no cargan**
   - Verificar rutas relativas
   - Comprobar CORS headers

4. **Build falla por tamaño**
   - Implementar code splitting
   - Optimizar dependencias

### Comandos de Debug

```bash
# Analizar bundle
npm run build -- --analyze

# Preview local del build
npm run preview

# Verificar variables de entorno
npm run build -- --mode production --debug
```

## 📋 Checklist de Despliegue

- [ ] Variables de entorno configuradas
- [ ] Build de producción exitoso
- [ ] Tests pasando
- [ ] Analytics configurado
- [ ] Error tracking configurado
- [ ] HTTPS habilitado
- [ ] Headers de seguridad configurados
- [ ] Redirects para SPA configurados
- [ ] Performance optimizada
- [ ] SEO básico implementado
- [ ] Favicon y manifest configurados
- [ ] Monitoreo configurado

---

¡Tu aplicación Flow Entertainment está lista para conquistar el mundo de los eventos! 🎉
