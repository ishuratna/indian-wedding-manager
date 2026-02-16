# 💍 EasyWeddings India

EasyWeddings is a premium, AI-powered wedding management platform designed for professional planners to coordinate unforgettable celebrations with ease.

## 🚀 Live Environment
The production site is hosted at **[easyweddings.in](https://easyweddings.in)**.

## ✨ Core Features

- **WhatsApp Guest Assistant**: Automated attendance and logistics collection via Meta Cloud API.
- **Vendor Marketplace**: A curated catalog of 60+ top-tier venues, decorators, and photographers.
- **Planner Dashboard**: A centralized command center for tracking RSVPs, vendor payments, and wedding timelines.
- **Multi-Tenant Readiness**: Each planner has an isolated workspace linked to their account.

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Firebase (Authentication & Firestore)
- **Messaging**: Meta Cloud API (WhatsApp Business)
- **Deployment**: Vercel

## 📦 Deployment Instructions

1. **Environment Variables**:
   Ensure the following are configured in your Vercel Dashboard:
   - `NEXT_PUBLIC_FIREBASE_*` (Config from Firebase Console)
   - `WHATSAPP_API_TOKEN` (Permanent System User Token)
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_VERIFY_TOKEN` (Used for webhook verification)

2. **Firebase Auth**:
   Add `easyweddings.in` to **Authorized Domains** in the Firebase Console.

3. **WhatsApp Webhook**:
   Configure the callback URL to `https://easyweddings.in/api/whatsapp/webhook` in the Meta Developer Portal.

## 👨‍💻 Local Development

```bash
npm install
npm run dev
```

---
*Built with ❤️ for the Indian Wedding Industry.*

