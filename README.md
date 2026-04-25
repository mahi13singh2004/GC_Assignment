# BidFlow - British Auction RFQ System

A modern web-based Request for Quotation (RFQ) platform implementing British Auction mechanics with automatic time extensions to ensure fair and transparent supplier bidding.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [British Auction Logic](#british-auction-logic)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

BidFlow is a comprehensive RFQ management system that enables buyers to create competitive auctions and suppliers to submit bids. The platform implements British Auction rules where bidding activity near the auction end time automatically extends the deadline, preventing last-second bidding manipulation and encouraging fair competition.

### Key Highlights

- **Role-Based Access**: Separate interfaces for Buyers and Suppliers
- **British Auction Mechanics**: Automatic time extensions based on bidding activity
- **Real-Time Updates**: Live bid rankings and activity logs
- **Secure Authentication**: JWT-based authentication with HTTP-only cookies
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

## ✨ Features

### For Buyers
- ✅ Create RFQs with customizable auction parameters
- ✅ Configure extension triggers (bid received, rank change, L1 change)
- ✅ Set trigger windows and extension durations
- ✅ View all submitted bids with rankings (L1, L2, L3...)
- ✅ Track auction activity with detailed logs
- ✅ Monitor auction status (upcoming, active, closed, force closed)

### For Suppliers
- ✅ Browse available RFQs
- ✅ Submit competitive bids
- ✅ View real-time rankings
- ✅ Track bid history
- ✅ Receive automatic time extension notifications

### British Auction Features
- ✅ **Trigger Window**: Monitor bidding activity in the last X minutes
- ✅ **Extension Duration**: Automatically extend auction by Y minutes
- ✅ **Three Extension Triggers**:
  - Bid Received: Extend when any bid is placed
  - Any Rank Change: Extend when any supplier ranking changes
  - L1 Rank Change: Extend only when the lowest bidder changes
- ✅ **Forced Close Time**: Hard deadline that cannot be exceeded
- ✅ **Activity Logging**: Complete audit trail of all auction events

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.0.11
- **Styling**: TailwindCSS 4.0.0
- **State Management**: Zustand 5.0.2
- **HTTP Client**: Axios 1.7.9
- **Routing**: React Router DOM 7.1.3

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.21.2
- **Database**: MongoDB with Mongoose 8.9.4
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: Bcrypt 5.1.1
- **CORS**: cors 2.8.5

### Development Tools
- **Linting**: ESLint 9.17.0
- **Version Control**: Git
- **Package Manager**: npm

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
│  React Frontend (Vite + TailwindCSS + Zustand)              │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  APPLICATION LAYER                           │
│  Express.js Backend                                          │
│  - Middleware (CORS, JWT, Body Parser)                       │
│  - API Routes (/api/auth, /api/rfq)                          │
│  - Controllers (Auth, RFQ)                                   │
│  - Business Logic (Auction Extension, Validation)            │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ MongoDB Driver
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                            │
│  MongoDB Collections:                                        │
│  - Users  - RFQs  - Bids  - AuctionActivities               │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/bidflow.git
cd bidflow
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Set up Environment Variables**

Create `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

5. **Start Backend Server**
```bash
cd backend
npm start
```

6. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
```

7. **Access the Application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb+srv://user:pass@cluster.mongodb.net/dbname |
| JWT_SECRET | Secret key for JWT signing | your_secret_key_here |
| NODE_ENV | Environment mode | development / production |

### Frontend

Update `frontend/src/utils/axios.util.js` with your backend URL:
```javascript
baseURL: "http://localhost:5000" // or your deployed backend URL
```

## 📡 API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Register a new user (buyer or supplier)
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer"
}
```

#### POST /api/auth/login
Authenticate user and receive JWT token
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/logout
Logout user and clear authentication cookie

#### GET /api/auth/checkAuth
Verify user authentication status

### RFQ Endpoints

#### POST /api/rfq/create
Create new RFQ (Buyer only)
```json
{
  "title": "Laptop Supply RFQ",
  "bidStartTime": "2024-01-15T10:00:00Z",
  "bidCloseTime": "2024-01-15T18:00:00Z",
  "forcedCloseTime": "2024-01-15T20:00:00Z",
  "pickupServiceDate": "2024-01-20T09:00:00Z",
  "triggerWindow": 10,
  "extensionDuration": 5,
  "extensionTriggerType": "bid_received"
}
```

#### GET /api/rfq
Get all RFQs with status and lowest bid

#### GET /api/rfq/:id
Get RFQ details with bids, rankings, and activity log

#### POST /api/rfq/bid
Place a bid (Supplier only)
```json
{
  "rfqId": "507f1f77bcf86cd799439012",
  "amount": 48000,
  "quoteValidity": "2024-02-15T00:00:00Z"
}
```

## 🗄 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (buyer/supplier),
  createdAt: Date,
  updatedAt: Date
}
```

