import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Transcription API not implemented in this build." },
    { status: 501 }
  );
}
