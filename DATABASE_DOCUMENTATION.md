# Documentación del Esquema de Base de Datos - Flow Entertainment

## 📋 Resumen General

Este documento describe el esquema de base de datos diseñado para **Flow Entertainment**, una plataforma integral para la gestión de eventos musicales que soporta tres tipos principales de usuarios: **administradores/organizadores**, **agentes de venta** y **clientes finales**.

## 🏗️ Arquitectura de Datos

### Tecnología Principal
- **PostgreSQL** como base de datos principal
- **Extensiones**: uuid-ossp (UUIDs), pgcrypto (encriptación)
- **Tipos de datos**: ENUMs para estados, JSONB para datos flexibles
- **Indexación**: Índices optimizados para consultas frecuentes

### Estructura Modular
El esquema está organizado en **10 módulos principales**:

1. **Gestión de Usuarios y Autenticación**
2. **Gestión de Eventos y Locales**
3. **Gestión de Ventas y Pagos**
4. **Notificaciones y Comunicación**
5. **Auditoría y Tracking**
6. **Configuración y Metadatos**
7. **Índices para Optimización**
8. **Funciones y Triggers**
9. **Vistas para Reporting**
10. **Datos de Ejemplo**

## 🗂️ Módulos Detallados

### 1. Gestión de Usuarios y Autenticación

#### Tablas Principales:
- **`users`**: Tabla central de usuarios con roles diferenciados
- **`agent_profiles`**: Información extendida para agentes de venta
- **`user_sessions`**: Gestión de sesiones JWT
- **`verification_tokens`**: Tokens para verificación de email/teléfono

#### Características Clave:
- Soporte para múltiples roles: `admin`, `organizer`, `agent`, `client`
- Sistema de verificación de email y teléfono
- Gestión de sesiones con información de dispositivo
- Perfiles especializados para agentes con métricas de rendimiento

```sql
-- Ejemplo: Usuario agente con perfil
INSERT INTO users (email, role, first_name, last_name) 
VALUES ('agent@example.com', 'agent', 'Juan', 'Pérez');

INSERT INTO agent_profiles (user_id, agent_code, commission_rate) 
VALUES (user_id, 'AGT001', 12.5);
```

### 2. Gestión de Eventos y Locales

#### Tablas Principales:
- **`events`**: Eventos principales con toda la información
- **`venues`**: Información de locales/venues
- **`venue_layouts`**: Diseños específicos para cada evento
- **`venue_elements`**: Elementos del diseñador (mesas, barras, etc.)
- **`seats`**: Asientos/espacios individuales
- **`pricing_zones`**: Zonas de precios diferenciadas

#### Funcionalidad del Diseñador de Locales:
El sistema incluye un **diseñador visual de locales** que permite:
- Crear layouts personalizados para cada evento
- Arrastrar y soltar elementos (mesas, barras, cabinas DJ, etc.)
- Configurar precios por zona
- Definir capacidades y restricciones

```sql
-- Ejemplo: Elemento mesa redonda en el diseñador
INSERT INTO venue_elements 
(layout_id, element_type, name, x_position, y_position, width, height, capacity, base_price)
VALUES 
(layout_id, 'table_round', 'Mesa 1', 100.0, 150.0, 80.0, 80.0, 6, 50.00);
```

### 3. Gestión de Ventas y Pagos

#### Tablas Principales:
- **`sales`**: Ventas principales con información del cliente y agente
- **`sale_line_items`**: Líneas de venta (tickets, productos adicionales)
- **`tickets`**: Tickets individuales con códigos QR
- **`payments`**: Información de pagos y transacciones
- **`products`**: Productos adicionales (bebidas, merchandising)
- **`discount_codes`**: Códigos de descuento
- **`agent_commissions`**: Cálculo de comisiones para agentes

#### Flujo de Venta:
1. **Creación de venta** → Se genera automáticamente un número único
2. **Líneas de venta** → Se añaden tickets y productos
3. **Procesamiento de pago** → Integración con pasarelas
4. **Generación de tickets** → Códigos QR únicos y seguros
5. **Cálculo de comisiones** → Automático para agentes

