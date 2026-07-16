import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type FeedbackRequest = { anonymousId?: unknown; rating?: unknown; comment?: unknown; unit?: unknown };

export async function POST(request: Request) {
  let input: FeedbackRequest;
  try {
    input = await request.json() as FeedbackRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rating = Number(input.rating);
  const comment = typeof input.comment === "string" ? input.comment.trim() : "";
  const anonymousId = typeof input.anonymousId === "string" ? input.anonymousId.slice(0, 100) : "anonymous";
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || comment.length > 800) {
    return NextResponse.json({ error: "Invalid feedback" }, { status: 422 });
  }

  const directory = path.join(process.cwd(), "data");
  await mkdir(directory, { recursive: true });
  await appendFile(path.join(directory, "private-feedback.jsonl"), `${JSON.stringify({
    id: crypto.randomUUID(),
    anonymousId,
    unit: input.unit === "genesis-1-3" ? input.unit : "genesis-1-3",
    rating,
    comment,
    createdAt: new Date().toISOString(),
  })}\n`, { encoding: "utf8", mode: 0o600 });

  return NextResponse.json({ ok: true }, { status: 201 });
}

export function GET() {
  return NextResponse.json({ error: "Feedback is private" }, { status: 405, headers: { Allow: "POST" } });
}
