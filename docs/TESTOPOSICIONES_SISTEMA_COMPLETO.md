# TestOposiciones - Documentación del Sistema Laravel

> Documento de referencia para la migración a React/NestJS (Postal3)

---

## Índice

1. [Visión General](#1-visión-general)
2. [Autenticación y Usuarios](#2-autenticación-y-usuarios)
3. [Tests y Exámenes](#3-tests-y-exámenes)
4. [Sistema de Intentos (Attempts)](#4-sistema-de-intentos-attempts)
5. [Catálogo](#5-catálogo)
6. [Mi Espacio (MySpace)](#6-mi-espacio-myspace)
7. [Gamificación](#7-gamificación)
8. [Carrito y Compras](#8-carrito-y-compras)
9. [Contenido y Blog](#9-contenido-y-blog)
10. [Modelos de Datos](#10-modelos-de-datos)
11. [Integración con Odoo](#11-integración-con-odoo)
12. [Flujos de Usuario](#12-flujos-de-usuario)

---

## 1. Visión General

TestOposiciones es una plataforma de preparación de oposiciones que permite a los estudiantes:

- Acceder a tests oficiales y de práctica
- Crear tests personalizados por competencias
- Realizar exámenes con tiempo y corrección automática
- Seguir su progreso y estadísticas
- Competir con otros estudiantes (gamificación)
- Comprar acceso a oposiciones, acciones formativas y módulos

### Stack Tecnológico (Legacy)

| Componente | Tecnología |
|------------|------------|
| Backend | Laravel 8.x |
| Frontend | Blade + Bootstrap 4 + MDB |
| Base de datos | PostgreSQL (vía Odoo ORM) |
| ERP | Odoo (JSON-RPC API) |
| Assets | SASS/SCSS, jQuery, Chart.js |

### Arquitectura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Laravel App   │────▶│   Odoo API      │────▶│   PostgreSQL    │
│   (Frontend)    │     │   (JSON-RPC)    │     │   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

Laravel actúa como cliente del ERP Odoo, que gestiona toda la lógica de negocio y datos.

---

## 2. Autenticación y Usuarios

### 2.1 Controladores

| Controlador | Funcionalidad |
|-------------|---------------|
| `LoginController` | Login con reconciliación automática con Odoo |
| `RegisterController` | Registro de usuarios con reconciliación post-registro |
| `ForgotPasswordController` | Envío de email para recuperar contraseña |
| `ResetPasswordController` | Cambio de contraseña vía enlace |
| `VerificationController` | Verificación de email |
| `ConfirmPasswordController` | Confirmación de contraseña para acciones sensibles |

### 2.2 Flujo de Login

```
1. Usuario introduce credenciales
2. Laravel valida contra base de datos local
3. Si OK → Reconciliación con Odoo (sincroniza datos de estudiante)
4. Se carga AcademyStudent asociado al User
5. Redirección a dashboard
```

### 2.3 Flujo de Registro

```
1. Usuario completa formulario (nombre, email, contraseña)
2. Detección automática de país por GeoIP
3. Creación de User en Laravel
4. Reconciliación con Odoo:
   - Crea ResPartner (contacto)
   - Crea AcademyStudent (estudiante)
5. Envío de email de verificación
6. Redirección a login
```

### 2.4 Validaciones de Contraseña

- Longitud mínima
- Lista de contraseñas baneadas/comunes
- Verificación de contraseña actual en cambios

### 2.5 Modelos Relacionados

| Modelo | Descripción |
|--------|-------------|
| `User` | Usuario de Laravel (auth) |
| `AcademyStudent` | Perfil de estudiante en Odoo |
| `ResPartner` | Datos de contacto (nombre, email, teléfono, dirección) |

---

## 3. Tests y Exámenes

### 3.1 Tipos de Tests

| Tipo | Código | Descripción |
|------|--------|-------------|
| **Oficial** | `first_use` | Tests de exámenes reales de oposiciones |
| **Coach** | `is_coach` | Tests de práctica generados por la plataforma |
| **Demo** | `is_demo` | Tests de demostración gratuitos |
| **Personalizado** | `wizard` | Tests creados por el estudiante seleccionando competencias |

### 3.2 Controladores de Tests

#### IndexController (Catálogo de Tests)

```php
// Ruta: /tests
// Funcionalidades:
- Listado de tests disponibles para el estudiante
- Filtrado por tipo (official, coach, demo)
- Vista grid/list configurable
- Paginación (23 tests por página)
- Resumen de intentos anteriores por test
```

#### DetailsController (Detalles del Test)

```php
// Ruta: /tests/{slug}
// Funcionalidades:
- Información completa del test
- Tipo de test (kind)
- Escala de corrección
- Intentos anteriores paginados (10 por página)
- Intento actual abierto (si existe)
- Unidades de competencia cubiertas
```

#### WizardController (Creación de Tests Personalizados)

```php
// Ruta: /tests/wizard
// Flujo:
1. Seleccionar enrolment (oposición/acción/módulo)
2. Seleccionar unidades de competencia
3. Configurar cantidad de preguntas por unidad
4. Generar test via API Odoo
5. Redirigir a realizar test
```

### 3.3 Estructura de un Test

```
Test
├── id, name, description
├── kind (tipo: oficial, coach, etc.)
├── correction_scale (escala de puntuación)
├── available_time (tiempo disponible en minutos)
├── question_count (número de preguntas)
├── training (oposición/formación asociada)
├── author (creador)
├── questions[] (preguntas)
│   ├── id, name, description
│   ├── topic, category
│   ├── level (dificultad)
│   └── answers[] (respuestas)
│       ├── id, name
│       └── is_correct (boolean)
└── stats (estadísticas del estudiante)
    ├── attempt_count
    ├── passed_count
    ├── failed_count
    ├── max_points
    └── own_max_points
```

### 3.4 Escalas de Corrección

El sistema soporta diferentes escalas de corrección:

| Escala | Fórmula |
|--------|---------|
| Sin penalización | correctas × valor |
| Penalización 1/3 | correctas - (incorrectas / 3) |
| Penalización 1/4 | correctas - (incorrectas / 4) |
| Personalizada | Configurable por test |

---

## 4. Sistema de Intentos (Attempts)

### 4.1 Estados de un Intento

```
┌─────────┐    start    ┌─────────┐    finish   ┌─────────┐
│ pending │───────────▶│  open   │────────────▶│ closed  │
└─────────┘             └─────────┘             └─────────┘
                            │
                            │ pause
                            ▼
                        ┌─────────┐
                        │ paused  │
                        └─────────┘
```

### 4.2 Controladores de Attempts

#### PerformController (Ejecución del Test)

```php
// Ruta: /attempts/{id}/perform
// Funcionalidades:
- Cargar intento y preguntas
- Keep-alive (mantener sesión activa)
- Registrar respuestas
- Pausar/reanudar
- Finalizar y calcular puntuación
```

**Acciones sobre respuestas:**

| Acción | Descripción |
|--------|-------------|
| `touch` | Marcar pregunta como vista |
| `answer` | Registrar respuesta seleccionada |
| `doubt` | Marcar para revisión |
| `blank` | Dejar en blanco |

#### ReviewController (Revisión de Resultados)

```php
// Ruta: /attempts/{id}/review
// Funcionalidades:
- Ver todas las respuestas
- Comparar con respuestas correctas
- Ver puntuación detallada
- Tiempo empleado
- Estadísticas por categoría/topic
```

### 4.3 Estructura de un Intento

```
Attempt
├── id
├── test_id
├── student_id
├── state (open, closed, paused)
├── start_date (timestamp)
├── end_date (timestamp)
├── elapsed_time (segundos)
├── final_points (puntuación)
├── answers[]
│   ├── question_id
│   ├── answer_id (respuesta seleccionada)
│   ├── state (blank, answered, doubt)
│   ├── is_correct (boolean)
│   └── touched_at (timestamp)
└── statistics
    ├── correct_count
    ├── incorrect_count
    ├── blank_count
    └── doubt_count
```

### 4.4 Sincronización con Odoo

Cada acción del estudiante se sincroniza en tiempo real:

```php
// Endpoint: /academy/api/json/attempt/answer
POST {
    "attempt_id": 123,
    "question_id": 456,
    "answer_id": 789,
    "action": "answer",
    "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 5. Catálogo

### 5.1 Estructura del Catálogo

```
Catálogo
├── Oposiciones (PublicTenderingProcess)
│   └── Detalles de oposición
├── Acciones de Formación (TrainingAction)
│   └── Detalles de acción
└── Módulos/Competencias (CompetencyUnit)
    └── Detalles de módulo
```

### 5.2 CatalogController

#### Página Principal

```php
// Ruta: /catalog
// Contenido:
- Showcase de acciones de formación (2 items)
- Showcase de procesos licitarios (4 items)
- Showcase de módulos (1 fila × 5)
```

#### Catálogo de Oposiciones

```php
// Ruta: /catalog/oppositions
// Filtros disponibles:
- Administración (estatal, autonómica, local)
- Tipo (funcionario, laboral)
- Grupo (A1, A2, C1, C2)
- Tipo de contratación
- Tipo de examen
- Tipo de acceso
- Estado (activo, finalizado)
- Año
- Vacantes (número)
- Nombre (búsqueda)

// Ordenamiento:
- Fecha de publicación
- Nombre A-Z / Z-A
- Vacantes
```

#### Catálogo de Acciones

```php
// Ruta: /catalog/actions
// Similar a oposiciones con filtros específicos
```

#### Catálogo de Módulos

```php
// Ruta: /catalog/modules
// Filtros:
- Por unidad de competencia
- Por actividad de formación
```

### 5.3 Detalles de Elementos

Cada tipo tiene su vista de detalles:

```php
// Oposición: /catalog/oppositions/{slug}
- Información del proceso
- Fechas importantes
- Vacantes
- Requisitos
- Tests disponibles
- Acción de formación asociada

// Acción: /catalog/actions/{slug}
- Descripción
- Módulos incluidos
- Tests disponibles
- Precio

// Módulo: /catalog/modules/{slug}
- Competencias cubiertas
- Preguntas disponibles
- Tests relacionados
```

---

## 6. Mi Espacio (MySpace)

### 6.1 Estructura

```
Mi Espacio
├── Mi Trabajo (workspace)
│   ├── Tests personalizados
│   ├── Wizard de tests
│   ├── Recursos
│   └── Desafíos
├── Mis Suscripciones
│   ├── Oposiciones suscritas
│   ├── Acciones suscritas
│   └── Módulos comprados
├── Mi Cuenta
│   ├── Perfil
│   ├── Contraseña
│   ├── Facturas
│   └── Opciones
├── Mis Amigos
│   ├── Seguidos
│   ├── Seguidores
│   └── Invitaciones
├── Mis Impugnaciones
│   └── Reclamaciones de preguntas
├── Mi Diario
│   └── Intentos manuales
└── Mis Desafíos
    └── Retos con otros estudiantes
```

### 6.2 MyWorkSpaceController

```php
// Ruta: /myspace/workspace
// Funcionalidades:
- Acceso rápido a tests personalizados
- Wizard para crear nuevos tests
- Estadísticas de actividad
- Últimos intentos
```

### 6.3 MySuscriptionsController

```php
// Ruta: /myspace/subscriptions
// Muestra:
- Procesos (oposiciones) en los que está inscrito
- Acciones de formación activas
- Módulos comprados individualmente
- Estado de cada enrolment
- Fecha de expiración (si aplica)
```

### 6.4 MyAccountController

```php
// Ruta: /myspace/account

// Edición de perfil:
- Nombre
- Email
- Teléfono
- Dirección
- Ciudad
- Código postal
- País

// Cambio de contraseña:
- Contraseña actual (verificación)
- Nueva contraseña
- Confirmación

// Facturas:
- Listado de facturas/invoices
- Acceso a portal de pago de Odoo
- Estado de pago
```

### 6.5 MyFriendsController

```php
// Ruta: /myspace/friends

// Funcionalidades:
- Buscar estudiantes con mismas inscripciones
- Seguir a un estudiante
- Dejar de seguir
- Ver lista de seguidores
- Ver lista de seguidos
- Enviar invitaciones por email
- Marcar usuario como ignorado
```

### 6.6 MyImpugnmentsController

```php
// Ruta: /myspace/impugnments

// Flujo de impugnación:
1. Estudiante detecta error en pregunta
2. Crea impugnación con justificación
3. Admin revisa y responde
4. Estados: abierto → reply → closed

// Datos de impugnación:
- Pregunta afectada
- Motivo de la reclamación
- Evidencia/justificación
- Respuesta del admin
- Estado
```

### 6.7 MyJournalController

```php
// Ruta: /myspace/journal

// Propósito:
Registrar intentos de tests realizados fuera de la plataforma
(exámenes en papel, academias presenciales, etc.)

// Datos:
- Nombre del test
- Fecha de realización
- Preguntas totales
- Respuestas correctas
- Respuestas incorrectas
- Respuestas en blanco
- Escala de corrección
- Puntuación calculada automáticamente
```

### 6.8 MyChallengesController

```php
// Ruta: /myspace/challenges

// Funcionalidades:
- Ver desafíos lanzados
- Ver desafíos recibidos
- Aceptar/rechazar desafíos
- Ver resultados de desafíos
- Ranking por división
```

---

## 7. Gamificación

### 7.1 Sistema de Ligas

```
┌─────────────────────────────────────────┐
│              LIGA SEMANAL               │
├─────────────────────────────────────────┤
│  🥇 División Oro     (top 10%)          │
│  🥈 División Plata   (10-30%)           │
│  🥉 División Bronce  (30-100%)          │
└─────────────────────────────────────────┘
```

### 7.2 LeagueController

```php
// Cálculo de puntos:
- Puntos por intentos completados
- Bonus por racha de días consecutivos
- Bonus por puntuación alta
- Multiplicadores por dificultad

// Rankings:
- Semanal (reset cada lunes)
- Mensual
- Global
```

### 7.3 ChallengeController

```php
// Tipos de desafío:
- Test específico
- Competencia aleatoria
- Duelo directo

// Estados:
pending → accepted → in_progress → completed

// Resultados:
- Ganador/perdedor
- Puntuación de cada participante
- Tiempo empleado
```

### 7.4 Sistema de Experiencia

```php
// XP ganada por:
- Completar tests
- Aprobar tests
- Ganar desafíos
- Racha de días
- Logros especiales

// Niveles:
- Basados en XP acumulada
- Desbloquean insignias
```

---

## 8. Carrito y Compras

### 8.1 CartController

#### Añadir al Carrito

```php
// Ruta: POST /cart/add
// Tipos de producto:
- process (oposición completa)
- action (acción de formación)
- module (módulo individual)

// Flujo:
1. Seleccionar producto
2. Crear/obtener SaleOrder
3. Añadir SaleOrderLine
4. Crear AcademyTrainingActionEnrolment automático
5. Actualizar totales
```

#### Eliminar del Carrito

```php
// Ruta: DELETE /cart/remove/{line_id}
// Elimina línea y limpia enrolment si no hay más líneas
```

#### Vaciar Carrito

```php
// Ruta: POST /cart/clear
// Cancela la orden de venta completa
```

#### Checkout

```php
// Ruta: GET /cart/checkout
// Muestra:
- Líneas del pedido
- Precios unitarios
- Subtotal
- Impuestos
- Total
- Métodos de pago
```

#### Procesar Pago

```php
// Ruta: POST /cart/accept
// Flujo:
1. Validar orden
2. Confirmar orden en Odoo
3. Generar factura (AccountMove)
4. Obtener URL de portal de pago
5. Redirigir a pasarela de Odoo
```

### 8.2 Modelos de Ventas

```
SaleOrder (Pedido)
├── id
├── name (referencia: SO001)
├── partner_id (cliente)
├── date_order
├── validity_date
├── state (draft, sent, sale, done, cancel)
├── amount_untaxed
├── amount_tax
├── amount_total
└── order_lines[]
    ├── product_id
    ├── name
    ├── quantity
    ├── price_unit
    ├── discount
    └── price_subtotal
```

### 8.3 Enrolments

Al comprar, se crea automáticamente un enrolment:

```
AcademyTrainingActionEnrolment
├── id
├── student_id
├── action_id (o process_id)
├── state (active, expired, cancelled)
├── start_date
├── end_date
└── modules[] (módulos incluidos)
```

---

## 9. Contenido y Blog

### 9.1 BlogController

```php
// Ruta: /blog

// Listado:
- Noticias paginadas (10 por página)
- Filtrado por fecha de publicación
- Ordenamiento por importancia/fecha

// Campos de noticia:
- Título
- Contenido (HTML)
- Imagen destacada
- Fecha de publicación
- Autor
- Categoría
```

### 9.2 AlertsController

```php
// Ruta: /alerts

// Tipos de alertas:
- Sistema (mantenimiento, actualizaciones)
- Académicas (nuevos tests, convocatorias)
- Personales (expiración de suscripción)

// Paginación: 15 items por página
```

### 9.3 ResourcesController

```php
// Ruta: /resources

// Tipos de recursos:
- PDFs descargables
- Enlaces externos
- Material de estudio
- Legislación

// Organización:
- Por oposición
- Por competencia
- Por tipo de recurso
```

### 9.4 WelcomeController (Landing)

```php
// Ruta: / (página principal pública)

// Contenido:
- Hero con CTA
- Planes de marketing con precios
- Testimonios (3 aleatorios con estrellas)
- Feed de noticias (5 últimas)
- Estadísticas de la plataforma

// Caching en memoria para rendimiento
```

---

## 10. Modelos de Datos

### 10.1 Modelos de Usuario

```
User (Laravel)
├── id
├── name
├── email
├── password
├── email_verified_at
└── student_id → AcademyStudent

AcademyStudent (Odoo)
├── id
├── name
├── partner_id → ResPartner
├── alias (nombre público)
├── avatar
├── experience_points
├── level
└── enrolments[]

ResPartner (Odoo)
├── id
├── name
├── email
├── phone
├── street
├── city
├── zip
├── country_id
└── company_id
```

### 10.2 Modelos de Tests

```
AcademyTestsTest
├── id
├── name
├── description
├── kind_id → AcademyTestsTestKind
├── correction_scale_id
├── available_time
├── question_count
├── training_id
├── author
└── questions[]

AcademyTestsTestKind
├── id
├── name (Oficial, Coach, Demo)
├── is_official
├── is_coach
└── is_demo

AcademyTestsCorrectionScale
├── id
├── name
├── correct_value
├── incorrect_value
├── blank_value
└── formula
```

### 10.3 Modelos de Preguntas

```
AcademyTestsQuestion
├── id
├── name
├── description (HTML)
├── topic_id
├── category_id
├── level_id
├── tags[]
└── answers[]

AcademyTestsAnswer
├── id
├── name
├── question_id
├── sequence
└── is_correct

AcademyTestsQuestionImpugnment
├── id
├── question_id
├── student_id
├── reason
├── state (open, reply, closed)
└── replies[]
```

### 10.4 Modelos de Intentos

```
AcademyTestsAttempt
├── id
├── test_id
├── student_id
├── state (open, paused, closed)
├── start_date
├── end_date
├── elapsed_time
├── final_points
├── passed
└── answers[]

AcademyTestsAttemptAnswer
├── id
├── attempt_id
├── question_id
├── answer_id
├── state (blank, answered, doubt)
├── is_correct
└── touched_at
```

### 10.5 Modelos de Catálogo

```
PublicTenderingProcess (Oposición)
├── id
├── name
├── description
├── administration_type
├── group (A1, A2, C1, C2)
├── vacancies
├── exam_date
├── deadline
├── requirements
├── state
└── action_id → TrainingAction

TrainingAction (Acción de Formación)
├── id
├── name
├── description
├── start_date
├── end_date
├── price
├── product_id
└── modules[]

CompetencyUnit (Módulo)
├── id
├── name
├── code
├── description
├── hours
├── questions_count
└── activity_id
```

### 10.6 Modelos de Ventas

```
SaleOrder
├── id
├── name
├── partner_id
├── date_order
├── state
├── amount_total
└── order_lines[]

SaleOrderLine
├── id
├── order_id
├── product_id
├── quantity
├── price_unit
└── price_subtotal

ProductProduct
├── id
├── name
├── default_code
├── list_price
├── type (process, action, module)
└── template_id

AccountMove (Factura)
├── id
├── name
├── partner_id
├── invoice_date
├── amount_total
├── state
└── payment_state
```

### 10.7 Modelos de Gamificación

```
AcademyStudentFollow
├── id
├── follower_id
├── followed_id
├── state (following, ignored)
└── created_at

AcademyTestsChallenge
├── id
├── challenger_id
├── challenged_id
├── test_id
├── state
├── winner_id
└── completed_at
```

---

## 11. Integración con Odoo

### 11.1 Comunicación

Laravel se comunica con Odoo mediante **JSON-RPC**:

```php
// Configuración
ODOO_URL=https://odoo.testoposiciones.es
ODOO_DB=testoposiciones
ODOO_USER=api_user
ODOO_PASSWORD=api_password
```

### 11.2 Endpoints Principales

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/academy/api/json/reconcile-assignments` | POST | Sincroniza asignaciones de tests |
| `/academy/api/json/test/custom` | POST | Crea test personalizado |
| `/academy/api/json/attempt/evolve` | POST | Actualiza estado de intento |
| `/academy/api/json/attempt/answer` | POST | Registra respuesta |
| `/account.move/get_portal_url` | GET | Obtiene URL de portal de factura |

### 11.3 OdooORM

Laravel usa un ORM personalizado para comunicarse con Odoo:

```php
// Ejemplo de query
$tests = AcademyTestsTest::where('student_id', $student->id)
    ->where('state', 'published')
    ->with(['kind', 'correction_scale'])
    ->orderBy('name')
    ->paginate(23);

// Se traduce a JSON-RPC
{
    "model": "academy.tests.test",
    "method": "search_read",
    "domain": [
        ["student_id", "=", 123],
        ["state", "=", "published"]
    ],
    "fields": ["id", "name", "kind_id", "correction_scale_id"],
    "order": "name asc",
    "limit": 23,
    "offset": 0
}
```

### 11.4 Sincronización de Datos

Datos que se sincronizan:

| Dato | Dirección | Trigger |
|------|-----------|---------|
| Usuario | Laravel → Odoo | Registro/Login |
| Intentos | Laravel ↔ Odoo | Tiempo real |
| Respuestas | Laravel → Odoo | Cada respuesta |
| Compras | Laravel → Odoo | Checkout |
| Facturas | Odoo → Laravel | Callback |

---

## 12. Flujos de Usuario

### 12.1 Flujo de Registro y Compra

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. Usuario visita landing → Ve planes y precios                │
│                    ↓                                            │
│  2. Click en "Registrarse" → Formulario de registro            │
│                    ↓                                            │
│  3. Verifica email → Login                                      │
│                    ↓                                            │
│  4. Navega catálogo → Selecciona oposición                     │
│                    ↓                                            │
│  5. Añade al carrito → Checkout                                │
│                    ↓                                            │
│  6. Pago en Odoo → Confirmación                                │
│                    ↓                                            │
│  7. Acceso a tests → Realiza intentos                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 12.2 Flujo de Realización de Test

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. Estudiante entra a /tests → Ve catálogo de tests           │
│                    ↓                                            │
│  2. Selecciona test → Ve detalles e intentos previos           │
│                    ↓                                            │
│  3. Click "Empezar" → Crea nuevo intento (state: open)         │
│                    ↓                                            │
│  4. Responde preguntas → Cada respuesta se sincroniza          │
│                    ↓                                            │
│  5. [Opcional] Pausa → state: paused                           │
│                    ↓                                            │
│  6. Click "Finalizar" → Calcula puntuación                     │
│                    ↓                                            │
│  7. Ve resultados → Revisión detallada                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 12.3 Flujo de Test Personalizado (Wizard)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. Click en "Crear Test" → Wizard step 1                      │
│                    ↓                                            │
│  2. Selecciona oposición/acción → Wizard step 2                │
│                    ↓                                            │
│  3. Selecciona competencias → Wizard step 3                    │
│                    ↓                                            │
│  4. Configura preguntas por competencia → Genera test          │
│                    ↓                                            │
│  5. API Odoo crea test → Redirige a realizar                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 12.4 Flujo de Desafío

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. Estudiante A busca amigo → Encuentra Estudiante B          │
│                    ↓                                            │
│  2. Envía desafío → Estudiante B recibe notificación           │
│                    ↓                                            │
│  3. Estudiante B acepta → Ambos realizan el test               │
│                    ↓                                            │
│  4. Cuando ambos terminan → Se calcula ganador                 │
│                    ↓                                            │
│  5. Puntos de liga actualizados → Rankings                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Apéndice: Archivos Clave del Codebase

### Controladores

```
app/Http/Controllers/
├── Auth/
│   ├── LoginController.php
│   ├── RegisterController.php
│   ├── ForgotPasswordController.php
│   └── ResetPasswordController.php
├── Tests/
│   ├── IndexController.php
│   ├── DetailsController.php
│   └── WizardController.php
├── Attempts/
│   ├── PerformController.php
│   ├── ReviewController.php
│   └── DetailsController.php
├── Myspace/
│   ├── MyWorkSpaceController.php
│   ├── MySuscriptionsController.php
│   ├── MyAccountController.php
│   ├── MyFriendsController.php
│   ├── MyImpugnmentsController.php
│   ├── MyJournal.php
│   └── MyChallenges.php
├── Gamification/
│   ├── LeagueController.php
│   └── ChallengeController.php
├── Sales/
│   └── CartController.php
├── CatalogController.php
├── BlogController.php
├── AlertsController.php
├── ResourcesController.php
├── WelcomeController.php
└── HomeController.php
```

### Modelos (OdooORM)

```
app/OdooModels/
├── Academy/
│   ├── AcademyStudent.php
│   ├── AcademyTestsTest.php
│   ├── AcademyTestsAttempt.php
│   ├── AcademyTestsQuestion.php
│   ├── AcademyTestsAnswer.php
│   ├── AcademyTrainingAction.php
│   ├── AcademyTrainingActionEnrolment.php
│   └── ...
├── Public/
│   └── PublicTenderingProcess.php
├── Product/
│   └── ProductProduct.php
├── Sale/
│   ├── SaleOrder.php
│   └── SaleOrderLine.php
└── Base/
    ├── ResPartner.php
    └── ResUsers.php
```

### Vistas

```
resources/views/
├── auth/
│   ├── login.blade.php
│   ├── register.blade.php
│   └── passwords/
├── tests/
│   ├── index.blade.php
│   ├── details.blade.php
│   └── wizard/
├── attempts/
│   ├── perform.blade.php
│   └── review.blade.php
├── myspace/
│   ├── workspace.blade.php
│   ├── subscriptions.blade.php
│   ├── account.blade.php
│   ├── friends.blade.php
│   └── ...
├── catalog/
│   ├── index.blade.php
│   ├── oppositions.blade.php
│   ├── actions.blade.php
│   └── modules.blade.php
├── cart/
│   └── checkout.blade.php
├── components/
│   ├── card-test.blade.php
│   ├── card-question.blade.php
│   └── status-bar-attempt.blade.php
└── welcome.blade.php
```

---

*Documento generado para el proyecto Postal3 - Migración de TestOposiciones*
*Fecha: Febrero 2026*
