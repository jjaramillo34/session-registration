# D79 Session Registration

A web application for managing D79 session registrations, built with Next.js, Prisma, and PostgreSQL.

## Features

- Modern, responsive UI with dark mode support
- Session registration system with capacity management
- Daytime and evening session scheduling
- Email validation for NYC Schools staff
- Real-time slot availability checking

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Deployment**: Vercel

## Deployment Instructions

### Prerequisites

1. A Vercel account
2. A PostgreSQL database (recommended: [Neon](https://neon.tech) or [Supabase](https://supabase.com))
3. GitHub repository with the code

### Database Setup

1. Create a PostgreSQL database in your chosen provider
2. Get two connection strings:
   - Main connection string (for Prisma migrations)
   - Direct connection string (for Edge functions)

### Environment Variables

The following environment variables need to be set in Vercel:

```env
# Main database URL (used for migrations and direct access)
DATABASE_URL="postgresql://user:password@host:port/database"

# Direct URL (needed for Edge functions)
DIRECT_URL="postgresql://user:password@host:port/database"
```

### Deployment Steps

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. In Vercel:
   - Create a new project
   - Import your GitHub repository
   - Add the environment variables
   - Deploy

3. After the first deployment, run database migrations:
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Pull environment variables
vercel env pull .env

# Run migrations
npx prisma migrate deploy

# Seed the database
npx prisma db seed
```

## Local Development

1. Clone the repository:
```bash
git clone <your-github-repo-url>
cd session-registration
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
# Main database URL
DATABASE_URL="postgresql://user:password@host:port/database"

# Direct URL (same as DATABASE_URL for local development)
DIRECT_URL="postgresql://user:password@host:port/database"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Seed the database:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

## Database Schema

The application uses two main models:

### TimeSlot
- Manages available session slots
- Tracks capacity and availability
- Differentiates between daytime and evening sessions
- Indexed for optimal query performance

### Session
- Records registered sessions
- Stores participant information
- Links to specific time slots
- Indexed for efficient lookups

## Database Migrations

To create a new migration after schema changes:

```bash
# Create a migration
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
