# Coach Personal — Evolución PWA: Calendario Real, Animaciones SVG, Editor y Respaldo

Plan de evolución para transformar **Coach Personal** en una aplicación web progresiva (PWA) completa, manteniendo su ligereza, rendimiento instantáneo y usabilidad móvil de una sola mano, con calendario real automático, animaciones vectoriales de guía técnica, edición de rutinas y respaldo JSON.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> A partir de las respuestas confirmadas en la fase de clarificación, se definen los siguientes estándares de implementación:

- **Calendario Semanal Automático**: El programa se mapea de lunes a domingo. El sistema lee en tiempo real el día del dispositivo (`new Date().getDay()`) y resalta automáticamente la rutina del día actual como "HOY", permitiendo además seleccionar y entrenar cualquier día de la semana.
- **Animaciones SVG Minimalistas Integradas**: Se implementan ilustraciones vectoriales dinámicas integradas en la tarjeta activa del entrenamiento, animadas con CSS puro (`transform` y keyframes de cadencia natural) que ilustran la técnica del ejercicio (sentadillas, flexiones, planchas, saltos, carrera, zancadas y puentes) con consumo nulo de datos y máxima eficiencia de batería.
- **Menú de Ajustes en Cabecera**: Se añade un botón de ajustes ergonómico en la barra superior que abre un panel deslizable (Drawer) con:
  - Editor interactivo de rutinas (agregar, modificar, eliminar ejercicios y descansos).
  - Exportación e importación del programa completo en formato JSON descargable/cargable.
  - Opción de restaurar la programación oficial por defecto.
  - Botón de instalación PWA guiado para navegadores móviles y desktop (con soporte para iOS Safari y Android).

---

## 1. Overview & Core Concept

- **Qué hace**: Es un entrenador personal de bolsillo que guía entrenamientos diarios de fuerza y carrera interválica en sesiones de ~60 minutos, con temporizadores sonoros, animaciones biomecánicas de referencia, registro de repeticiones al fallo y total personalización del programa.
- **Audiencia objetivo**: Atletas de calistenia, corredores híbridos y usuarios que entrenan en casa o al aire libre en su teléfono móvil con conexión intermitente.
- **Valor diferencial**: Cero dependencias pesadas, carga instantánea offline, control por voz/sonido con Wake Lock para que la pantalla no se apague durante las series, y control total del usuario sobre su propio plan de entrenamiento.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Flujo de Inicio & Día Actual**:
   - El usuario abre la app y observa inmediatamente la tarjeta del día actual destacada con etiqueta "HOY" y borde de acento en degradado índigo/violeta.
   - Puede pulsar "Iniciar Entrenamiento de Hoy" en un solo toque o explorar el resto de la semana.
2. **Flujo del Entrenador Activo con Animación**:
   - Al iniciar, se presenta el paso actual con su barra de progreso superior.
   - En el centro, una figura SVG estilizada ejecuta el movimiento continuo (ej. flexión bajando y subiendo al compás del ejercicio).
   - Temporizador grande con cuenta regresiva, beeps audibles en los últimos 3 segundos y transición automática en descansos.
3. **Flujo de Edición de Rutinas**:
   - Desde el menú de ajustes, el usuario selecciona el día que desea personalizar.
   - Puede editar nombres, series, repeticiones sugeridas, tiempos de trabajo o descanso, y reorganizar la secuencia.
   - Los cambios se guardan al instante en almacenamiento local seguro (`localStorage`).
4. **Flujo de Respaldo & Restauración**:
   - Con un clic en "Exportar Programa", se genera un archivo `coach-personal-rutinas.json`.
   - Con "Importar Programa", puede cargar un archivo o compartir su rutina con otra persona, con validación de datos para evitar errores.

### Visual Identity & Theme
- **Atmósfera**: Dark-mode deportivo refinado (`bg-gray-950` / `bg-gray-900`) con acentos de alta legibilidad (`indigo-400`, `emerald-400` para completado, `orange-400` para series al fallo y `blue-400` para fases de descanso).
- **Tipografía**: Jerarquía limpia con números tabulares para cronómetros (`font-mono tabular-nums`), títulos equilibrados y botones táctiles de 48px de altura mínima.
- **Animaciones SVG**: Líneas vectoriales geométricas de bajo contraste (silueta deportiva minimalista) con acentos de color dinámicos según la fase concéntrica y excéntrica del movimiento.

