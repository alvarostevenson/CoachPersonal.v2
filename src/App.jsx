import { useState, useEffect, useRef } from 'react';
import { Play, Pause, CheckCircle2, ArrowRight, ArrowLeft, Activity, Timer, ChevronRight, Check } from 'lucide-react';

// --- GENERADOR DE DATOS DEL PROGRAMA ---
// Función auxiliar para crear bloques de ejercicios planos (para el carrusel de la app)
const createWorkoutData = () => {

  // 1. SABADO (HOY) - Calibración
  const sabadoHoy = [
    { type: 'info', name: 'Calentamiento', instruction: 'Rotaciones de brazos hacia adelante y atrás, giros de cadera y rotación de tobillos.', duration: 180 },
    { type: 'time', name: 'Paso Yogui', instruction: 'Trote suave en tu lugar, levantando rodillas.', duration: 120 },
  ];
  for (let i = 1; i <= 4; i++) {
    sabadoHoy.push(
      { type: 'info', name: `Circuito Full Body - Serie ${i} de 4`, instruction: 'Prepárate para el circuito continuo.' },
      { type: 'reps', name: 'Sentadillas', instruction: 'Baja lento, espalda recta.', reps: 15 },
      { type: 'failure', name: 'Flexiones (Push-ups)', instruction: 'Haz todas las que puedas con buena técnica. Apoya rodillas si fallas.', reps: 'Al fallo' },
      { type: 'time', name: 'Plancha (Plank)', instruction: 'Aprieta el abdomen fuerte.', duration: 30 },
      { type: 'reps', name: 'Puentes de glúteo', instruction: 'Acuéstate, eleva la cadera y sostén 1 seg arriba.', reps: 15 },
      { type: 'rest', name: 'Descanso del Circuito', instruction: 'Respira profundo y toma agua.', duration: 90 }
    );
  }
  sabadoHoy.push({ type: 'time', name: 'Enfriamiento', instruction: 'Estiramientos en el tapete. Toca puntas, estira pecho y espalda.', duration: 300 });

  // 2. DOMINGO - Carrera Suave
  const domingo = [
    { type: 'time', name: 'Calentamiento', instruction: 'Caminata rápida para despertar las piernas.', duration: 300 },
    { type: 'time', name: 'Carrera Introductoria', instruction: 'Trote muy suave. Si te cansas, alterna caminata y trote.', duration: 1800 },
    { type: 'time', name: 'Enfriamiento', instruction: 'Caminata lenta de regreso a casa.', duration: 300 }
  ];

  // 3. LUNES - Tren Superior
  const lunes = [
    { type: 'time', name: 'Calentamiento Articular', instruction: 'Rotaciones y movilidad de hombros y muñecas.', duration: 300 },
  ];
  for(let i=1; i<=4; i++) {
    lunes.push(
      { type: 'failure', name: `Flexiones - Serie ${i}/4`, instruction: 'Al fallo. Prioriza la técnica.', reps: 'Al fallo' },
      { type: 'rest', name: 'Descanso', duration: 90 }
    );
  }
  for(let i=1; i<=3; i++) {
    lunes.push(
      { type: 'reps', name: `Pike Push-ups - Serie ${i}/3`, instruction: 'Cadera arriba, formando un triángulo. 8 a 12 reps.', reps: '8-12' },
      { type: 'rest', name: 'Descanso', duration: 90 }
    );
  }
  for(let i=1; i<=3; i++) {
    lunes.push(
      { type: 'time', name: `Plancha Abdominal - Serie ${i}/3`, instruction: 'Cuerpo recto como tabla.', duration: 45 },
      { type: 'rest', name: 'Descanso', duration: 60 }
    );
  }
  for(let i=1; i<=3; i++) {
    lunes.push(
      { type: 'time', name: `Hollow Body Hold - Serie ${i}/3`, instruction: 'Boca arriba, separa hombros y pies del piso.', duration: 30 },
      { type: 'rest', name: 'Descanso', duration: 60 }
    );
  }
  lunes.push({ type: 'time', name: 'Enfriamiento', instruction: 'Estiramiento de pecho, hombros y abdomen.', duration: 300 });

  // 4. MARTES - Intervalos
  const martes = [
    { type: 'time', name: 'Calentamiento', instruction: 'Trote suave para elevar pulsaciones.', duration: 600 },
  ];
  for(let i=1; i<=10; i++) {
    martes.push(
      { type: 'time', name: `Intervalo Rápido ${i}/10`, instruction: 'Corre rápido (Esfuerzo 8/10).', duration: 60 },
      { type: 'time', name: `Recuperación ${i}/10`, instruction: 'Caminata o trote muy lento.', duration: 60 }
    );
  }
  martes.push({ type: 'time', name: 'Enfriamiento', instruction: 'Trote suave o caminata hacia casa.', duration: 600 });

  // 5. MIERCOLES - Tren Inferior
  const miercoles = [
    { type: 'time', name: 'Calentamiento', instruction: 'Giros de rodillas, cadera y sentadillas sin peso.', duration: 300 },
  ];
  for(let i=1; i<=4; i++) {
    miercoles.push(
      { type: 'reps', name: `Sentadillas Lentas - Serie ${i}/4`, instruction: 'Baja en 3 segundos, sube en 1.', reps: 20 },
      { type: 'rest', name: 'Descanso', duration: 90 }
    );
  }
  for(let i=1; i<=3; i++) {
    miercoles.push(
      { type: 'reps', name: `Desplantes - Serie ${i}/3`, instruction: 'Alternando piernas. 12 reps por pierna (24 total).', reps: 24 },
      { type: 'rest', name: 'Descanso', duration: 90 }
    );
  }
  for(let i=1; i<=3; i++) {
    miercoles.push(
      { type: 'reps', name: `Puentes de Glúteo - Serie ${i}/3`, instruction: 'Aprieta glúteos arriba por 2 segundos.', reps: 15 },
      { type: 'rest', name: 'Descanso', duration: 60 }
    );
  }
  for(let i=1; i<=4; i++) {
    miercoles.push(
      { type: 'reps', name: `Elevaciones de Pantorrilla - Serie ${i}/4`, instruction: 'En un escalón si es posible.', reps: 20 },
      { type: 'rest', name: 'Descanso', duration: 60 }
    );
  }
  miercoles.push({ type: 'time', name: 'Enfriamiento', instruction: 'Estiramiento profundo de piernas.', duration: 300 });

  // 6. JUEVES - Carrera Base
  const jueves = [
    { type: 'time', name: 'Calentamiento', instruction: 'Caminata rápida.', duration: 300 },
    { type: 'time', name: 'Carrera Constante', instruction: 'Trote a ritmo conversacional (esfuerzo 5/10). Construyendo resistencia.', duration: 2400 },
    { type: 'time', name: 'Enfriamiento', instruction: 'Caminata lenta.', duration: 300 }
  ];

  // 7. VIERNES - Circuito Full Body
  const viernes = [
    { type: 'time', name: 'Calentamiento', instruction: 'Movilidad general y saltos de tijera suaves.', duration: 300 },
  ];
  for (let i = 1; i <= 5; i++) {
    viernes.push(
      { type: 'info', name: `Circuito HIIT - Serie ${i} de 5`, instruction: 'Haz estos ejercicios seguidos sin descanso.' },
      { type: 'reps', name: 'Flexiones', instruction: 'Técnica limpia.', reps: 10 },
      { type: 'reps', name: 'Sentadillas con Salto', instruction: 'Amortigua la caída. (O normales si duele la rodilla).', reps: 15 },
      { type: 'reps', name: 'Mountain Climbers', instruction: 'Posición de plancha, rodillas al pecho (10 por pierna).', reps: 20 },
      { type: 'reps', name: 'Abs de Bicicleta', instruction: 'Codo a rodilla contraria.', reps: 15 },
      { type: 'rest', name: 'Descanso del Circuito', instruction: 'Recupera el aliento.', duration: 60 }
    );
  }
  viernes.push({ type: 'time', name: 'Enfriamiento', instruction: 'Estiramientos en el tapete.', duration: 300 });

  // 8. SABADO (Prox) - Carrera Larga
  const sabadoProx = [
    { type: 'time', name: 'Calentamiento', instruction: 'Caminata rápida y estiramientos dinámicos.', duration: 300 },
    { type: 'time', name: 'Carrera Larga', instruction: 'Disfruta la ruta, busca un parque o elevación. Mantén un ritmo cómodo.', duration: 3000 }, // 50 mins
    { type: 'time', name: 'Enfriamiento', instruction: 'Caminata y estiramiento de piernas.', duration: 300 }
  ];

  // 9. DOMINGO (Prox) - Recuperación
  const domingoProx = [
    { type: 'time', name: 'Sesión de Movilidad y Yoga', instruction: 'Estiramientos profundos en el tapete. Cero impacto hoy.', duration: 2400 } // 40 mins
  ];

  return [
    { id: 's0', day: 'Sábado (Hoy)', title: 'Calibración Full Body', type: 'Fuerza', actions: sabadoHoy },
    { id: 'd0', day: 'Domingo (Mañana)', title: 'Carrera Suave Intro', type: 'Cardio', actions: domingo },
    { id: 'l1', day: 'Lunes', title: 'Fuerza Tren Superior y Core', type: 'Fuerza', actions: lunes },
    { id: 'm1', day: 'Martes', title: 'Carrera de Intervalos', type: 'Cardio', actions: martes },
    { id: 'x1', day: 'Miércoles', title: 'Fuerza Tren Inferior', type: 'Fuerza', actions: miercoles },
    { id: 'j1', day: 'Jueves', title: 'Carrera a Ritmo Constante', type: 'Cardio', actions: jueves },
    { id: 'v1', day: 'Viernes', title: 'Circuito Full Body', type: 'Mixto', actions: viernes },
    { id: 's1', day: 'Sábado', title: 'Carrera Larga', type: 'Cardio', actions: sabadoProx },
    { id: 'd1', day: 'Domingo', title: 'Recuperación Activa', type: 'Movilidad', actions: domingoProx },
  ];
};

