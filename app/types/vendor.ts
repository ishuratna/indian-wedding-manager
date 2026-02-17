export type VendorCategory =
    | 'Venue'
    | 'Catering'
    | 'Decor'
    | 'Photography'
    | 'Makeup'
    | 'Entertainment'
    | 'Logistics'
    | 'Mehandi'
    | 'Pandit'
    | 'Other';

export type VendorStatus =
    | 'Shortlisted'
    | 'Contacted'
    | 'Booked'
    | 'Paid'
    | 'Completed'
    | 'Cancelled';

export interface PaymentTerms {
    totalAmount: number;
    advancePaid: number;
    balanceDue: number;
    dueDate?: string;
    status: 'Pending' | 'Partial' | 'Paid';
}

export interface Vendor {
    id?: string;
    weddingId: string;

    // Business Info
    businessName: string;
    contactName: string;
    category: VendorCategory;

    // Contact
    phone: string;
    email?: string;
    address?: string;

    // Status & Details
    status: VendorStatus;
    rating?: number; // 1-5
    notes?: string;

    // Financials
    paymentTerms: PaymentTerms;

    whatsappOptIn: boolean;
    createdAt?: any;
}

// Marketplace listing vendor (pre-populated catalog)
export interface MarketplaceVendor {
    id: string;
    name: string;
    category: VendorCategory;
    description: string;
    rating: number;       // 1–5
    reviewCount: number;
    priceRange: string;   // e.g. "₹50,000 – ₹2,00,000"
    priceMin: number;     // for sorting
    city: string;
    tags: string[];
    phone: string;
    email: string;
    address: string;
    highlights: string[];
    portfolio: string[];  // image URLs
}
