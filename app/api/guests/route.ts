import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/firebase/config';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Creating guest:', body);

    if (!body.weddingId || !body.fullName || !body.phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const guestData = {
      weddingId: body.weddingId,
      fullName: body.fullName,
      phone: body.phone,
      email: body.email || '',
      whatsappOptIn: body.whatsappOptIn ?? true,

      // Basic Info
      gender: body.gender || 'Other',
      ageGroup: body.ageGroup || 'Adult',
      side: body.side || 'Common',
      group: body.group || 'Other',
      relationship: body.relationship || '',

      // Headcount
      adults: Number(body.adults || 0),
      kids: Number(body.kids || 0),
      infants: Number(body.infants || 0),
      totalHeadcount: Number(body.totalHeadcount || (Number(body.adults || 0) + Number(body.kids || 0) + Number(body.infants || 0))),

      // Registration State
      registrationStage: body.registrationStage || 'RSVP',

      // Attendance
      rsvpStatus: body.rsvpStatus || 'Pending',
      events: body.events || [],

      // Dietary
      dietaryRestrictions: body.dietaryRestrictions || [],
      allergies: body.allergies || '',

      // Travel & Stay
      arrival: body.arrival || null,
      departure: body.departure || null,
      accommodation: body.accommodation || null,

      createdAt: serverTimestamp(),
    };

    const guestsRef = collection(db, 'guests');
    const docRef = await addDoc(guestsRef, guestData);

    console.log('Guest created:', docRef.id);
    return NextResponse.json({ id: docRef.id, success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Guest creation error:', error);
    return NextResponse.json({
      error: error.message || 'Failed to create guest'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const weddingId = searchParams.get('weddingId');

    if (!weddingId) {
      return NextResponse.json({ error: 'weddingId required' }, { status: 400 });
    }

    const q = query(collection(db, 'guests'), where('weddingId', '==', weddingId));
    const snapshot = await getDocs(q);
    const guests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(guests);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
