# Taskify

A modern project and task management application built with Next.js, Prisma, and Better Auth.

## Features

- 📁 Project management with descriptions
- ✅ Task tracking with customizable statuses
- 🔐 Secure authentication with Better Auth
- 🎨 Beautiful UI with shadcn/ui components
- 🌙 Dark mode support
- 📱 Responsive design

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** SQLite with Prisma ORM
- **Authentication:** Better Auth
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/YOUR_USERNAME/tek_innov8ers.git
cd tek_innov8ers
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**
Create a `.env` file in the root directory and add the following variables:

```env
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="your_better_auth_secret"
```
Replace `your_better_auth_secret` with a secure random string. Or you can generate one using `npm run better-auth:secret`. This command will print a secure secret to the console, which you can copy and paste into your `.env` file.

4. **Set up the database:**

```bash
# Initialize the database and run migrations
npm run db:init

# Seed the database with initial data (optional)
npm run db:seed
```

5. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

Note: If you ran the command to seed the database, you can log in with the following credentials:
- User: John Doe
  - email: john.doe@taskify.com
  - password: password123

- User: Jane Doe
  - email: jane.doe@taskify.com
  - password: password123

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run db:migrate` - Run Prisma migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:generate` - Generate Prisma Client
- `npm run db:seed` - Seed the database
- `npm run db:reset` - Reset the database and migrations

## Project Structure

```
├── app/                    # Next.js app router pages
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   └── ...                # Feature components
├── lib/                   # Utility functions and services
├── prisma/                # Database schema and migrations
└── public/                # Static assets
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## Deploy on Vercel

The easiest way to deploy this app is using the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
