# 🚀 Despliegue Automático Configurado

Este proyecto está configurado para despliegue automático en Vercel.

## ⚡ Flujo de CI/CD

### 🔄 Production (rama `main`)
- **Trigger**: `git push origin main`
- **URL**: Dominio principal de producción
- **Tiempo**: ~2-3 minutos

### 🧪 Preview (otras ramas)
- **Trigger**: `git push origin feature-branch`
- **URL**: `feature-branch-xxx.vercel.app`
- **Tiempo**: ~2-3 minutos

### 📝 Pull Requests
- **Trigger**: Crear/actualizar PR
- **URL**: Comentario automático en el PR
- **Tiempo**: ~2-3 minutos

## 🛠️ Comandos Útiles

```bash
# Desarrollo local
pnpm dev

# Build local (probar antes de push)
pnpm build

# Preview del build
pnpm preview

# Deploy manual (opcional)
vercel --prod
```

## 📊 Monitoreo

- **Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Analytics**: Habilitadas automáticamente
- **Logs**: Disponibles en tiempo real
- **Performance**: Speed Insights incluidas

---

**Última actualización**: Auto-deploy configurado el 21 de septiembre de 2025