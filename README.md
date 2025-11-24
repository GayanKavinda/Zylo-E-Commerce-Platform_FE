# Zylo E-Commerce Platform - Frontend

A modern, responsive e-commerce platform frontend built with Next.js 16, React 19, and TypeScript. This application provides a complete user interface for managing products, customers, and orders with role-based access control.

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 16 (App Router), React 19, and TypeScript
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Responsive Design**: Mobile-first design using Tailwind CSS 4
- **UI Components**: Pre-built components using Radix UI and shadcn/ui
- **State Management**: Zustand for global state management
- **Data Fetching**: TanStack Query (React Query) for efficient server state management
- **Form Handling**: React Hook Form with Zod validation
- **Type Safety**: Full TypeScript support throughout the application

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm/yarn/pnpm**: Latest version
- **Backend API**: The Laravel backend must be running on `http://127.0.0.1:8000`

## 🛠️ Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure API endpoint** (optional):
   
   By default, the API is configured to connect to `http://127.0.0.1:8000/api`. To change this, update the `baseURL` in `lib/api.ts`:
   ```typescript
   const api = axios.create({
       baseURL: "http://your-backend-url/api",
   });
   ```

## 🚀 Getting Started

### Development Server

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
frontend/
├── app/                      # Next.js App Router pages
│   ├── admin/               # Admin dashboard pages
│   ├── dashboard/           # User dashboard pages
│   │   └── customer/        # Customer management
│   ├── login/               # Authentication pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── Navbar.tsx           # Navigation bar
│   ├── ProtectedRoute.tsx   # Route protection wrapper
│   └── Sidebar.jsx          # Dashboard sidebar
├── lib/                     # Utilities and configurations
│   ├── api.ts               # Axios instance with interceptors
│   ├── authStore.ts         # Zustand auth state
│   ├── types.ts             # TypeScript type definitions
│   └── utils.ts             # Helper functions
└── public/                  # Static assets

```

## 🔑 Key Technologies

### Core Framework
- **Next.js 16.0.3**: React framework with App Router
- **React 19.2.0**: UI library
- **TypeScript 5**: Type safety

### UI & Styling
- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible component primitives
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variants

### State Management & Data Fetching
- **Zustand 5.0.8**: Lightweight state management
- **TanStack Query 5.90.10**: Server state management
- **Axios 1.13.2**: HTTP client

### Form & Validation
- **React Hook Form 7.66.1**: Form management
- **Zod 4.1.12**: Schema validation
- **@hookform/resolvers**: Form validation resolver

## 🔐 Authentication Flow

1. User logs in via `/login` page
2. JWT token is received from the backend
3. Token is stored in Zustand state (`authStore`)
4. Axios interceptor automatically adds token to all API requests
5. Protected routes use `ProtectedRoute` component to verify authentication

## 🎨 Available Pages

- **`/`**: Home/Landing page
- **`/login`**: User authentication
- **`/dashboard`**: Main dashboard (protected)
- **`/dashboard/customer`**: Customer management (protected)
- **`/admin`**: Admin dashboard (protected, admin role required)

## 🔧 API Configuration

The API client is configured in `lib/api.ts` with:
- Base URL: `http://127.0.0.1:8000/api`
- Automatic JWT token injection via interceptors
- Centralized error handling

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.0.3 | React framework |
| react | 19.2.0 | UI library |
| typescript | ^5 | Type safety |
| tailwindcss | ^4 | Styling |
| zustand | ^5.0.8 | State management |
| @tanstack/react-query | ^5.90.10 | Data fetching |
| axios | ^1.13.2 | HTTP client |
| react-hook-form | ^7.66.1 | Forms |
| zod | ^4.1.12 | Validation |

## 🤝 Integration with Backend

This frontend is designed to work with the Laravel backend located in the `../backend` directory. Ensure the backend is running before starting the frontend.

**Backend Requirements:**
- Laravel API running on `http://127.0.0.1:8000`
- CORS enabled for `http://localhost:3000`
- JWT authentication configured

## 🐛 Troubleshooting

### API Connection Issues
- Verify the backend is running on `http://127.0.0.1:8000`
- Check CORS configuration in Laravel backend
- Ensure `.env` is properly configured in the backend

### Authentication Issues
- Clear browser localStorage/cookies
- Check token expiration
- Verify JWT configuration in backend

### Build Issues
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Check for TypeScript errors with `npm run lint`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [React Documentation](https://react.dev) - Learn React
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling documentation
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [TanStack Query](https://tanstack.com/query/latest) - Data fetching

## 🚀 Deployment

### Vercel (Recommended)
The easiest way to deploy is using [Vercel](https://vercel.com/new):

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms
You can also deploy to:
- AWS Amplify
- Netlify
- DigitalOcean App Platform
- Docker containers

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📄 License

This project is part of the Zylo E-Commerce Platform.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
