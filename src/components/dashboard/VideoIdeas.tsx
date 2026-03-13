import { useState } from 'react';
import { Lightbulb, Sparkles, Save, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useUsageLimit } from '../../hooks/useUsageLimit';
import { UpgradeModal } from '../UpgradeModal';

interface Idea {
  titulo: string;
  descripcion: string;
  gancho: string;
}

export function VideoIdeas() {
  const { user } = useAuth();
  const { usage, showUpgradeModal, setShowUpgradeModal, incrementUsage } = useUsageLimit();
  const [nicho, setNicho] = useState('');
  const [estilo, setEstilo] = useState('');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const generateIdeas = async () => {
    if (!nicho.trim() || !estilo.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    const canProceed = await incrementUsage();
    if (!canProceed) {
      return;
    }

    setLoading(true);
    setError('');
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
          type: 'ideas',
          params: {
            nicho,
            estilo,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Error al generar ideas');
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setIdeas(data.data);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const saveIdeas = async () => {
    if (!user || ideas.length === 0) return;

    try {
      const ideasToSave = ideas.map((idea) => ({
        user_id: user.id,
        nicho,
        estilo,
        idea: `${idea.titulo}\n\n${idea.descripcion}\n\nGancho: ${idea.gancho}`,
      }));

      const { error } = await supabase.from('saved_ideas').insert(ideasToSave);

      if (error) throw error;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar ideas');
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
            <Lightbulb className="w-8 h-8 text-accent" />
            Ideas de Videos
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
        <p className="text-gray-400">Genera ideas virales con inteligencia artificial</p>
      </div>

      <div className="bg-card p-6 rounded-xl border border-gray-800 mb-8">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nicho del canal</label>
            <input
              type="text"
              value={nicho}
              onChange={(e) => setNicho(e.target.value)}
              placeholder="Ej: fitness, cocina, finanzas..."
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-gray-700 rounded-lg focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Estilo del canal</label>
            <input
              type="text"
              value={estilo}
              onChange={(e) => setEstilo(e.target.value)}
              placeholder="Ej: educativo, entretenimiento, motivacional..."
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-gray-700 rounded-lg focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={generateIdeas}
            disabled={loading}
            className="flex-1 md:flex-none bg-accent hover:bg-[#e63562] text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {loading ? 'Generando...' : 'Generar 10 Ideas'}
          </button>

          {ideas.length > 0 && (
            <button
              onClick={saveIdeas}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              {saveSuccess ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {saveSuccess ? 'Guardado' : 'Guardar Ideas'}
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {ideas.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {ideas.map((idea, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-xl border border-gray-800 hover:border-accent transition-colors"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-accent/20 text-accent w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-lg flex-1">{idea.titulo}</h3>
              </div>
              <p className="text-gray-400 mb-4">{idea.descripcion}</p>
              <div className="bg-[#0a0a0f] p-3 rounded-lg border border-gray-800">
                <p className="text-sm text-gray-500 mb-1">Hook sugerido:</p>
                <p className="text-sm text-accent italic">{idea.gancho}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
