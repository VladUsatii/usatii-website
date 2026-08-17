import { NextResponse } from 'next/server';
import { createQrLead } from '@/lib/portal/qr-leads';

export const runtime = 'nodejs';

function clean(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const fullName = clean(body?.fullName, 120);
    const phone = clean(body?.phone, 40);

    if (!fullName || !phone) {
      return NextResponse.json({ error: 'Name and phone number are required.' }, { status: 400 });
    }
    if (!/[0-9]{7}/.test(phone.replace(/\D/g, ''))) {
      return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
    }

    const lead = await createQrLead({
      fullName,
      phone,
      destinationPath: '/software',
      campaign: 'software-qr',
    });
    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error('Failed to save QR lead', error);
    return NextResponse.json({ error: 'Unable to save your information right now.' }, { status: 500 });
  }
}

