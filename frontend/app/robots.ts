import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://stackwatch.pulsemonitor.dev";

  return {
    rules: [
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot"],
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/settings/", "/integrations/", "/alerts/", "/team/"],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/settings/", "/integrations/", "/alerts/", "/team/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
