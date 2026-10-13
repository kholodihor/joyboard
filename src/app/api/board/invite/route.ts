import { NextResponse } from 'next/server';

import { createTransport } from 'nodemailer';
import { z } from 'zod';

import { AccessError, requireAdmin, requireBoardAccess } from '@/lib/access';

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  debug: process.env.SMTP_DEBUG === 'true',
});

const InviteBody = z.object({
  email: z.string().trim().email(),
  boardId: z.string().min(1),
});

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    char =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        char
      ]!,
  );

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const parsed = InviteBody.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const { email, boardId } = parsed.data;
    const { board } = await requireBoardAccess(boardId);

    const boardName = escapeHtml(board.title);
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/board/${board.id}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: `Invitation to join "${board.title}" board`,
      html: `
        <h2>You've been invited to join a board on JoyBoard!</h2>
        <p>Click the link below to join the "${boardName}" board:</p>
        <a href="${inviteLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">Join Board</a>
        <p>If you didn't request this invitation, please ignore this email.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AccessError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error sending invitation:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 },
    );
  }
}
