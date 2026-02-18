'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { db } from '@/lib/firebase/config';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import BudgetDashboard from '@/components/budget/BudgetDashboard';
import BudgetCategoryCard from '@/components/budget/BudgetCategoryCard';
import { BudgetCategoryType, ExpenseItem } from '@/app/types/budget';
import Link from 'next/link';

export default function BudgetPage() {
    const { weddingId } = useAuth();
    const [totalBudget, setTotalBudget] = useState(1000000); // Default
    const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!weddingId) return;

        // Fetch Wedding Info for Total Budget
        const fetchWeddingData = async () => {
            const weddingDoc = await getDoc(doc(db, 'weddings', weddingId));
            if (weddingDoc.exists()) {
                setTotalBudget(weddingDoc.data().budget || 1000000);
            }
        };
        fetchWeddingData();

        // Fetch Hired Vendors as Expenses
        const q = query(collection(db, 'vendors'), where('weddingId', '==', weddingId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const vendorExpenses: ExpenseItem[] = snapshot.docs
                .map(doc => {
                    const data = doc.data();
                    const total = data.paymentTerms?.totalAmount || 0;
                    const paid = data.paymentTerms?.advancePaid || 0;

                    let status: 'Planned' | 'Partial' | 'Paid' = 'Planned';
                    if (paid >= total && total > 0) status = 'Paid';
                    else if (paid > 0) status = 'Partial';

                    return {
                        id: doc.id,
                        title: data.businessName,
                        category: data.category as BudgetCategoryType,
                        estimatedCost: total,
                        actualCost: total,
                        paidAmount: paid,
                        status,
                        vendorId: doc.id,
                        updatedAt: data.updatedAt,
                        _status: data.status
                    } as any;
                })
                .filter(item => item._status !== 'Shortlisted' && item._status !== 'Contacted');

            setExpenses(vendorExpenses);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [weddingId]);

    const totalSpent = expenses.reduce((sum, item) => sum + item.actualCost, 0);

    const CATEGORIES: BudgetCategoryType[] = [
        'Venue', 'Catering', 'Decor', 'Photography', 'Entertainment',
        'Logistics', 'Makeup', 'Mehandi', 'Pandit', 'Outfits', 'Miscellaneous'
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 font-serif">Budget Manager</h1>
                    <p className="text-slate-500 mt-1">Manage your wedding finances and vendor payments</p>
                </div>
                <Link
                    href="/vendors"
                    className="px-4 py-2 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-colors shadow-sm"
                >
                    Add Expense (via Vendors)
                </Link>
            </div>

            <BudgetDashboard totalBudget={totalBudget} spent={totalSpent} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CATEGORIES.map(category => {
                    const categoryItems = expenses.filter(e => e.category === category);
                    // For now, we use a simple percentage allocation or fixed values
                    // In a future update, users can set these per category
                    const allocation = (totalBudget * 0.1);

                    return (
                        <BudgetCategoryCard
                            key={category}
                            category={category}
                            items={categoryItems}
                            allocation={allocation}
                        />
                    );
                })}
            </div>
        </div>
    );
}
