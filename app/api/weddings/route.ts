import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const weddingsRef = collection(db, 'weddings');
    const docRef = await addDoc(weddingsRef, {
      brideName: body.brideName,
      groomName: body.groomName,
      weddingDate: body.weddingDate,
      location: body.location,
      status: 'planning',
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating wedding:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create wedding' },
      { status: 500 }
    );
  }
}
