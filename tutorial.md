# Building the Digital Twin Chat

This tutorial walks through the AI chat feature added to this portfolio site. It is written for a complete beginner in frontend coding, so it explains both what the code does and why each part exists.

The feature lets a visitor ask questions about Volodymyr Salo's career. The browser shows a chat interface, but the actual AI request happens on the server so the OpenRouter API key never gets exposed to visitors.

## What We Built

We added a new section to the portfolio called "Digital Twin". It appears near the top of the page and lets users ask career-related questions such as:

- "What senior roles fit Volodymyr best?"
- "Summarize his embedded Linux experience."
- "How has he handled production ownership?"
- "Which projects show engineering quality?"

When the user sends a message, the app:

1. Stores the message in React state.
2. Sends the conversation to a Next.js API route.
3. The API route builds a career-focused prompt from local profile data.
4. The API route calls OpenRouter using the model `openai/gpt-oss-120b:free`.
5. OpenRouter returns an assistant answer.
6. The frontend displays that answer in the chat.

The most important files are:

```txt
src/lib/profile.ts
src/lib/digitalTwin.ts
src/app/api/digital-twin/route.ts
src/components/portfolio/DigitalTwinChat.tsx
src/components/portfolio/PortfolioPage.tsx
src/app/globals.css
```

## Technology Summary

### Next.js

Next.js is the web framework used by this site. It lets us build both:

- frontend pages and React components
- backend API routes

That matters here because AI API keys should not live in browser code. Browser code can be seen by users. Server code cannot be directly inspected by site visitors.

The app uses the Next.js App Router. That is why the API route lives here:

```txt
src/app/api/digital-twin/route.ts
```

In the App Router, a file named `route.ts` creates an HTTP endpoint.

### React

React is used to build the interactive UI. The chat box is a React component:

```txt
src/components/portfolio/DigitalTwinChat.tsx
```

React gives us state through hooks such as:

```tsx
const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
const [input, setInput] = useState("");
const [status, setStatus] = useState<ChatStatus>("idle");
const [error, setError] = useState<string | null>(null);
```

State is data that can change while the page is open. For a chat interface, the changing data is the message list, the text currently typed into the input, whether the app is waiting for a response, and whether an error happened.

### TypeScript

TypeScript is JavaScript with types. Types help catch mistakes before the code runs.

For example, this type says that a chat message can only have one of two roles:

```ts
type ChatRole = "assistant" | "user";
```

This prevents accidental roles like `"bot"`, `"human"`, or `"admin"` from being used in the frontend chat code.

### OpenRouter

OpenRouter is the AI gateway used by the server route. It exposes a chat-completions API similar to OpenAI's API.

The model configured for this feature is:

```ts
export const DIGITAL_TWIN_MODEL = "openai/gpt-oss-120b:free";
```

The API key is read from:

```txt
.env
```

The relevant environment variable is:

```txt
OPENROUTER_API_KEY
```

### CSS

This project uses plain global CSS in:

```txt
src/app/globals.css
```

There is no Tailwind, CSS module, or component library. The chat is styled with regular CSS class names such as:

```css
.digital-twin-section
.chat-panel
.chat-log
.chat-message
.message-bubble
.chat-form
```

### lucide-react

The icons come from `lucide-react`. For example:

```tsx
import { Bot, Send, Sparkles, UserRound } from "lucide-react";
```

These are React components that render SVG icons.

## High-Level Walkthrough

Here is the feature from the user's point of view:

1. The user opens the portfolio.
2. They click "Ask AI" or scroll to the Digital Twin section.
3. They type a question into the chat box.
4. They press Enter or click the send button.
5. The message appears immediately in the chat.
6. A temporary "Thinking through the career context..." message appears.
7. The app receives the answer from the API.
8. The answer appears as an assistant message.

Here is the feature from the code's point of view:

```txt
User
  |
  v
DigitalTwinChat.tsx
  |
  v
POST /api/digital-twin
  |
  v
route.ts
  |
  v
buildDigitalTwinSystemPrompt()
  |
  v
OpenRouter Chat Completions API
  |
  v
route.ts returns JSON
  |
  v
DigitalTwinChat.tsx displays answer
```

