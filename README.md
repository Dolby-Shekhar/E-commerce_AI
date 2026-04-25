# 🛒 E-Shop AI - AI-Powered E-Commerce Application

A full-stack e-commerce application like Amazon/Flipkart with AI integration, built using MERN stack (MongoDB, Express, React, Node.js).

## ✨ Features

### User Features
- **Browse Products** - View all products with search, filter, and sort
- **Product Details** - Detailed view with reviews, ratings, and specifications
- **Smart Cart** - Add/remove items, update quantities, view total
- **Secure Checkout** - Multiple payment options with address management
- **Order Tracking** - Track order status from pending to delivered
- **AI Chatbot** - 24/7 customer support with quick replies
- **Personalized Recommendations** - AI-based product suggestions
- **Sentiment Analysis** - AI-analyzed review sentiments

### Admin Features
- **Dashboard** - View key metrics (products, orders, revenue)
- **Product Management** - Add, edit, delete products
- **Order Management** - Update order status
- **Analytics** - Track sales and performance

### AI Features
- **Smart Recommendations** - Based on browsing history
- **AI Search** - Intelligent product search with relevance ranking
- **Sentiment Analysis** - Analyze review sentiment (positive/neutral/negative)
- **AI Chatbot** - Handles customer queries about orders, returns, payments
- **Trending Products** - AI-curated trending items

## 🏗️ Project Structure

```
E-Commerce/
├── backend/           # Node.js + Express API
│   ├── config/        # Database config
│   ├── controllers/   # Route controllers
│   ├── data/          # Seeder data
│   ├── middleware/    # Auth & error handling
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── utils/         # Helper functions
│   └── server.js      # Entry point
├── frontend/          # React.js SPA
│   ├── public/
│   └── src/
│       ├── components/    # Reusable components
│       ├── context/       # React contexts
│       ├── pages/         # Page components
│       ├── services/      # API services
│       └── styles/        # CSS files
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment Variables
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret
```

### 3. Seed Database
```bash
node data/seeder.js
```

### 4. Start Backend Server
```bash
npm run dev
```

### 5. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 6. Start Frontend
```bash
npm start
```

The app will run at `http://localhost:3000` with API at `http://localhost:5000`.

## 🔑 Demo Credentials
- **Admin**: admin@eshop.com / admin123

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React.js | Frontend framework |
| Node.js | Backend runtime |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Axios | HTTP client |
| CSS3 | Styling |

## 📱 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Product listing with AI recommendations |
| Login | `/login` | User authentication |
| Register | `/register` | New account creation |
| Product Details | `/product/:id` | Single product view |
| Cart | `/cart` | Shopping cart |
| Checkout | `/checkout` | Order placement |
| Orders | `/orders` | Order history |
| Admin Dashboard | `/admin` | Admin panel |

## 🤖 AI Integration

1. **Recommendations**: Collaborative filtering based on user browsing history
2. **Chatbot**: Rule-based NLP for customer support
3. **Sentiment Analysis**: Keyword-based sentiment scoring on reviews
4. **Smart Search**: Multi-field search with AI relevance ranking
5. **Trending**: Algorithmic trending based on ratings and reviews

## 📄 License

MIT License

