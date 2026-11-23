import { NextResponse } from "next/server";
import { EMPTY_PROFILE, evaluateAllSchemes } from "@/lib/checker";
import type { UserProfile } from "@/types/scheme";

export async function POST(request: Request) {
  const body = (await request.json()) as { profile?: Partial<UserProfile> };
  const profile: UserProfile = {
    ...EMPTY_PROFILE,
    ...(body.profile ?? {}),
    categories: body.profile?.categories ?? [],
  };
  const { counts, results } = evaluateAllSchemes(profile);
  return NextResponse.json({ profile, counts, results });
}
