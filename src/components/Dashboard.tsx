import { useState } from 'react';
import { Video, TrendingUp, Lightbulb, FileText, Film, Archive, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ViralVideos } from './dashboard/ViralVideos';
import { VideoIdeas } from './dashboard/VideoIdeas';
import { ViralTitles } from './dashboard/ViralTitles';
import { VideoScripts } from './dashboard/VideoScripts';
import { SavedContent } from './dashboard/SavedContent';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<'viral' | 'ideas' | 'titles' | 'scripts' | 'saved'>('viral');
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onNavigate('landing');
  };

  return (
    <div className="flex h-screen bg-[#0a0a0f]">
      <aside className="w-64 bg-card border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Video className="w-8 h-8 text-accent" />
            <span className="text-xl font-bold">Viralizate con IA</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavButton
            icon={<TrendingUp className="w-5 h-5" />}
            label="Videos Virales"
            active={activeSection === 'viral'}
            onClick={() => setActiveSection('viral')}
          />
          <NavButton
            icon={<Lightbulb className="w-5 h-5" />}
            label="Ideas de Videos"
            active={activeSection === 'ideas'}
            onClick={() => setActiveSection('ideas')}
          />
          <NavButton
            icon={<FileText className="w-5 h-5" />}
            label="Títulos Virales"
            active={activeSection === 'titles'}
            onClick={() => setActiveSection('titles')}
          />
          <NavButton
            icon={<Film className="w-5 h-5" />}
            label="Guiones"
            active={activeSection === 'scripts'}
            onClick={() => setActiveSection('scripts')}
          />
          <NavButton
            icon={<Archive className="w-5 h-5" />}
            label="Guardados"
            active={activeSection === 'saved'}
            onClick={() => setActiveSection('saved')}
          />
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {activeSection === 'viral' && <ViralVideos />}
        {activeSection === 'ideas' && <VideoIdeas />}
        {activeSection === 'titles' && <ViralTitles />}
        {activeSection === 'scripts' && <VideoScripts />}
        {activeSection === 'saved' && <SavedContent />}
      </main>
    </div>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, active, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active
          ? 'bg-accent text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}
