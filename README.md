# ⚡ ShopEase — MEAN Stack E-Commerce Store

A full-featured e-commerce application built with **MongoDB, Express, Angular, and Node.js**.

---

## 🚀 Features

| Feature | Details |
|---|---|
| 🛍️ Product Listings | Browse, search, filter by category/price, sort, paginate |
| 🔍 Search | Full-text search across product names, descriptions, tags |
| 🔐 Authentication | JWT-based register/login, protected routes |
| 🛒 Shopping Cart | Add/remove/update items, persisted per user |
| 💳 Checkout | Shipping form + Stripe payment integration |
| 📦 Order Management | Order history, status tracking, detail view |
| ⭐ Reviews | Authenticated users can leave product reviews |
| 🛠️ Admin Dashboard | Stats, manage products/orders/users |
| 📱 Responsive | Works on mobile, tablet, desktop |

---

## 📁 Project Structure

```
shopease/
├── backend/             # Node.js + Express API
│   ├── models/          # Mongoose models (User, Product, Order, Cart)
│   ├── routes/          # API routes (auth, products, orders, cart, payment, admin)
│   ├── middleware/       # JWT auth middleware
│   ├── server.js        # Entry point
│   ├── seed.js          # Database seeder
│   └── .env.example     # Environment variables template
│
├── frontend/            # Angular 16 app
│   └── src/app/
│       ├── components/  # All page components
│       ├── services/    # API services (auth, product, cart, order, admin)
│       ├── guards/      # Auth & Admin route guards
│       └── interceptors/ # JWT interceptor
│
└── package.json         # Root scripts
```

---

## ⚙️ Prerequisites

- **Node.js** v18+ — https://nodejs.org
- **MongoDB** running locally or MongoDB Atlas URI
- **Angular CLI** — `npm install -g @angular/cli`
- **Git** — https://git-scm.com

---

## 🛠️ Local Setup

### 1. Clone / navigate to the project
```bash
cd shopease
```

### 2. Install all dependencies
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```

Or manually:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure environment variables
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopease
JWT_SECRET=your_super_secret_key_change_this_in_production
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
CLIENT_URL=http://localhost:4200
```

### 4. Seed the database (optional but recommended)
```bash
cd backend
node seed.js
```

This creates:
- **Admin account:** `admin@shopease.com` / `admin123`
- **User account:** `john@example.com` / `user123`
- **8 sample products** across multiple categories

### 5. Start the development servers

**Option A — Run both together from root:**
```bash
npm install -g concurrently
npm run dev
```

**Option B — Run separately:**
```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 4200)
cd frontend && npm start
```

### 6. Open in browser
- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:5000/api/health

---

## 🌐 Push to GitHub

### Step 1: Create repo on GitHub
Go to https://github.com/new and create a new repository named `shopease`. Leave it empty (no README, no .gitignore).

### Step 2: Initialize and push
```bash
cd shopease
git init
git add .
git commit -m "Initial commit: ShopEase MEAN stack e-commerce app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shopease.git
git push -u origin main
```

> Replace `YOUR_USERNAME` with your GitHub username.

### OR — Use GitHub CLI (1 command!)
```bash
cd shopease
git init && git add . && git commit -m "Initial commit: ShopEase"
gh repo create shopease --public --source=. --remote=origin --push
```

---

## 💳 Stripe Setup

1. Create account at https://stripe.com
2. Get your test keys from the Stripe Dashboard
3. Add them to `backend/.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

For production Stripe integration, replace the demo payment simulation in `checkout.component.ts` with Stripe Elements.

---

## 🚢 Production Deployment

### Backend (e.g., Railway, Render, Heroku)
1. Set environment variables on your hosting platform
2. Use MongoDB Atlas for the database URI
3. Deploy the `backend/` folder

### Frontend (e.g., Vercel, Netlify)
1. Update `frontend/src/environments/environment.prod.ts` with your backend URL
2. Build: `cd frontend && ng build --configuration production`
3. Deploy the `frontend/dist/shopease-frontend/` folder

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get all (filter/search/paginate) |
| GET | `/api/products/featured` | Featured products |
| GET | `/api/products/:id` | Single product |
| POST | `/api/products` | Create (Admin) |
| PUT | `/api/products/:id` | Update (Admin) |
| DELETE | `/api/products/:id` | Delete (Admin) |

### Cart
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart/add` | Add item |
| PUT | `/api/cart/update` | Update quantity |
| DELETE | `/api/cart/remove/:id` | Remove item |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Create order |
| GET | `/api/orders/my` | My orders |
| GET | `/api/orders/:id` | Order detail |
| PUT | `/api/orders/:id/pay` | Mark paid |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/users` | All users |
| PUT | `/api/admin/users/:id/role` | Change role |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 16, TypeScript, CSS3 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Payments | Stripe |
| Dev Tools | Nodemon, Concurrently |

---

Made with ❤️ — ShopEase MEAN Stack
