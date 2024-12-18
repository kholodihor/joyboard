import { NextResponse } from 'next/server';

import { createTransport } from 'nodemailer';

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

export async function POST(req: Request) {
  try {
    const { email, boardId, boardName } = await req.json();

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/board/${boardId}`;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: `Invitation to join "${boardName}" board`,
      html: `
        <h2>You've been invited to join a board on JoyBoard!</h2>
        <p>Click the link below to join the "${boardName}" board:</p>
        <a href="${inviteLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">Join Board</a>
        <p>If you didn't request this invitation, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending invitation:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 },
    );
  }
}
