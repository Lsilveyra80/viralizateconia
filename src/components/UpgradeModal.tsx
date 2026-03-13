import { X, Zap, Check } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  remainingUses?: number;
}

export function UpgradeModal({ isOpen, onClose, remainingUses = 0 }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl max-w-2xl w-full border border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-purple-600"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-4">
              <Zap className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {remainingUses === 0 ? 'Has alcanzado el límite diario' : 'Actualiza a Premium'}
            </h2>
            <p className="text-gray-400 text-lg">
              {remainingUses === 0
                ? 'Actualiza a Premium para continuar creando contenido viral'
                : `Te quedan ${remainingUses} generaciones hoy. Actualiza para acceso ilimitado.`}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#0a0a0f] p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-bold mb-4">Plan Free</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-gray-500 mt-0.5" />
                  <span className="text-gray-400">5 generaciones diarias</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-gray-500 mt-0.5" />
                  <span className="text-gray-400">Acceso a tendencias</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-gray-500 mt-0.5" />
                  <span className="text-gray-400">Guardar contenido</span>
                </div>
              </div>
              <div className="text-3xl font-bold">$0</div>
            </div>

            <div className="bg-gradient-to-br from-accent/20 to-purple-600/20 p-6 rounded-xl border border-accent relative">
              <div className="absolute top-3 right-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                RECOMENDADO
              </div>
              <h3 className="text-xl font-bold mb-4">Plan Premium</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent mt-0.5" />
                  <span className="text-white font-medium">Generaciones ilimitadas</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent mt-0.5" />
                  <span className="text-white font-medium">Análisis avanzado de tendencias</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent mt-0.5" />
                  <span className="text-white font-medium">Exportar en múltiples formatos</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent mt-0.5" />
                  <span className="text-white font-medium">Soporte prioritario</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">$19</span>
                <span className="text-gray-400">/mes</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors font-semibold"
            >
              Continuar con Free
            </button>
            <button className="flex-1 px-6 py-3 rounded-lg bg-accent hover:bg-accent/90 transition-colors font-semibold flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              Actualizar a Premium
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            El límite se reinicia diariamente a las 00:00 UTC
          </p>
        </div>
      </div>
    </div>
  );
}
