# VBook App

This is a modern web application, built with the latest technologies in the React ecosystem.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Linting:** ESLint

## 📂 Project Structure

```
src/
├── app/                  # App Router
│   ├── (auth)/           # Authentication routes (login, register)
│   ├── (user)/           # User protected routes
│   ├── api/              # API Routes
│   ├── layout.tsx        # Root layout with StoreProvider
│   └── globals.css       # Global styles (Tailwind)
├── components/           # Reusable UI components
│   ├── ui/               # UI elements (buttons, inputs, notifications)
│   └── layouts/          # Layout components
├── lib/                  # Utilities and configuration
│   ├── redux/            # Redux store configuration
│   │   ├── features/     # Redux slices (auth, articles, ui, notifications)
│   │   └── store.ts      # Store setup
│   └── mockData.ts       # Mock data for development
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone toSignUp
   cd vbook-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Scripts

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run start`: Runs the built app in production mode.
- `npm run lint`: Lints the codebase using ESLint.

## 🎨 Features

- **Route Groups**: Organized routing structure separating Authentication and User logic.
- **Global State**: Redux Toolkit configured with a `StoreProvider` wrapper.
- **Notifications**: Integrated **Toast** and **Modal** notification systems managed via Redux.
- **Responsive Design**: Mobile-first approach using Tailwind CSS.
- **Type Safety**: Full TypeScript support for better developer experience and code reliability.

## 📝 License

This project is for educational purposes.
