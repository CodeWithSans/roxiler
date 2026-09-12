# Store Rating App

My submission for the FullStack Intern Coding Challenge. Users can rate stores from 1 to 5, and what you see after logging in depends on your role: admin, normal user, or store owner.

Built with React (Vite), Express and PostgreSQL (hosted on Supabase). Plain JavaScript, no TypeScript.

## Running it locally

You'll need Node 20+ and a Postgres database. I used a free Supabase project.

**Backend**

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env` (the example file says what goes where), then:

```bash
npm run migrate   
npm run seed     
npm run dev       # runs on http://localhost:5000
```

**Frontend** (in another terminal)

```bash
cd frontend
npm install
npm run dev       # runs on http://localhost:5173
```

Open http://localhost:5173. The Vite dev server forwards `/api` calls to the backend, so there's nothing to configure on the frontend side.

## Test logins

The seed script creates these. The password for all of them is `Test@1234`.

| Role        | Email           |
|-------------|-----------------|
| Admin       | admin@test.com  |
| Store owner | owner1@test.com |
| Store owner | owner2@test.com |
| Normal user | user1@test.com  |

You can also sign up as a new normal user from the login page.

## What each role can do

**Admin** gets a dashboard with the total number of users, stores and ratings. They can add users (with any role) and stores, filter and sort both lists, and open any user to see their details. For store owners, that includes their store's rating.

**Normal users** can sign up, search stores by name or address, and rate any store from 1 to 5 by clicking the stars. Clicking again changes the rating.

**Store owners** see the average rating of their store and a list of everyone who rated it.

Everyone can change their password and log out.

## How it's put together

The backend is split into routes, controllers and services. Routes decide which middleware runs, controllers handle the request and response, and services hold the actual logic and SQL. I used `postgres` (postgres.js) instead of an ORM, because most of the queries are joins with averages, and those are easier to write in plain SQL.

Login uses a JWT stored in an httpOnly cookie, so it isn't readable from JavaScript. Role checks are applied to whole routers (`/api/admin`, `/api/owner`), which means any new route added there is protected automatically.

On the frontend, TanStack Query handles fetching and caching, and react-hook-form with Zod handles the forms. The Zod rules are the same ones the backend uses, so you get the same error messages before and after submitting.

A few things I made sure of:

- A user can only have one rating per store. There's a unique constraint on `(user_id, store_id)`, and rating uses an upsert, so double-clicking can't create duplicates.
- Validation happens in the form, in the API, and in the database (`CHECK` constraints).
- Sorting only accepts known column names, so the `sortBy` query parameter can't be used for SQL injection.
- Login and sign-up are limited to 20 attempts per 15 minutes.

## Assumptions I made

The brief left a few things open, so here's what I went with:

- The 20–60 character name rule also applies to store names, since the validation rules are listed for the whole app.
- The admin's "add user" form includes a role dropdown. It isn't in the listed fields, but admins need some way to create other admins and store owners.
- A store doesn't need an owner when it's created, so the admin can add the store first and link the owner later.
- One owner can have more than one store. The dashboard shows each store separately.
- Signing up always creates a normal user. Only an admin can create admins or owners.

## If something doesn't connect

If the backend can't reach the database (`ENETUNREACH` or `EHOSTUNREACH`), use the **Session pooler** connection string from Supabase instead of the direct one. The direct host is IPv6-only, and a lot of networks don't support that.

If login suddenly says "Too many attempts", that's the rate limiter. Restart the backend or wait 15 minutes.
