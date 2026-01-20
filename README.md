# D79 Session Registration

A Next.js application for managing D79 session registrations.

## Features

- Session registration with email validation for @schools.nyc.gov domain
- Admin dashboard for managing sessions
- Teams meeting link management with QR code generation
- CSV export functionality
- Dark mode support

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- MongoDB with Mongoose
- Tailwind CSS
- React Hook Form

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   MONGODB_URI="your-mongodb-connection-string"
   ```
   
   Example MongoDB connection string format:
   ```
   MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority"
   ```
   Or for local MongoDB:
   ```
   MONGODB_URI="mongodb://localhost:27017/session-registration"
   ```

4. Seed the database (optional):
   ```bash
   # Seed sessions
   npm run seed:sessions
   # Seed admin users
   npm run seed:users
   ```
   - `seed:sessions`: Populates the database with the D79 Week Virtual Sessions schedule
   - `seed:users`: Creates admin users (Javier Jaramillo and Stacey Oliger)

5. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment on Vercel

1. Push your code to a Git repository

2. Import the project in Vercel

3. Configure the following environment variables in Vercel:
   - `MONGODB_URI`: Your MongoDB connection string

4. Deploy!

## Database Schema

The application uses MongoDB with the following collections:

### TimeSlot
- Manages available session slots
- Tracks capacity and availability
- Supports both daytime and evening sessions

### Session
- Stores registered session information
- Includes participant details and Teams meeting links
- Indexed for optimal query performance

### Registration
- Stores user registrations for sessions
- Includes language preferences and agency information

### Signup
- Tracks signups for Pathways to Graduation sessions

### Crawl
- Manages school crawl events
- Includes location and capacity information

### CrawlRegistration
- Stores registrations for crawl events

## Development

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run linter
- `npm run lint:fix`: Fix linting issues
- `npm run seed:sessions`: Seed database with D79 Week Virtual Sessions schedule
- `npm run seed:users`: Create admin users for the admin dashboard