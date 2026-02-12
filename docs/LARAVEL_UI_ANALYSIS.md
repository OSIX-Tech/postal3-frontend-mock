# Análisis UI - TestOposiciones (Laravel Legacy)

> Documento de referencia para migración a React (postal3-frontend)
> Generado: 2026-02-04

---

## 1. Stack Tecnológico Actual

| Aspecto | Tecnología |
|---------|------------|
| Framework Backend | Laravel 8+ |
| Framework CSS | Bootstrap 4 + MDB (Material Design Bootstrap) |
| Preprocesador | SASS/SCSS |
| Templates | Blade |
| Tipografía | Nunito (Google Fonts) |
| Iconos | Font Awesome 5 Pro |
| JS | Vanilla JS + jQuery |
| Gráficos | Chart.js |
| Tablas | DataTables |
| BD | PostgreSQL (vía Odoo ORM) |

---

## 2. Design Tokens

### 2.1 Colores (de _variables.scss)

```scss
// Body
$body-bg: #FFFFFF;

// Colores principales
$blue: #3490dc;
$indigo: #6574cd;
$purple: #9561e2;
$pink: #f66d9b;
$red: #e3342f;
$orange: #f6993f;
$yellow: #ffed4a;
$green: #38c172;
$teal: #4dc0b5;
$cyan: #6cb2eb;

// Colores de estado (usados en tests)
$success-color: #00c851;  // Respuestas correctas
$warning-color: #fb3;     // Respuestas incorrectas
$secondary-color: #a6c;   // Sin responder
```

### 2.2 Tipografía

```scss
$font-family-sans-serif: 'Nunito', sans-serif;
$font-size-base: 0.9rem;
$line-height-base: 1.6;
```

### 2.3 Gradientes MDB usados

- `cloudy-knoxville-gradient` - Navbar y headers
- `dusty-grass-gradient` - Respuestas correctas
- `lady-lips-gradient` - Respuestas incorrectas
- `heavy-rain-gradient` - Sin responder
- `purple-gradient` - Barra de progreso

---

## 3. Sistema de Layouts

### 3.1 Layout Base (`app.blade.php`)

```
┌─────────────────────────────────┐
│     Navbar (fixed-top)          │
├─────────────────────────────────┤
│                                 │
│      <main> Content             │
│                                 │
├─────────────────────────────────┤
│         Footer                  │
└─────────────────────────────────┘
```

**Clases clave:**
- `body.avoid-fixed-navbar` → `padding: 66px 0 0 0`
- `main.main.clearfix`

### 3.2 Layout Catálogo (`catalog.blade.php`)

```
┌─────────────────────────────────┐
│     Navbar (fixed-top)          │
├─────────────────────────────────┤
│  Header: Título + Descripción   │
├─────────┬───────────────────────┤
│ Sidebar │   Content Area        │
│ col-lg-3│      col-lg-9         │
│         │                       │
│ Filtros │  Sort + View Toggle   │
│         │  Grid/List Content    │
│         │  Pagination           │
├─────────┴───────────────────────┤
│         Footer                  │
└─────────────────────────────────┘
```

**Características:**
- Formulario envuelve todo para auto-submit filtros
- View switcher: Grid (`fa-th`) / List (`fa-th-list`)
- Select de ordenación con clase `.form-auto-submit`
- Paginación con `$items->appends()->links()`

### 3.3 Layout MySpace (`myspace.blade.php`)

Similar a catalog pero:
- Clase contenedor: `.my-space`
- Sin formulario envolvente
- Sidebar con menús de navegación

---

## 4. Componentes UI

### 4.1 Navbar (`navbar-base.blade.php`)

```html
<nav class="navbar fixed-top navbar-expand-lg navbar-light cloudy-knoxville-gradient scrolling-navbar">
  <div class="container">
    <!-- Brand -->
    <a class="navbar-brand">
      <img id="brand-logo" src="/img/opostal-inline.svg" style="min-width: 130px">
    </a>

    <!-- Toggler móvil -->
    <button class="navbar-toggler">...</button>

    <!-- Menú principal (izquierda) -->
    <ul class="navbar-nav mr-auto">
      <li class="nav-item {{ active ? 'active' : '' }}">
        <a class="nav-link">Catálogo</a>
      </li>
      <!-- Tests, Recursos, Blog -->
    </ul>

    <!-- Menú usuario (derecha) -->
    <ul class="nav navbar-nav nav-flex-icons mr-right">
      <!-- Notificaciones dropdown -->
      <li class="nav-item dropdown notifications-nav">
        <a class="nav-link dropdown-toggle">
          <span class="badge red">0</span>
          <i class="fas fa-bell"></i>
        </a>
      </li>

      <!-- Contacto -->
      <li class="nav-item">
        <a class="nav-link"><i class="fas fa-envelope"></i></a>
      </li>

      <!-- User dropdown -->
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle">
          <i class="fas fa-user"></i> Perfil
        </a>
        <!-- Login/Logout según auth -->
      </li>

      <!-- Carrito (condicional) -->
      <li class="nav-item" v-if="cartItems > 0">
        <i class="fa fa-shopping-cart text-primary"></i>
      </li>
    </ul>
  </div>
</nav>
```

