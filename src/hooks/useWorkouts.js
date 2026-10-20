import { useState, useEffect, useMemo, useCallback } from 'react';
import { DEFAULT_WORKOUTS } from '../data/defaultWorkouts';

const STORAGE_KEY = 'coach_personal_workouts_v3';

export function useWorkouts() {
  const [workouts, setWorkouts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 7) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading saved workouts:', e);
    }
    return DEFAULT_WORKOUTS;
  });

  // Guardar en localStorage cada vez que cambien las rutinas
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
    } catch (e) {
      console.error('Error saving workouts to localStorage:', e);
    }
  }, [workouts]);

  // Día de la semana actual del sistema (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
  const todayDayOfWeek = useMemo(() => new Date().getDay(), []);

  // Rutina que corresponde exactamente al día de hoy
  const todayWorkout = useMemo(() => {
    return workouts.find(w => w.dayOfWeek === todayDayOfWeek) || workouts[0];
  }, [workouts, todayDayOfWeek]);

  // Ordenar los días empezando por Lunes (1) hasta Domingo (0)
  const sortedWorkouts = useMemo(() => {
    const order = [1, 2, 3, 4, 5, 6, 0];
    return [...workouts].sort((a, b) => {
      return order.indexOf(a.dayOfWeek) - order.indexOf(b.dayOfWeek);
    });
  }, [workouts]);

  // Actualizar una rutina completa
  const updateWorkout = useCallback((workoutId, updatedData) => {
    setWorkouts(prev =>
      prev.map(w => (w.id === workoutId ? { ...w, ...updatedData } : w))
    );
  }, []);

  // Actualizar un ejercicio específico dentro de una rutina
  const updateAction = useCallback((workoutId, actionIndex, newActionData) => {
    setWorkouts(prev =>
      prev.map(w => {
        if (w.id !== workoutId) return w;
        const newActions = [...w.actions];
        newActions[actionIndex] = { ...newActions[actionIndex], ...newActionData };
        return { ...w, actions: newActions };
      })
    );
  }, []);

  // Añadir un nuevo ejercicio a una rutina
  const addAction = useCallback((workoutId, newAction) => {
    setWorkouts(prev =>
      prev.map(w => {
        if (w.id !== workoutId) return w;
        const actionWithId = {
          id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          ...newAction
        };
        return { ...w, actions: [...w.actions, actionWithId] };
      })
    );
  }, []);

  // Eliminar un ejercicio
  const deleteAction = useCallback((workoutId, actionIndex) => {
    setWorkouts(prev =>
      prev.map(w => {
        if (w.id !== workoutId) return w;
        const newActions = w.actions.filter((_, idx) => idx !== actionIndex);
        return { ...w, actions: newActions };
      })
    );
  }, []);

  // Reordenar ejercicios (mover arriba/abajo)
  const reorderActions = useCallback((workoutId, fromIndex, toIndex) => {
    setWorkouts(prev =>
      prev.map(w => {
        if (w.id !== workoutId) return w;
        const newActions = [...w.actions];
        if (toIndex < 0 || toIndex >= newActions.length) return w;
        const [moved] = newActions.splice(fromIndex, 1);
        newActions.splice(toIndex, 0, moved);
        return { ...w, actions: newActions };
      })
    );
  }, []);

  // Restaurar el programa original
  const resetToDefault = useCallback(() => {
    setWorkouts(DEFAULT_WORKOUTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignorar
    }
  }, []);

  // Exportar a archivo JSON descargable
  const exportWorkoutsJSON = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(workouts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `coach_personal_programa_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [workouts]);

  // Importar desde JSON con validación
  const importWorkoutsJSON = useCallback((jsonData) => {
    let parsed = jsonData;
    if (typeof jsonData === 'string') {
      try {
        parsed = JSON.parse(jsonData);
      } catch {
        throw new Error('El archivo no contiene un JSON válido.');
      }
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('El archivo debe contener una lista de rutinas.');
    }

    // Validar estructura básica
    for (const item of parsed) {
      if (!item.id || item.dayOfWeek === undefined || !item.title || !Array.isArray(item.actions)) {
        throw new Error('Formato incompatible: cada rutina debe tener id, dayOfWeek, title y actions.');
      }
    }

    setWorkouts(parsed);
    return { success: true, count: parsed.length };
  }, []);

  return {
    workouts: sortedWorkouts,
    rawWorkouts: workouts,
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
  };
}
