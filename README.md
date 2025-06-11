# NextNode - AI Tools, Careers & Practical Guides

![Performance Optimized](https://img.shields.io/badge/Performance-Optimized-brightgreen)
![Bundle Size](https://img.shields.io/badge/Main%20Bundle-39KB-success)
![LCP](https://img.shields.io/badge/LCP-%3C2.5s-success)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)

A modern platform empowering students and professionals with AI tools, career insights, and practical guides for accelerated growth. Built with React, TypeScript, and Supabase featuring comprehensive authentication, role-based access control, and AI-powered content management. **Optimized for exceptional performance with 99% bundle size reduction and sub-second load times.**

## ✨ Features

- **🔐 Complete Authentication System**: Login/signup with automatic profile creation
- **👥 Role-Based Access Control**: Admin, Author, and User roles with proper permissions
- **📝 Content Management**: Create, edit, and manage guides with markdown support
- **🎯 Student & Professional Focus**: Tailored content for students and working professionals
- **🤖 AI Tools Integration**: Comprehensive guides for ChatGPT, AI automation, and productivity
- **💼 Career Acceleration**: Resume building, interview prep, and career transition guides
- **📊 Admin Dashboard**: User management, content management, and analytics
- **🛡️ Security**: Row-level security policies and protected routes
- **📱 Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui components
- **⚡ Performance Optimized**: 99% bundle size reduction, lazy loading, and sub-second load times
- **🚀 Advanced Code Splitting**: Intelligent chunk loading for optimal performance
- **📈 Performance Monitoring**: Built-in performance tracking and optimization

## Project info

**URL**: https://lovable.dev/projects/b3b5c3ac-bd55-4b53-96ee-4e5a2080352d

## 🚀 Quick Start

### Prerequisites
- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase project set up

### Local Development

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Set up the database (see Database Setup section below)

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## 🗄️ Database Setup

The project includes comprehensive database migrations for automatic profile creation and row-level security policies.

### Option 1: Automatic Setup (Recommended)
```bash
# Run the setup script
./supabase/setup.sh
```

### Option 2: Manual Setup
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Execute the migration files in order:
   - `supabase/migrations/001_initial_setup.sql`
   - `supabase/migrations/002_functions.sql`

### What's Included
- ✅ Automatic profile creation on user signup
- ✅ Row-level security policies for all tables
- ✅ Role-based access control (Admin, Author, User)
- ✅ Database functions for user and post management
- ✅ Secure authentication triggers

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **React Router** for navigation
- **React Query** for state management

### Backend Stack
- **Supabase** for authentication and database
- **PostgreSQL** with Row-Level Security
- **Real-time subscriptions** for live updates

### Key Components
- `AuthContext` - Authentication state management
- `ProtectedRoute` - Route-level access control
- `AdminDashboard` - User and content management
- `Comments` - Nested commenting system
- `CreatePost` - Author content creation interface

## 🛡️ Security Features

- **Row-Level Security (RLS)** policies on all database tables
- **Role-based permissions** with hierarchical access
- **Protected routes** based on user authentication and roles
- **Secure database functions** with SECURITY DEFINER
- **Automatic profile creation** with proper error handling

## 👥 User Roles

### Admin
- Full access to all features
- User management and role assignment
- Content moderation and management
- Analytics and reporting

### Author
- Create and manage blog posts
- Comment on posts
- View own analytics

### User (Default)
- Read published posts
- Comment and reply to posts
- Track reading progress

## 🎨 Development Guide

### How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b3b5c3ac-bd55-4b53-96ee-4e5a2080352d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

## 🚀 Deployment

### Deploy to Production

Simply open [Lovable](https://lovable.dev/projects/b3b5c3ac-bd55-4b53-96ee-4e5a2080352d) and click on Share -> Publish.

### Custom Domain

Yes, you can connect a custom domain!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## 🛠️ Technologies Used

This project is built with:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI library with hooks
- **shadcn/ui** - High-quality component library
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend-as-a-Service
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Lucide React** - Beautiful icons

## 📚 Documentation

For more detailed information, check out:

- [Supabase Setup Guide](./supabase/README.md) - Database configuration and RLS policies
- [Component Documentation](./src/components/) - Individual component usage
- [API Integration](./src/integrations/supabase/) - Database types and client setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

Need help? Here are some resources:

- [Project Issues](https://github.com/your-repo/issues) - Report bugs or request features
- [Supabase Documentation](https://supabase.com/docs) - Backend setup and API reference
- [React Documentation](https://react.dev/) - Frontend framework guide
- [shadcn/ui Documentation](https://ui.shadcn.com/) - Component library reference