## The Data Source: `profile.ts`

The AI should answer questions about the career, not make things up. The source of truth is the existing portfolio data in:

```txt
src/lib/profile.ts
```

That file contains structured information such as:

- name
- role
- summary
- capabilities
- career history
- systems experience
- projects
- engineering principles

The Digital Twin feature also added one new navigation item:

```ts
export const navItems = [
  { label: "About", href: "#about" },
  { label: "Ask AI", href: "#digital-twin" },
  { label: "Journey", href: "#journey" },
  { label: "Systems", href: "#systems" },
  { label: "Contact", href: "#contact" }
];
```

This tells the header navigation to include a link to the new chat section.

Beginner note: the `href: "#digital-twin"` value means "scroll to the element on this page that has `id="digital-twin"`".

## The Prompt Helper: `digitalTwin.ts`

The file:

```txt
src/lib/digitalTwin.ts
```

has two jobs:

1. Build the system prompt for the AI.
2. Clean and limit messages coming from the browser.

### The model constant

```ts
export const DIGITAL_TWIN_MODEL = "openai/gpt-oss-120b:free";
```

Putting the model name in one exported constant makes it easy to reuse and easy to change later.

Without this constant, the model name might be copied into multiple places. That makes future changes more error-prone.

### The message type

```ts
export type DigitalTwinRole = "user" | "assistant";

export type DigitalTwinMessage = {
  role: DigitalTwinRole;
  content: string;
};
```

This describes the shape of messages that the API route accepts.

Each message has:

- `role`: who sent the message
- `content`: the actual message text

### The safety limits

```ts
const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 2_000;
```

These limits stop the browser from sending an unlimited amount of data to the server.

This matters because:

- AI requests cost compute.
- Very long conversations can slow down responses.
- A malicious or buggy browser could try to send huge payloads.

The code keeps only the latest 12 valid messages and trims each message to 2,000 characters.

### Building the AI prompt

```ts
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
```

This is one of the most important parts of the feature.

The prompt tells the model:

- what role it should play
- what it should answer
- what it should not invent
- what format to use
- what career data it may use

The line:

```ts
JSON.stringify(careerContext, null, 2)
```

turns the JavaScript object into readable JSON text. That text is inserted into the prompt so the AI can answer based on the portfolio data.

Beginner note: an AI model does not automatically know what is inside your local TypeScript files. You have to send the relevant context with the request.

### Normalizing incoming messages

The browser sends JSON to the server. Server code should not blindly trust browser input, even if the browser code is also ours.

This function cleans the input:

```ts
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
```

Step by step:

1. If the input is not an array, return an empty list.
2. Keep only values that look like valid chat messages.
3. Trim whitespace from each message.
4. Cut long messages down to the maximum allowed length.
5. Remove empty messages.
6. Keep only the latest messages.

The helper uses a type guard:

```ts
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
```

A type guard is a function that checks a value at runtime and helps TypeScript understand the result.

In plain language, this function says:

"This value is a valid Digital Twin message only if it is an object, has a role of `user` or `assistant`, and has text content."

## The Server Route: `route.ts`

The file:

```txt
src/app/api/digital-twin/route.ts
```

creates the backend endpoint:

```txt
POST /api/digital-twin
```

The frontend calls this route. This route then calls OpenRouter.

### Why use a server route?

The OpenRouter API key is secret. If we put it in frontend code, anyone could inspect the browser bundle and steal it.

This is why the frontend does not call OpenRouter directly.

Instead:

```txt
Browser -> Your API route -> OpenRouter
```

The browser only talks to your own site.

### Importing the helper code

```ts
import {
  buildDigitalTwinSystemPrompt,
  DIGITAL_TWIN_MODEL,
  normalizeDigitalTwinMessages
} from "@/lib/digitalTwin";
```

The route imports:

- the model name
- the prompt builder
- the message normalizer

This keeps the route focused on request handling instead of mixing everything into one file.

### Describing the OpenRouter response

```ts
type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: unknown;
    };
  }>;
};
```

