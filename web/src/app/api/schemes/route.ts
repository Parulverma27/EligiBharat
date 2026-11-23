import { NextResponse } from "next/server";
import { SCHEMES_DATA } from "@/lib/schemesData";

export async function GET() {
  return NextResponse.json({
    schemes: SCHEMES_DATA,
    total: SCHEMES_DATA.length,
  });
}
