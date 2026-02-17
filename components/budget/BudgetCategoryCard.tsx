'use client';

import { BudgetCategoryType, ExpenseItem } from '@/app/types/budget';

interface BudgetCategoryCardProps {
    category: BudgetCategoryType;
    items: ExpenseItem[];
    allocation: number;
}

export default function BudgetCategoryCard({ category, items, allocation }: BudgetCategoryCardProps) {
    const totalSpent = items.reduce((sum, item) => sum + item.actualCost, 0);
    const totalPaid = items.reduce((sum, item) => sum + item.paidAmount, 0);
    const balance = totalSpent - totalPaid;

    const icons: Record<string, string> = {
        Venue: '🏰',
        Catering: '🍽️',
        Decor: '✨',
        Photography: '📸',
        Makeup: '💄',
        Entertainment: '🎵',
        Logistics: '🚗',
        Mehandi: '🌿',
        Pandit: '🙏',
        Outfits: '👗',
        Miscellaneous: '📦'
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{icons[category] || '💰'}</span>
                    <div>
                        <h3 className="font-bold text-slate-900">{category}</h3>
                        <p className="text-xs text-slate-500">{items.length} Items</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Budget</p>
                    <p className="font-bold text-slate-900">₹{allocation.toLocaleString()}</p>
                </div>
            </div>

            <div className="p-5">
                {items.length > 0 ? (
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between items-start group">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 group-hover:text-rose-600 transition-colors">
                                        {item.title}
                                    </p>
                                    <div className="flex gap-2 items-center mt-1">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${item.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                item.status === 'Partial' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-slate-100 text-slate-600'
                                            }`}>
                                            {item.status}
                                        </span>
                                        <span className="text-[10px] text-slate-400">₹{item.actualCost.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-900">₹{item.paidAmount.toLocaleString()}</p>
                                    <p className="text-[10px] text-slate-400">Paid</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-sm text-slate-400 italic">No expenses added yet</p>
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center font-bold">
                    <span className="text-sm text-slate-600">Total Spent</span>
                    <span className="text-slate-900">₹{totalSpent.toLocaleString()}</span>
                </div>
                {balance > 0 && (
                    <div className="mt-1 flex justify-between items-center text-xs">
                        <span className="text-slate-400 italic">Balance Due</span>
                        <span className="text-amber-600 font-medium">₹{balance.toLocaleString()}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
