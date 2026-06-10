import { NextResponse } from "next/server";

import {
  buildDigitalTwinSystemPrompt,
  DIGITAL_TWIN_MODEL,
  normalizeDigitalTwinMessages
} from "@/lib/digitalTwin";

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: unknown;
    };
  }>;
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  const body = await readJson(request);
  const messages = normalizeDigitalTwinMessages(body?.messages);

  if (!messages.some((message) => message.role === "user")) {
    return NextResponse.json({ error: "Send at least one user message." }, { status: 400 });
  }

  const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      "X-OpenRouter-Title": "Volodymyr Salo Portfolio"
    },
    body: JSON.stringify({
      model: DIGITAL_TWIN_MODEL,
      messages: [{ role: "system", content: buildDigitalTwinSystemPrompt() }, ...messages],
      temperature: 0.35,
      max_tokens: 700
    })
  });

  if (!openRouterResponse.ok) {
    const detail = await openRouterResponse.text();
    console.error("OpenRouter request failed", {
      status: openRouterResponse.status,
      detail: detail.slice(0, 600)
    });

    return NextResponse.json(
      { error: "The Digital Twin is unavailable right now. Please try again shortly." },
      { status: 502 }
    );
  }

  const data = (await openRouterResponse.json()) as OpenRouterResponse;
  const content = data.choices?.[0]?.message?.content;

  if (typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json(
      { error: "The Digital Twin returned an empty response." },
      { status: 502 }
    );
  }

  return NextResponse.json({ message: content.trim() });
}

async function readJson(request: Request): Promise<{ messages?: unknown } | null> {
  try {
    return (await request.json()) as { messages?: unknown };
  } catch {
    return null;
  }
}
