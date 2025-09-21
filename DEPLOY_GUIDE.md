# 🚀 Guía de Despliegue: Flow Entertainment en Vercel + Supabase

## 📋 Requisitos Previos

- [x] Cuenta en [Supabase](https://supabase.com)
- [x] Cuenta en [Vercel](https://vercel.com)
- [x] Cuenta en [GitHub](https://github.com)
- [x] Repositorio del proyecto en GitHub

## 🗄️ Paso 1: Configurar Supabase

### 1.1 Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) e inicia sesión
2. Haz clic en **"New Project"**
3. Completa los datos:
   - **Name**: `flow-entertainment`
   - **Database Password**: Crea una contraseña segura (guárdala)
   - **Region**: Selecciona la región más cercana a tus usuarios
   - **Pricing Plan**: Selecciona "Free" para comenzar

### 1.2 Configurar la Base de Datos

1. Una vez creado el proyecto, ve a **SQL Editor** en el panel lateral
2. Crea un nuevo query y pega el contenido completo del archivo `database-schema.sql`
3. Ejecuta el script haciendo clic en **"Run"**
4. Verifica que todas las tablas se hayan creado correctamente en la pestaña **Table Editor**

### 1.3 Configurar Autenticación

1. Ve a **Authentication** → **Settings**
2. En **Site URL**, agrega:
   - `http://localhost:5173` (para desarrollo)
   - `https://tu-dominio.vercel.app` (para producción, lo actualizarás después)
3. En **Redirect URLs**, agrega las mismas URLs
4. Guarda los cambios

### 1.4 Obtener Credenciales

1. Ve a **Settings** → **API**
2. Copia y guarda estos valores:
   - **Project URL** (ejemplo: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (comienza con `eyJhbGciOi...`)

## 🔧 Paso 2: Configurar Variables de Entorno Localmente

1. En tu proyecto local, abre el archivo `.env.local`
2. Reemplaza los valores con tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-publica-anonima
```

3. Guarda el archivo y prueba que la conexión funcione:

```bash
pnpm dev
```

## 📤 Paso 3: Preparar el Repositorio para Vercel

### 3.1 Subir Código a GitHub

Si aún no has subido tu código a GitHub:

```bash
# Inicializar repositorio (si no está inicializado)
git init

# Agregar archivos
git add .

# Hacer commit
git commit -m "feat: configuración inicial con Supabase"

# Conectar con repositorio remoto
git remote add origin https://github.com/tu-usuario/flow-entertainment.git

# Subir código
git push -u origin main
```

### 3.2 Verificar Build Local

Antes de desplegar, asegúrate de que el build funcione correctamente:

```bash
# Instalar dependencias
pnpm install

# Construir el proyecto
pnpm build

# Previsualizar el build
pnpm preview
```

## 🌐 Paso 4: Desplegar en Vercel

### 4.1 Conectar Repositorio

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en **"New Project"**
3. Conecta tu cuenta de GitHub si no lo has hecho
4. Busca tu repositorio `flow-entertainment` y haz clic en **"Import"**

### 4.2 Configurar el Proyecto

1. **Project Name**: `flow-entertainment`
2. **Framework Preset**: Vite (debería detectarse automáticamente)
3. **Root Directory**: `./` (raíz del proyecto)
4. **Build Command**: `pnpm build`
5. **Output Directory**: `dist`
6. **Install Command**: `pnpm install`

### 4.3 Configurar Variables de Entorno

En la sección **Environment Variables**, agrega:

| Nombre | Valor |
|--------|--------|
| `VITE_SUPABASE_URL` | Tu Project URL de Supabase |
| `VITE_SUPABASE_ANON_KEY` | Tu anon public key de Supabase |

### 4.4 Desplegar

1. Haz clic en **"Deploy"**
2. Espera a que termine el proceso (usualmente 2-3 minutos)
3. Una vez completado, obtendrás una URL como `https://flow-entertainment-xxx.vercel.app`

## 🔧 Paso 5: Configuración Post-Despliegue

### 5.1 Actualizar URLs en Supabase

1. Ve a tu proyecto de Supabase
2. Navega a **Authentication** → **Settings**
3. Actualiza las URLs:
   - **Site URL**: `https://tu-dominio.vercel.app`
   - **Redirect URLs**: Agrega `https://tu-dominio.vercel.app/**`

### 5.2 Configurar Dominio Personalizado (Opcional)

1. En Vercel, ve a tu proyecto
2. Navega a **Settings** → **Domains**
3. Agrega tu dominio personalizado
4. Configura los DNS según las instrucciones de Vercel
5. Actualiza las URLs en Supabase con tu nuevo dominio

## ✅ Paso 6: Verificación

### 6.1 Verificar Funcionalidades

Prueba las siguientes funciones en tu aplicación desplegada:

- [ ] Página principal carga correctamente
- [ ] Registro de usuario funciona
- [ ] Inicio de sesión funciona
- [ ] Dashboard se muestra para usuarios autenticados
- [ ] Datos se cargan desde Supabase
- [ ] SSL certificado está activo (candado verde en el navegador)

### 6.2 Monitoreo

1. **Vercel Analytics**: Habilitado automáticamente
2. **Supabase Dashboard**: Monitorea consultas y usuarios
3. **Logs**: Revisa logs en Vercel → Functions

## 🚨 Solución de Problemas Comunes

### Error: "Invalid API key"
- Verifica que las variables de entorno estén configuradas correctamente en Vercel
- Asegúrate de que las claves de Supabase sean correctas

### Error 404 en rutas
- Verifica que `vercel.json` esté configurado correctamente
- Las SPAs necesitan redireccionar todas las rutas a `index.html`

### Error de CORS
- Verifica las URLs configuradas en Supabase Auth
- Asegúrate de incluir `**` al final de las redirect URLs

### Build fails
- Revisa que todas las dependencias estén en `package.json`
- Verifica que no hay imports rotos
- Revisa los logs de build en Vercel

## 📱 Próximos Pasos

1. **Configurar CI/CD**: Los despliegues automáticos ya están activos
2. **Monitoreo**: Configura alertas en Vercel y Supabase
3. **Analytics**: Implementa Google Analytics o similar
4. **Performance**: Optimiza imágenes y lazy loading
5. **SEO**: Agrega meta tags y sitemap

## 🔐 Seguridad

- [ ] RLS (Row Level Security) configurado en Supabase
- [ ] Variables de entorno nunca committeadas
- [ ] HTTPS configurado correctamente
- [ ] Headers de seguridad en `vercel.json`

---

¡Tu aplicación Flow Entertainment ya está desplegada en producción! 🎉

Para soporte técnico:
- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)