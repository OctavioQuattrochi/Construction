// Netlify Scheduled Function: cada 6 horas le pega al endpoint del cron para
// refrescar el snapshot de precios. El trabajo pesado (scraping) ocurre en la
// route de Next; esta función solo dispara la llamada con el secret.
export const config = {
  schedule: "0 */6 * * *", // 00:00, 06:00, 12:00, 18:00 (UTC)
};

export default async () => {
  const base = process.env.URL || process.env.DEPLOY_PRIME_URL;
  const secret = process.env.CRON_SECRET;
  if (!base || !secret) {
    return new Response("Faltan URL o CRON_SECRET", { status: 500 });
  }
  try {
    const res = await fetch(`${base}/api/cron/refresh-prices?secret=${secret}`);
    const body = await res.text();
    return new Response(`refresh-prices: ${res.status} ${body}`, {
      status: res.ok ? 200 : 502,
    });
  } catch (e) {
    return new Response(`error: ${e}`, { status: 502 });
  }
};
