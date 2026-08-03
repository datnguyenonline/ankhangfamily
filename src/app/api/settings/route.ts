import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserSettings, updateUserSettings } from "@/lib/settings/store";
import { parseUserSettingsPatch } from "@/lib/settings/validation";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getUserSettings(session.user.id);
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const patch = parseUserSettingsPatch(body);

  if (!patch) {
    return NextResponse.json({ error: "Invalid settings" }, { status: 400 });
  }

  const settings = await updateUserSettings(session.user.id, patch);
  return NextResponse.json(settings);
}
