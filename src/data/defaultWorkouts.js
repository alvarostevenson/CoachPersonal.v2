// Rutinas predeterminadas de Coach Personal organizadas por día de la semana
// dayOfWeek: 0 = Domingo, 1 = Lunes, 2 = Martes, 3 = Miércoles, 4 = Jueves, 5 = Viernes, 6 = Sábado

export const DEFAULT_WORKOUTS = [
  {
    id: 'lunes',
    dayOfWeek: 1,
    dayName: 'Lunes',
    title: 'Fuerza Tren Superior y Core',
    type: 'Fuerza',
    durationMinutes: 55,
    summary: 'Flexiones al fallo, hombros con pike push-ups y core de acero.',
    actions: [
      { id: 'l-warm', type: 'time', name: 'Calentamiento Articular', instruction: 'Rotaciones circulares y movilidad suave de hombros, codos y muñecas.', duration: 300 },
      { id: 'l-push-1', type: 'failure', name: 'Flexiones - Serie 1/4', instruction: 'Al fallo con técnica estricta. Aprieta glúteos y abdomen.', reps: 'Al fallo' },
      { id: 'l-rest-1', type: 'rest', name: 'Descanso', instruction: 'Respira hondo y sacude los brazos.', duration: 90 },
      { id: 'l-push-2', type: 'failure', name: 'Flexiones - Serie 2/4', instruction: 'Pecho toca el suelo si es posible.', reps: 'Al fallo' },
      { id: 'l-rest-2', type: 'rest', name: 'Descanso', instruction: 'Hidrátate y recupera el pulso.', duration: 90 },
      { id: 'l-push-3', type: 'failure', name: 'Flexiones - Serie 3/4', instruction: 'Mantén el cuerpo como una tabla recta.', reps: 'Al fallo' },
      { id: 'l-rest-3', type: 'rest', name: 'Descanso', instruction: 'Respira profundo.', duration: 90 },
      { id: 'l-push-4', type: 'failure', name: 'Flexiones - Serie 4/4', instruction: 'Última serie, da tu máximo esfuerzo.', reps: 'Al fallo' },
      { id: 'l-rest-4', type: 'rest', name: 'Descanso del bloque', instruction: 'Prepárate para los hombros.', duration: 120 },
      { id: 'l-pike-1', type: 'reps', name: 'Pike Push-ups - Serie 1/3', instruction: 'Cadera alta en V invertida, enfoca el empuje en los hombros.', reps: 10 },
      { id: 'l-rest-5', type: 'rest', name: 'Descanso', instruction: 'Recupera los hombros.', duration: 90 },
      { id: 'l-pike-2', type: 'reps', name: 'Pike Push-ups - Serie 2/3', instruction: 'Baja la coronilla hacia el suelo de forma controlada.', reps: 10 },
      { id: 'l-rest-6', type: 'rest', name: 'Descanso', instruction: 'Toma agua.', duration: 90 },
      { id: 'l-pike-3', type: 'reps', name: 'Pike Push-ups - Serie 3/3', instruction: 'Última serie de hombros.', reps: 10 },
      { id: 'l-rest-7', type: 'rest', name: 'Descanso del bloque', instruction: 'Pasa al tapete para el trabajo de core.', duration: 120 },
      { id: 'l-plank-1', type: 'time', name: 'Plancha Abdominal - Serie 1/3', instruction: 'Antebrazos apoyados, abdomen contraído sin que caiga la cadera.', duration: 45 },
      { id: 'l-rest-8', type: 'rest', name: 'Descanso', instruction: 'Relaja la zona lumbar.', duration: 60 },
      { id: 'l-plank-2', type: 'time', name: 'Plancha Abdominal - Serie 2/3', instruction: 'Firme como una roca, respira constantemente.', duration: 45 },
      { id: 'l-rest-9', type: 'rest', name: 'Descanso', instruction: 'Respira hondo.', duration: 60 },
      { id: 'l-plank-3', type: 'time', name: 'Plancha Abdominal - Serie 3/3', instruction: 'Aguanta hasta que suene el pitido.', duration: 45 },
      { id: 'l-rest-10', type: 'rest', name: 'Descanso', instruction: 'Prepárate para el hollow body.', duration: 60 },
      { id: 'l-hollow-1', type: 'time', name: 'Hollow Body Hold - Serie 1/3', instruction: 'Boca arriba, zona lumbar pegada al suelo, levanta piernas y hombros.', duration: 30 },
      { id: 'l-rest-11', type: 'rest', name: 'Descanso', instruction: 'Recupera el abdomen.', duration: 60 },
      { id: 'l-hollow-2', type: 'time', name: 'Hollow Body Hold - Serie 2/3', instruction: 'Mantén la tensión en el ombligo.', duration: 30 },
      { id: 'l-rest-12', type: 'rest', name: 'Descanso', instruction: 'Último descanso.', duration: 60 },
      { id: 'l-hollow-3', type: 'time', name: 'Hollow Body Hold - Serie 3/3', instruction: '¡Cierra fuerte el entrenamiento!', duration: 30 },
      { id: 'l-cool', type: 'time', name: 'Enfriamiento y Estiramiento', instruction: 'Estira pecho contra la pared, hombros y cobra en el piso.', duration: 300 }
    ]
  },
  {
    id: 'martes',
    dayOfWeek: 2,
    dayName: 'Martes',
    title: 'Carrera de Intervalos (HIIT)',
    type: 'Cardio',
    durationMinutes: 40,
    summary: 'Aumenta tu capacidad aeróbica y velocidad con series 1:1.',
    actions: [
      { id: 'm-warm', type: 'time', name: 'Calentamiento Progresivo', instruction: 'Trote suave y progresivo para elevar las pulsaciones.', duration: 600 },
      ...Array.from({ length: 8 }, (_, i) => [
        { id: `m-sprint-${i+1}`, type: 'time', name: `Intervalo Fuerte ${i+1}/8`, instruction: 'Corre a ritmo rápido y constante (esfuerzo 8/10).', duration: 60 },
        { id: `m-recup-${i+1}`, type: 'time', name: `Recuperación ${i+1}/8`, instruction: 'Trote muy suave o caminata rápida para bajar pulsaciones.', duration: 60 }
      ]).flat(),
      { id: 'm-cool', type: 'time', name: 'Vuelta a la Calma', instruction: 'Caminata lenta hacia casa y respiración profunda.', duration: 600 }
    ]
  },
  {
    id: 'miercoles',
    dayOfWeek: 3,
    dayName: 'Miércoles',
    title: 'Fuerza Tren Inferior',
    type: 'Fuerza',
    durationMinutes: 50,
    summary: 'Potencia de piernas, glúteos y pantorrillas sin pesas.',
    actions: [
      { id: 'x-warm', type: 'time', name: 'Calentamiento de Cadera y Rodillas', instruction: 'Giros articulares, sentadillas lentas de prueba y balanceos de pierna.', duration: 300 },
      { id: 'x-sq-1', type: 'reps', name: 'Sentadillas Profundas - Serie 1/4', instruction: 'Baja en 3 segundos, rompe el paralelo y sube con potencia.', reps: 20 },
      { id: 'x-rest-1', type: 'rest', name: 'Descanso', instruction: 'Camina un poco y sacude piernas.', duration: 90 },
      { id: 'x-sq-2', type: 'reps', name: 'Sentadillas Profundas - Serie 2/4', instruction: 'Espalda erguida, pecho abierto.', reps: 20 },
      { id: 'x-rest-2', type: 'rest', name: 'Descanso', instruction: 'Toma agua.', duration: 90 },
      { id: 'x-sq-3', type: 'reps', name: 'Sentadillas Profundas - Serie 3/4', instruction: 'Mantén los talones firmes en el suelo.', reps: 20 },
      { id: 'x-rest-3', type: 'rest', name: 'Descanso', instruction: 'Respira.', duration: 90 },
      { id: 'x-sq-4', type: 'reps', name: 'Sentadillas Profundas - Serie 4/4', instruction: 'Última serie de sentadillas.', reps: 20 },
      { id: 'x-rest-4', type: 'rest', name: 'Descanso de bloque', instruction: 'Prepárate para las zancadas alternas.', duration: 120 },
      { id: 'x-lunges-1', type: 'reps', name: 'Desplantes Alternos - Serie 1/3', instruction: 'Paso largo, la rodilla trasera roza el suelo (12 por pierna).', reps: 24 },
      { id: 'x-rest-5', type: 'rest', name: 'Descanso', instruction: 'Recupera el aliento.', duration: 90 },
      { id: 'x-lunges-2', type: 'reps', name: 'Desplantes Alternos - Serie 2/3', instruction: 'Torso recto y mirada al frente.', reps: 24 },
      { id: 'x-rest-6', type: 'rest', name: 'Descanso', instruction: 'Toma agua.', duration: 90 },
      { id: 'x-lunges-3', type: 'reps', name: 'Desplantes Alternos - Serie 3/3', instruction: 'Último esfuerzo de zancadas.', reps: 24 },
      { id: 'x-rest-7', type: 'rest', name: 'Descanso de bloque', instruction: 'Pasa al tapete para glúteos.', duration: 120 },
      { id: 'x-bridge-1', type: 'reps', name: 'Puentes de Glúteo - Serie 1/3', instruction: 'Boca arriba, empuja con los talones y mantén 2s arriba.', reps: 15 },
      { id: 'x-rest-8', type: 'rest', name: 'Descanso', instruction: 'Respira.', duration: 60 },
      { id: 'x-bridge-2', type: 'reps', name: 'Puentes de Glúteo - Serie 2/3', instruction: 'Aprieta glúteos al máximo en la cúspide.', reps: 15 },
      { id: 'x-rest-9', type: 'rest', name: 'Descanso', instruction: 'Respira.', duration: 60 },
      { id: 'x-bridge-3', type: 'reps', name: 'Puentes de Glúteo - Serie 3/3', instruction: 'Última serie de puente.', reps: 15 },
      { id: 'x-rest-10', type: 'rest', name: 'Descanso de bloque', instruction: 'De pie frente a un escalón.', duration: 90 },
      { id: 'x-calves-1', type: 'reps', name: 'Elevación de Pantorrilla - Serie 1/3', instruction: 'Rango completo de movimiento, estira abajo y sube en puntas.', reps: 20 },
      { id: 'x-rest-11', type: 'rest', name: 'Descanso', instruction: 'Sacude tobillos.', duration: 60 },
      { id: 'x-calves-2', type: 'reps', name: 'Elevación de Pantorrilla - Serie 2/3', instruction: 'Sube con control.', reps: 20 },
      { id: 'x-rest-12', type: 'rest', name: 'Descanso', instruction: 'Respira.', duration: 60 },
      { id: 'x-calves-3', type: 'reps', name: 'Elevación de Pantorrilla - Serie 3/3', instruction: 'Cierra con todo.', reps: 20 },
      { id: 'x-cool', type: 'time', name: 'Estiramiento Profundo de Piernas', instruction: 'Estira cuádriceps, isquiotibiales y gemelos.', duration: 300 }
    ]
  },
  {
    id: 'jueves',
    dayOfWeek: 4,
    dayName: 'Jueves',
    title: 'Carrera a Ritmo Constante',
    type: 'Cardio',
    durationMinutes: 45,
    summary: 'Construye tu base aeróbica y economía de carrera en zona 2.',
    actions: [
      { id: 'j-warm', type: 'time', name: 'Calentamiento Caminando', instruction: 'Caminata enérgica para lubricar articulaciones y ligamentos.', duration: 300 },
      { id: 'j-run', type: 'time', name: 'Carrera Continua Zona 2', instruction: 'Trote constante a ritmo conversacional (esfuerzo 5/10). Si te falta el aire, baja el ritmo.', duration: 2400 },
      { id: 'j-cool', type: 'time', name: 'Enfriamiento Caminando', instruction: 'Caminata suave de vuelta a casa y respiraciones calmas.', duration: 300 }
    ]
  },
  {
    id: 'viernes',
    dayOfWeek: 5,
    dayName: 'Viernes',
    title: 'Circuito HIIT Full Body',
    type: 'Mixto',
    durationMinutes: 45,
    summary: 'Circuito metabólico continuo para quemar energía y ganar resistencia.',
    actions: [
      { id: 'v-warm', type: 'time', name: 'Calentamiento Dinámico', instruction: 'Jumping jacks suaves, giros de torso y sentadillas sin impacto.', duration: 300 },
      ...Array.from({ length: 4 }, (_, i) => [
        { id: `v-info-${i+1}`, type: 'info', name: `Ronda de Circuito ${i+1} de 4`, instruction: 'Completa los 4 ejercicios seguidos con técnica limpia.' },
        { id: `v-push-${i+1}`, type: 'reps', name: 'Flexiones Explosivas', instruction: 'Empuja con fuerza el piso.', reps: 12 },
        { id: `v-squat-${i+1}`, type: 'reps', name: 'Sentadillas con Salto', instruction: 'Amortigua la caída suavemente con las puntas.', reps: 15 },
        { id: `v-climbers-${i+1}`, type: 'reps', name: 'Mountain Climbers', instruction: 'Rodillas al pecho a ritmo rápido (10 por pierna).', reps: 20 },
        { id: `v-abs-${i+1}`, type: 'reps', name: 'Abdominales Bicicleta', instruction: 'Codo toca rodilla opuesta con giro de tronco.', reps: 16 },
        { id: `v-rest-${i+1}`, type: 'rest', name: 'Descanso de Ronda', instruction: 'Camina y toma aire para la siguiente vuelta.', duration: 90 }
      ]).flat(),
      { id: 'v-cool', type: 'time', name: 'Enfriamiento y Respiración', instruction: 'Estiramientos en el tapete de todo el cuerpo.', duration: 300 }
    ]
  },
  {
    id: 'sabado',
    dayOfWeek: 6,
    dayName: 'Sábado',
    title: 'Carrera Larga de Resistencia',
    type: 'Cardio',
    durationMinutes: 60,
    summary: 'Fondo largo al aire libre en parque o ruta cómoda para cerrar la semana.',
    actions: [
      { id: 's-warm', type: 'time', name: 'Calentamiento y Movilidad', instruction: 'Caminata rápida y zancadas dinámicas cortas.', duration: 300 },
      { id: 's-run', type: 'time', name: 'Carrera Larga Cómoda', instruction: 'Disfruta el recorrido. Mantén un ritmo relajado y sostenible.', duration: 3000 },
      { id: 's-cool', type: 'time', name: 'Caminata y Estiramiento', instruction: 'Caminata tranquila y estiramiento completo de piernas y espalda.', duration: 300 }
    ]
  },
  {
    id: 'domingo',
    dayOfWeek: 0,
    dayName: 'Domingo',
    title: 'Recuperación Activa y Movilidad',
    type: 'Movilidad',
    durationMinutes: 35,
    summary: 'Cero impacto: yoga, flexibilidad articular y descarga muscular.',
    actions: [
      { id: 'd-breath', type: 'time', name: 'Respiración Diafragmática', instruction: 'Acuéstate en el tapete, inhala por la nariz llenando el abdomen y exhala lento.', duration: 180 },
      { id: 'd-hips', type: 'time', name: 'Apertura de Cadera (Paloma)', instruction: 'Postura de la paloma: 90s con la pierna derecha y 90s con la izquierda.', duration: 180 },
      { id: 'd-hamstrings', type: 'time', name: 'Estiramiento Isquiotibial', instruction: 'Sentado con piernas extendidas, busca tocarte la punta de los pies sin forzar.', duration: 180 },
      { id: 'd-spine', type: 'time', name: 'Torsión Espinal Suave', instruction: 'Boca arriba, deja caer ambas rodillas a un lado con los brazos en cruz.', duration: 180 },
      { id: 'd-shoulders', type: 'time', name: 'Apertura de Pecho y Hombros', instruction: 'Postura del niño extendida empujando suavemente el pecho hacia el piso.', duration: 240 },
      { id: 'd-relax', type: 'time', name: 'Relajación Final (Savasana)', instruction: 'Cierra los ojos, relaja mandíbula, hombros y piernas. Tu cuerpo se regenera hoy.', duration: 300 }
    ]
  }
];
