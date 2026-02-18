import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const docRef = doc(db, 'vendors', id);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
            return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
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
        const docRef = doc(db, 'vendors', id);

        const updateData: any = {
            ...body,
            updatedAt: serverTimestamp(),
        };

        // Ensure numbers are numbers
        if (body.paymentTerms) {
            updateData.paymentTerms = {
                ...body.paymentTerms,
                totalAmount: Number(body.paymentTerms.totalAmount || 0),
                advancePaid: Number(body.paymentTerms.advancePaid || 0),
                balanceDue: Number(body.paymentTerms.balanceDue || 0),
            };
        }

        await updateDoc(docRef, updateData);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