### RFQs Collection
```javascript
{
  _id: ObjectId,
  title: String,
  buyer: ObjectId (ref: Users),
  bidStartTime: Date,
  bidCloseTime: Date,
  forcedCloseTime: Date,
  currentCloseTime: Date,
  pickupServiceDate: Date,
  triggerWindow: Number,
  extensionDuration: Number,
  extensionTriggerType: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Bids Collection
```javascript
{
  _id: ObjectId,
  rfq: ObjectId (ref: RFQs),
  supplier: ObjectId (ref: Users),
  amount: Number,
  quoteValidity: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### AuctionActivities Collection
```javascript
{
  _id: ObjectId,
  rfq: ObjectId (ref: RFQs),
  activityType: String,
  performedBy: ObjectId (ref: Users),
  details: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎲 British Auction Logic

### How It Works

1. **Trigger Window**: The system monitors bidding activity in the last X minutes before auction close
2. **Extension Trigger**: When a trigger condition is met within the trigger window, the auction extends
3. **Extension Duration**: Auction extends by Y minutes
4. **Forced Close**: Extension never exceeds the forced close time

### Extension Trigger Types

#### 1. Bid Received
- Extends whenever ANY bid is placed within the trigger window
- Most lenient option, encourages maximum participation

#### 2. Any Rank Change
- Extends when ANY supplier's ranking changes within the trigger window
- Balances fairness with auction duration

#### 3. L1 Rank Change
- Extends ONLY when the lowest bidder (L1) changes within the trigger window
- Most restrictive option, focuses on competitive pricing

### Example Scenario

```
Bid Close Time: 6:00 PM
Trigger Window: 10 minutes
Extension Duration: 5 minutes
Forced Close Time: 8:00 PM

Timeline:
5:50 PM - Trigger window starts
5:55 PM - Supplier A places bid → Auction extends to 6:05 PM
6:00 PM - Supplier B places bid → Auction extends to 6:10 PM
6:05 PM - Supplier C places bid → Auction extends to 6:15 PM
...continues until no bids in trigger window or forced close time reached
```

## 🚢 Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to Vercel or Netlify

3. Update environment variables with production backend URL

### Backend (Render/Railway)

1. Push code to GitHub repository

2. Connect repository to Render/Railway

3. Set environment variables:
   - PORT
   - MONGO_URI
   - JWT_SECRET
   - NODE_ENV=production

4. Deploy and note the backend URL

5. Update frontend axios configuration with backend URL

### Database (MongoDB Atlas)

1. Create MongoDB Atlas account
2. Create a cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string and add to backend .env

## 📝 Project Structure

```
bidflow/
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── rfq.controller.js
│   ├── db/
│   │   └── connectDB.js
│   ├── middlewares/
│   │   └── verifyToken.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── rfq.model.js
│   │   ├── bid.model.js
│   │   └── auctionActivity.model.js
│   ├── routes/
│   │   ├── auth.route.js
│   │   └── rfq.route.js
│   ├── utils/
│   │   └── generateTokenAndSetCookie.js
│   ├── .env
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── assets/
│   │       └── logo.jpg
│   ├── src/
│   │   ├── components/
│   │   │   ├── PlaceBidModal.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RedirectRoute.jsx
│   │   ├── pages/
│   │   │   ├── LoadingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateRfq.jsx
│   │   │   └── RfqDetails.jsx
│   │   ├── store/
│   │   │   ├── auth.store.js
│   │   │   └── rfq.store.js
│   │   ├── utils/
│   │   │   └── axios.util.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── HLD.md
├── SCHEMA_DESIGN.md
├── architecture-diagram.html
├── .gitignore
└── README.md
```