### 4.2 Footer (`footer.blade.php`)

```scss
.page-footer {
  border-top: 3px solid rgba(0, 0, 0, 0.2);

  // 3 columnas: About | Company Info | Quick Links
  // Redes sociales: Facebook, Instagram (48px icons)
  // Copyright centrado
}
```

### 4.3 Cards

#### Card Test (`card-test.blade.php`)
```html
<a class="card card-catalog-item d-flex flex-column h-100 dark-grey-text">
  <div class="card-body d-flex flex-column">
    <!-- Imagen con ratio -->
    <div class="catalog-image">
      <div class="ratio-content">
        <img class="img-fluid w-100">
      </div>
    </div>

    <!-- Título -->
    <h3 class="h6 card-title my-2 font-weight-bold">...</h3>

    <!-- Descripción -->
    <small class="text-muted flex-fill">...</small>

    <!-- Badges de estado -->
    <span class="badge badge-danger">Pendiente</span>
    <span class="badge badge-warning">Fallido</span>
    <span class="badge badge-success">Aprobado</span>

    <!-- Metadata lista -->
    <ul class="list-unstyled">
      <li><strong>Autor:</strong> ...</li>
      <li><strong>Preguntas:</strong> ...</li>
      <li><strong>Tiempo:</strong> ...</li>
    </ul>
  </div>

  <div class="card-footer">
    <!-- Stats: intentos, aprobados, fallidos, puntuación -->
    <i class="fas fa-chalkboard-teacher"></i>
    <i class="fas fa-check text-success"></i>
    <i class="fas fa-times text-danger"></i>
    <i class="fas fa-star" style="color: #EABE3F"></i>
  </div>
</a>
```

#### Card Opposition (`card-opposition.blade.php`)
```html
<div class="card card-catalog-item">
  <div class="view overlay ratio-3-2">
    <div class="ratio-content p-3 text-center">
      <img class="img-fluid">
      <div class="mask rgba-white-slight waves-effect"></div>
    </div>
  </div>

  <div class="card-body">
    <h5 class="card-title font-weight-bold text-truncate">...</h5>
    <span class="badge py-1 px-2 mb-3">Estado</span>

    <ul class="list-group property-box">
      <li><i class="fas fa-caret-right"></i> Admin</li>
      <li><i class="fas fa-caret-right"></i> Cuerpo</li>
    </ul>
  </div>

  <div class="card-footer">
    <strong>Vacantes:</strong> X
    <i class="fas fa-user-tie"></i>
  </div>
</div>
```

### 4.4 Botones Especiales

#### `.btn-big-toc` (Dashboard principal)
```scss
.btn-big-toc {
  // Botones grandes tipo card con icono + texto
  a[type=button] {
    @extend .card, .hoverable;

    > div {
      min-width: 104px;

      i {
        @extend .deep-purple-text;
        font-size: 2em;
      }

      h5 {
        @extend .black-text;
      }
    }
  }
}
```

#### `.btn-small-toc` (Acciones secundarias)
```scss
.btn-small-toc {
  a[type=button] {
    @extend .btn, .btn-flat, .btn-lg, .hoverable, .rounded;

    i {
      @extend .deep-purple-text;
    }
  }
}
```

---

## 5. Pantalla de Test (attempt-perform)

### 5.1 Estructura

