# D79 Session Registration

A Next.js application for managing D79 session registrations.

## Features

- Session registration with email validation for @schools.nyc.gov domain
- Admin dashboard for managing sessions
- Teams meeting link management with QR code generation
- CSV export functionality
- Dark mode support

## Tech Stack

- Next.js 14
- TypeScript
- Prisma with PostgreSQL
- Tailwind CSS
- React Hook Form

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   DATABASE_URL="your-database-url"
   DIRECT_URL="your-direct-database-url"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment on Vercel

1. Push your code to a Git repository

2. Import the project in Vercel

3. Configure the following environment variables in Vercel:
   - `DATABASE_URL`: Your Prisma database connection string
   - `DIRECT_URL`: Your direct database connection URL

4. Deploy!

## Database Schema

The application uses two main models:

### TimeSlot
- Manages available session slots
- Tracks capacity and availability
- Supports both daytime and evening sessions

### Session
- Stores registered session information
- Includes participant details and Teams meeting links
- Indexed for optimal query performance

## Development

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run linter
- `npm run lint:fix`: Fix linting issues
