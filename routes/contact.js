
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    // Configura el transporter de nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Email de destino (empresa)
    const toEmail = process.env.CONTACT_EMAIL;


    // Envía el correo a la empresa
    await transporter.sendMail({
      from: `Sutelabs <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Contacto: ${subject}`,
      text: `Nombre: ${name}\nEmail: ${email}\nMensaje: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #18191a; padding: 0; margin: 0;">
          <div style="max-width: 600px; margin: 40px auto; background: #242526; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.12); padding: 32px 24px;">
            <h2 style="color: #90cdf4; text-align: center; margin-bottom: 28px; letter-spacing: 1px;">Nuevo mensaje de contacto</h2>
            <table style="width: 100%; font-size: 17px; color: #f1f1f1;">
              <tr>
                <td style="font-weight: bold; color: #90cdf4; padding: 10px 0; width: 120px;">Nombre:</td>
                <td style="padding: 10px 0;">${name}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #90cdf4; padding: 10px 0;">Email:</td>
                <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #63b3ed; text-decoration: underline;">${email}</a></td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #90cdf4; padding: 10px 0;">Asunto:</td>
                <td style="padding: 10px 0;">${subject}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #90cdf4; padding: 10px 0; vertical-align: top;">Mensaje:</td>
                <td style="padding: 10px 0; white-space: pre-line; color: #e2e8f0; word-break: break-word; max-width: 350px;">${message}</td>
              </tr>
            </table>
            <div style="margin-top: 36px; text-align: center; color: #a0aec0; font-size: 13px;">
              <span>Este mensaje fue enviado desde el formulario de contacto de la web.</span>
            </div>
          </div>
        </div>
      `
    });

    // Envía confirmación automática al usuario
    await transporter.sendMail({
      from: `Sutelabs <${process.env.SMTP_USER}>`,
      to: email,
      subject: '¡Gracias por contactarnos!',
      text: `Hola ${name},\n\nHemos recibido tu mensaje correctamente y te responderemos a la brevedad.\n\nGracias por comunicarte con Sutelabs.\n\nMensaje enviado:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f6f8fa; padding: 0; margin: 0;">
          <div style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.10); padding: 32px 24px;">
            <h2 style="color: #2a4365; text-align: center; margin-bottom: 24px;">¡Gracias por contactarnos!</h2>
            <p style="font-size: 16px; color: #222;">Hola <b>${name}</b>,</p>
            <p style="font-size: 16px; color: #222;">Hemos recibido tu mensaje y te responderemos a la brevedad.</p>
            <div style="margin: 24px 0; padding: 16px; background: #f1f5f9; border-radius: 8px; color: #2a4365;">
              <b>Tu mensaje:</b><br>
              <span style="white-space: pre-line; color: #2a4365;">${message}</span>
            </div>
            <p style="font-size: 15px; color: #555;">Gracias por comunicarte con <b>Sutelabs</b>.</p>
            <div style="margin-top: 32px; text-align: center; color: #888; font-size: 13px;">
              <span>Este es un mensaje automático, no respondas a este correo.</span>
            </div>
          </div>
        </div>
      `
    });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
