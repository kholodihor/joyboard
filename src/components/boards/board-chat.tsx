'use client';

import { type FormEvent, useState } from 'react';

import { useChat } from '@ai-sdk/react';
import type { Message } from 'ai';
import { LoaderCircle, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const BoardChat = () => {
  const [open, setOpen] = useState(false);

  const chat = useChat({
    api: '/api/chat',
  });

  const isStreaming = chat.status === 'streaming';

  function clearChat() {
    if (isStreaming) return;
    // Reset chat history and input
    chat.setMessages([]);
    chat.setInput('');
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isStreaming) return;
    chat.handleSubmit(e);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="py-5">
          AI Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Chat</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6">
          <div className="h-80 overflow-y-auto rounded-md border bg-background/60">
            <div className="flex flex-col gap-3 p-4">
              {chat.messages.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  Start a conversation…
                </div>
              ) : (
                chat.messages.map((m: Message) => (
                  <div
                    key={m.id}
                    className={
                      m.role === 'user'
                        ? 'max-w-[80%] self-end rounded-lg bg-primary px-3 py-2 text-primary-foreground'
                        : 'max-w-[80%] self-start rounded-lg bg-muted px-3 py-2 text-foreground'
                    }
                  >
                    {m.content}
                  </div>
                ))
              )}
              {isStreaming && (
                <div className="flex max-w-[80%] items-center gap-2 self-start rounded-lg bg-muted px-3 py-2 text-foreground">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  <span>Thinking…</span>
                </div>
              )}
            </div>
          </div>
          <form onSubmit={onSubmit} className="mt-4 flex items-end gap-2">
            <Textarea
              value={chat.input}
              onChange={chat.handleInputChange}
              placeholder="What can I help you with?"
              className="min-h-[14px]"
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!isStreaming) chat.handleSubmit();
                }
              }}
            />

            <Button type="submit" disabled={isStreaming || !chat.input.trim()}>
              {isStreaming ? 'Sending…' : 'Send'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={clearChat}
              disabled={isStreaming || chat.messages.length === 0}
              className="bg-red-300 text-red-600 hover:bg-red-400 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BoardChat;