```html
<section class="attempt-section"
         data-attempt-id="X"
         data-questions="N"
         data-answered="M">

  <header class="attempt-section-header">
    <h2 class="attempt-section-header-title">Nombre Test</h2>
    <p class="attempt-preamble">Preámbulo</p>
  </header>

  <div class="attempt-section-content">
    <!-- Bloques de temas -->
    <h4 class="bg-light px-3 py-2 text-center text-uppercase">
      Nombre Bloque
    </h4>

    <!-- Preguntas -->
    <article class="attempt-question">...</article>
  </div>

  <footer class="attempt-section-footer">
    <!-- Paginación -->
  </footer>
</section>

<!-- Status bar fijo en bottom -->
<div id="attempt-status-bar" class="fixed-bottom unique-color">
  <!-- Progress bar -->
  <!-- Reloj -->
  <!-- Botones: Pausar, Finalizar -->
</div>
```

### 5.2 Componente Pregunta (`card-question.blade.php`)

```html
<article class="attempt-question attempt-question-unrevised"
         data-question-id="X">

  <!-- Header con controles (solo en revisión) -->
  <header class="attempt-question-header">
    <div class="attempt-question-controls">
      <button class="attempt-question-btn-revise">
        <i class="fas fa-check-double text-success"></i>
      </button>
      <button class="attempt-question-btn-justify">
        <i class="far fa-info text-info"></i>
      </button>
      <button class="attempt-question-btn-impugn">
        <i class="far fa-fire text-danger"></i>
      </button>
    </div>
  </header>

  <div class="attempt-question-body">
    <!-- Preámbulo opcional -->
    <p class="attempt-question-preamble">...</p>

    <!-- Imágenes -->
    <div class="attempt-question-image-area">
      <figure>
        <img class="figure-img">
        <figcaption class="figure-caption">...</figcaption>
      </figure>
    </div>

    <!-- Pregunta -->
    <p class="attempt-question-name">
      1.- Texto de la pregunta
    </p>

    <!-- Respuestas -->
    <ol class="attempt-question-answers">
      <li class="attempt-question-answer" data-answer-id="X">
        <span class="attempt-question-answer-icon-area">
          <i class="attempt-question-answer-icon"></i>
        </span>
        <span class="attempt-question-answer-name">
          a) Respuesta
        </span>
      </li>
    </ol>
  </div>

  <!-- Footer con justificación -->
  <footer class="attempt-question-footer d-none">
    <p class="attempt-question-description">
      <i class="fas fa-info-square"></i>
      <span>Explicación...</span>
    </p>
  </footer>
</article>
```

### 5.3 Estados de Pregunta

```scss
// Sin revisar
.attempt-question-unrevised { }

// Correcta
.attempt-question-right {
  .attempt-question-header {
    @extend .dusty-grass-gradient;  // Verde
  }
  .attempt-answer-is-correct {
    color: green;
    font-weight: bold;
  }
}

// Incorrecta
.attempt-question-wrong {
  .attempt-question-header {
    @extend .lady-lips-gradient;  // Rojo
  }
  .attempt-question-answer-answer {
    color: red;
    text-decoration: line-through;
  }
}

// Sin responder
.attempt-question-blank {
  .attempt-question-header {
    @extend .heavy-rain-gradient;  // Gris
  }
}
```

### 5.4 Status Bar (Bottom Fixed)

```scss
#attempt-status-bar {
  @extend .fixed-bottom, .unique-color;

  #clock {
    font-size: 22px;
    color: #fff;

    &.clock-exceeded {
      @extend .orange-text;
      animation: clock-blinker 1s linear infinite;
    }
  }

  #attempt-progress-bar {
    @extend .progress, .w-25;
    height: 25px;

    #attempt-progress-value {
      @extend .purple-gradient;
    }
  }
}
```

---

## 6. Utilidades CSS Personalizadas

### 6.1 Ratios para Imágenes

```scss
.ratio-1-1 { padding-top: 100%; }
.ratio-3-2 { padding-top: 65.1785714%; }
.ratio-4-3 { padding-top: 75%; }
.ratio-16-9 { padding-top: 56.25%; }

.ratio-* > * {
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
}
```

### 6.2 Line Clamp (Truncate)

```scss
.line-clamb-2 {
  max-height: 3rem;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.line-clamb-3 {
  max-height: 4.5rem;
  -webkit-line-clamp: 3;
}
```

### 6.3 Otras Utilidades

```scss
.clickable { cursor: pointer; }
.not-allowed { cursor: not-allowed; }
.bg-middle-white { background-color: rgba(255,255,255,0.5); }
.middle-white-text { color: rgba(255,255,255,0.5); }
.img-64 { width: 64px; }
.img-128 { width: 128px; }
```

---

## 7. Flujos de Usuario

### 7.1 Flujo Test

