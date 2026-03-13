import { Sparkles, TrendingUp, Lightbulb, FileText, Video } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Video className="w-8 h-8 text-accent" />
              <span className="text-2xl font-bold">Viralizate con IA</span>
            </div>
            <button
              onClick={() => onNavigate('auth')}
              className="bg-accent hover:bg-[#e63562] text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </nav>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Crea videos virales con IA
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto">
            La herramienta definitiva para creadores de YouTube. Encuentra tendencias, genera ideas, crea títulos virales y guiones completos con inteligencia artificial.
          </p>
          <button
            onClick={() => onNavigate('auth')}
            className="bg-accent hover:bg-[#e63562] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 inline-flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Comenzar Gratis
          </button>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-[#13131a]/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Todo lo que necesitas para crecer en YouTube
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Videos Virales"
              description="Descubre qué videos están explotando en tu nicho y replica su éxito"
            />
            <FeatureCard
              icon={<Lightbulb className="w-8 h-8" />}
              title="Ideas con IA"
              description="Genera ideas únicas y virales adaptadas a tu estilo de contenido"
            />
            <FeatureCard
              icon={<FileText className="w-8 h-8" />}
              title="Títulos Optimizados"
              description="Crea títulos irresistibles que maximicen tu CTR y vistas"
            />
            <FeatureCard
              icon={<Video className="w-8 h-8" />}
              title="Guiones Completos"
              description="Scripts profesionales listos para grabar en minutos"
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Precios simples y transparentes
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              title="Free"
              price="$0"
              period="para siempre"
              features={[
                '3 búsquedas de videos virales por día',
                'Generación de ideas limitada',
                'Títulos y guiones básicos',
                'Acceso a todas las herramientas',
              ]}
              buttonText="Comenzar Gratis"
              onNavigate={onNavigate}
            />
            <PricingCard
              title="Pro"
              price="$25.500"
              period="por mes"
              features={[
                'Búsquedas ilimitadas',
                'Generación ilimitada de ideas',
                'Títulos y guiones avanzados',
                'Soporte prioritario',
              ]}
              buttonText="Obtener Pro"
              featured
              onNavigate={onNavigate}
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Video className="w-6 h-6 text-accent" />
            <span className="text-xl font-bold text-white">Viralizate con IA</span>
          </div>
          <p className="mb-4">La herramienta de IA para creadores de YouTube</p>
          <p className="text-sm">&copy; 2024 Viralizate con IA. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-card p-6 rounded-xl border border-gray-800 hover:border-accent transition-colors">
      <div className="text-accent mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  featured?: boolean;
  onNavigate: (page: string) => void;
}

function PricingCard({ title, price, period, features, buttonText, featured, onNavigate }: PricingCardProps) {
  return (
    <div className={`bg-card p-8 rounded-xl border ${featured ? 'border-accent' : 'border-gray-800'} relative flex flex-col`}>
      <div className="h-4 mb-2">
        {featured && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent px-4 py-1 rounded-full text-sm font-semibold">
            Más Popular
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-gray-400 ml-2">{period}</span>
      </div>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => onNavigate('auth')}
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          featured
            ? 'bg-accent hover:bg-[#e63562] text-white'
            : 'bg-gray-800 hover:bg-gray-700 text-white'
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
}
