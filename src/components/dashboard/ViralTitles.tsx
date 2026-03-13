import { useState } from 'react';
import { FileText, Sparkles, Copy, Check } from 'lucide-react';
import { useUsageLimit } from '../../hooks/useUsageLimit';
import { UpgradeModal } from '../UpgradeModal';

interface Title {
  titulo: string;
  score: number;
}

export function ViralTitles() {
  const { usage, showUpgradeModal, setShowUpgradeModal, incrementUsage } = useUsageLimit();
  const [tema, setTema] = useState('');
  const [estiloTitulo, setEstiloTitulo] = useState('Curioso');
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateTitles = async () => {
    if (!tema.trim()) {
      setError('Por favor ingresa un tema para el video');
      return;
    }

    const canProceed = await incrementUsage();
    if (!canProceed) {
      return;
    }

    setLoading(true);
    setError('');

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
          type: 'titles',
          params: {
            tema,
            estiloTitulo,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Error al generar títulos');
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setTitles(data.data);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-green-500/20 border-green-500';
    if (score >= 6) return 'bg-yellow-500/20 border-yellow-500';
    return 'bg-orange-500/20 border-orange-500';
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
            <FileText className="w-8 h-8 text-accent" />
            Títulos Virales
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
        <p className="text-gray-400">Genera títulos optimizados para maximizar tu CTR</p>
      </div>

      <div className="bg-card p-6 rounded-xl border border-gray-800 mb-8">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tema del video</label>
            <input
              type="text"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Ej: Cómo ganar dinero desde casa..."
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-gray-700 rounded-lg focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Estilo del título</label>
            <select
              value={estiloTitulo}
              onChange={(e) => setEstiloTitulo(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-gray-700 rounded-lg focus:outline-none focus:border-accent transition-colors"
            >
              <option value="Curioso">Curioso</option>
              <option value="Controversial">Controversial</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Lista">Lista</option>
            </select>
          </div>
        </div>

        <button
          onClick={generateTitles}
          disabled={loading}
          className="w-full md:w-auto bg-accent hover:bg-[#e63562] text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          {loading ? 'Generando...' : 'Generar 10 Títulos'}
        </button>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {titles.length > 0 && (
        <div className="space-y-4">
          {titles.map((title, index) => (
            <div
              key={index}
              className="bg-card p-5 rounded-xl border border-gray-800 hover:border-accent transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className={`${getScoreBg(title.score)} px-3 py-2 rounded-lg border flex-shrink-0`}>
                  <div className="text-xs text-gray-400 mb-1">Score</div>
                  <div className={`text-2xl font-bold ${getScoreColor(title.score)}`}>
                    {title.score}/10
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-medium mb-3">{title.titulo}</p>
                  <button
                    onClick={() => copyToClipboard(title.titulo, index)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-green-500">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar título</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
