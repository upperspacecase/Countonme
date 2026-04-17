import { NextResponse, type NextRequest } from 'next/server';
import { Resend } from 'resend';
import { adminDb } from '@/lib/server/firebase-admin';
import { signUid } from '@/lib/server/unsubscribe-token';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const REMINDER_HOUR = 9; // Local hour in the user's timezone when we nudge.

function dateKeyInZone(d: Date, tz: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d);
  const map: Record<string, string> = {};
  for (const p of parts) if (p.type !== 'literal') map[p.type] = p.value;
  return `${map.year}-${map.month}-${map.day}`;
}

function hourInZone(d: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour: '2-digit',
    hour12: false,
  }).formatToParts(d);
  const h = parts.find((p) => p.type === 'hour')?.value ?? '0';
  return parseInt(h, 10);
}

function authorized(req: NextRequest): boolean {
  const header = req.headers.get('authorization');
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return header === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const from = process.env.REMINDER_FROM;
  const resendKey = process.env.RESEND_API_KEY;
  const appOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN || 'https://countonme-dun.vercel.app';

  if (!from || !resendKey) {
    return NextResponse.json(
      { error: 'REMINDER_FROM or RESEND_API_KEY not configured' },
      { status: 500 }
    );
  }

  const resend = new Resend(resendKey);
  const db = adminDb();
  const now = new Date();

  const snap = await db
    .collection('users')
    .where('reminderEnabled', '==', true)
    .get();

  const sent: string[] = [];
  const skipped: Array<{ uid: string; reason: string }> = [];
  const failed: Array<{ uid: string; error: string }> = [];

  for (const userDoc of snap.docs) {
    const data = userDoc.data() as {
      email?: string;
      displayName?: string;
      timezone?: string;
      habit?: string;
      streak?: number;
      lastReminderSentOn?: string;
    };
    const uid = userDoc.id;
    const tz = data.timezone || 'UTC';
    const localHour = hourInZone(now, tz);
    const today = dateKeyInZone(now, tz);

    if (localHour !== REMINDER_HOUR) {
      skipped.push({ uid, reason: `hour ${localHour} != ${REMINDER_HOUR}` });
      continue;
    }
    if (data.lastReminderSentOn === today) {
      skipped.push({ uid, reason: 'already reminded today' });
      continue;
    }
    if (!data.email) {
      skipped.push({ uid, reason: 'no email' });
      continue;
    }

    // Skip if they already checked in today.
    const checkinSnap = await db
      .collection('users')
      .doc(uid)
      .collection('checkins')
      .doc(today)
      .get();
    if (checkinSnap.exists) {
      skipped.push({ uid, reason: 'already checked in' });
      await userDoc.ref.update({ lastReminderSentOn: today });
      continue;
    }

    const habit = data.habit || 'Show up today';
    const firstName = (data.displayName || 'there').split(' ')[0];
    const streak = data.streak ?? 0;
    const unsubToken = signUid(uid);
    const unsubLink = `${appOrigin}/api/unsubscribe?uid=${encodeURIComponent(uid)}&t=${unsubToken}`;

    const streakLine =
      streak > 0
        ? `You're on a ${streak}-day streak. Keep it alive.`
        : `Today is a good day to start.`;

    const subject = streak > 0 ? `Day ${streak + 1} — did you show up?` : `Did you show up today?`;
    const text = [
      `Hey ${firstName},`,
      '',
      `"${habit}"`,
      '',
      streakLine,
      '',
      `Check in: ${appOrigin}/`,
      '',
      `— Countonme`,
      '',
      `Unsubscribe: ${unsubLink}`,
    ].join('\n');

    const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1c1b1f;">
  <p style="font-size:16px;margin:0 0 24px;">Hey ${firstName},</p>
  <p style="font-size:22px;font-style:italic;line-height:1.4;margin:0 0 24px;color:#1c1b1f;">&ldquo;${habit}&rdquo;</p>
  <p style="font-size:15px;margin:0 0 32px;color:#49454f;">${streakLine}</p>
  <p style="margin:0 0 32px;">
    <a href="${appOrigin}/" style="display:inline-block;background:#4a6741;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600;">Check in</a>
  </p>
  <p style="font-size:12px;color:#79747e;margin:48px 0 0;">
    <a href="${unsubLink}" style="color:#79747e;">Stop these reminders</a>
  </p>
</div>`.trim();

    try {
      await resend.emails.send({
        from,
        to: data.email,
        subject,
        text,
        html,
      });
      await userDoc.ref.update({ lastReminderSentOn: today });
      sent.push(uid);
    } catch (err) {
      failed.push({ uid, error: err instanceof Error ? err.message : String(err) });
    }
  }

  return NextResponse.json({
    sent: sent.length,
    skipped: skipped.length,
    failed: failed.length,
    details: { sent, skipped, failed },
  });
}
