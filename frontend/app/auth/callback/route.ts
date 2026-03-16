import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      // Auto-provision an enabled email alert channel for new users
      const userId = data.user.id;
      const { data: existing } = await supabase
        .from("alert_channels")
        .select("id")
        .eq("user_id", userId)
        .eq("type", "email")
        .maybeSingle();

      if (!existing) {
        await supabase.from("alert_channels").insert({
          user_id: userId,
          type: "email",
          config: { email: data.user.email },
          enabled: true,
        });
      }

      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
