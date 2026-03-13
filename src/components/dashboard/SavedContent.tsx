import { useState, useEffect } from 'react';
import { Archive, Trash2, Calendar, Tag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface SavedIdea {
  id: string;
  nicho: string;
  estilo: string;
  idea: string;
  created_at: string;
}

interface SavedTitle {
  id: string;
  nicho: string;
  estilo_video: string;
  titulo: string;
  created_at: string;
}

interface SavedScript {
  id: string;
  titulo: string;
  duracion: string;
  tono: string;
  contenido: string;
  created_at: string;
}

export function SavedContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'ideas' | 'titles' | 'scripts'>('ideas');
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);
  const [titles, setTitles] = useState<SavedTitle[]>([]);
  const [scripts, setScripts] = useState<SavedScript[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedContent();
  }, [activeTab]);

  const loadSavedContent = async () => {
    if (!user) return;

    setLoading(true);
    try {
      if (activeTab === 'ideas') {
        const { data, error } = await supabase
          .from('saved_ideas')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setIdeas(data || []);
      } else if (activeTab === 'titles') {
        const { data, error } = await supabase
          .from('saved_titles')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTitles(data || []);
      } else if (activeTab === 'scripts') {
        const { data, error } = await supabase
          .from('saved_scripts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setScripts(data || []);
      }
    } catch (err) {
      console.error('Error loading saved content:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteIdea = async (id: string) => {
    try {
      const { error } = await supabase.from('saved_ideas').delete().eq('id', id);
      if (error) throw error;
      setIdeas(ideas.filter((idea) => idea.id !== id));
    } catch (err) {
      console.error('Error deleting idea:', err);
    }
  };

  const deleteTitle = async (id: string) => {
    try {
      const { error } = await supabase.from('saved_titles').delete().eq('id', id);
      if (error) throw error;
      setTitles(titles.filter((title) => title.id !== id));
    } catch (err) {
      console.error('Error deleting title:', err);
    }
  };

  const deleteScript = async (id: string) => {
    try {
      const { error } = await supabase.from('saved_scripts').delete().eq('id', id);
      if (error) throw error;
      setScripts(scripts.filter((script) => script.id !== id));
    } catch (err) {
      console.error('Error deleting script:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Archive className="w-8 h-8 text-accent" />
          Contenido Guardado
        </h1>
        <p className="text-gray-400">Tus ideas, títulos y guiones guardados</p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('ideas')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'ideas'
              ? 'text-accent border-b-2 border-accent'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Ideas ({ideas.length})
        </button>
        <button
          onClick={() => setActiveTab('titles')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'titles'
              ? 'text-accent border-b-2 border-accent'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Títulos ({titles.length})
        </button>
        <button
          onClick={() => setActiveTab('scripts')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'scripts'
              ? 'text-accent border-b-2 border-accent'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Guiones ({scripts.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando...</div>
      ) : (
        <>
          {activeTab === 'ideas' && (
            <div className="space-y-4">
              {ideas.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  No tienes ideas guardadas aún
                </div>
              ) : (
                ideas.map((idea) => (
                  <div
                    key={idea.id}
                    className="bg-card p-6 rounded-xl border border-gray-800 hover:border-accent transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <Tag className="w-5 h-5 text-accent" />
                        <div>
                          <span className="text-sm text-gray-400">Nicho:</span>
                          <span className="ml-2 font-semibold">{idea.nicho}</span>
                          <span className="mx-3 text-gray-600">|</span>
                          <span className="text-sm text-gray-400">Estilo:</span>
                          <span className="ml-2 font-semibold">{idea.estilo}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteIdea(idea.id)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg border border-gray-800">
                      <p className="text-gray-300 whitespace-pre-wrap">{idea.idea}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(idea.created_at)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'titles' && (
            <div className="space-y-4">
              {titles.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  No tienes títulos guardados aún
                </div>
              ) : (
                titles.map((title) => (
                  <div
                    key={title.id}
                    className="bg-card p-6 rounded-xl border border-gray-800 hover:border-accent transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <Tag className="w-5 h-5 text-accent" />
                        <div>
                          <span className="text-sm text-gray-400">Nicho:</span>
                          <span className="ml-2 font-semibold">{title.nicho}</span>
                          <span className="mx-3 text-gray-600">|</span>
                          <span className="text-sm text-gray-400">Estilo:</span>
                          <span className="ml-2 font-semibold">{title.estilo_video}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTitle(title.id)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg border border-gray-800">
                      <p className="text-lg font-semibold text-white">{title.titulo}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(title.created_at)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'scripts' && (
            <div className="space-y-4">
              {scripts.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  No tienes guiones guardados aún
                </div>
              ) : (
                scripts.map((script) => (
                  <div
                    key={script.id}
                    className="bg-card p-6 rounded-xl border border-gray-800 hover:border-accent transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{script.titulo}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Tag className="w-4 h-4" />
                          Duración: {script.duracion}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteScript(script.id)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg border border-gray-800">
                      <p className="text-gray-300 whitespace-pre-wrap">{script.contenido}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(script.created_at)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
