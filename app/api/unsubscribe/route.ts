import { NextResponse, type NextRequest } from 'next/server';
import { adminDb } from '@/lib/server/firebase-admin';
import { verifyUid } from '@/lib/server/unsubscribe-token';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function htmlResponse(title: string, body: string, status = 200) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:80px auto;padding:0 24px;color:#1c1b1f;text-align:center;}h1{font-size:24px;margin:0 0 16px;}p{color:#49454f;line-height:1.5;}</style>
</head><body><h1>${title}</h1><p>${body}</p></body></html>`;
  return new NextResponse(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get('uid');
  const token = req.nextUrl.searchParams.get('t');
  if (!uid || !token) {
    return htmlResponse('Invalid link', 'This unsubscribe link is missing required parameters.', 400);
  }
  if (!verifyUid(uid, token)) {
    return htmlResponse('Invalid link', 'This unsubscribe link is not valid.', 400);
  }

  await adminDb().collection('users').doc(uid).update({ reminderEnabled: false });
  return htmlResponse(
    'Reminders off',
    'You will no longer receive daily reminder emails. You can re-enable them from your profile inside the app.'
  );
}