### 4. Notificaciones y Comunicación

#### Características:
- **Multicanal**: Email, SMS, Push, WhatsApp, In-App
- **Plantillas flexibles**: Sistema de templates con variables
- **Programación**: Envío diferido y automático
- **Tracking**: Seguimiento de entrega y apertura

### 5. Auditoría y Tracking

#### Componentes:
- **`audit_logs`**: Registro completo de acciones de usuarios
- **`analytics_events`**: Eventos de comportamiento para analytics
- **`agent_metrics`**: Métricas diarias para gamificación

## 🔗 Relaciones Principales

### Diagrama de Relaciones Clave:

```
Users (1) ←→ (N) Events [organizer_id]
Users (1) ←→ (N) Sales [customer_id, agent_id]
Events (1) ←→ (N) Venue_Layouts
Venue_Layouts (1) ←→ (N) Venue_Elements
Venue_Elements (1) ←→ (N) Seats
Sales (1) ←→ (N) Sale_Line_Items
Sales (1) ←→ (N) Tickets
Sales (1) ←→ (N) Payments
```

## 📊 Vistas de Reporting

### Vistas Incluidas:
1. **`sales_detailed`**: Ventas con información completa
2. **`agent_ranking`**: Ranking de agentes por rendimiento
3. **`event_occupancy`**: Ocupación y ingresos por evento

### Ejemplo de consulta:
```sql
-- Top 10 agentes por ingresos
SELECT agent_name, total_revenue, total_commission_earned
FROM agent_ranking
ORDER BY total_revenue DESC
LIMIT 10;
```

## ⚡ Optimizaciones

### Índices Estratégicos:
- Búsquedas por email, fechas, estados
- Consultas de ventas por evento y agente
- Lookups de tickets por QR
- Filtros geográficos de venues

### Funciones Automáticas:
- **Numeración automática**: Sales y tickets
- **Timestamps automáticos**: created_at, updated_at
- **Generación de códigos**: QR únicos y seguros

## 🛡️ Seguridad

### Medidas Implementadas:
- **UUIDs**: En lugar de IDs secuenciales
- **Hashing**: Para tokens y códigos sensibles
- **Constraints**: Validación de datos a nivel DB
- **Audit trail**: Registro completo de cambios

## 📈 Escalabilidad

### Diseño para Crecimiento:
- **Particionado futuro**: Preparado para particionar por fecha
- **Índices optimizados**: Para consultas pesadas
- **JSONB**: Para datos flexibles sin impacto en rendimiento
- **Vistas materializadas**: Preparadas para reporting pesado

## 🔧 Configuración Flexible

### Sistema de Configuración:
- **system_config**: Configuración dinámica sin restart
- **notification_templates**: Plantillas editables
- **Metadatos JSONB**: Extensibilidad sin cambios de esquema

## 📱 Soporte para Apps

### Diseño Multi-plataforma:
- **API-First**: Esquema preparado para APIs REST/GraphQL
- **Datos móviles**: Optimizado para sincronización móvil
- **Offline-ready**: Estructura que soporta caching local

## 🚀 Próximos Pasos

### Implementación Recomendada:
1. **Configurar PostgreSQL** con las extensiones necesarias
2. **Ejecutar database-schema.sql** para crear toda la estructura
3. **Configurar conexiones** desde el backend (NestJS/FastAPI)
4. **Implementar APIs** siguiendo la estructura de datos
5. **Desarrollar frontend** consumiendo las APIs
6. **Configurar notificaciones** con plantillas iniciales

### Consideraciones de Producción:
- **Backups automáticos** configurados
- **Monitoreo de performance** de consultas
- **Replicación** para alta disponibilidad
- **Migraciones controladas** para cambios futuros

---

Este esquema proporciona una base sólida y escalable para toda la funcionalidad de Flow Entertainment, desde la gestión básica de usuarios hasta características avanzadas como el diseñador de locales y el sistema de gamificación para agentes.