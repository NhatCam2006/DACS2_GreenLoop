# GreenLoop 🌱

A recyclable waste donation platform connecting donors with collectors. Earn points by recycling!

## Features

- **Donors**: Create donation requests, earn Green Points, redeem rewards
- **Collectors**: Browse available donations, collect waste, complete pickups
- **Admin**: Manage users, categories, rewards, view analytics
- **AI Chatbot**: GreenBot powered by Gemini AI for user support

## Tech Stack

### Frontend (Client)

- React 19 + TypeScript
- TanStack Query (React Query)
- Tailwind CSS + Framer Motion
- Vite

### Backend (Server)

- Node.js + Express
- Prisma ORM + PostgreSQL
- JWT Authentication
- Google Gemini AI

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL or MySQL
- Google AI API Key (for chatbot)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/greenloop.git
cd greenloop
```

2. **Setup Server**

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your database URL and API keys
npx prisma migrate dev
npx prisma generate
npm run dev
```

3. **Setup Client**

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

4. **Open in browser**

- Client: http://localhost:5173
- Server: http://localhost:4000

## Environment Variables

### Server (.env)

**For PostgreSQL:**

```
DATABASE_URL="postgresql://user:password@localhost:5432/greenloop_db"
```

**For MySQL:**

```
DATABASE_URL="mysql://user:password@localhost:3306/greenloop_db"
```

**Other variables:**

```
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=4000
API_KEY="your-gemini-api-key"

# Cloudinary (optional - for cloud image storage)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

> **Note**: Cloudinary is optional. If not configured, images will be stored locally in `server/uploads/`. Get free credentials at https://cloudinary.com/console

### Client (.env)

```
VITE_API_URL=http://localhost:4000/api
```

## Database Setup

### Option 1: PostgreSQL (Default)

1. Install PostgreSQL
2. Create database:

```sql
CREATE DATABASE greenloop_db;
```

3. Update `.env`:

```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/greenloop_db"
```

### Option 2: MySQL

1. Install MySQL
2. Create database:

```sql
CREATE DATABASE greenloop_db;
```

3. Update `.env`:

```
DATABASE_URL="mysql://root:yourpassword@localhost:3306/greenloop_db"
```

4. Update `prisma/schema.prisma` - change provider:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

5. Run migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

> **Note**: When switching databases, delete the `prisma/migrations` folder and re-run migrations.

## Project Structure

```
greenloop/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── stores/
│   │   └── lib/
│   └── package.json
├── server/          # Express backend
│   ├── src/
│   │   ├── modules/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── lib/
│   ├── prisma/
│   └── package.json
└── README.md
```

## API Endpoints

See [Server API Docs](./server/API_DOCS.md) for detailed API documentation.

## License

MIT
