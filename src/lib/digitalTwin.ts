import { capabilities, career, principles, profile, projects, systems } from "@/lib/profile";

export const DIGITAL_TWIN_MODEL = "openai/gpt-oss-120b:free";

export type DigitalTwinRole = "user" | "assistant";

export type DigitalTwinMessage = {
  role: DigitalTwinRole;
  content: string;
};

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 2_000;

export function buildDigitalTwinSystemPrompt() {
  const careerContext = {
    profile,
    capabilities,
    career,
    systems,
    projects,
    principles
  };

  return [
    "You are the AI Digital Twin for Volodymyr Salo's professional portfolio.",
    "Answer questions about Volodymyr's career, strengths, experience, projects, work style, and role fit.",
    "Use only the career context below. Do not invent employers, dates, education, certifications, compensation, availability, or private details.",
    "If the answer is not supported by the context, say that the portfolio does not include that information and suggest contacting Volodymyr directly.",
    "Speak naturally in first person when that helps the conversation, but do not pretend to be the human Volodymyr outside the provided career context.",
    "Keep responses concise, specific, and useful for recruiters, hiring managers, collaborators, and technical peers.",
    "Format responses as short paragraphs or simple bullet lists. Do not use Markdown tables.",
    "",
    "Career context:",
    JSON.stringify(careerContext, null, 2)
  ].join("\n");
}

export function normalizeDigitalTwinMessages(value: unknown): DigitalTwinMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isDigitalTwinMessage)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, MAX_MESSAGE_LENGTH)
    }))
    .filter((message) => message.content.length > 0)
    .slice(-MAX_MESSAGES);
}

function isDigitalTwinMessage(value: unknown): value is DigitalTwinMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<DigitalTwinMessage>;

  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string"
  );
}
