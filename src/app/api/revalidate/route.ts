import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { PORTFOLIO_TAG } from "@/lib/content/revalidate";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  revalidateTag(PORTFOLIO_TAG, "max");
  return NextResponse.json({ ok: true, revalidated: true });
}
