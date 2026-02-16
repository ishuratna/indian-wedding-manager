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
        console.log('Creating vendor:', body);

        if (!body.weddingId || !body.businessName || !body.category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const vendorData = {
            weddingId: body.weddingId,
            businessName: body.businessName,
            contactName: body.contactName || '',
            category: body.category,

            phone: body.phone || '',
            email: body.email || '',
            address: body.address || '',

            status: body.status || 'Shortlisted',
            rating: body.rating || 0,
            notes: body.notes || '',

            paymentTerms: {
                totalAmount: Number(body.paymentTerms?.totalAmount || 0),
                advancePaid: Number(body.paymentTerms?.advancePaid || 0),
                balanceDue: Number(body.paymentTerms?.balanceDue || 0),
                dueDate: body.paymentTerms?.dueDate || null,
                status: body.paymentTerms?.status || 'Pending'
            },

            whatsappOptIn: body.whatsappOptIn ?? true,
            createdAt: serverTimestamp(),
        };

        const vendorsRef = collection(db, 'vendors');
        const docRef = await addDoc(vendorsRef, vendorData);

        console.log('Vendor created:', docRef.id);
        return NextResponse.json({ id: docRef.id, success: true }, { status: 201 });
    } catch (error: any) {
        console.error('Vendor creation error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to create vendor'
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

        const q = query(collection(db, 'vendors'), where('weddingId', '==', weddingId));
        const snapshot = await getDocs(q);
        const vendors = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(vendors);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
