# Taskify

A modern project and task management application built with Next.js, Prisma, and Better Auth. This project was built to demonstrate how vulnerabilities can creep into our applications if we're not careful with our code practices. 

There are intentional security flaws sprinkled throughout the codebase for educational purposes:

1. SQL Injection - Project search feature if vulnerable to SQL Injection attack
2. Cross-site Scripting (XSS) - Project descriptions are not sanitized and user-defined content is inserted directly into the DOM
3. Broken Access Control /Insecure Direct Object References (IDOR) - Users can access projects and tasks that do not belong to them by manipulating URL parameters.

Viewers are encouraged to clone and explore the codebase, identify these vulnerabilities, and mitigate them in ways that follow best security practices and support existing features. 

Directions on how to exploit these vulnerabilities can be found in the [vulnerabilities.md](https://github.com/KylerJohnsonDev/Tek_innov8ers/blob/main/vulnerabilities.md) file.

## App Features

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

- Node.js 20.19 or higher
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/kylerjohnsondev/tek_innov8ers.git
cd tek_innov8ers
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**
Create a `.env` file in the root directory and add the following variables:

```env
DATABASE_URL="file:./prisma/dev.db"
BETTER_AUTH_SECRET="your_better_auth_secret"
```
Run `npm run better-auth:secret` to generate a secure Better Auth secret to the console, which you can copy and paste into your `.env` file.

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
