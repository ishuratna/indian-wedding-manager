'use client';

interface BudgetDashboardProps {
    totalBudget: number;
    spent: number;
}

export default function BudgetDashboard({ totalBudget, spent }: BudgetDashboardProps) {
    const remaining = totalBudget - spent;
    const percentSpent = totalBudget > 0 ? (spent / totalBudget) * 100 : 0;
    const isOverBudget = spent > totalBudget;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Budget Overview</h2>
                    <p className="text-slate-500 text-sm">Track your wedding finances in real-time</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-500 mb-1">Total Budget</p>
                    <p className="text-2xl font-bold text-slate-900">₹{totalBudget.toLocaleString()}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600 font-medium">Progress</span>
                    <span className={`font-bold ${isOverBudget ? 'text-red-500' : 'text-rose-600'}`}>
                        {percentSpent.toFixed(1)}% Spent
                    </span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min(percentSpent, 100)}%` }}
                    />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Spent</p>
                    <p className="text-xl font-bold text-slate-900">₹{spent.toLocaleString()}</p>
                </div>
                <div className={`p-4 rounded-xl border ${isOverBudget ? 'bg-red-50 border-red-100' : 'bg-rose-50 border-rose-100'}`}>
                    <p className="text-xs text-rose-600 uppercase tracking-wider font-semibold mb-1">
                        {isOverBudget ? 'Over Budget' : 'Remaining'}
                    </p>
                    <p className={`text-xl font-bold ${isOverBudget ? 'text-red-600' : 'text-rose-600'}`}>
                        ₹{Math.abs(remaining).toLocaleString()}
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Cash Flow</p>
                    <p className="text-xl font-bold text-slate-900">₹{remaining.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}
