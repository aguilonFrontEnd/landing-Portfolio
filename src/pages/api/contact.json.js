// src/pages/api/contact.json.js
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const prerender = false;

export async function POST({ request }) {
  try {
    const data = await request.json();
    const { name, email, message } = data;

    const { data: responseData, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['aguilondevelopsoft@gmail.com'],
      subject: `Nuevo mensaje de ${name} desde el portafolio`,
      reply_to: email,
      html: `
        <h2>📬 Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">${message}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Enviado desde el portafolio de Alejandro Aguilon</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Server error:', err);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}