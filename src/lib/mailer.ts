import "server-only";

// Envío de emails vía Resend (https://resend.com) usando su API REST — sin SDK.
// Si RESEND_API_KEY no está configurada, no falla: registra en consola y sigue.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/** A dónde se notifican los leads. */
export function leadNotifyTo(): string | null {
  return (
    process.env.LEAD_NOTIFY_EMAIL ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    null
  );
}

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "BildAp <onboarding@resend.dev>";

  if (!key) {
    console.log(`[mailer] RESEND_API_KEY ausente — email omitido: "${opts.subject}"`);
    return false;
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(opts.to) ? opts.to : [opts.to],
        subject: opts.subject,
        html: opts.html,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[mailer] Resend error", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[mailer] fallo de red", e);
    return false;
  }
}

// ---- plantillas simples -------------------------------------------------

const shell = (title: string, body: string) => `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f4f5f7;padding:24px">
    <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e3e5ea;border-radius:16px;overflow:hidden">
      <div style="background:#0c0f14;padding:20px 24px;color:#fff">
        <span style="font-size:18px;font-weight:800">Bild<span style="color:#f0a500">Ap</span></span>
      </div>
      <div style="padding:24px;color:#1a1d25;font-size:15px;line-height:1.6">
        <h1 style="margin:0 0 16px;font-size:18px;color:#0c0f14">${title}</h1>
        ${body}
      </div>
      <div style="padding:16px 24px;border-top:1px solid #e3e5ea;color:#6f7688;font-size:12px">
        Notificación automática de BildAp
      </div>
    </div>
  </div>`;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function contactLeadEmail(data: {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  service?: string | null;
  message: string;
}): { subject: string; html: string } {
  const row = (label: string, value?: string | null) =>
    value
      ? `<tr><td style="padding:4px 0;color:#6f7688;width:110px">${label}</td><td style="padding:4px 0;color:#0c0f14">${esc(value)}</td></tr>`
      : "";
  return {
    subject: `Nueva consulta de ${data.name}${data.service ? ` · ${data.service}` : ""}`,
    html: shell(
      "Nueva consulta desde la web",
      `<table style="width:100%;border-collapse:collapse;font-size:14px">
        ${row("Nombre", data.name)}
        ${row("Email", data.email)}
        ${row("Teléfono", data.phone)}
        ${row("Servicio", data.service)}
        ${row("Asunto", data.subject)}
      </table>
      <div style="margin-top:16px;padding:16px;background:#f4f5f7;border-radius:12px">
        ${esc(data.message).replace(/\n/g, "<br>")}
      </div>
      <p style="margin-top:16px;font-size:13px;color:#6f7688">Respondé este email para contestarle directamente a ${esc(data.name)}.</p>`
    ),
  };
}

export function newsletterEmail(email: string): { subject: string; html: string } {
  return {
    subject: `Nuevo suscriptor al newsletter: ${email}`,
    html: shell(
      "Nuevo suscriptor",
      `<p><strong>${esc(email)}</strong> se suscribió al newsletter de BildAp.</p>`
    ),
  };
}
