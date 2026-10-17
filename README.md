# Electro Hub ⚡ - Modern Electronics & Tech E-Commerce

> **Live Website:** [https://electro-hub-website.vercel.app](https://electro-hub-website.vercel.app)  
> **Backend API:** [https://electro-hub-1.vercel.app](https://electro-hub-1.vercel.app)  
> **GitHub Repository:** [https://github.com/fares-aym2n/Electro-Hub-WebSite](https://github.com/fares-aym2n/Electro-Hub-WebSite)

---

## 📌 Project Overview

**Electro Hub** is a full-featured, responsive e-commerce web application built for browsing and purchasing high-performance electronics, computer hardware, audio equipment, and tech gadgets. It delivers an intuitive shopping experience with real-time server synchronization, animated micro-interactions, cookie-based session persistence, and secure Stripe checkout.

---

## ✨ Features

### 🔐 Authentication & Profile Management
- **Modal Popup Auth Flow**: Seamless Sign In, Sign Up, and Password Reset modals without full-page navigation.
- **Persistent Sessions**: Reliable dual-token & HttpOnly cookie authentication that persists across browser reloads.
- **Customer Profile**: User avatar upload, profile detail editing, and password updating.

### 🛒 Real-Time Shopping Cart
- **Server Synchronized**: Cart items and totals are stored directly on the backend.
- **Multiple Clicks / Atomic Increments**: Repeatedly clicking "Add to Cart" increments the quantity smoothly without race conditions.
- **Smooth Animations**: Cart icon bump, bouncing badge counter, and floating toast with product thumbnail and direct "View Cart" CTA.
- **Stock Validation**: Enforces backend stock limits with immediate warning alerts.

### ❤️ Personal Wishlist
- **Account Synchronized**: Save favorite hardware to your account across devices.
- **Optimistic Updates**: Instant UI responsiveness with automatic server synchronization.

### 🏷️ Product Catalog & Best Offers
- **Best Offers Carousel**: Dynamic discount carousel connected directly to backend offers API.
- **Advanced Filtering**: Filter by category, dual-slider price range, rating, in-stock status, and sorting options.
- **Interactive Product Details**: Gallery image angles, real-time stock counters, rating breakdowns, and related hardware.

### ⭐ Verified Customer Reviews
- **Community Ratings**: Star rating distribution and average calculations.
- **Review Ownership**: Authenticated users can write, edit, and delete their own reviews with live feedback.

### 💳 Checkout & Order History
- **Stripe Payment Gateway**: Integrated Stripe checkout for secure credit/debit card processing.
- **Cash on Delivery (COD)**: Alternate payment option with shipping fee calculation.
- **Order Tracking**: Order history page with status badges (`Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`).
- **Success & Cancel Pages**: Dedicated post-checkout confirmation screens.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linter**: [Oxlint](https://oxc.rs/)

### Backend Integration
- **Platform**: [NestJS](https://nestjs.com/) / [Node.js](https://nodejs.org/)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT & HttpOnly Cookies
- **Payments**: Stripe API

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/fares-aym2n/Electro-Hub-WebSite.git
cd "Electro-Hub-WebSite"
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Leave empty in local development to route through Vite proxy (/api)
VITE_API_BASE_URL=

# Stripe publishable key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 4. Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### 5. Building for Production

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── auth/          # Authentication modal & forms (Sign In, Sign Up, Forgot Password)
│   ├── catalog/       # Price sliders and filtering components
│   ├── common/        # Shared components (BackButton, CartToast, etc.)
│   ├── electro/       # Global ElectroHeader, Footer, and navigation
│   ├── home/          # Hero banner, CategoryCarousel, OffersSection
│   ├── pages/         # Page views (Home, Products, Details, Checkout, Orders, Wishlist)
│   ├── profile/       # Edit profile & change password modals
│   └── reviews/       # Review list, modal dialogs for edit and delete
├── context/
│   ├── AuthContext.tsx        # Authentication & modal state
│   ├── CartContext.tsx        # Server cart, increments, and animations
│   ├── FavoritesContext.tsx   # Server wishlist synchronization
│   └── NavigationContext.tsx  # Route and filter state management
├── services/          # API clients (auth, cart, products, orders, reviews, wishlist)
├── types/             # TypeScript definitions & API models
└── utils/             # Formatters, helpers, and calculation utilities
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
