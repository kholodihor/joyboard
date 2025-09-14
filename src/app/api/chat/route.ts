import { NextRequest, NextResponse } from 'next/server';

import { SystemMessage } from '@langchain/core/messages';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';
import { LangChainAdapter, type Message } from 'ai';

import { convertVercelMessageToLangChainMessage } from '@/utils/message-converters';

const AGENT_SYSTEM_TEMPLATE = `You are a personal assistant. You are a helpful assistant that can answer questions and help with tasks on Joyboard canban board. You have access to a set of tools, use the tools as needed to answer the user's question.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const messages = (body.messages ?? [])
      .filter(
        (message: Message) =>
          message.role === 'user' || message.role === 'assistant',
      )
      .map(convertVercelMessageToLangChainMessage);

    const llm = new ChatOpenAI({
      model: 'gpt-4',
      temperature: 0,
    });

    const agent = createReactAgent({
      llm,
      tools: [],
      messageModifier: new SystemMessage(AGENT_SYSTEM_TEMPLATE),
    });

    let eventStream = agent.streamEvents({ messages }, { version: 'v2' });

    // Only import and apply logging in development to avoid any prod warnings or overhead.
    if (process.env.NODE_ENV === 'development') {
      const { logToolCallsInDevelopment } = await import(
        '@/utils/stream-logging'
      );
      eventStream = logToolCallsInDevelopment(eventStream);
    }

    return LangChainAdapter.toDataStreamResponse(eventStream);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