This TypeScript type describes the part of the OpenRouter response that the app uses.

The `?` marks fields as optional. That is defensive coding. External APIs can fail, change, or return unexpected data.

### Reading the API key

```ts
const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  return NextResponse.json(
    { error: "OPENROUTER_API_KEY is not configured on the server." },
    { status: 500 }
  );
}
```

`process.env.OPENROUTER_API_KEY` reads the key from the environment.

If the key is missing, the route returns a server error.

Beginner note: environment variables are configuration values. They are commonly used for secrets, API keys, database URLs, and deployment-specific settings.

### Reading the request body

```ts
const body = await readJson(request);
const messages = normalizeDigitalTwinMessages(body?.messages);
```

The request body is expected to contain something like:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "What senior roles fit Volodymyr best?"
    }
  ]
}
```

The route reads that JSON and passes the messages through the normalizer.

### Rejecting empty conversations

```ts
if (!messages.some((message) => message.role === "user")) {
  return NextResponse.json({ error: "Send at least one user message." }, { status: 400 });
}
```

This prevents the API from sending a request to OpenRouter if there is no user question.

HTTP status `400` means "bad request". The client sent something that is not useful.

### Calling OpenRouter

```ts
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
```

Important pieces:

- `method: "POST"` means we are sending data.
- `Authorization` sends the API key securely from the server.
- `Content-Type` says the request body is JSON.
- `HTTP-Referer` and `X-OpenRouter-Title` identify the site to OpenRouter.
- `model` chooses the AI model.
- `messages` sends the system prompt plus the conversation.
- `temperature` controls creativity. Lower values usually produce more focused answers.
- `max_tokens` limits the response length.

The most important part is this:

```ts
messages: [{ role: "system", content: buildDigitalTwinSystemPrompt() }, ...messages]
```

The system prompt is placed before the user conversation. That tells the model how it should behave before it answers the user's latest question.

### Handling OpenRouter errors

```ts
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
```

`openRouterResponse.ok` is true for successful HTTP status codes.

If OpenRouter returns an error:

- the server logs a short version of the error
- the user gets a friendly error message

HTTP status `502` means "bad gateway". In this case, our route is saying: "I tried to call an external service, but that service did not give me a usable answer."

### Returning the assistant answer

```ts
const data = (await openRouterResponse.json()) as OpenRouterResponse;
const content = data.choices?.[0]?.message?.content;

if (typeof content !== "string" || content.trim().length === 0) {
  return NextResponse.json(
    { error: "The Digital Twin returned an empty response." },
    { status: 502 }
  );
}

