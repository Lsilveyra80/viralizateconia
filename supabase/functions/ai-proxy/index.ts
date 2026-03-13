import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ClaudeRequest {
  prompt: string;
  type: 'ideas' | 'titles' | 'script';
  params?: {
    nicho?: string;
    estilo?: string;
    tema?: string;
    estiloTitulo?: string;
    titulo?: string;
    duracion?: string;
    tono?: string;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { prompt, type, params }: ClaudeRequest = await req.json();

    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY no está configurada');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'ideas':
        systemPrompt = 'Eres un experto en YouTube que genera ideas virales de videos. Debes generar exactamente 10 ideas creativas y únicas.';
        userPrompt = `Genera 10 ideas de videos virales para el nicho "${params?.nicho}" con estilo "${params?.estilo}".

Formato de respuesta (JSON array):
[
  {
    "titulo": "Título de la idea",
    "descripcion": "Breve descripción de por qué funcionaría",
    "gancho": "Hook inicial sugerido"
  }
]

Solo responde con el JSON, sin texto adicional.`;
        break;

      case 'titles':
        systemPrompt = 'Eres un experto en crear títulos virales para YouTube optimizados para CTR (Click-Through Rate).';
        userPrompt = `Genera 10 títulos virales para un video sobre "${params?.tema}" con estilo "${params?.estiloTitulo}".

Los títulos deben:
- Generar curiosidad
- Ser específicos
- Usar números cuando sea apropiado
- Crear urgencia o FOMO
- Ser optimizados para CTR

Formato de respuesta (JSON array):
[
  {
    "titulo": "El título",
    "score": 8
  }
]

El score es del 1 al 10 según el potencial viral. Solo responde con el JSON, sin texto adicional.`;
        break;

      case 'script':
        systemPrompt = 'Eres un guionista experto en crear scripts para videos de YouTube que retienen la atención.';
        userPrompt = `Crea un guión completo para un video de YouTube con:
- Título: "${params?.titulo}"
- Duración: ${params?.duracion}
- Tono: ${params?.tono}

El guión debe incluir:
1. HOOK (primeros 30 segundos) - Debe captar atención inmediatamente
2. INTRODUCCIÓN - Presentación del tema
3. DESARROLLO - Contenido principal dividido en secciones
4. CONCLUSIÓN - Resumen de puntos clave
5. CTA - Llamado a la acción (like, suscribirse, comentar)

Formato de respuesta (JSON):
{
  "hook": "Hook inicial poderoso (30 segundos)",
  "introduccion": "Introducción del video",
  "desarrollo": "Contenido principal del video con secciones marcadas",
  "conclusion": "Conclusión y resumen",
  "cta": "Llamado a la acción final"
}

Solo responde con el JSON, sin texto adicional.`;
        break;

      default:
        throw new Error('Tipo de solicitud no válido');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${error}`);
    }

    const data = await response.json();
    let content = data.content[0].text;

    // Remove markdown code blocks if present
    content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (e) {
      parsedContent = { raw: content };
    }

    return new Response(
      JSON.stringify({ success: true, data: parsedContent }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Error desconocido'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