1. **Lista Tests** (`tests/index`) → Grid/List de tests disponibles
2. **Detalle Test** (`tests/details`) → Info + botón iniciar
3. **Realizar Test** (`attempts/attempt-perform`) → Preguntas + timer
4. **Revisar Test** (`attempts/details`) → Resultados + corrección

### 7.2 Flujo MySpace

1. **Dashboard** (`myspace/index`) → Botones grandes: Tests, Recursos, Desafíos
2. **Secundarios** → Stats, Cuenta, Opciones, Alertas
3. **Sidebar** → Navegación entre secciones

### 7.3 Flujo Retos (Challenges)

1. **Mis Retos** (`myspace/my-challenges`) → Lista de retos
2. **Detalle Reto** (`myspace/my-challenge`) → Test + ranking posiciones
3. **Tabla posiciones** → Ranking con puntos

---

## 8. Iconografía (Font Awesome)

| Contexto | Icono |
|----------|-------|
| Tests | `fa-chalkboard-teacher` |
| Recursos | `fa-folder-open` |
| Desafíos | `fa-trophy` |
| Estadísticas | `fa-chart-line` |
| Cuenta | `fa-user-tie` |
| Opciones | `fa-user-cog` |
| Alertas | `fa-bell` |
| Correcto | `fa-check` / `fa-check-double` |
| Incorrecto | `fa-times` |
| Info | `fa-info` / `fa-info-square` |
| Impugnar | `fa-fire` |
| Reloj | `fa-user-clock` |
| Pausar | `fa-pause` |
| Estrella | `fa-star` (color: #EABE3F) |
| Pregunta oficial | `fa-university` |
| Obsoleta | `fa-exclamation-triangle` |

---

## 9. Patrones de Interacción

### 9.1 Auto-submit en Filtros
```javascript
$('.form-auto-submit').on('change', function() {
  $('form#catalog').submit();
});
```

### 9.2 Selección de Respuestas
- Click en respuesta → añade clase `.attempt-question-answer-answer`
- Muestra icono check y color primario
- Doble click → marca como duda (`.attempt-question-answer-doubt`)

### 9.3 Modal de Impugnación
- Botón abre modal con formulario
- Campos: motivo (select) + argumento (textarea)

### 9.4 Zoom de Imágenes
- Click en imagen → modal con imagen ampliada
- Usa Bootstrap modal

---

## 10. Decisiones para Migración

### Mantener (Replicar)
- [x] Sistema de layouts con sidebar
- [x] Cards con ratios de imagen
- [x] Status bar fijo para tests
- [x] Sistema de estados de pregunta (colores)
- [x] Iconografía Font Awesome
- [x] Estructura de preguntas/respuestas

### Mejorar
- [ ] Migrar de Bootstrap/MDB a Tailwind + shadcn/ui
- [ ] Reemplazar jQuery por React state
- [ ] Timer con hooks en lugar de JS vanilla
- [ ] Componentes más modulares
- [ ] Dark mode support
- [ ] Animaciones con Framer Motion
- [ ] Mobile-first responsive

### Eliminar
- [x] Dependencia de jQuery
- [x] DataTables (usar TanStack Table)
- [x] MDB específico (gradientes custom en Tailwind)

---

## 11. Mapeo Componentes Laravel → React

| Laravel (Blade) | React Component |
|-----------------|-----------------|
| `layouts/app.blade.php` | `<AppLayout>` |
| `layouts/catalog.blade.php` | `<CatalogLayout>` |
| `layouts/myspace.blade.php` | `<MySpaceLayout>` |
| `partials/navbar-base.blade.php` | `<Navbar>` |
| `partials/footer.blade.php` | `<Footer>` |
| `card-test.blade.php` | `<TestCard>` |
| `card-question.blade.php` | `<QuestionCard>` |
| `card-opposition.blade.php` | `<OppositionCard>` |
| `attempt-perform.blade.php` | `<TestPerform>` |
| `status-bar-attempt.blade.php` | `<TestStatusBar>` |
| `modal-impugn.blade.php` | `<ImpugnModal>` |

---

## 12. Assets a Migrar

```
/img/
├── opostal-inline.svg      # Logo principal
├── no-picture-512.jpg      # Placeholder imagen
├── facebook.svg            # Redes sociales
├── instagram.svg
├── favicon-*.png           # Favicons
└── feature-*.svg           # Iconos features

/css/
├── app.css                 # CSS compilado (referencia)

/js/
├── attempt.js              # Lógica de tests (reimplementar)
```
