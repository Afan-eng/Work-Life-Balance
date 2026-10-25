# Balance Studio — Community Engagement & Life-in-Balance Platform

A premium, modern, highly visual and fully interactive multi-page web application engineered around botanical calm and editorial wellness.

## 🌿 Architecture & Tech Stack

- **Frontend**: React (Vite) + TypeScript + Tailwind CSS + shadcn/ui tokens + Lucide React.
- **Routing**: Clean client-side SPA routing (`react-router-dom`) with active route tracking and smooth view transitions.
- **Backend & Automation**: [n8n Cloud](https://n8n.io). All backend logic, AI processing relays, scheduled jobs, and payment workflows run through webhook-based n8n workflows (`https://<your-n8n-instance>.app.n8n.cloud/webhook/...`).
- **Database & Auth**: [Supabase](https://supabase.com) (PostgreSQL + Supabase Auth) with Row Level Security (RLS) on all user-scoped tables:
  - `user_streaks`
  - `user_habits`
  - `user_goals`
  - `user_mood_logs`
  - `chat_threads`
  - `chat_messages`
  - `payments`
- **Media Storage**: [Cloudinary](https://cloudinary.com) for profile avatars and 21-day community challenge proof photos.
- **AI Processing**: Empathetic wellness coaching ("Balance Guide") orchestrated via n8n webhook calling third-party LLMs.
- **Payments**: Razorpay Checkout modal for subscriptions and masterclass workshop passes with n8n webhook signature verification.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(The application includes graceful simulation/fallback handling, so it runs completely out-of-the-box even before you set up live cloud credentials!)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🗄️ Database Setup (Supabase)
To initialize the database in your Supabase project:
1. Open your Supabase Dashboard -> **SQL Editor**.
2. Copy and execute the contents of `src/lib/supabase_schema.sql`.
3. All tables, RLS policies, and indexes will be created automatically.

---

## ⚡ n8n Webhook Endpoints
The frontend is configured to communicate with the following webhooks:
- `POST /webhook/balance-ai-chat`: Relays user prompts and chat history to the LLM.
- `POST /webhook/razorpay-order-create`: Generates authentic Razorpay Order IDs.
- `POST /webhook/razorpay-verify`: Validates payment signatures and provisions Supabase membership passes.
- `POST /webhook/contact-inquiry`: Relays crisis and support messages.

---

## 🎨 Design System
- **Colors**: Soft warm linen (`#F7F6F0`), deep ink body text (`#173D2C`), sage/forest green primary accents (`#2F9A5D`), and dark mode botanical night (`#0D1C14`).
- **Typography**: Sora (display headings) & Manrope (body and data tables).
