import { useState } from 'react';
import { Search, ExternalLink, TrendingUp, Eye, ThumbsUp, Calendar } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  viewCount: number;
  likeCount: number;
  publishedAt: string;
  outlierScore: number;
}

export function ViralVideos() {
  const [nicho, setNicho] = useState('');
  const [period, setPeriod] = useState('7');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchVideos = async () => {
    if (!nicho.trim()) {
      setError('Por favor ingresa un nicho');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(period));
      const publishedAfter = daysAgo.toISOString();

      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          nicho
        )}&type=video&order=viewCount&publishedAfter=${publishedAfter}&maxResults=12&key=${apiKey}`
      );

      if (!searchResponse.ok) {
        throw new Error('Error al buscar videos');
      }

      const searchData = await searchResponse.json();
      const videoIds = searchData.items.map((item: { id: { videoId: string } }) => item.id.videoId).join(',');

      const statsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${apiKey}`
      );

      if (!statsResponse.ok) {
        throw new Error('Error al obtener estadísticas');
      }

      const statsData = await statsResponse.json();

      const processedVideos: Video[] = statsData.items.map((item: {
        id: string;
        snippet: {
          title: string;
          channelTitle: string;
          thumbnails: { high: { url: string } };
          publishedAt: string;
        };
        statistics: {
          viewCount: string;
          likeCount: string;
        };
      }) => {
        const publishDate = new Date(item.snippet.publishedAt);
        const daysSince = Math.max(1, Math.floor((Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24)));
        const views = parseInt(item.statistics.viewCount);
        const outlierScore = parseFloat((views / daysSince / 1000).toFixed(1));

        return {
          id: item.id,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          thumbnailUrl: item.snippet.thumbnails.high.url,
          viewCount: views,
          likeCount: parseInt(item.statistics.likeCount || '0'),
          publishedAt: item.snippet.publishedAt,
          outlierScore,
        };
      });

      processedVideos.sort((a, b) => b.outlierScore - a.outlierScore);
      setVideos(processedVideos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
    return `Hace ${Math.floor(days / 30)} meses`;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-accent" />
          Videos Virales
        </h1>
        <p className="text-gray-400">Descubre qué videos están explotando en tu nicho</p>
      </div>

      <div className="bg-card p-6 rounded-xl border border-gray-800 mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Nicho</label>
            <input
              type="text"
              value={nicho}
              onChange={(e) => setNicho(e.target.value)}
              placeholder="Ej: fitness, cocina, finanzas..."
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-gray-700 rounded-lg focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Período</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-gray-700 rounded-lg focus:outline-none focus:border-accent transition-colors"
            >
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
              <option value="90">Últimos 90 días</option>
            </select>
          </div>
        </div>

        <button
          onClick={searchVideos}
          disabled={loading}
          className="mt-4 w-full md:w-auto bg-accent hover:bg-[#e63562] text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Search className="w-5 h-5" />
          {loading ? 'Buscando...' : 'Buscar Videos Virales'}
        </button>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {videos.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-card rounded-xl border border-gray-800 overflow-hidden hover:border-accent transition-colors cursor-pointer group"
              onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
            >
              <div className="relative">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute top-2 right-2 bg-accent px-2 py-1 rounded text-xs font-bold">
                  Score: {video.outlierScore}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-400 mb-3">{video.channelTitle}</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {formatNumber(video.viewCount)}
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {formatNumber(video.likeCount)}
                  </div>
                  <div className="flex items-center gap-1 col-span-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(video.publishedAt)}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-center gap-2 text-sm text-accent">
                  <ExternalLink className="w-4 h-4" />
                  <span>Ver en YouTube</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
