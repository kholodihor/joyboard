# Joyboard 🧩

Joyboard is a modern, collaborative Kanban-style board app built with Next.js 15, React 19, Prisma, and NextAuth. It features drag-and-drop boards/cards, team collaboration, and an integrated AI Agent chat powered by the Vercel AI SDK and LangChain.

## ✨ Features

- __Authentication__: Google OAuth via NextAuth with secure JWT sessions
- __Boards & Cards__: Create, update, delete boards/cards with modern UI
- __Collaboration__: Invite members to boards and manage access
- __Drag & Drop__: Smooth card movement with `@hello-pangea/dnd`
- __Rich UI__: Tailwind CSS + shadcn/ui components
- __AI Agent__: In-app chat using `@ai-sdk/react` and a LangGraph agent (`/api/chat`)
- __Type Safety__: Full TypeScript across the stack
- __Prisma ORM__: PostgreSQL (or compatible) database

## 🧱 Tech Stack

- Framework: `next@15`, `react@19`, `react-dom@19`
- Auth: `next-auth`
- Database: `prisma` + `@prisma/client`
- UI: Tailwind CSS + shadcn/ui (Radix primitives)
- DnD: `@hello-pangea/dnd`
- AI: `ai`, `@ai-sdk/react`, `@langchain/*`

## 📁 Project Structure

```
src/
  app/
    api/
      chat/route.ts          # AI chat streaming API (LangChain + AI SDK)
    (boards)/                # Boards routes
  components/
    boards/
      board-navbar.tsx
      board-chat.tsx         # Chat dialog using @ai-sdk/react
  lib/
  utils/
    message-converters.ts    # AI message helpers
    stream-logging.ts        # Dev-only stream logger
prisma/
  schema.prisma
```

## 🚀 Getting Started (Local)

1) __Clone & Install__

```bash
git clone <your-repo-url>
cd joyboard
npm install
```

2) __Environment Variables__

Create a `.env` file in the project root. Use `env.example` as a reference and add the AI key:

```env
# Auth
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-nextauth-secret

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname?schema=public

# AI
OPENAI_API_KEY=sk-...
```

3) __Generate Prisma Client & Migrate__

```bash
npx prisma migrate dev
```

4) __Run the App__

```bash
npm run dev
```

Open `http://localhost:3000` and sign in with Google.

## 🤖 AI Agent Chat

- UI component: `src/components/boards/board-chat.tsx`
- Hook: `useChat` from `@ai-sdk/react`
- API route: `src/app/api/chat/route.ts` (LangChain `createReactAgent` + `LangChainAdapter` streaming)
- Dev-only stream logging is applied dynamically and excluded from production bundles.

Ensure `OPENAI_API_KEY` is set. The default model in the API is `gpt-4` (update as you prefer).

## 🧪 Useful Scripts

```bash
npm run dev        # Start Next.js dev server
npm run build      # Build for production (includes prisma generate)
npm run start      # Start production server
npm run lint       # Run ESLint
npm run lint:fix   # Fix lint issues
npm run format     # Prettier format
```

## ☁️ Deploying to Vercel

1) __Create Vercel project__ and link this repository.

2) __Set Environment Variables__ in the Vercel dashboard:

- `GOOGLE_ID`
- `GOOGLE_SECRET`
- `NEXTAUTH_SECRET`
- `DATABASE_URL`
- `OPENAI_API_KEY`

3) __Build & Runtime__

- No special config is required for the dev-only logger; it is dynamically imported only in development.
- If you run into runtime issues with LangChain, add at the top of `src/app/api/chat/route.ts`:

  ```ts
  export const runtime = 'nodejs';
  ```

4) __Database__

- For production, use a hosted PostgreSQL provider (e.g., Neon, Supabase, RDS). Make sure `DATABASE_URL` is set. Run your migrations (via CI/CD or manually) before first start.

## 🛠️ Troubleshooting

- __Auth fetch errors__: Check that NextAuth routes are available and `NEXTAUTH_SECRET` is set.
- __Prisma errors__: Verify `DATABASE_URL`, run `npx prisma migrate dev`, and confirm your schema matches the DB.
- __AI API errors__: Ensure `OPENAI_API_KEY` is present and the model name is valid; inspect `/api/chat` responses.
- __UI issues__: Verify Tailwind config and that shadcn components are correctly imported from `src/components/ui/*`.

## 📜 License

MIT — see `LICENSE` (or add one if missing).

---

If you have ideas or find issues, feel free to open a PR or file an issue. Happy building!
