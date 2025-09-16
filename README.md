# Proyecto: Plataforma de Gestión y Venta de Entradas para Eventos

## 1. Resumen del Proyecto

Crear una plataforma integral (web y móvil) para la promoción, venta y gestión de entradas a eventos. El sistema se diferenciará por su experiencia de usuario inmersiva, potentes herramientas de gestión para organizadores y una app ágil para agentes de ventas y clientes.

**Principales Actores:**
*   **Administrador/Organizador:** Gestiona eventos, locales y agentes desde la plataforma web.
*   **Agente de Ventas:** Vende entradas y gestiona clientes desde la aplicación móvil.
*   **Cliente Final:** Compra entradas, explora eventos y accede a sus QR desde la app.

---

## 2. Arquitectura Tecnológica (Stack Propuesto)

### **Backend (Microservicios)**
*   **Framework:** Node.js con **NestJS** (altamente recomendado por su arquitectura modular, similar a Angular) o Python con **FastAPI**.
*   **Servicios Propuestos:**
    *   `servicio-usuarios`: Autenticación (JWT), perfiles, roles (admin, agente, cliente).
    *   `servicio-eventos`: CRUD de eventos, gestión de fechas, políticas de precios.
    *   `servicio-locales`: Gestión de mapas de locales (mesas, zonas, barras).
    *   `servicio-ventas`: Lógica de negocio para crear, procesar y confirmar ventas.
    *   `servicio-pagos`: Integración con pasarelas de pago (Stripe, Mercado Pago).
    *   `servicio-notificaciones`: Envío de emails, notificaciones push y generación/envío de QR.

### **Bases de Datos**
*   **Datos Relacionales:** **PostgreSQL**. Ideal para usuarios, eventos, ventas, transacciones. Es robusto y escalable.
*   **Datos No Relacionales:** **MongoDB**. Perfecto para almacenar la estructura de los mapas de los locales (JSON flexible con posiciones x, y, tipo de objeto, etc.).

### **Frontend**
*   **Plataforma Web (Admin/Organizador):** **React** o **Vue.js**.
    *   Librería de componentes: Material-UI (para React) o Vuetify (para Vue).
    *   Librería para el diseñador de locales: `react-dnd` (drag and drop) o `konva`.
*   **Aplicación Móvil (Agente/Cliente):** **Flutter** o **React Native**.
    *   Permite un único código base para iOS y Android, optimizando recursos.

---

## 3. Plan de Desarrollo por Fases y Funcionalidades

### **Fase 1: El Núcleo del Sistema (Backend y Base de Datos)**

#### **Paso 1.1: Configuración de la Base de Datos**
*   **Tarea:** Diseñar y crear los esquemas para PostgreSQL.
    *   `users` (id, nombre, email, password_hash, role).
    *   `events` (id, nombre, fecha, lugar, descripcion, organizador_id).
    *   `sales` (id, event_id, user_id, agent_id, total_amount, status).
    *   `tickets` (id, sale_id, seat_info, qr_code_hash).
*   **Tarea:** Configurar la base de datos MongoDB.
    *   Crear una colección `venue_maps` para guardar los diseños de los locales en formato JSON.

#### **Paso 1.2: Microservicio de Usuarios y Autenticación**
*   **Tarea:** Implementar endpoints para registro, login y gestión de perfiles.
*   **Tarea:** Implementar sistema de autenticación basado en **JWT (JSON Web Tokens)**.
*   **Tarea:** Definir roles (`admin`, `agent`, `client`) y proteger rutas según el rol.

#### **Paso 1.3: Microservicio de Eventos**
*   **Tarea:** Crear endpoints CRUD (Crear, Leer, Actualizar, Borrar) para los eventos.
*   **Tarea:** El endpoint de creación debe asociar el evento a un organizador (user_id).

---

### **Fase 2: Plataforma Web de Administración**

#### **Paso 2.1: Dashboard Principal del Organizador**
*   **Tarea:** Crear la interfaz para listar, crear y editar eventos.
*   **Tarea:** Conectar la interfaz con el `servicio-eventos`.