return NextResponse.json({ message: content.trim() });
```

The route extracts the assistant message from the OpenRouter response.

It checks that the message is a non-empty string. If it is valid, it returns:

```json
{
  "message": "The assistant answer goes here."
}
```

## The Client Component: `DigitalTwinChat.tsx`

The file:

```txt
src/components/portfolio/DigitalTwinChat.tsx
```

contains the interactive chat UI.

### Why it starts with `"use client"`

```tsx
"use client";
```

In Next.js App Router, components are server components by default. Server components cannot use browser-only React features like `useState`, `useEffect`, or event handlers.

The chat component needs all of those things, so it must be a client component.

### Imports

```tsx
import {
  Bot,
  LoaderCircle,
  MessageCircle,
  Send,
  Sparkles,
  UserRound
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
```

This imports icons and React hooks.

The most important hooks are:

- `useState`: remembers changing values
- `useEffect`: runs code after the component updates
- `useRef`: keeps a reference to a DOM element

### Chat types

```tsx
type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

type ChatStatus = "idle" | "submitting";
```

These types describe the frontend chat state.

Every chat message has:

- `id`: a unique value React uses as a stable key
- `role`: whether it is a user or assistant message
- `content`: the text shown in the bubble

The status can be:

- `idle`: nothing is currently being sent
- `submitting`: waiting for the API response

### Initial assistant message

```tsx
const initialMessage: ChatMessage = {
  id: "initial",
  role: "assistant",
  content:
    "I can answer career questions from Volodymyr's portfolio context: embedded Linux, Qt/QML, C++, Python, product ownership, production support, and selected projects."
};
```

This message appears before the user asks anything. It tells visitors what the chat is for.

### Starter prompts

```tsx
const starterPrompts = [
  "What senior roles fit Volodymyr best?",
  "Summarize his embedded Linux experience.",
  "How has he handled production ownership?",
  "Which projects show engineering quality?"
];
```

Starter prompts help users who do not know what to ask. They also guide the interaction toward questions the AI can answer well.

### Component state

```tsx
const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
const [input, setInput] = useState("");
const [status, setStatus] = useState<ChatStatus>("idle");
const [error, setError] = useState<string | null>(null);
const logRef = useRef<HTMLDivElement>(null);

const isSubmitting = status === "submitting";
```

This is the state needed for a basic chat:

- `messages`: all visible messages
- `input`: what the user has typed
- `status`: whether the request is in progress
- `error`: any error message to display
- `logRef`: a reference to the scrollable message list

### Auto-scrolling the chat

```tsx
useEffect(() => {
  logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
}, [messages, error, status]);
```

When a new message appears, the chat log scrolls to the bottom.

The dependency array:

```tsx
[messages, error, status]
```

means the effect runs when any of those values changes.

Beginner note: `?.` is optional chaining. It means "only call this if `logRef.current` exists".

### Sending a message

This is the main frontend function:

```tsx
async function submitMessage(value = input) {
  const content = value.trim();

  if (!content || isSubmitting) {
    return;
  }

  const userMessage = createMessage("user", content);
  const nextMessages = [...messages, userMessage];

  setMessages(nextMessages);
  setInput("");
  setError(null);
  setStatus("submitting");

  try {
    const response = await fetch("/api/digital-twin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: nextMessages.map(({ role, content: messageContent }) => ({
          role,
          content: messageContent
        }))
      })
    });

    const data = (await response.json()) as { message?: unknown; error?: unknown };

    if (!response.ok) {
      throw new Error(typeof data.error === "string" ? data.error : "The Digital Twin is unavailable.");
    }

    if (typeof data.message !== "string" || data.message.trim().length === 0) {
      throw new Error("The Digital Twin returned an empty response.");
    }

    setMessages([...nextMessages, createMessage("assistant", data.message)]);
  } catch (requestError) {
    setError(requestError instanceof Error ? requestError.message : "The Digital Twin is unavailable.");
  } finally {
    setStatus("idle");
  }
}
```

Step by step:

1. Trim the input.
2. Stop if the message is empty.
3. Stop if a request is already in progress.
4. Create a user message.
5. Add it to the visible chat immediately.
6. Clear the input box.
7. Clear old errors.
8. Set status to `submitting`.
9. Send a POST request to `/api/digital-twin`.
10. Parse the JSON response.
11. If the response failed, show an error.
12. If the response is valid, add the assistant message.
13. Set the status back to `idle`.

This line is worth understanding:

```tsx
const nextMessages = [...messages, userMessage];
```

The `...messages` syntax copies the existing array. Then `userMessage` is added at the end.

React state should usually be treated as immutable. Instead of changing the existing array, we create a new array.

### The fetch call

```tsx
const response = await fetch("/api/digital-twin", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    messages: nextMessages.map(({ role, content: messageContent }) => ({
      role,
      content: messageContent
    }))
  })
});
```

This sends the conversation to the local API route.

Important: this does not call OpenRouter directly. It calls your own Next.js route.

The browser sends only:

- role
- content

It does not send internal UI-only data like the message `id`.

### Form submit

```tsx
function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  void submitMessage();
}
```

Normally, submitting an HTML form reloads the page. `event.preventDefault()` stops that.

Then the chat sends the message through JavaScript instead.

### Pressing Enter

```tsx
function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    void submitMessage();
  }
}
```

This makes Enter send the message. Shift+Enter still lets the user add a new line.

### The section HTML

```tsx
<section className="digital-twin-section" id="digital-twin" aria-labelledby="digital-twin-title">
```

This creates the page section.

The `id="digital-twin"` value is what makes this link work:

```tsx
<a className="action-button" href="#digital-twin">
```

The `aria-labelledby` attribute improves accessibility by connecting the section to its heading.

### Rendering messages

```tsx
{messages.map((message) => (
  <div className={`chat-message ${message.role}`} key={message.id}>
    <div className="message-avatar" aria-hidden="true">
      {message.role === "assistant" ? (
        <Bot size={18} strokeWidth={1.9} />
      ) : (
        <UserRound size={18} strokeWidth={1.9} />
      )}
    </div>
    <p className="message-bubble">{message.content}</p>
  </div>
))}
```

This loops through each message and renders it.

The class name includes the role:

```tsx
className={`chat-message ${message.role}`}
```

So an assistant message gets:

```txt
chat-message assistant
```

And a user message gets:

```txt
chat-message user
```

CSS can then style user and assistant messages differently.

### The temporary pending message

```tsx
{isSubmitting ? (
  <div className="chat-message assistant pending">
    <div className="message-avatar" aria-hidden="true">
      <Bot size={18} strokeWidth={1.9} />
    </div>
    <p className="message-bubble">Thinking through the career context...</p>
  </div>
) : null}
```

This message is shown while waiting for OpenRouter.

It is not stored permanently in the `messages` array. It only appears when `isSubmitting` is true.

### Error display

```tsx
{error ? <p className="chat-error">{error}</p> : null}
```

If an error exists, the component shows it. If there is no error, it renders nothing.

### Suggested prompts

```tsx
{messages.length === 1 ? (
  <div className="chat-suggestions" aria-label="Suggested career questions">
    {starterPrompts.map((prompt) => (
      <button
        className="chat-suggestion"
        disabled={isSubmitting}
        key={prompt}
        onClick={() => void submitMessage(prompt)}
        type="button"
      >
        <Sparkles size={15} strokeWidth={1.9} aria-hidden="true" />
        {prompt}
      </button>
    ))}
  </div>
) : null}
```

The suggestions only appear at the beginning, when the only message is the initial assistant message.

Once the user sends something, `messages.length` becomes greater than 1, so the suggestions disappear.

### The input form

```tsx
<form className="chat-form" onSubmit={handleSubmit}>
  <textarea
    aria-label="Ask the Digital Twin about Volodymyr's career"
    disabled={isSubmitting}
    onChange={(event) => setInput(event.target.value)}
    onKeyDown={handleKeyDown}
    placeholder="Ask about embedded Linux, Qt, production support, projects..."
    rows={2}
    value={input}
  />
  <button
    className="chat-send"
    data-loading={isSubmitting}
    disabled={isSubmitting || input.trim().length === 0}
    type="submit"
  >
    {isSubmitting ? (
      <LoaderCircle size={20} strokeWidth={2} aria-hidden="true" />
    ) : (
      <Send size={20} strokeWidth={2} aria-hidden="true" />
    )}
    <span className="sr-only">Send message</span>
  </button>
