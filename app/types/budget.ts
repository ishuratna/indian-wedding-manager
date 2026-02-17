export type BudgetCategoryType =
    | 'Venue'
    | 'Catering'
    | 'Decor'
    | 'Photography'
    | 'Makeup'
    | 'Entertainment'
    | 'Logistics'
    | 'Mehandi'
    | 'Pandit'
    | 'Outfits'
    | 'Miscellaneous';

export interface ExpenseItem {
    id: string;
    title: string;
    category: BudgetCategoryType;
    estimatedCost: number;
    actualCost: number;
    paidAmount: number;
    status: 'Planned' | 'Partial' | 'Paid';
    vendorId?: string; // Optional: link to a hired vendor
    notes?: string;
    updatedAt: any;
}

export interface Budget {
    id: string;
    weddingId: string;
    totalBudget: number;
    categories: {
        [key in BudgetCategoryType]?: {
            allocation: number;
            spent: number;
        };
    };
}
