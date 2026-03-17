import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// Vercel inyectará esta variable de entorno automáticamente
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Solo permitimos peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'El email es obligatorio' });
  }

  try {
    const data = await resend.emails.send({
      // IMPORTANTE: Este dominio debe estar verificado en resend.com
      from: 'Viralizate con IA <bienvenida@tudominio.com>', 
      to: email,
      subject: '¡Bienvenido a Viralizate con IA! 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #ff3d6e;">¡Hola ${name || 'creador'}!</h2>
          <p>Gracias por unirte a <strong>Viralizate con IA</strong>. Estamos muy emocionados de tenerte con nosotros y ayudarte a potenciar tu contenido.</p>
          <p>Ya puedes acceder a la plataforma y comenzar a generar ideas virales.</p>
          <p>¡Éxitos!</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
}