</form>
```

Important details:

- The textarea is controlled by React through `value={input}`.
- `onChange` updates the state when the user types.
- The send button is disabled if the input is empty.
- The send button is also disabled while a request is already running.
- The visible button is an icon, but screen readers still get the text "Send message".

### Creating unique message IDs

```tsx
function createMessage(role: ChatRole, content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content
  };
}
```

React needs stable `key` values when rendering lists.

`crypto.randomUUID()` creates a unique ID for each new message.

## Integrating the Chat into the Page

The main portfolio component lives here:

```txt
src/components/portfolio/PortfolioPage.tsx
```

The new chat component is imported:

```tsx
import { DigitalTwinChat } from "@/components/portfolio/DigitalTwinChat";
```

Then it is inserted into the page:

```tsx
export function PortfolioPage() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <Hero />
      <DigitalTwinChat />
      <Capabilities />
      <About />
      <Journey />
      <Systems />
      <Projects />
      <Contact />
    </main>
  );
}
```

The chat appears after the hero and before the rest of the portfolio content.

The hero also has an "Ask AI" button:

```tsx
<a className="action-button" href="#digital-twin">
  <MessageCircle size={18} strokeWidth={1.9} aria-hidden="true" />
  Ask AI
</a>
```

This is an anchor link. Clicking it scrolls down to the chat section.

## Styling the Chat

The styling lives in:

```txt
src/app/globals.css
```

### The outer section

```css
.digital-twin-section {
  background:
    linear-gradient(90deg, rgba(45, 226, 164, 0.11), transparent 35%),
    linear-gradient(270deg, rgba(167, 139, 250, 0.11), transparent 42%),
    rgba(244, 239, 230, 0.035);
  border-bottom: 1px solid var(--line);
  border-top: 1px solid var(--line);
  padding: 6rem max(1rem, calc((100vw - var(--max)) / 2));
  position: relative;
  z-index: 2;
}
```

This gives the section:

- a subtle background
- top and bottom borders
- responsive horizontal padding
- vertical spacing

### The layout

```css
.digital-twin-layout {
  align-items: start;
  display: grid;
  gap: 2rem;
  grid-template-columns: minmax(0, 0.82fr) minmax(380px, 1.18fr);
}
```

This creates a two-column layout:

- left column: explanation text
- right column: chat panel

`minmax(0, 0.82fr)` and `minmax(380px, 1.18fr)` help prevent layout overflow while still giving the chat enough room.

### The chat log

```css
.chat-log {
  display: grid;
  gap: 0.85rem;
  height: 430px;
  overflow-y: auto;
  padding: 1rem;
  scrollbar-color: rgba(45, 226, 164, 0.4) rgba(244, 239, 230, 0.08);
}
```

The chat log has a fixed height and scrolls internally.

That prevents the entire page from jumping too much as messages are added.

### User and assistant messages

```css
.chat-message {
  align-items: start;
  display: grid;
  gap: 0.65rem;
  grid-template-columns: 34px minmax(0, 1fr);
  max-width: 86%;
}

