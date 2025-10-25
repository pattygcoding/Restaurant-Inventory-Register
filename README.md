# POS Register + Inventory System

[![Angular](https://img.shields.io/badge/Angular-0F0F11?style=for-the-badge&logo=angular&logoColor=DD0031)](https://angular.dev/)
[![Angular Material](https://img.shields.io/badge/Angular%20Material-757575?style=for-the-badge&logo=angular&logoColor=white)](https://material.angular.io/)
[![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
[![RxJS](https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)](https://rxjs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![argon2id](https://img.shields.io/badge/argon2id-35495E?style=for-the-badge&logo=auth0&logoColor=white)](https://github.com/ranisalt/node-argon2)
[![CORS](https://img.shields.io/badge/CORS-FF6F61?style=for-the-badge&logo=security&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
[![ES Modules](https://img.shields.io/badge/ES%20Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
[![Morgan](https://img.shields.io/badge/Morgan-4B8BBE?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/morgan)
[![Rate Limiting](https://img.shields.io/badge/Rate%20Limiter-6E4AFF?style=for-the-badge&logo=shield&logoColor=white)](https://www.npmjs.com/package/express-rate-limit)
[![NPM](https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)

A full-stack demo Point of Sale (POS) Register with Inventory Management system built with Angular 17+ and Node.js. This application demonstrates a professional-grade POS system with user authentication, role-based access control, inventory tracking, and mock payment processing.

## 🚀 Features

- **Full-Stack Architecture**: Angular frontend + Node.js/Express backend + SQLite database
- **Authentication & Authorization**: JWT-based auth with argon2id password hashing and role-based access control
- **POS Register**: Complete point-of-sale interface with item selection, customization, and checkout
- **Inventory Management**: Real-time stock tracking with automatic decrementation on orders
- **Order Processing**: Complex order management with toppings, sizes, flavors, and payment options
- **Mock Payments**: Simulated card payments with configurable success rates
- **User Management**: Admin interface for managing users and roles
- **Reports**: Order history and sales analytics for managers
- **Showcase Mode**: Frontend-only deployment mode with mocked API for demonstrations

## 🛠 Tech Stack

### Frontend
- **Angular 17+** with standalone components
- **Angular Material** for UI components
- **SCSS** for styling
- **RxJS** for reactive programming
- **Router** with guards for protected routes
- **Reactive Forms** for form handling

### Backend
- **Node.js 20+** with ES modules
- **Express.js** web framework
- **Prisma ORM** with SQLite database
- **JWT** for authentication (access + refresh tokens)
- **argon2id** for password hashing with server-side pepper
- **Zod** for request validation
- **Morgan** for HTTP request logging

### Security & Performance
- Role-based access control (CASHIER/MANAGER/ADMIN)
- HTTP-only cookies for refresh tokens
- Rate limiting on auth endpoints
- Input validation and sanitization
- CORS protection

## 📋 Prerequisites

- **Node.js 20+** and **npm**
- **Angular CLI** (optional, but recommended)

## 🚀 Quick Start

### Local Mode (Full-Stack)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pattygcoding/Restaurant-Inventory-Register.git
   cd Restaurant-Inventory-Register
   ```

2. **Install dependencies** (this will install for root, client, and server):
   ```bash
   npm install
   ```
   
   > **Note**: Dependencies are not tracked in the repository. The first `npm install` will set up all required packages for the root project and workspaces (client/server). This may take a few minutes depending on your internet connection.

3. **Setup environment variables**:
   ```bash
   cp server/.env.example server/.env
   ```

4. **Configure environment variables** in `server/.env`:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-super-secret-jwt-key-change-me-in-production"
   REFRESH_SECRET="your-super-secret-refresh-key-change-me-in-production"
   PEPPER="your-super-secret-pepper-for-password-hashing"
   TAX_RATE=0.07
   PORT=3000
   CLIENT_URL="http://localhost:4200"
   ```

5. **Setup database**:
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

6. **Start the application**:
   ```bash
   npm run dev
   ```

7. **Access the application**:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000

8. **Login with default credentials**:
   - **Admin**: `admin` / `ChangeMe123!`
   - **Cashier**: `cashier` / `Cashier123!`

### Showcase Mode (Frontend-Only)

For demonstrations or GitHub Pages deployment:

1. **Development server**:
   ```bash
   npm run client:showcase
   ```
   Visit http://localhost:4200 (with mocked API)

2. **Build for static hosting**:
   ```bash
   npm run client:build:showcase
   ```
   Deploy the `client/dist` folder to GitHub Pages or any static host.

## 📁 Project Structure

```
pos-register/
├── client/                 # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/       # Services, guards, interceptors
│   │   │   ├── features/   # Feature modules (auth, pos, inventory, etc.)
│   │   │   └── shared/     # Shared components and utilities
│   │   └── environments/   # Environment configurations
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Custom middleware
│   │   └── utils/          # Utility functions
│   └── prisma/             # Database schema and migrations
├── package.json            # Root package with workspace scripts
└── README.md
```

## 🎯 User Roles & Permissions

### CASHIER
- Access POS Register
- Create and process orders
- View current inventory levels

### MANAGER
- All CASHIER permissions
- Adjust inventory levels
- View order history and reports
- Void orders

### ADMIN
- All MANAGER permissions
- User management (create, update, delete users)
- System administration

## 💳 Mock Payment Processing

### Mock Card Payment
- Simulates 2-second processing delay
- 90% success rate (configurable)
- On failure: option to retry or switch to cash

### Cash Payment
- Accepts cash amount tendered
- Calculates change automatically
- Immediate processing (no simulation delay)

## 🛒 Sample Menu Data

The system includes a comprehensive menu with:

### Entrées
- Hamburger, Cheeseburger, Hot Dog

### Sides  
- Fries (Regular, Extra Large)
- Poutine

### Desserts
- Ice Cream (Chocolate, Vanilla, Strawberry flavors)

### Drinks
- Milkshakes (S/M/L sizes, multiple flavors)
- Fountain Drinks (S/M/L sizes)

### Toppings
- Proteins: Extra Patty, Extra Dog, Bacon
- Vegetables: Lettuce, Tomatoes, Onions, Pickles, Bell Peppers, Jalapeños
- Condiments: Mayo, Ketchup, Mustard, BBQ Sauce, Hot Sauce, Extra Hot Sauce
- Cheese: Extra Cheese, Blue Cheese

## 🔧 Available Scripts

### Root Scripts
```bash
npm run dev              # Start both frontend and backend
npm run server:dev       # Start backend only
npm run client:start     # Start frontend only
npm run client:showcase  # Start frontend in showcase mode
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run database migrations
npm run db:seed         # Seed database with sample data
npm run format          # Format code with Prettier
npm run lint            # Run linters
```

### Frontend Scripts
```bash
npm run build                # Production build
npm run build:showcase       # Showcase mode build
npm test                     # Run tests
```

## 🔒 Security Features

### Password Security
- **argon2id** hashing with memory cost: 64MB, time cost: 3, parallelism: 4
- Server-side **pepper** added to passwords before hashing
- Password complexity requirements enforced

### JWT Token Security
- Short-lived access tokens (15 minutes)
- Long-lived refresh tokens (7 days) stored in HTTP-only cookies
- Automatic token refresh on valid requests

### API Security
- Rate limiting on authentication endpoints
- CORS protection with configurable origins
- Request validation using Zod schemas
- Role-based route protection

## 🚀 Deployment

### Frontend-Only (GitHub Pages)
1. Build showcase mode: `npm run client:build:showcase`
2. Deploy `client/dist` folder to GitHub Pages
3. All API calls are mocked in-browser

### Full-Stack Deployment
- **Frontend**: Deploy to Netlify, Vercel, or any static host
- **Backend**: Deploy to Heroku, Railway, or any Node.js host
- **Database**: Use PostgreSQL or MySQL for production (update Prisma schema)

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL="your-production-database-url"
JWT_SECRET="strong-random-secret-256-bits"
REFRESH_SECRET="different-strong-random-secret-256-bits" 
PEPPER="unique-pepper-for-password-hashing"
CLIENT_URL="https://your-frontend-domain.com"
```

## 📊 Key Metrics

- **Bundle Size**: ~743KB initial (compressed: ~150KB)
- **Performance**: Lazy-loaded routes, optimized builds
- **Accessibility**: Material Design compliance
- **Mobile**: Responsive design for tablet/desktop

## ⚠️ Important Notes

### Development vs Production
- Uses HTTP in development; **HTTPS required for production**
- JWT secrets must be changed for production use
- Database should be PostgreSQL/MySQL for production scale

### Limitations
- **No real payment processing** (demo purposes only)
- SQLite for development (not recommended for production)
- Mock API for showcase mode has limited persistence

### Security Recommendations
- Change all default passwords immediately
- Use strong, unique secrets for JWT and pepper
- Enable HTTPS in production
- Implement proper backup strategies for production data
- Consider adding 2FA for admin accounts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is for demonstration purposes. See LICENSE file for details.

---

**Built with ❤️ using Angular 17+ and Node.js 20+**
