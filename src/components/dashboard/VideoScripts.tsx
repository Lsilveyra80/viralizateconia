import { useState } from 'react';
import { Film, Sparkles, Copy, Save, Check, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useUsageLimit } from '../../hooks/useUsageLimit';
import { UpgradeModal } from '../UpgradeModal';

interface Script {
  hook: string;
  introduccion: string;
  desarrollo: string;
  conclusion: string;
  cta: string;
}

export function VideoScripts() {
  const { user } = useAuth();
  const { usage, showUpgradeModal, setShowUpgradeModal, incrementUsage } = useUsageLimit();
  const [titulo, setTitulo] = useState('');
  const [duracion, setDuracion] = useState('10 min');
  const [tono, setTono] = useState('Educativo');
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const generateScript = async () => {
    if (!titulo.trim()) {
      setError('Por favor ingresa un título para el video');
      return;
    }

    const canProceed = await incrementUsage();
    if (!canProceed) {
      return;
    }

    setLoading(true);
    setError('');
    setCopied(false);
    setSaveSuccess(false);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/ai-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          type: 'script',
          params: {
            titulo,
            duracion,
            tono,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Error al generar guión');
      }

      const data = await response.json();
      if (data.success && data.data) {
        setScript(data.data);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const copyScript = async () => {
    if (!script) return;

    const fullScript = `
HOOK (Primeros 30 segundos)
${script.hook}

INTRODUCCIÓN
${script.introduccion}

DESARROLLO
${script.desarrollo}

CONCLUSIÓN
${script.conclusion}

LLAMADO A LA ACCIÓN
${script.cta}
    `.trim();

    try {
      await navigator.clipboard.writeText(fullScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const saveScript = async () => {
    if (!user || !script) return;

    try {
      const contenido = `HOOK: ${script.hook}\n\nINTRODUCCIÓN: ${script.introduccion}\n\nDESARROLLO: ${script.desarrollo}\n\nCONCLUSIÓN: ${script.conclusion}\n\nCTA: ${script.cta}`;

      const { error } = await supabase.from('saved_scripts').insert({
        user_id: user.id,
        titulo,
        duracion,
        tono,
        contenido,
      });

      if (error) throw error;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar guión');
    }
  };

  return (
    <div className="p-8">
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        remainingUses={usage?.remaining || 0}
      />

      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Film className="w-8 h-8 text-accent" />
            Guiones de Video
          </h1>
          {usage && usage.plan === 'free' && (
            <div className="bg-card border border-gray-800 rounded-lg px-4 py-2">
              <p className="text-sm text-gray-400">
                Generaciones hoy:{' '}
                <span className={`font-bold ${usage.remaining === 0 ? 'text-red-500' : 'text-accent'}`}>
                  {usage.daily_searches}/5
                </span>
              </p>
            </div>
          )}
        </div>
        <p className="text-gray-400">Crea guiones completos y profesionales con IA</p>
      </div>

      <div className="bg-card p-6 rounded-xl border border-gray-800 mb-8">
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Título del video</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Cómo ganar $10,000 al mes con YouTube"
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-gray-700 rounded-lg focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Duración deseada</label>
              <select
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a0f] border border-gray-700 rounded-lg focus:outline-none focus:border-accent transition-colors"
              >
                <option value="5 min">5 minutos</option>
                <option value="10 min">10 minutos</option>
                <option value="15 min">15 minutos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tono del video</label>
              <select
                value={tono}
                onChange={(e) => setTono(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a0f] border border-gray-700 rounded-lg focus:outline-none focus:border-accent transition-colors"
              >
                <option value="Educativo">Educativo</option>
                <option value="Entretenido">Entretenido</option>
                <option value="Inspiracional">Inspiracional</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={generateScript}
          disabled={loading}
          className="w-full md:w-auto bg-accent hover:bg-[#e63562] text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          {loading ? 'Creando guión...' : 'Crear Guión Completo'}
        </button>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {script && (
        <div className="space-y-6">
          <div className="flex gap-3">
            <button
              onClick={copyScript}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-green-500">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copiar guión</span>
                </>
              )}
            </button>
            <button
              onClick={saveScript}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Guardado</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Guardar en biblioteca</span>
                </>
              )}
            </button>
          </div>

          <ScriptSection
            title="HOOK (Primeros 30 segundos)"
            content={script.hook}
            accent="text-accent"
          />
          <ScriptSection
            title="INTRODUCCIÓN"
            content={script.introduccion}
          />
          <ScriptSection
            title="DESARROLLO"
            content={script.desarrollo}
          />
          <ScriptSection
            title="CONCLUSIÓN"
            content={script.conclusion}
          />
          <ScriptSection
            title="LLAMADO A LA ACCIÓN (CTA)"
            content={script.cta}
            accent="text-green-500"
          />
        </div>
      )}
    </div>
  );
}

interface ScriptSectionProps {
  title: string;
  content: string;
  accent?: string;
}

function ScriptSection({ title, content, accent }: ScriptSectionProps) {
  return (
    <div className="bg-card p-6 rounded-xl border border-gray-800">
      <h3 className={`text-lg font-bold mb-4 ${accent || 'text-white'}`}>
        {title}
      </h3>
      <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
        {content}
      </p>
    </div>
  );
}