.chat-message.user {
  grid-template-columns: minmax(0, 1fr) 34px;
  justify-self: end;
}
```

Assistant messages align left. User messages align right.

The user message changes the column order so the avatar appears on the right.

### Message bubbles

```css
.message-bubble {
  background: rgba(16, 15, 12, 0.5);
  border: 1px solid rgba(244, 239, 230, 0.13);
  border-radius: 8px;
  color: var(--ink);
  line-height: 1.6;
  margin: 0;
  overflow-wrap: anywhere;
  padding: 0.85rem 0.95rem;
  white-space: pre-wrap;
}
```

The important beginner-friendly details:

- `line-height` improves readability.
- `overflow-wrap: anywhere` prevents long text from breaking the layout.
- `white-space: pre-wrap` preserves line breaks from the AI response.

### Loading animation

```css
.chat-status-pill[data-loading="true"] svg,
.chat-send[data-loading="true"] svg,
.pending svg {
  animation: spin 900ms linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

This spins the loading icon while a request is active.

The button uses:

```tsx
data-loading={isSubmitting}
```

So CSS can tell the difference between an idle disabled button and a loading disabled button.

### Mobile layout

```css
@media (max-width: 1060px) {
  .digital-twin-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .chat-panel-header,
  .chat-suggestions,
  .chat-form {
    grid-template-columns: 1fr;
  }

  .chat-send {
    width: 100%;
  }
}
```

Media queries change the layout on smaller screens.

At tablet and mobile widths, the two-column section becomes one column. On small phones, the input and send button stack vertically.

## Security and Privacy Review

The feature has a few important security choices.

### The API key stays on the server

The browser never sees:

```txt
OPENROUTER_API_KEY
```

Only the server route reads it:

```ts
const apiKey = process.env.OPENROUTER_API_KEY;
```

This is the correct pattern for AI API calls in a public website.

### User input is normalized

The server validates and limits messages before sending anything to OpenRouter:

```ts
const messages = normalizeDigitalTwinMessages(body?.messages);
```

This is not complete abuse protection, but it is a useful baseline.

### The AI is grounded in portfolio data

The prompt explicitly says:

```txt
Use only the career context below.
```

This reduces the chance of the assistant inventing unsupported facts.

It cannot eliminate hallucinations completely, but it gives the model a strong instruction and a clear data source.

### Error details are not shown to users

The server logs the OpenRouter error:

```ts
console.error("OpenRouter request failed", {
  status: openRouterResponse.status,
  detail: detail.slice(0, 600)
});
```

But the user sees a safer message:

```ts
{ error: "The Digital Twin is unavailable right now. Please try again shortly." }
```

This avoids leaking internal implementation details into the UI.

## Accessibility Review

The chat includes several accessibility details.

### The section has a label

```tsx
<section className="digital-twin-section" id="digital-twin" aria-labelledby="digital-twin-title">
```

This connects the section to its heading.

### The chat panel has a label

```tsx
<div className="chat-panel" aria-label="Digital Twin chat">
```

This gives assistive technology a meaningful name for the chat area.

### Icons are hidden when decorative

```tsx
<MessageCircle size={16} strokeWidth={1.8} aria-hidden="true" />
```

If an icon is only visual decoration, `aria-hidden="true"` prevents screen readers from announcing it unnecessarily.

### The send button has screen-reader text

```tsx
<span className="sr-only">Send message</span>
```

The button only visually shows an icon. The hidden text gives the button an accessible name.

### New messages use `aria-live`

```tsx
<div className="chat-log" ref={logRef} aria-live="polite">
```

`aria-live="polite"` tells screen readers that this area can update. "Polite" means updates should be announced when convenient, not interrupting the user aggressively.

## How To Run It Locally

Install dependencies if needed:

```bash
bun install
```

Make sure `.env` contains:

```txt
OPENROUTER_API_KEY=your_key_here
```

Start the development server:

```bash
bun run dev
```

Open the site:

```txt
http://127.0.0.1:3000
```

Open the chat directly:

```txt
http://127.0.0.1:3000/#digital-twin
```

Build the production version:

```bash
bun run build
```

## How To Test the Feature Manually

### Test the UI

1. Open the page.
2. Click "Ask AI" in the hero area.
3. Confirm the page scrolls to the Digital Twin section.
4. Type a question.
5. Press Enter.
6. Confirm your message appears.
7. Confirm the loading state appears.
8. Confirm the assistant answer appears.

### Test starter prompts

1. Refresh the page.
2. Go to the Digital Twin section.
3. Click a starter prompt.
4. Confirm the prompt is sent.
5. Confirm the starter prompt buttons disappear after the first message.

### Test empty input

1. Go to the chat.
2. Leave the input empty.
3. Confirm the send button is disabled.

### Test the API route directly

You can send a request directly to the local API:

```bash
curl -X POST http://127.0.0.1:3000/api/digital-twin \
  -H "Content-Type: application/json" \
  -d "{\"messages\":[{\"role\":\"user\",\"content\":\"What roles fit Volodymyr best?\"}]}"
```

Expected response shape:

```json
{
  "message": "A career-specific answer from the Digital Twin."
}
```

## Detailed Code Review

### What is clean

The feature is split into sensible layers:

- `DigitalTwinChat.tsx` handles browser interaction.
- `route.ts` handles server/API behavior.
- `digitalTwin.ts` handles prompt creation and message validation.
- `profile.ts` remains the source of truth for portfolio content.
- `globals.css` handles layout and visual styling.

This separation is useful because each file has a clear responsibility.

### Why the API route is a good boundary

The route protects the API key and gives the app one controlled place to handle:

- environment variables
- input validation
- OpenRouter headers
- model choice
- error handling
- response formatting

The frontend does not need to know how OpenRouter works. It only needs to know:

```tsx
fetch("/api/digital-twin", ...)
```

That is a good abstraction.

### Why the prompt helper is separate

Keeping prompt logic out of the route makes the code easier to reason about.

The route answers: "How do we handle this HTTP request?"

The prompt helper answers: "What should the AI know, and how should it behave?"

Those are different concerns.

### Why the frontend sends the full conversation

The frontend sends the visible conversation:

```tsx
messages: nextMessages.map(({ role, content: messageContent }) => ({
  role,
  content: messageContent
}))
```

This allows the assistant to understand follow-up questions.

For example:

```txt
User: What embedded Linux work has he done?
Assistant: ...
User: Which company was that at?
```

The second user question only makes sense if the model sees the previous messages.

### Why messages are limited on the server

Even though the frontend sends the conversation, the server keeps control:

```ts
.slice(-MAX_MESSAGES)
```

That keeps the newest messages and drops older ones.

This is practical because chat history can grow forever if users keep typing.

### Why the UI updates before the API returns

The code immediately shows the user's message:

```tsx
setMessages(nextMessages);
```

This makes the UI feel responsive. The user sees that their message was accepted before the network request finishes.

Then the assistant message is added later:

```tsx
setMessages([...nextMessages, createMessage("assistant", data.message)]);
```

### Why errors are kept in separate state

The component uses:

```tsx
const [error, setError] = useState<string | null>(null);
```

An error is not the same thing as an assistant message. Keeping it separate lets the UI style it differently and avoids pretending the AI said something it did not say.

### Why the loading state is explicit

The component uses:

```tsx
const [status, setStatus] = useState<ChatStatus>("idle");
const isSubmitting = status === "submitting";
```

This is clearer than using several separate booleans. If the feature grows later, more states can be added, such as:

- `streaming`
- `failed`
- `rate-limited`

### Why the CSS uses responsive grid rules

The chat section is wide on desktop:

```css
grid-template-columns: minmax(0, 0.82fr) minmax(380px, 1.18fr);
```

But it becomes one column on smaller screens:

```css
@media (max-width: 1060px) {
  .digital-twin-layout {
    grid-template-columns: 1fr;
  }
}
```

This is important because a desktop layout often does not fit on phones.

### What was verified

The implementation was checked with:

```bash
bun run build
```

The build passed and confirmed that:

- TypeScript compiled.
- The Next.js route was valid.
- The page could be statically generated.
- The API route was recognized as dynamic server code.

The local API was also tested with a real OpenRouter-backed request, and the browser UI was checked at desktop and mobile widths.

## Mental Model for Beginners

If you are new to frontend development, this is the simplest way to think about the feature:

```txt
HTML is the structure.
CSS is the visual design.
React state is the changing memory in the browser.
The API route is the private server-side worker.
OpenRouter is the external AI service.
The prompt is the instruction manual sent to the AI.
```

The browser is good at showing UI and collecting user input.

The server is good at keeping secrets and talking to private APIs.

The AI service is good at generating language, but it needs clear instructions and trusted context.

## Common Beginner Questions

### Why not put the OpenRouter key in the React component?

Because React code runs in the browser. Browser code is public. Any visitor could inspect the JavaScript bundle and find the key.

### Why use TypeScript types if the app also checks values at runtime?

TypeScript catches mistakes while writing code. Runtime checks protect the app from real data that arrives while the app is running.

You usually want both.

### Why does the server still validate data from our own frontend?

Because users can bypass the frontend and call the API directly. Never assume the browser sends well-formed data.

### Why does the prompt say not to invent things?

AI models can produce confident but unsupported answers. The prompt sets boundaries and tells the model what to do when the portfolio does not include enough information.

### Why not stream the response word by word?

Streaming is a good improvement, but non-streaming is simpler for the first version. This version waits for the full answer, then displays it.

## 5 Suggestions for Future Improvement

1. Add streaming responses so the assistant answer appears progressively instead of waiting for the full OpenRouter response.

2. Add rate limiting to `/api/digital-twin` so one visitor cannot send too many requests in a short time.

3. Add automated tests for `normalizeDigitalTwinMessages()` and the API route error cases, especially missing API key, invalid body, empty messages, and malformed OpenRouter responses.

4. Add a small Markdown renderer with sanitization if rich formatting is desired, or keep the current plain-text approach and further tighten the prompt to avoid unsupported formatting.

5. Move the career context into a richer retrieval layer later, for example by indexing the CV and LinkedIn snapshot, so answers can reference more complete career evidence while still staying grounded.
