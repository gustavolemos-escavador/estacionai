import { IncomingWebhook } from "@slack/webhook";

let webhook: IncomingWebhook | null = null;

function getWebhook(): IncomingWebhook {
  if (!webhook) {
    const url = process.env.SLACK_WEBHOOK_URL;
    if (!url) {
      throw new Error("SLACK_WEBHOOK_URL não está configurado.");
    }
    webhook = new IncomingWebhook(url);
  }
  return webhook;
}

export async function sendParkingNotification(
  free: number,
  total: number,
  sector?: string
): Promise<void> {
  const occupancyPercent = total > 0 ? Math.round(((total - free) / total) * 100) : 0;
  const sectorLabel = sector ? ` — Setor ${sector}` : "";

  let emoji = "🟢";
  if (occupancyPercent >= 90) emoji = "🔴";
  else if (occupancyPercent >= 70) emoji = "🟡";

  await getWebhook().send({
    text: `${emoji} *EstacionAI${sectorLabel}*: ${free} vaga${free !== 1 ? "s" : ""} livre${free !== 1 ? "s" : ""} de ${total} (${100 - occupancyPercent}% disponível).`,
  });
}
