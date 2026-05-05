# Guía Completa de Uso — Impulso Latino
### Plataforma de Gestión de Préstamos para la Comunidad Latina

---

> **Documento confidencial** — Preparado exclusivamente para el equipo de Impulso Latino.  
> Versión 1.0 · Mayo 2026

---

## Tabla de Contenidos

1. [Visión General de la Plataforma](#1-visión-general-de-la-plataforma)
2. [Acceso y Roles de Usuario](#2-acceso-y-roles-de-usuario)
3. [La Landing Page (Sitio Público)](#3-la-landing-page-sitio-público)
4. [Formulario de Solicitud (Aplicación del Cliente)](#4-formulario-de-solicitud-aplicación-del-cliente)
5. [Portal del Cliente (Dashboard)](#5-portal-del-cliente-dashboard)
6. [Panel de Administración (CRM)](#6-panel-de-administración-crm)
7. [Flujo Completo de un Préstamo](#7-flujo-completo-de-un-préstamo)
8. [Seguridad y Buenas Prácticas](#8-seguridad-y-buenas-prácticas)
9. [Preguntas Frecuentes](#9-preguntas-frecuentes)

---

## 1. Visión General de la Plataforma

**Impulso Latino** es una plataforma web completa diseñada para gestionar préstamos personales dirigidos a la comunidad hispana en Estados Unidos. La plataforma tiene **dos grandes áreas**:

| Área | ¿Para quién? | ¿Cómo se accede? |
|---|---|---|
| **Sitio público + Formulario** | Clientes que buscan un préstamo | Visitando la página principal |
| **Portal del cliente** | Clientes que ya aplicaron | Iniciando sesión en `/dashboard` |
| **Panel de administración** | El equipo de Impulso Latino | Iniciando sesión en `/admin` |

### ¿Cómo está construida?

La plataforma funciona con datos en tiempo real almacenados en **Supabase** (base de datos en la nube segura). Toda la información se guarda automáticamente y es accesible desde cualquier dispositivo — computadora, teléfono o tablet.

---

## 2. Acceso y Roles de Usuario

### 2.1 Rol: Administrador

El administrador es el equipo interno de Impulso Latino. Tiene acceso completo al CRM, puede ver todos los leads, moverlos por el pipeline, ver datos de desembolso y responder mensajes de contacto.

**Para ingresar como administrador:**
1. Ir a la página web
2. Clic en **"Iniciar sesión"** en la barra de navegación
3. Usar las credenciales de administrador (email + contraseña del equipo)
4. El sistema detecta automáticamente que es administrador y redirige al **Panel Admin** (`/admin`)

> ⚠️ **Importante:** La cuenta de administrador debe estar marcada como `is_admin = true` en la base de datos de Supabase. Si se crea una cuenta nueva para un asesor, se debe activar ese campo manualmente en Supabase → tabla `profiles`.

### 2.2 Rol: Cliente

Los clientes son las personas que llenan el formulario de solicitud de préstamo. Al completar el formulario, el sistema crea automáticamente una cuenta para ellos.

**Para ingresar como cliente:**
1. Haber completado el formulario de solicitud (esto crea su cuenta)
2. Ir a la página → clic en **"Iniciar sesión"**
3. Usar el email y la contraseña que definieron al aplicar
4. El sistema los redirige a su **Portal del Cliente** (`/dashboard`)

---

## 3. La Landing Page (Sitio Público)

La página principal es la cara pública de Impulso Latino. Está diseñada para atraer y convertir visitantes en aplicantes. Funciona perfectamente en **celulares, tablets y computadoras**.

### Secciones de la página:

#### 🏠 Hero (Portada)
- Mensaje principal con propuesta de valor
- **Calculadora de préstamo interactiva** — el visitante puede mover el slider para ver cuánto pagaría mensualmente según el monto y plazo
- Botón "Aplicar ahora" que lleva directamente al formulario
- Estadísticas de confianza (clientes, tiempo de aprobación)

#### ⚙️ ¿Cómo Funciona?
- Explica el proceso en 4 pasos simples: Formulario → Evaluación → Llamada → Dinero
- Diseñado para reducir el miedo o confusión del cliente potencial

#### ✅ Requisitos
- Lista los requisitos mínimos de manera clara y no intimidante
- Incluye la sección "¿Por qué elegirnos?" con los diferenciadores de Impulso Latino

#### 🌟 Testimonios y Confianza
- Testimonios de clientes reales con montos aprobados
- Pilares de confianza: datos protegidos, sin intermediarios, transparencia total

#### 👥 Quiénes Somos
- Historia y valores de Impulso Latino
- Estadísticas de la empresa (años de experiencia, clientes, satisfacción)

#### 📞 Contacto
- Formulario de contacto rápido (nombre, teléfono, email, mensaje)
- Los mensajes llegan directamente al panel de administración
- Información de WhatsApp, email y horario de atención

#### 📄 Footer
- Links a información legal (privacidad, términos)
- Datos de contacto
- Acceso rápido al portal (`/login`)

---

## 4. Formulario de Solicitud (Aplicación del Cliente)

El formulario es el punto de entrada principal. Está ubicado en la sección "Aplicar Ahora" de la landing page y está dividido en **4 pasos** para no abrumar al usuario.

### Paso 1 — Datos Personales
El cliente ingresa:
- Nombre completo
- Correo electrónico (será su usuario para ingresar al portal)
- Contraseña (mínimo 8 caracteres)
- Número de teléfono
- Estado de residencia en USA

> 📌 **Nota para el admin:** Si el cliente ya tiene una cuenta (porque aplicó antes), el sistema lo detecta y usa la cuenta existente. No se crean cuentas duplicadas.

### Paso 2 — Situación Laboral
- ¿Está trabajando actualmente?
- Tipo de trabajo (tiempo completo, medio tiempo, independiente)
- Ingresos mensuales aproximados

### Paso 3 — Perfil Bancario y Crediticio
- ¿Tiene cuenta bancaria activa en USA?
- ¿Recibe sus ingresos en esa cuenta?
- Nombre del banco
- Tiempo usando esa cuenta
- ¿Tiene historial crediticio en USA?

> 📌 Si el cliente dice "No" a tener cuenta bancaria, el sistema muestra un mensaje de advertencia informándole que es necesaria para recibir el préstamo.

### Paso 4 — Detalles del Préstamo
- Monto necesario (rangos: $500–$1,000 / $1,000–$2,000 / $2,000–$5,000 / Más de $5,000)
- Propósito del préstamo
- Se muestra automáticamente una estimación de cuotas para el monto seleccionado

### ¿Qué pasa cuando el cliente envía el formulario?

1. Se crea la cuenta del cliente en el sistema de autenticación
2. Se registra el perfil del cliente en la base de datos
3. Se crea un **lead** (solicitud) en el CRM con toda la información
4. El lead aparece automáticamente en el Panel Admin bajo la etapa **"Nuevo Lead"**
5. El cliente ve una pantalla de confirmación exitosa
6. El cliente puede iniciar sesión en su portal para seguir el estado de su solicitud

---

## 5. Portal del Cliente (Dashboard)

Después de aplicar, el cliente puede iniciar sesión en cualquier momento para ver el estado de su solicitud. El portal tiene **4 secciones principales** (pestañas en la parte superior).

### 🏠 Pestaña: Inicio

Es la pantalla principal. Muestra:
- **Saludo personalizado** con el nombre del cliente
- **Banner de estado** — si tiene solicitud en proceso o préstamo activo
- **Mini estadísticas** — número de solicitudes, préstamos, y estado actual
- **Estado detallado de la solicitud** — una línea de tiempo visual que muestra en qué etapa está su solicitud:
  1. ✅ Solicitud recibida
  2. ✅ Pre-aprobación
  3. ✅ Documentos
  4. ✅ Aprobación final
  5. ✅ ¡Dinero enviado!
- **Botón de WhatsApp** para contactar al equipo directamente

> 🔑 **Acción importante del cliente:** Cuando la solicitud llega a la etapa "Aprobación final", el cliente verá un botón especial para **completar el formulario de desembolso**. Esta es la parte donde el cliente proporciona sus datos bancarios para recibir el dinero.

### 💳 Pestaña: Mi Cuenta

Muestra una **tarjeta de crédito animada** con:
- Nombre del titular
- Número de cuenta (generado automáticamente por el sistema)
- Estado de la cuenta (ACTIVO / PENDIENTE)
- Saldo pendiente del préstamo activo

Si tiene un préstamo activo, también muestra:
- Cuota mensual
- Plazo total
- Tasa de interés

### 📄 Pestaña: Créditos

Historial completo de:
- **Préstamos** — con barra de progreso de pago, detalles de cuota, fecha de vencimiento
- **Solicitudes** — todas las solicitudes enviadas con su estado actual
- Botón para **hacer una nueva solicitud** (si el cliente necesita otro préstamo)

### 👤 Pestaña: Perfil

El cliente puede:
- Ver todos sus datos guardados
- **Editar su información** (nombre, teléfono, dirección, estado civil, fecha de nacimiento)
- Cerrar sesión

---

## 6. Panel de Administración (CRM)

El panel de administración es el corazón operativo de Impulso Latino. Aquí el equipo gestiona todos los leads, el pipeline de ventas, los datos de desembolso y los mensajes de contacto.

**URL de acceso:** `/admin` (se accede iniciando sesión con cuenta de administrador)

### 6.1 Estadísticas en tiempo real

En la parte superior del panel se muestran 4 métricas clave:
- **Total Leads** — número total de solicitudes recibidas
- **Nuevos** — leads recién llegados sin gestionar
- **Desembolsados** — clientes que ya recibieron su préstamo
- **Mensajes nuevos** — mensajes de contacto sin leer

### 6.2 Leads / Pipeline (Pestaña principal)

Esta es la sección más importante del CRM. Se puede ver en dos vistas:

#### Vista Kanban (tablero visual)
Las solicitudes se organizan en columnas según su etapa:

| Etapa | ¿Qué significa? |
|---|---|
| 🔵 **Nuevo Lead** | La solicitud acaba de llegar, está sin gestionar |
| 🟡 **Llamada 1** | Se realizó la primera llamada de contacto |
| 🟠 **Documentos** | Se está verificando la documentación del cliente |
| 🟣 **Llamada 2** | Segunda llamada para confirmar datos y condiciones |
| 🟢 **Desembolsado** | El préstamo fue aprobado y enviado |

> 💡 **Consejo:** El tablero Kanban se puede desplazar horizontalmente en celular para ver todas las etapas.

#### Vista Lista (tabla)
Muestra todos los leads en una tabla con columnas: Nombre, Email, Teléfono, Estado, Ingresos, Monto, Etapa y Fecha. Es útil para buscar rápidamente un cliente específico.

#### Búsqueda y Filtros
- **Buscador** — busca por nombre, email o teléfono en tiempo real
- **Filtro por etapa** — muestra solo los leads de una etapa específica

### 6.3 Perfil del Lead (Panel lateral)

Al hacer clic en cualquier lead, se abre un panel lateral con toda la información del cliente y herramientas de gestión:

#### Contacto directo
- **Botón WhatsApp** — abre WhatsApp con un mensaje pre-redactado de seguimiento
- **Botón Llamar** — marca el número directamente desde el teléfono

#### Cambiar etapa del pipeline
- Un selector desplegable para mover el lead a cualquier etapa con un solo clic
- El cambio se guarda automáticamente al presionar "Guardar cambios"

#### Datos completos del formulario
Toda la información que el cliente proporcionó al aplicar:
- Teléfono, email, estado de residencia
- Ingresos, banco, historial crediticio
- Monto solicitado, propósito del préstamo

#### Calculadora de tasas (herramienta interna)
El asesor puede estimar cuánto pagaría el cliente a 12, 24 o 36 meses basándose en el monto solicitado. Esto ayuda durante la llamada de negociación.

#### Crear préstamo activo
Cuando se mueve un lead a la etapa **"Desembolsado"**, aparece un botón especial para **crear el préstamo activo** en el sistema. Al hacerlo:
- El préstamo queda registrado en la base de datos
- El cliente lo puede ver desde su portal inmediatamente
- La tarjeta del cliente muestra el saldo pendiente y cuota mensual

#### Datos adicionales del asesor
Campos que el asesor puede completar internamente:
- Fecha de nacimiento
- Estado civil
- Dirección completa
- Código postal
- Notas internas (solo visibles para el equipo)
- Subir foto del ID / Licencia

### 6.4 Datos de Desembolso (Pestaña)

Esta sección muestra exclusivamente los clientes que completaron el **formulario de desembolso** (donde proporcionaron sus credenciales bancarias para recibir el dinero).

#### ¿Cómo funciona?
1. El admin mueve el lead a etapa "Llamada 2" (Aprobación final)
2. El cliente ve en su portal un botón para completar el formulario de desembolso
3. El cliente ingresa: titular de cuenta, username y contraseña bancaria
4. Esa información aparece en esta sección del panel admin

#### Vista de la tabla
Se muestra una tabla compacta con: Cliente, Teléfono, Monto, Fecha de completado.

#### Ver credenciales
Al hacer clic en el botón **"Ver"** de cualquier fila, se abre un modal con:
- Información del cliente (monto, teléfono)
- **Credenciales bancarias completas** (titular, username, contraseña con opción de mostrar/ocultar)
- Fecha y hora en que se completó el formulario
- ID único del registro

> ⚠️ **Seguridad:** Esta información es altamente sensible. Solo debe ser accedida por el personal autorizado.

### 6.5 Mensajes de Contacto (Pestaña)

Todos los mensajes enviados desde el formulario de contacto de la landing page aparecen aquí.

**Funcionalidades:**
- Los mensajes no leídos se marcan con un punto azul
- Al hacer clic en un mensaje se marca automáticamente como leído
- El panel derecho muestra el mensaje completo con los datos del remitente
- Botones de respuesta directa por **WhatsApp** o **Email**
- Contador de mensajes sin leer visible en la pestaña

---

## 7. Flujo Completo de un Préstamo

Aquí está el proceso completo de principio a fin, para que el equipo sepa exactamente qué hace cada parte:

```
CLIENTE aplica en la landing page
        ↓
Lead aparece en CRM → etapa "Nuevo Lead"
        ↓
Asesor llama al cliente (1ra llamada)
        ↓
Lead pasa a → "Llamada 1"
        ↓
Se solicitan y verifican documentos
        ↓
Lead pasa a → "Documentos"
        ↓
Segunda llamada para confirmar condiciones
        ↓
Lead pasa a → "Llamada 2" (Aprobación final)
        ↓ ← El cliente ve un botón en su portal:
            "Completa el formulario de desembolso"
        ↓
El cliente llena sus datos bancarios
        ↓
Los datos aparecen en "Datos de Desembolso" del admin
        ↓
El asesor usa los datos para realizar el depósito
        ↓
Admin crea el préstamo activo en el sistema
        ↓
Lead pasa a → "Desembolsado" ✅
        ↓
El cliente ve su préstamo activo en su portal
```

---

## 8. Seguridad y Buenas Prácticas

### Para el equipo administrador

- **No compartir las credenciales de admin.** Si se necesita dar acceso a un nuevo asesor, crear una cuenta y activar `is_admin = true` en Supabase.
- **Las credenciales bancarias** de los clientes (sección "Datos de Desembolso") son información altamente confidencial. Acceder solo cuando sea necesario para procesar el desembolso.
- **Cerrar sesión** al terminar de trabajar, especialmente desde equipos compartidos.
- **Revisar mensajes de contacto** diariamente para no dejar a ningún cliente sin respuesta.

### Para los clientes

- Los datos están protegidos con **cifrado SSL de 256 bits**.
- Las contraseñas nunca se almacenan en texto plano.
- El sistema no solicita información de tarjetas de crédito ni SSN.

### Respaldos y disponibilidad

- La base de datos en Supabase tiene respaldos automáticos diarios.
- La plataforma está disponible 24/7 desde cualquier dispositivo con conexión a internet.

---

## 9. Preguntas Frecuentes

**¿Qué pasa si un cliente olvida su contraseña?**  
Por ahora, el cliente debe contactar al equipo para que el administrador pueda asistirle desde el panel de Supabase. Se puede implementar recuperación de contraseña por email como mejora futura.

**¿Se pueden editar los datos de un lead?**  
El asesor puede agregar/editar los campos de "Datos del Asesor" (fecha de nacimiento, dirección, estado civil, notas) desde el perfil del lead. Los datos originales del formulario del cliente no se modifican para mantener integridad.

**¿Qué pasa si un cliente aplica dos veces?**  
El sistema detecta si ya existe una cuenta con ese email y usa la misma, creando una nueva solicitud (lead). Ambas solicitudes quedan visibles en el historial del cliente y en el CRM.

**¿Cómo se sabe si un nuevo lead llegó?**  
El contador de "Total Leads" en el panel admin se actualiza en tiempo real. Se recomienda revisar el panel al menos una vez al día, o configurar notificaciones desde Supabase.

**¿Se puede usar desde el teléfono?**  
Sí. Toda la plataforma está optimizada para móvil. El panel admin tiene vista Kanban con scroll horizontal y todos los formularios se adaptan a pantallas pequeñas.

**¿Qué significa el número de cuenta de la tarjeta del cliente?**  
Es un identificador interno generado automáticamente por el sistema. No es un número de cuenta bancaria real, es el identificador de Impulso Latino para ese cliente.

**¿Cómo agregar nuevos asesores al sistema?**  
1. El nuevo asesor crea una cuenta (o el admin la crea en Supabase → Authentication → Users)
2. En Supabase → tabla `profiles` → buscar al usuario → cambiar `is_admin` a `true`
3. El nuevo asesor ya puede ingresar al panel admin

**¿Se puede eliminar un lead?**  
Actualmente no desde la interfaz. Si se necesita eliminar registros, se hace directamente desde Supabase → tabla `leads`. Se recomienda no eliminar registros y en su lugar usar las notas para marcar leads inactivos.

---

## Información de Contacto del Desarrollador

Para soporte técnico, nuevas funcionalidades o reportar problemas:

> Esta plataforma fue diseñada y desarrollada a medida para **Impulso Latino**.  
> Para modificaciones, actualizaciones o nuevas funcionalidades, contactar al desarrollador.

---

*Documento generado en Mayo 2026 · Impulso Latino Platform v1.0*
