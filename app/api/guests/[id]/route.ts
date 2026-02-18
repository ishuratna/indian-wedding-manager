import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const docRef = doc(db, 'guests', id);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
            return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
        }

        return NextResponse.json({ id: snapshot.id, ...snapshot.data() });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const docRef = doc(db, 'guests', id);

        const updateData: any = {
            ...body,
            updatedAt: serverTimestamp(),
        };

        // Ensure numbers are numbers if provided
        if (body.adults !== undefined) updateData.adults = Number(body.adults);
        if (body.kids !== undefined) updateData.kids = Number(body.kids);
        if (body.infants !== undefined) updateData.infants = Number(body.infants);
        if (updateData.adults !== undefined || updateData.kids !== undefined || updateData.infants !== undefined) {
            const snapshot = await getDoc(docRef);
            const currentData = snapshot.data();
            const adults = updateData.adults ?? currentData?.adults ?? 0;
            const kids = updateData.kids ?? currentData?.kids ?? 0;
            const infants = updateData.infants ?? currentData?.infants ?? 0;
            updateData.totalHeadcount = adults + kids + infants;
        }

        await updateDoc(docRef, updateData);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