---

## 3. Key Product Decisions & Trade-Offs

- **Animaciones SVG en Código vs. GIFs/Vídeos**:
  - *Decisión*: SVGs vectoriales nativos con CSS keyframes en lugar de archivos de vídeo o gifs externos.
  - *Por qué*: Pesa menos de 15KB en total, funciona 100% offline, se escala a cualquier resolución sin pixelarse y no consume ancho de banda móvil.
- **Persistencia en LocalStorage con Fallback Seguro**:
  - *Decisión*: Guardar las rutinas modificadas en `localStorage` con versionado y estructura tipada.
  - *Por qué*: Mantiene la app privada, sin necesidad de registros o cuentas de usuario externas, garantizando que si el usuario no tiene internet en el parque, sus datos siguen intactos.
- **Validación de Archivos JSON en Importación**:
  - *Decisión*: Parser estricto que verifica que cada día y bloque contenga propiedades válidas (`id`, `day`, `title`, `type`, `actions`).
  - *Por qué*: Evita corromper la aplicación si se importa un archivo malformado, ofreciendo mensajes de error claros al usuario.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                      App Container                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │     Top Header (Wordmark + Settings / PWA Btn)   │  │
│  └──────────────────────────────────────────────────┘  │
│                           │                            │
│         ┌─────────────────┴─────────────────┐          │
│         ▼                                   ▼          │
│  ┌──────────────┐                   ┌───────────────┐  │
│  │ ScheduleView │                   │ WorkoutRunner │  │
│  │ (Día actual  │                   │ (WakeLock,    │  │
│  │  resaltado)  │                   │  Audio Beeps) │  │
│  └──────────────┘                   └───────┬───────┘  │
│                                             ▼          │
│                                     ┌───────────────┐  │
│                                     │  WorkoutStep  │  │
│                                     │ (Animación SVG│  │
│                                     │  + Cronómetro)│  │
│                                     └───────────────┘  │
│                           ▲                            │
│                           │                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │ SettingsModal (Editor de Rutinas + Import/Export)│  │
│  └──────────────────────────────────────────────────┘  │
│                           ▲                            │
│                           │                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │    Storage Layer (localStorage + Default Plan)   │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### Component Breakdown
1. **`src/data/defaultWorkouts.js`**: Banco de rutinas predeterminadas de calistenia y carrera organizadas de Lunes a Domingo.
2. **`src/components/ExerciseAnimation.jsx`**: Colección de ilustraciones vectoriales animadas para cada tipo de ejercicio (`squat`, `pushup`, `plank`, `bridge`, `run`, `stretch`, `climber`).
3. **`src/components/SettingsModal.jsx`**: Drawer/modal de ajustes con gestión de rutinas, botón PWA y selector de archivo JSON para importar/exportar.
4. **`src/components/RoutineEditor.jsx`**: Interfaz de edición táctil para agregar, eliminar y modificar ejercicios.
5. **`src/hooks/useWorkouts.js`**: Hook personalizado que administra el estado sincronizado con `localStorage`, cálculo del día de hoy y funciones de importación/exportación.
6. **`src/hooks/usePWAInstall.js`**: Hook para capturar `beforeinstallprompt` y ofrecer instalación nativa en Android/Chrome o guía para iOS.

---

## Verification Plan

- [ ] Verificar que el día de la semana actual se resalte con exactitud según la fecha del sistema (`new Date()`).
- [ ] Comprobar que las animaciones SVG se reproduzcan de forma suave y sin lag en cada ejercicio.
- [ ] Probar el editor: modificar un ejercicio, cambiar repeticiones/tiempo, refrescar la página y verificar persistencia.
- [ ] Probar exportar el programa a un archivo `.json` y volver a importarlo exitosamente.
- [ ] Probar la opción "Restaurar por defecto" para comprobar que retorna al programa original.
- [ ] Validar la compilación con `compile_applet` y la verificación de estilo/código con `lint_applet`.