#### **Paso 2.2: Diseñador de Locales (Funcionalidad Estrella)**
*   **Tarea:** Desarrollar un componente visual de "arrastrar y soltar" (drag-and-drop).
*   **Tarea:** Permitir al organizador añadir elementos: mesas (circulares, cuadradas), zonas VIP, pista de baile, DJ, barras.
*   **Tarea:** Cada elemento debe ser configurable (ej. número de mesa, capacidad, precio).
*   **Tarea:** Al guardar, la configuración se envía como un objeto JSON al `servicio-locales` y se almacena en MongoDB.

#### **Paso 2.3: Gestión de Agentes y Analíticas**
*   **Tarea:** Crear interfaz para invitar/añadir agentes de ventas a la plataforma.
*   **Tarea:** Asignar agentes a eventos específicos.
*   **Tarea:** Desarrollar un panel de analíticas con gráficos (ej. usando Chart.js) para visualizar ventas en tiempo real, ingresos por evento y rendimiento de agentes.

---

### **Fase 3: Aplicación Móvil (Modo Agente y Cliente)**

#### **Paso 3.1: Configuración Inicial y Autenticación**
*   **Tarea:** Estructurar la app en Flutter/React Native con navegación.
*   **Tarea:** Implementar las pantallas de login/registro que se comunican con el `servicio-usuarios`.
*   **Tarea:** La app debe cambiar su interfaz según el rol del usuario logueado (Agente o Cliente).

#### **Paso 3.2: Modo Agente de Ventas**
*   **Tarea:** Pantalla principal con la lista de eventos asignados.
*   **Tarea:** Al seleccionar un evento, mostrar el mapa del local renderizando el JSON de MongoDB. Las mesas/zonas deben ser interactivas y mostrar su estado (libre, reservada, vendida).
*   **Tarea:** Implementar el flujo de venta:
    1.  Agente selecciona una mesa/entrada.
    2.  La app se comunica con el `servicio-ventas` para crear una "pre-reserva".
    3.  Generar un **enlace de pago** (usando el `servicio-pagos`) o permitir al agente marcarla como "pagada en efectivo".
    4.  Una vez confirmado el pago, el `servicio-notificaciones` genera el QR.
*   **Tarea:** Implementar la función de compartir el QR por WhatsApp, email, etc.
*   **Tarea:** Implementar la creación de "enlaces de invitación" que filtren la vista del mapa para un cliente específico.

#### **Paso 3.3: Modo Cliente Final**
*   **Tarea:** Pantalla de exploración de eventos (con filtros por ciudad, fecha).
*   **Tarea:** Visualizador del mapa del local, permitiendo al cliente seleccionar su lugar.
*   **Tarea:** Flujo de compra autónomo:
    1.  Cliente selecciona mesa/entrada.
    2.  Añade productos opcionales (bebidas, merchandising).
    3.  Procede al checkout e introduce sus datos de pago en la pasarela.
*   **Tarea:** Crear la sección "Mis Entradas", una billetera digital que muestra los QR de las compras activas.

---

### **Fase 4: Funcionalidades Innovadoras y Pulido Final**

#### **Paso 4.1: Mejoras en la Experiencia de Usuario**
*   **Tarea:** (Opcional, Avanzado) Investigar librerías como `three.js` para renderizar el mapa del local en **3D** en la app del cliente.
*   **Tarea:** Implementar un sistema de notificaciones push para recordar eventos o anunciar novedades.

#### **Paso 4.2: Gamificación y Funciones Sociales**
*   **Tarea:** En el backend, crear lógica para calcular rankings de agentes (ventas totales, velocidad de venta).
*   **Tarea:** Mostrar medallas y tablas de clasificación en el "Modo Agente" de la app.
*   **Tarea:** Implementar la compra anticipada de bebidas, generando un QR adicional para canjear en barra.

#### **Paso 4.3: Despliegue y Pruebas**
*   **Tarea:** Contenerizar los microservicios usando **Docker**.
*   **Tarea:** Orquestar los contenedores con **Kubernetes** o usar un servicio gestionado como AWS Fargate, Google Cloud Run o DigitalOcean App Platform.
*   **Tarea:** Configurar un pipeline de CI/CD (Integración Continua/Despliegue Continuo) con herramientas como GitHub Actions.
*   **Tarea:** Publicar la aplicación móvil en la App Store y Google Play.

