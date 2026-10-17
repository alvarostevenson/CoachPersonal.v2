import { useState } from 'react';
import { ArrowUp, ArrowDown, Trash2, Plus, Edit2, Check, X, Clock, Dumbbell, Flame } from 'lucide-react';

export default function RoutineEditor({
  workouts,
  onUpdateWorkout,
  onUpdateAction,
  onAddAction,
  onDeleteAction,
  onReorderActions
}) {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(workouts[0]?.id || 'lunes');
  const [editingActionIndex, setEditingActionIndex] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const activeWorkout = workouts.find(w => w.id === selectedWorkoutId) || workouts[0];

  // Estado temporal para editar un ejercicio existente
  const [actionFormData, setActionFormData] = useState({
    name: '',
    type: 'reps',
    instruction: '',
    reps: 15,
    duration: 60
  });

  const handleStartEdit = (action, index) => {
    setEditingActionIndex(index);
    setActionFormData({
      name: action.name || '',
      type: action.type || 'reps',
      instruction: action.instruction || '',
      reps: action.reps || 15,
      duration: action.duration || 60
    });
  };

  const handleSaveEdit = (index) => {
    const payload = {
      name: actionFormData.name.trim() || 'Ejercicio',
      type: actionFormData.type,
      instruction: actionFormData.instruction.trim()
    };
    if (actionFormData.type === 'reps') {
      payload.reps = Number(actionFormData.reps) || 12;
    } else if (actionFormData.type === 'failure') {
      payload.reps = 'Al fallo';
    } else if (actionFormData.type === 'time' || actionFormData.type === 'rest') {
      payload.duration = Number(actionFormData.duration) || 60;
    }
    onUpdateAction(activeWorkout.id, index, payload);
    setEditingActionIndex(null);
  };

  const handleSaveNew = () => {
    const payload = {
      name: actionFormData.name.trim() || 'Nuevo Ejercicio',
      type: actionFormData.type,
      instruction: actionFormData.instruction.trim()
    };
    if (actionFormData.type === 'reps') {
      payload.reps = Number(actionFormData.reps) || 12;
    } else if (actionFormData.type === 'failure') {
      payload.reps = 'Al fallo';
    } else if (actionFormData.type === 'time' || actionFormData.type === 'rest') {
      payload.duration = Number(actionFormData.duration) || 60;
    }
    onAddAction(activeWorkout.id, payload);
    setIsAddingNew(false);
    setActionFormData({ name: '', type: 'reps', instruction: '', reps: 15, duration: 60 });
  };

  return (
    <div className="space-y-4">
      {/* Selector de días horizontal */}
      <div>
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
          Selecciona el día a editar
        </label>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {workouts.map(w => {
            const isSelected = w.id === activeWorkout.id;
            return (
              <button
                key={w.id}
                onClick={() => {
                  setSelectedWorkoutId(w.id);
                  setEditingActionIndex(null);
                  setIsAddingNew(false);
                }}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-900/30'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>{w.dayName}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-indigo-800/80 text-indigo-100' : 'bg-gray-700/80 text-gray-400'
                }`}>
                  {w.actions.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Encabezado del día seleccionado */}
      <div className="bg-gray-800/70 border border-gray-700/60 rounded-2xl p-3.5">
        <div className="flex items-center justify-between mb-2">
          <input
            type="text"
            value={activeWorkout.title}
            onChange={(e) => onUpdateWorkout(activeWorkout.id, { title: e.target.value })}
            className="bg-transparent font-bold text-white text-base outline-none focus:border-b focus:border-indigo-400 w-full"
            placeholder="Título de la rutina"
          />
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 shrink-0 ml-2">
            {activeWorkout.type}
          </span>
        </div>
        <input
          type="text"
          value={activeWorkout.summary || ''}
          onChange={(e) => onUpdateWorkout(activeWorkout.id, { summary: e.target.value })}
          className="bg-transparent text-xs text-gray-400 outline-none focus:border-b focus:border-indigo-400/50 w-full"
          placeholder="Descripción o enfoque del día..."
        />
      </div>

      {/* Lista de pasos / ejercicios */}
      <div className="space-y-2 max-h-[48vh] overflow-y-auto pr-1">
        {activeWorkout.actions.map((action, idx) => {
          const isEditing = editingActionIndex === idx;

          if (isEditing) {
            return (
              <div key={action.id || idx} className="bg-gray-800 border-2 border-indigo-500/80 rounded-2xl p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-indigo-400">Editando Paso {idx + 1}</span>
                  <button
                    onClick={() => setEditingActionIndex(null)}
                    className="min-h-[36px] min-w-[36px] flex items-center justify-center text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Nombre</label>
                  <input
                    type="text"
                    value={actionFormData.name}
                    onChange={(e) => setActionFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm text-white outline-none focus:border-indigo-500"
                    placeholder="Ej. Sentadillas con Salto"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Tipo</label>
                    <select
                      value={actionFormData.type}
                      onChange={(e) => setActionFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    >
                      <option value="reps">Por Repeticiones</option>
                      <option value="failure">Al Fallo Muscular</option>
                      <option value="time">Por Tiempo (segundos)</option>
                      <option value="rest">Descanso (segundos)</option>
                      <option value="info">Instrucción / Info</option>
                    </select>
                  </div>

                  <div>
                    {actionFormData.type === 'reps' && (
                      <>
                        <label className="text-[11px] text-gray-400 block mb-1">Reps objetivo</label>
                        <input
                          type="number"
                          value={actionFormData.reps}
                          onChange={(e) => setActionFormData(prev => ({ ...prev, reps: e.target.value }))}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm text-white outline-none focus:border-indigo-500"
                        />
                      </>
                    )}
                    {(actionFormData.type === 'time' || actionFormData.type === 'rest') && (
                      <>
                        <label className="text-[11px] text-gray-400 block mb-1">Duración (segundos)</label>
                        <input
                          type="number"
                          value={actionFormData.duration}
                          onChange={(e) => setActionFormData(prev => ({ ...prev, duration: e.target.value }))}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm text-white outline-none focus:border-indigo-500"
                        />
                      </>
                    )}
                    {actionFormData.type === 'failure' && (
                      <div className="flex items-center h-full pt-4 text-xs font-semibold text-orange-400">
                        <Flame className="w-4 h-4 mr-1" /> Sin límite fijo
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Instrucción o técnica</label>
                  <textarea
                    rows={2}
                    value={actionFormData.instruction}
                    onChange={(e) => setActionFormData(prev => ({ ...prev, instruction: e.target.value }))}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                    placeholder="Detalla postura, ritmo o respiración..."
                  />
                </div>

                <button
                  onClick={() => handleSaveEdit(idx)}
                  className="w-full min-h-[44px] bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Check className="w-4 h-4" /> Guardar cambios
                </button>
              </div>
            );
          }

          return (
            <div
              key={action.id || idx}
              className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition ${
                action.type === 'rest'
                  ? 'bg-blue-950/20 border-blue-900/40 text-blue-200'
                  : 'bg-gray-800/80 border-gray-700/60 text-gray-200'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-gray-400 w-5">#{idx + 1}</span>
                  <span className="font-semibold text-sm text-white truncate">{action.name}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                  {action.type === 'reps' && (
                    <span className="flex items-center text-indigo-300">
                      <Dumbbell className="w-3 h-3 mr-1" /> {action.reps} reps
                    </span>
                  )}
                  {action.type === 'failure' && (
                    <span className="flex items-center text-orange-400 font-medium">
                      <Flame className="w-3 h-3 mr-1" /> Al fallo
                    </span>
                  )}
                  {(action.type === 'time' || action.type === 'rest') && (
                    <span className="flex items-center text-blue-300">
                      <Clock className="w-3 h-3 mr-1" /> {action.duration}s
                    </span>
                  )}
                  {action.instruction && (
                    <span className="truncate max-w-[150px] text-gray-400">· {action.instruction}</span>
                  )}
                </div>
              </div>

              {/* Botones de acción rápida: reordenar, editar, eliminar */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  disabled={idx === 0}
                  onClick={() => onReorderActions(activeWorkout.id, idx, idx - 1)}
                  className={`min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg ${
                    idx === 0 ? 'text-gray-600' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                  title="Subir paso"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  disabled={idx === activeWorkout.actions.length - 1}
                  onClick={() => onReorderActions(activeWorkout.id, idx, idx + 1)}
                  className={`min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg ${
                    idx === activeWorkout.actions.length - 1 ? 'text-gray-600' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                  title="Bajar paso"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleStartEdit(action, idx)}
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-gray-400 hover:text-indigo-300 hover:bg-gray-700"
                  title="Editar"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteAction(activeWorkout.id, idx)}
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                  title="Eliminar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Formulario para añadir nuevo ejercicio */}
      {isAddingNew ? (
        <div className="bg-gray-800/95 border-2 border-dashed border-indigo-500/70 rounded-2xl p-3.5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-indigo-300">Nuevo Ejercicio al final</span>
            <button
              onClick={() => setIsAddingNew(false)}
              className="min-h-[36px] min-w-[36px] flex items-center justify-center text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="text-[11px] text-gray-400 block mb-1">Nombre</label>
            <input
              type="text"
              value={actionFormData.name}
              onChange={(e) => setActionFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm text-white outline-none focus:border-indigo-500"
              placeholder="Ej. Dominadas o Salto a la cuerda"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">Tipo</label>
              <select
                value={actionFormData.type}
                onChange={(e) => setActionFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
              >
                <option value="reps">Por Repeticiones</option>
                <option value="failure">Al Fallo Muscular</option>
                <option value="time">Por Tiempo (segundos)</option>
                <option value="rest">Descanso (segundos)</option>
                <option value="info">Instrucción / Info</option>
              </select>
            </div>

            <div>
              {actionFormData.type === 'reps' && (
                <>
                  <label className="text-[11px] text-gray-400 block mb-1">Reps objetivo</label>
                  <input
                    type="number"
                    value={actionFormData.reps}
                    onChange={(e) => setActionFormData(prev => ({ ...prev, reps: e.target.value }))}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm text-white outline-none focus:border-indigo-500"
                  />
                </>
              )}
              {(actionFormData.type === 'time' || actionFormData.type === 'rest') && (
                <>
                  <label className="text-[11px] text-gray-400 block mb-1">Duración (segundos)</label>
                  <input
                    type="number"
                    value={actionFormData.duration}
                    onChange={(e) => setActionFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm text-white outline-none focus:border-indigo-500"
                  />
                </>
              )}
            </div>
          </div>

          <div>
            <label className="text-[11px] text-gray-400 block mb-1">Instrucción</label>
            <input
              type="text"
              value={actionFormData.instruction}
              onChange={(e) => setActionFormData(prev => ({ ...prev, instruction: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
              placeholder="Ej. Baja lento y cuida la postura..."
            />
          </div>

          <button
            onClick={handleSaveNew}
            className="w-full min-h-[44px] bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" /> Agregar a {activeWorkout.dayName}
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            setIsAddingNew(true);
            setEditingActionIndex(null);
            setActionFormData({ name: '', type: 'reps', instruction: '', reps: 15, duration: 60 });
          }}
          className="w-full min-h-[44px] py-2.5 border border-dashed border-gray-700 hover:border-indigo-500 text-gray-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition bg-gray-800/40"
        >
          <Plus className="w-4 h-4" /> Añadir ejercicio a {activeWorkout.dayName}
        </button>
      )}
    </div>
  );
}
