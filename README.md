# VBook App - Document Management Platform

A modern web application for document management and blogging, built with cutting-edge technologies in the React ecosystem. This project serves as a comprehensive graduation project template.

## 🚀 Tech Stack

### Core Framework
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Runtime:** React 19.2.0

### UI & Styling
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Library:** [Mantine v8](https://mantine.dev/)
- **Icons:** [Lucide React](https://lucide.dev/), [Tabler Icons](https://tabler-icons.io/), [React Icons](https://react-icons.github.io/react-icons/)

### State Management & Data
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **HTTP Client:** [Axios](https://axios-http.com/)

### Rich Content Editing
- **Editor:** [Tiptap](https://tiptap.dev/) - Headless WYSIWYG editor
  - Extensions: Link, Image, Highlight, Text Align, Font Family, Underline, Placeholder

### Document Viewing
- **PDF Viewer:** [React PDF](https://react-pdf.org/)
- **Document Viewer:** [React Doc Viewer](https://www.npmjs.com/package/@cyntler/react-doc-viewer)

### Development Tools
- **Linting:** ESLint with Next.js config
- **Code Quality:** React Compiler (Babel plugin)

## 📂 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Authentication routes (login, register)
│   ├── (user)/               # Protected user routes
│   │   ├── blogs/            # Blog management
│   │   ├── documents/        # Document management
│   │   ├── home/             # User dashboard
│   │   └── profile/          # User profile
│   ├── api/                  # API routes
│   ├── providers/            # Context providers (Redux, Mantine)
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global Tailwind styles
│
├── screens/                  # Page-level components
│   ├── auth/                 # Authentication screens
│   ├── blogs/                # Blog management screens
│   ├── documents/            # Document management screens
│   ├── home/                 # Homepage screens
│   └── onboarding/           # Onboarding flow
│
├── components/               # Reusable UI components
│   ├── ui/                   # Base UI elements
│   │   ├── button.tsx
│   │   ├── text_input.tsx
│   │   ├── ModalNotification.tsx
│   │   └── ToastNotification.tsx
│   ├── layouts/              # Layout components
│   └── icons/                # Icon components
│
├── lib/                      # Utilities and configuration
│   ├── redux/                # Redux store
│   │   ├── features/         # Redux slices
│   │   │   ├── authSlice.ts
│   │   │   ├── articleSlice.ts
│   │   │   ├── modalSlice.ts
│   │   │   ├── toastSlice.ts
│   │   │   └── layoutSlide.ts
│   │   ├── store.ts          # Store configuration
│   │   └── hooks.ts          # Typed Redux hooks
│   ├── apiEndPoints.ts       # API endpoint definitions
│   ├── appRoutes.ts          # Route constants
│   └── mockData.ts           # Mock data for development
│
├── types/                    # TypeScript type definitions
└── utils/                    # Helper functions and utilities
```

## 🎨 Key Features

### 📝 Document Management
- **Upload & View**: Support for PDF and various document formats
- **Rich Text Editing**: Powered by Tiptap editor with extensive formatting options
- **Document Preview**: Inline document viewing with React Doc Viewer

### 📰 Blog System
- **Create & Edit**: Full-featured blog post creation with rich text editor
- **Article Management**: Organize and manage blog articles

### 🔐 Authentication
- **User Registration & Login**: Secure authentication flow
- **Protected Routes**: Route-based access control

### 🎯 User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Toast Notifications**: Real-time feedback with toast messages
- **Modal Dialogs**: Contextual modal notifications
- **Modern UI**: Beautiful interface powered by Mantine components

### 🏗️ Architecture
- **Route Groups**: Clean separation of public/authenticated routes
- **Global State**: Redux Toolkit for predictable state management
- **Type Safety**: Full TypeScript coverage
- **API Integration**: Structured API endpoints with Axios

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: v18 or higher recommended
- **Package Manager**: npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/khoale2k4/BKUMENT_FE.git
   cd vbook-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server with hot-reload |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Runs the production server |
| `npm run lint` | Runs ESLint to check code quality |

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=your_api_url_here
```

### Tailwind CSS

The project uses Tailwind CSS v4 with the following plugins:
- `@tailwindcss/typography` - For beautiful typographic defaults
- `@tailwindcss/postcss` - PostCSS integration

## 📚 Project Highlights

This template demonstrates:

✅ **Modern React Patterns**: Server/Client components, hooks, and composition  
✅ **Type Safety**: Comprehensive TypeScript usage  
✅ **State Management**: Redux Toolkit with feature-based slices  
✅ **Rich Content**: Advanced text editing and document viewing  
✅ **UI Excellence**: Professional design with Mantine + Tailwind  
✅ **API Architecture**: Structured endpoint management  
✅ **Code Quality**: ESLint + React Compiler optimization  

## 🤝 Contributing

This is a graduation project template. Feel free to fork and customize for your needs.

## 📄 License

This project is for educational purposes.

## 👨‍💻 Author

Developed as a graduation project at Bach Khoa University.

---

**Repository**: [khoale2k4/BKUMENT_FE](https://github.com/khoale2k4/BKUMENT_FE)
