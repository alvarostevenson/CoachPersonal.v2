import { useState, useRef } from 'react';
import { X, Download, Upload, RotateCcw, Smartphone, Sliders, Check, AlertCircle, Copy, ClipboardPaste } from 'lucide-react';
import RoutineEditor from './RoutineEditor';
import { usePWAInstall } from '../hooks/usePWAInstall';

export default function SettingsModal({
  isOpen,
  onClose,
  workouts,
  onUpdateWorkout,
  onUpdateAction,
  onAddAction,
  onDeleteAction,
  onReorderActions,
  onResetToDefault,
  onExportWorkouts,
  onImportWorkouts
}) {
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'backup' | 'pwa'
  const [importStatus, setImportStatus] = useState(null); // { type: 'success'|'error', message: string }
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [manualJsonText, setManualJsonText] = useState('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const fileInputRef = useRef(null);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        const result = onImportWorkouts(content);
        setImportStatus({
          type: 'success',
          message: `¡Programa importado con éxito! Se cargaron ${result.count} rutinas.`
        });
      } catch (err) {
        setImportStatus({
          type: 'error',
          message: err.message || 'Error al procesar el archivo JSON.'
        });
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  const handleManualImport = () => {
    if (!manualJsonText.trim()) return;
    try {
      const result = onImportWorkouts(manualJsonText);
      setImportStatus({
        type: 'success',
        message: `¡Importación completada! ${result.count} rutinas cargadas.`
      });
      setManualJsonText('');
    } catch (err) {
      setImportStatus({
        type: 'error',
        message: err.message || 'JSON no válido.'
      });
    }
  };

  const handleCopyCurrentJSON = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(workouts, null, 2));
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cabecera del modal */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Configuración del Programa</h2>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas de navegación */}
        <div className="grid grid-cols-3 border-b border-gray-800 text-xs font-semibold shrink-0 bg-gray-950/50">
          <button
            onClick={() => { setActiveTab('editor'); setImportStatus(null); }}
            className={`min-h-[44px] py-2.5 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'editor'
                ? 'text-indigo-400 border-b-2 border-indigo-500 bg-gray-800/40'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Editar Rutinas</span>
          </button>

          <button
            onClick={() => { setActiveTab('backup'); setImportStatus(null); }}
            className={`min-h-[44px] py-2.5 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'backup'
                ? 'text-indigo-400 border-b-2 border-indigo-500 bg-gray-800/40'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Respaldo JSON</span>
          </button>

          <button
            onClick={() => { setActiveTab('pwa'); setImportStatus(null); }}
            className={`min-h-[44px] py-2.5 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'pwa'
                ? 'text-indigo-400 border-b-2 border-indigo-500 bg-gray-800/40'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Instalar PWA</span>
          </button>
        </div>

        {/* Contenido según pestaña */}
        <div className="p-4 overflow-y-auto flex-grow">
          {activeTab === 'editor' && (
            <RoutineEditor
              workouts={workouts}
              onUpdateWorkout={onUpdateWorkout}
              onUpdateAction={onUpdateAction}
              onAddAction={onAddAction}
              onDeleteAction={onDeleteAction}
              onReorderActions={onReorderActions}
            />
          )}

          {activeTab === 'backup' && (
            <div className="space-y-6">
              {/* Notificación de resultado de importación */}
              {importStatus && (
                <div className={`p-3 rounded-xl flex items-center gap-2.5 text-xs font-medium ${
                  importStatus.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/10 border border-red-500/30 text-red-300'
                }`}>
                  {importStatus.type === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <span>{importStatus.message}</span>
                </div>
              )}

              {/* Sección Exportar */}
              <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-bold text-sm text-white">Exportar Programa Completo</h3>
                </div>
                <p className="text-xs text-gray-400">
                  Descarga tus 7 días de entrenamiento personalizados en un archivo JSON para tener copia de seguridad o transferirlo a otro dispositivo.
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={onExportWorkouts}
                    className="flex-1 min-h-[44px] bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition shadow-md"
                  >
                    <Download className="w-4 h-4" /> Descargar archivo .json
                  </button>
                  <button
                    onClick={handleCopyCurrentJSON}
                    className="min-h-[44px] px-3.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition border border-gray-700"
                    title="Copiar texto JSON al portapapeles"
                  >
                    {copiedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedSuccess ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* Sección Importar */}
              <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-purple-400" />
                  <h3 className="font-bold text-sm text-white">Importar Programa</h3>
                </div>
                <p className="text-xs text-gray-400">
                  Sube un archivo de programa previo o pega el contenido JSON para restaurar tus rutinas.
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".json,application/json"
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full min-h-[44px] bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition shadow-md"
                >
                  <Upload className="w-4 h-4" /> Seleccionar archivo JSON
                </button>

                {/* Opción alternativa de texto manual */}
                <div className="pt-2">
                  <label className="text-[11px] text-gray-400 block mb-1">O pegar JSON directamente:</label>
                  <textarea
                    rows={3}
                    value={manualJsonText}
                    onChange={(e) => setManualJsonText(e.target.value)}
                    placeholder='[{"id": "lunes", "dayOfWeek": 1, ...}]'
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs font-mono text-gray-300 outline-none focus:border-purple-500"
                  />
                  {manualJsonText.trim() && (
                    <button
                      onClick={handleManualImport}
                      className="mt-2 w-full min-h-[40px] bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <ClipboardPaste className="w-3.5 h-3.5" /> Aplicar JSON Pegado
                    </button>
                  )}
                </div>
              </div>

              {/* Botón de Restaurar a valores de fábrica */}
              <div className="pt-2 border-t border-gray-800">
                {showResetConfirm ? (
                  <div className="bg-red-950/30 border border-red-800/50 rounded-2xl p-3.5 space-y-2">
                    <p className="text-xs text-red-200 font-semibold">
                      ¿Seguro que deseas restablecer el programa predeterminado? Se borrarán tus ediciones locales.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onResetToDefault();
                          setShowResetConfirm(false);
                          setImportStatus({ type: 'success', message: 'Se ha restaurado el programa por defecto.' });
                        }}
                        className="flex-1 min-h-[40px] bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition"
                      >
                        Sí, restaurar todo
                      </button>
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        className="flex-1 min-h-[40px] bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-xl transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full min-h-[44px] text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition"
                  >
                    <RotateCcw className="w-4 h-4" /> Restaurar programa original de fábrica
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-4 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <Smartphone className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-base text-white">Instalar Coach Personal</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Usa la aplicación a pantalla completa, sin barras del navegador y con acceso offline inmediato desde tu pantalla de inicio.
                </p>

                {isInstalled && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Ya estás usando la app instalada
                  </div>
                )}

                {isInstallable && (
                  <button
                    onClick={install}
                    className="w-full min-h-[48px] bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-900/30"
                  >
                    <Smartphone className="w-5 h-5" /> Instalar en este dispositivo
                  </button>
                )}

                {isIOS && !isInstalled && (
                  <div className="text-left bg-gray-900/90 border border-gray-800 p-3.5 rounded-xl space-y-2 text-xs text-gray-300">
                    <p className="font-semibold text-white">Cómo instalar en iPhone / iPad (Safari):</p>
                    <ol className="list-decimal list-inside space-y-1.5 text-gray-400">
                      <li>Toca el botón <strong>Compartir</strong> (icono de cuadrado con flecha hacia arriba) en la barra de Safari.</li>
                      <li>Baja por las opciones y selecciona <strong>Agregar al inicio</strong>.</li>
                      <li>Confirma pulsando <strong>Agregar</strong> en la esquina superior derecha.</li>
                    </ol>
                  </div>
                )}

                {!isInstallable && !isIOS && !isInstalled && (
                  <div className="text-xs text-gray-400 bg-gray-900/50 p-3 rounded-xl">
                    Para instalarla, abre el menú de opciones de tu navegador (los tres puntos verticales) y pulsa <strong>Instalar aplicación</strong> o <strong>Añadir a pantalla de inicio</strong>.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
