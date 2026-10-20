import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Activity,
  Timer,
  ChevronRight,
  Check,
  Settings,
  Sparkles
} from 'lucide-react';

import { useWorkouts } from './hooks/useWorkouts';
import SettingsModal from './components/SettingsModal';

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export default function App() {
  const {
    workouts,
    todayDayOfWeek,
    todayWorkout,
    updateWorkout,
    updateAction,
    addAction,
    deleteAction,
    reorderActions,
    resetToDefault,
    exportWorkoutsJSON,
    importWorkoutsJSON
  } = useWorkouts();

  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Audio Context Setup (Lazy initialization on user interaction)
  const audioCtxRef = useRef(null);

  const playBeep = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      console.log('Audio not supported', e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-indigo-500/30">
      <div className="max-w-md mx-auto bg-gray-900 min-h-screen shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Cabecera */}
        <header className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 p-4 sticky top-0 z-20 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent leading-none">
                Coach Personal
              </h1>
              <span className="text-[10px] text-gray-500 font-medium">Fuerza, Carrera & Movilidad</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {selectedWorkout ? (
              <button
                onClick={() => setSelectedWorkout(null)}
                className="min-h-[44px] px-3 text-xs font-semibold text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
              >
                Volver
              </button>
            ) : (
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-indigo-300 rounded-xl hover:bg-gray-800 transition"
                title="Configuración y editor de rutinas"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
          </div>
        </header>

        {/* Vistas Principales */}
        <main className="flex-grow flex flex-col">
          {!selectedWorkout ? (
            <ScheduleView
              workouts={workouts}
              todayDayOfWeek={todayDayOfWeek}
              todayWorkout={todayWorkout}
              onSelect={setSelectedWorkout}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          ) : (
            <WorkoutRunner
              workout={selectedWorkout}
              onFinish={() => setSelectedWorkout(null)}
              playBeep={playBeep}
            />
          )}
        </main>

        {/* Modal de Configuración y Editor */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          workouts={workouts}
          onUpdateWorkout={updateWorkout}
          onUpdateAction={updateAction}
          onAddAction={addAction}
          onDeleteAction={deleteAction}
          onReorderActions={reorderActions}
          onResetToDefault={resetToDefault}
          onExportWorkouts={exportWorkoutsJSON}
          onImportWorkouts={importWorkoutsJSON}
        />
      </div>
    </div>
  );
}

// --- VISTA: CALENDARIO SEMANAL CON DÍA ACTUAL RESALTADO ---
function ScheduleView({ workouts, todayDayOfWeek, todayWorkout, onSelect, onOpenSettings }) {
  return (
    <div className="p-4 pb-20 space-y-4">
      {/* Tarjeta Destacada: Entrenamiento de Hoy */}
      {todayWorkout && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-gray-900 border border-indigo-500/40 p-5 shadow-xl shadow-indigo-950/40">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500 text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Hoy te toca
            </span>
            <span className="text-xs text-indigo-300 font-semibold">
              {todayWorkout.dayName}
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mb-1.5">
            {todayWorkout.title}
          </h2>
          <p className="text-gray-300 text-xs mb-4 line-clamp-2">
            {todayWorkout.summary || 'Entrenamiento del día con progresión gradual y temporizadores.'}
          </p>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1 text-indigo-200">
                <Timer className="w-3.5 h-3.5" /> ~{todayWorkout.durationMinutes || 50} min
              </span>
              <span>·</span>
              <span className="text-indigo-200 font-medium">{todayWorkout.actions.length} ejercicios</span>
            </div>

            <button
              onClick={() => onSelect(todayWorkout)}
              className="min-h-[44px] px-4 bg-white text-gray-950 rounded-xl font-bold text-xs flex items-center gap-1.5 hover:bg-gray-100 transition shadow-lg active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" /> Comenzar
            </button>
          </div>
        </div>
      )}

      {/* Título de la semana */}
      <div className="pt-2 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Programa Semanal</h2>
          <p className="text-gray-400 text-xs">Toca cualquier día para entrenar o ver su estructura.</p>
        </div>
        <button
          onClick={onOpenSettings}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-gray-800 transition"
        >
          Editar
        </button>
      </div>

      {/* Lista de días de la semana */}
      <div className="space-y-2.5">
        {workouts.map((w) => {
          const isToday = w.dayOfWeek === todayDayOfWeek;

          return (
            <button
              key={w.id}
              onClick={() => onSelect(w)}
              className={`w-full text-left rounded-2xl p-4 transition-all duration-200 border flex items-center justify-between gap-3 ${
                isToday
                  ? 'bg-gradient-to-r from-indigo-950/80 to-purple-950/50 border-indigo-500/70 shadow-md shadow-indigo-950/30'
                  : 'bg-gray-800/80 hover:bg-gray-800 border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    isToday ? 'text-indigo-400' : 'text-gray-400'
                  }`}>
                    {w.dayName}
                  </span>
                  {isToday && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 font-bold border border-indigo-500/40">
                      HOY
                    </span>
                  )}
                </div>

                <h3 className={`font-semibold text-sm truncate ${isToday ? 'text-white' : 'text-gray-200'}`}>
                  {w.title}
                </h3>

                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                    w.type === 'Fuerza'
                      ? 'bg-orange-500/20 text-orange-300'
                      : w.type === 'Cardio'
                      ? 'bg-blue-500/20 text-blue-300'
                      : w.type === 'Movilidad'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-purple-500/20 text-purple-300'
                  }`}>
                    {w.type}
                  </span>
                  <span className="text-gray-500 text-xs">·</span>
                  <span className="text-xs text-gray-400 flex items-center">
                    <Timer className="w-3 h-3 mr-1 text-gray-500" />
                    ~{w.durationMinutes || 45}m
                  </span>
                  <span className="text-gray-500 text-xs">·</span>
                  <span className="text-xs text-gray-400">{w.actions.length} pasos</span>
                </div>
              </div>

              <ChevronRight className={`w-5 h-5 shrink-0 ${isToday ? 'text-indigo-400' : 'text-gray-600'}`} />
            </button>
          );
        })}
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

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

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
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
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
        setTimeLeft((prev) => {
          if (prev <= 1) {
            playBeep();
            setTimerRunning(false);
            return 0;
          }
          if (prev <= 4) playBeep();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft, playBeep]);

  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] pb-6 relative justify-between">
      
      {/* Barra de progreso */}
      <div className="w-full bg-gray-800 h-1.5 shrink-0">
        <div
          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Contenedor Central */}
      <div className="p-4 flex-grow flex flex-col items-center justify-center relative">
        
        {/* Número de paso */}
        <span className="text-indigo-400 font-semibold mb-2 flex items-center text-sm">
          {step.type === 'rest' ? <Timer className="w-4 h-4 mr-1" /> : <Activity className="w-4 h-4 mr-1" />}
          Paso {currentStep + 1} de {totalSteps}
        </span>

        {/* Título e instrucción */}
        <h2 className={`text-3xl font-bold text-center mb-4 transition-colors ${
          step.type === 'rest' ? 'text-blue-400' : 'text-white'
        }`}>
          {step.name}
        </h2>
        <p className="text-gray-400 text-center mb-8 px-4 text-lg">
          {step.instruction}
        </p>

        {/* Display Dinámico por Tipo */}
        <div className="w-full max-w-xs flex flex-col items-center justify-center min-h-[200px] mb-8">
          
          {/* BASADO EN TIEMPO O DESCANSO */}
          {(step.type === 'time' || step.type === 'rest') && (
            <div className="text-center w-full">
              <div className={`text-7xl font-mono font-black mb-6 tracking-tighter ${
                timeLeft === 0 ? 'text-gray-600' : step.type === 'rest' ? 'text-blue-400' : 'text-white'
              }`}>
                {formatTime(timeLeft)}
              </div>

              {timeLeft > 0 ? (
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                    timerRunning
                      ? 'bg-gray-800 text-gray-300 border-2 border-gray-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-500'
                  }`}
                >
                  {timerRunning ? <Pause className="w-8 h-8 ml-1" /> : <Play className="w-8 h-8 ml-1" />}
                </button>
              ) : (
                <div className="text-emerald-400 flex items-center justify-center space-x-2 font-bold animate-pulse text-sm">
                  <CheckCircle2 className="w-6 h-6" />
                  <span>¡Tiempo completado!</span>
                </div>
              )}
            </div>
          )}

          {/* BASADO EN REPETICIONES */}
          {step.type === 'reps' && (
            <div className="text-center">
              <div className="text-6xl font-black text-white mb-4">
                {step.reps}
              </div>
              <span className="text-gray-400 uppercase tracking-widest text-sm font-bold">Repeticiones</span>
            </div>
          )}

          {/* AL FALLO */}
          {step.type === 'failure' && (
            <div className="w-full text-center">
              <div className="text-5xl font-black text-orange-500 mb-6 uppercase">
                Al Fallo
              </div>
              <div className="bg-gray-800 p-4 rounded-2xl w-full">
                <label className="block text-gray-400 text-sm mb-2">¿Cuántas lograste? (Opcional)</label>
                <input
                  type="number"
                  className="bg-gray-900 border border-gray-700 text-white text-center text-2xl font-bold rounded-xl w-32 p-3 outline-none focus:border-indigo-500 transition-all"
                  placeholder="0"
                  value={failureReps}
                  onChange={(e) => setFailureReps(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* SÓLO INFORMATIVO */}
          {step.type === 'info' && (
            <div className="w-24 h-24 rounded-full bg-gray-800/50 flex items-center justify-center border-4 border-gray-700 border-dashed text-gray-500">
              <Check className="w-10 h-10" />
            </div>
          )}
        </div>
      </div>

      {/* Controles de Navegación Inferiores */}
      <div className="px-5 flex justify-between items-center space-x-3 shrink-0">
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className={`min-h-[48px] min-w-[48px] rounded-xl flex items-center justify-center transition-colors ${
            currentStep === 0 ? 'text-gray-700 bg-gray-900/40' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
          title="Paso anterior"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onClick={onNext}
          className="flex-grow min-h-[48px] bg-white text-gray-950 px-5 rounded-xl font-bold text-sm flex items-center justify-center hover:bg-gray-200 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          {isLast ? '¡Finalizar Entrenamiento!' : 'Siguiente Paso'}
          {!isLast && <ArrowRight className="w-4 h-4 ml-2" />}
        </button>
      </div>

    </div>
  );
}