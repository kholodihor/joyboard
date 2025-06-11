# Joyboard

Joyboard is a modern web application built with Next.js, NextAuth for authentication, and Prisma for database management. It provides a seamless and secure user experience with Google authentication.

## Features

- Google OAuth authentication using NextAuth
- Secure session management with JWT strategy
- Prisma ORM integration with a PostgreSQL (or other) database
- Customizable authentication pages

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd joyboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```env
   GOOGLE_ID=your-google-client-id
   GOOGLE_SECRET=your-google-client-secret
   DATABASE_URL=your-database-connection-url
   NEXTAUTH_SECRET=your-nextauth-secret
   ```

4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Usage

- Access the app at `http://localhost:3000`
- Sign in using your Google account on the `/login` page
- Customize authentication and session handling in `src/lib/auth.ts`

## Troubleshooting

- If you encounter `[next-auth][error][CLIENT_FETCH_ERROR] Failed to fetch`, ensure your API routes are correctly set up and accessible.
- Verify environment variables are properly configured.
- For Prisma errors related to client initialization, check your Prisma schema and client setup.
- Use browser devtools network tab to inspect API requests.

## License

This project is licensed under the MIT License.

---

Feel free to contribute or report issues on the repository.
