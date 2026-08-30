# BookShop API

A REST API for buying and selling books, built with Express, TypeScript, Prisma and PostgreSQL.

## Stack

Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT, BullMQ, Redis, Jest.

## Getting started

1. Copy `.env.example` into `.env` and fill in your own values.
2. Install dependencies: `npm install`
3. Run migrations: `npx prisma migrate dev`
4. Start the server: `npm start`

The API runs on `http://localhost:3000`.

## What it does

- Users sign up and log in with JWT.
- Authenticated users can publish, edit, delete and buy books.
- Anyone can browse the public catalog (paginated, searchable by title or author).
- When a book is sold, the seller gets an email notification.
- A weekly scheduled job emails sellers whose books have been listed for over 7 days without selling.

## Testing
npm test

## Build
npm run build