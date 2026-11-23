import { NextResponse } from "next/server";
import { EMPTY_PROFILE, runConversationalTurn } from "@/lib/checker";
import type { Language, UserProfile } from "@/types/scheme";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    message?: string;
    profile?: Partial<UserProfile>;
    asked_fields?: string[];
    turn_count?: number;
    language?: Language;
  };

  const profile: UserProfile = {
    ...EMPTY_PROFILE,
    ...(body.profile ?? {}),
    categories: body.profile?.categories ?? [],
  };

  const response = runConversationalTurn(
    body.message ?? "",
    profile,
    body.asked_fields ?? [],
    body.turn_count ?? 0,
    body.language ?? "en"
  );

  return NextResponse.json(response);
}
