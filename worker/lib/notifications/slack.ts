import type { AlertPayload } from "./types";
import { METRIC_LABELS } from "../utils";

export async function sendSlackAlert(
  webhookUrl: string,
  alert: AlertPayload
): Promise<void> {
  try {
    const metricLabel = METRIC_LABELS[alert.metricName] ?? alert.metricName;
    const pct = alert.percentUsed ?? 0;
    const color =
      pct >= 90
        ? "#ef4444"
        : pct >= 80
          ? "#eab308"
          : "#22c55e";

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attachments: [
          {
            color,
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `*Usage Alert: ${alert.service} — ${metricLabel}*\n${alert.accountLabel} is at *${Math.round(pct)}%* of limit (${alert.currentValue.toLocaleString()} / ${alert.limitValue?.toLocaleString() ?? "—"})`,
                },
              },
            ],
          },
        ],
      }),
    });
  } catch {
    // Slack failure should not block other channels
  }
}