const WORKOUTS = createWorkoutData();

// --- COMPONENTES ---

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export default function App() {
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // Audio Context Setup (Lazy initialization on user interaction)
  const audioCtxRef = useRef(null);

  const playBeep = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch(e) { console.log("Audio not supported", e); }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-indigo-500/30">
      <div className="max-w-md mx-auto bg-gray-900 min-h-screen shadow-2xl relative overflow-hidden">
        
        {/* Cabecera */}
        <header className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-10 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Activity className="text-indigo-400 w-6 h-6" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Coach Personal
            </h1>
          </div>
          {selectedWorkout && (
            <button 
              onClick={() => setSelectedWorkout(null)}
              className="text-sm text-gray-400 hover:text-white"
            >
              Cerrar
            </button>
          )}
        </header>

        {/* Vistas */}
        {!selectedWorkout ? (
          <ScheduleView onSelect={setSelectedWorkout} workouts={WORKOUTS} />
        ) : (
          <WorkoutRunner workout={selectedWorkout} onFinish={() => setSelectedWorkout(null)} playBeep={playBeep} />
        )}
      </div>
    </div>
  );
}

// --- VISTA: CALENDARIO ---
function ScheduleView({ workouts, onSelect }) {
  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Tu Programa</h2>
        <p className="text-gray-400 text-sm">Alternando fuerza y resistencia para máximos resultados en 60 minutos.</p>
      </div>

      <div className="space-y-3">
        {workouts.map((w, idx) => (
          <button
            key={w.id}
            onClick={() => onSelect(w)}
            className={`w-full text-left rounded-2xl p-4 transition-all duration-200 border border-transparent 
              ${idx === 0 ? 'bg-gradient-to-br from-indigo-600 to-purple-700 shadow-lg shadow-indigo-900/20' : 'bg-gray-800 hover:bg-gray-700 hover:border-gray-600'}
            `}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider mb-1 block
                  ${idx === 0 ? 'text-indigo-200' : 'text-gray-500'}
                `}>{w.day}</span>
                <h3 className={`font-semibold ${idx === 0 ? 'text-white text-lg' : 'text-gray-200'}`}>{w.title}</h3>
              </div>
              <ChevronRight className={idx === 0 ? 'text-indigo-300' : 'text-gray-600'} />
            </div>
            
            <div className="flex items-center space-x-2 mt-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium
                ${w.type === 'Fuerza' ? 'bg-orange-500/20 text-orange-300' : 
                  w.type === 'Cardio' ? 'bg-blue-500/20 text-blue-300' : 
                  'bg-emerald-500/20 text-emerald-300'}
              `}>
                {w.type}
              </span>
              <span className={`text-xs flex items-center ${idx === 0 ? 'text-indigo-200' : 'text-gray-500'}`}>
                <Timer className="w-3 h-3 mr-1" />
                ~60 min
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}


// --- VISTA: ENTRENADOR ACTIVO ---
function WorkoutRunner({ workout, onFinish, playBeep }) {
  const actions = workout.actions;
  const [currentStep, setCurrentStep] = useState(0);

  // --- WAKE LOCK API (Evitar que la pantalla se apague) ---
  useEffect(() => {
    let wakeLock = null;
    
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen');
        }
      } catch (err) {
        console.log(`Wake Lock error: ${err.message}`);
      }
    };

    requestWakeLock();

    // Re-solicitar si el usuario minimiza la app y vuelve a entrar
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Limpiar al terminar el entrenamiento
    return () => {
      if (wakeLock !== null) {
        wakeLock.release().catch(() => {});
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const isLast = currentStep === actions.length - 1;

  const handleNext = () => {
    if (isLast) {
      onFinish();
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  return (
    <WorkoutStep
      key={currentStep}
      step={actions[currentStep]}
      currentStep={currentStep}
      totalSteps={actions.length}
      isLast={isLast}
      onNext={handleNext}
      onPrev={handlePrev}
      playBeep={playBeep}
    />
  );
}

function WorkoutStep({ step, currentStep, totalSteps, isLast, onNext, onPrev, playBeep }) {
  // Timer state
  const [timeLeft, setTimeLeft] = useState(
    step.type === 'time' || step.type === 'rest' ? (step.duration ?? 0) : 0
  );
  const [timerRunning, setTimerRunning] = useState(step.type === 'rest');

  // Récords state
  const [failureReps, setFailureReps] = useState('');

  // Timer loop
  useEffect(() => {
    let interval = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            playBeep();
            setTimerRunning(false);
            return 0;
          }
          // Beep on last 3 seconds
          if (prev <= 4) playBeep(); 
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft, playBeep]);

  // Progress Bar
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] pb-6 relative">
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-800 h-1.5">
        <div 
          className="bg-indigo-500 h-1.5 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <div className="p-4 flex-grow flex flex-col items-center justify-center relative">
        
        {/* Number / Status */}
        <span className="text-indigo-400 font-semibold mb-2 flex items-center text-sm">
          {step.type === 'rest' ? <Timer className="w-4 h-4 mr-1" /> : <Activity className="w-4 h-4 mr-1" />}
          Paso {currentStep + 1} de {totalSteps}
        </span>
        
        {/* Title & Instruction */}
        <h2 className={`text-3xl font-bold text-center mb-4 transition-colors ${step.type === 'rest' ? 'text-blue-400' : 'text-white'}`}>
          {step.name}
        </h2>
        <p className="text-gray-400 text-center mb-8 px-4 text-lg">
          {step.instruction}
        </p>

        {/* Dynamic Center Display */}
        <div className="w-full max-w-xs flex flex-col items-center justify-center min-h-[200px] mb-8">
          
          {/* TIME BASED */}
          {(step.type === 'time' || step.type === 'rest') && (
            <div className="text-center w-full">
              <div className={`text-7xl font-mono font-black mb-6 tracking-tighter
                ${timeLeft === 0 ? 'text-gray-600' : step.type === 'rest' ? 'text-blue-400' : 'text-white'}
              `}>
                {formatTime(timeLeft)}
              </div>
              
              {timeLeft > 0 ? (
                <button 
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95
                    ${timerRunning ? 'bg-gray-800 text-gray-300 border-2 border-gray-700' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`
                  }
                >
                  {timerRunning ? <Pause className="w-8 h-8 ml-1" /> : <Play className="w-8 h-8 ml-1" />}
                </button>
              ) : (
                <div className="text-emerald-400 flex items-center justify-center space-x-2 font-bold animate-pulse">
                  <CheckCircle2 className="w-6 h-6" />
                  <span>¡Tiempo completado!</span>
                </div>
              )}
            </div>
          )}

          {/* REP BASED */}
          {step.type === 'reps' && (
            <div className="text-center">
              <div className="text-6xl font-black text-white mb-4">
                {step.reps}
              </div>
              <span className="text-gray-400 uppercase tracking-widest text-sm font-bold">Repeticiones</span>
            </div>
          )}

          {/* FAILURE BASED */}
          {step.type === 'failure' && (
            <div className="w-full text-center">
              <div className="text-5xl font-black text-orange-500 mb-6 uppercase">
                Al Fallo
              </div>
              <div className="bg-gray-800 p-4 rounded-2xl w-full">
                <label className="block text-gray-400 text-sm mb-2">¿Cuántas lograste? (Opcional)</label>
                <input 
                  type="number" 
                  className="bg-gray-900 border border-gray-700 text-white text-center text-2xl font-bold rounded-xl w-32 p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="0"
                  value={failureReps}
                  onChange={(e) => setFailureReps(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* INFO ONLY (Calentamiento start, circuit start) */}
          {step.type === 'info' && (
            <div className="w-24 h-24 rounded-full bg-gray-800/50 flex items-center justify-center border-4 border-gray-700 border-dashed">
              <Check className="w-10 h-10 text-gray-500" />
            </div>
          )}

        </div>
      </div>

      {/* Navigation Controls */}
      <div className="px-6 flex justify-between items-center space-x-4">
        <button 
          onClick={onPrev}
          disabled={currentStep === 0}
          className={`p-4 rounded-xl flex items-center justify-center transition-colors
            ${currentStep === 0 ? 'text-gray-700' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button 
          onClick={onNext}
          className="flex-grow bg-white text-gray-950 p-4 rounded-xl font-bold text-lg flex items-center justify-center hover:bg-gray-200 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          {isLast ? '¡Finalizar Entrenamiento!' : 'Siguiente Paso'}
          {!isLast && <ArrowRight className="w-5 h-5 ml-2" />}
        </button>
      </div>

    </div>
  );
}