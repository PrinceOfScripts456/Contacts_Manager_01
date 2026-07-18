# Contacts Manager

A full-stack contacts manager with a React frontend and an Express/MongoDB REST API. Add, edit, search, and organize contacts with multiple phone numbers, emails, and dates per contact, then bulk import/export your data as JSON.

## Features

- **Full CRUD** — create, view, edit, and delete contacts
- **Rich contact fields** — multiple labeled phone numbers, emails, and dates per contact, plus company, job title, website, address, notes, and avatar
- **Search** — server-side search, so filtering happens on the backend rather than in the browser
- **Multiple views** — card, compact, and full list layouts, with pagination
- **Import / Export** — bulk import contacts from a `.json` file, export all contacts to a downloadable `.json` file
- **Light/dark theme**
- **Server-side validation** — requests validated with [Zod](https://zod.dev/) before hitting the database

## Tech Stack

**Frontend:** React 19, React Router, Vite, Axios  
**Backend:** Node.js, Express 5, MongoDB with Mongoose, Zod, Multer, EJS

## Getting Started

### Prerequisites
- Node.js
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```bash
PORT=5000
MONGO_URI=mongodb_connection_string
FRONTEND_URLS=link_1,link_2         # white listed origins for CORS
```

Start the server:

```bash
npm start
```

### Frontend setup

```bash
cd Frontend
npm install
```

Create a `.env` file in `Frontend/` if your backend isn't on the default port:

```bash
VITE_API_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

## Screenshots

**Home Page View 1:**

<p align="center">
<img src="./others/screenshots/View_1.jpg" width="320px">
</p>

<hr>

**Home Page View 2:**

<p align="center">
<img src="./others/screenshots/View_2.jpg" width="320px">
</p>

<hr>

**Home Page View 3:**

<p align="center">
<img src="./others/screenshots/View_3.jpg" width="320px">
</p>

<hr>

**Page Navigation:**

<p align="center">
<img src="./others/screenshots/PageEnd.jpg" width="320px">
</p>

<hr>

**Search View (Result Found):**

<p align="center">
<img src="./others/screenshots/Search.jpg" width="320px">
</p>

<hr>

**Search View (No Result Found):**

<p align="center">
<img src="./others/screenshots/NoResult.jpg" width="320px">
</p>

<hr>

**Create New Contact Page:**

<p align="center">
<img src="./others/screenshots/NewContact.jpg" width="320px">
</p>

<hr>

**Contact Details Page:**

<p align="center">
<img src="./others/screenshots/ViewContactDetails.jpg" width="320px">
</p>

<hr>

**Contact Edit Page:**

<p align="center">
<img src="./others/screenshots/EditContact.jpg" width="320px">
</p>

<hr>

**Page Not Found:**

<p align="center">
<img src="./others/screenshots/PageNotFound.jpg" width="320px">
</p>

<hr>

## API Routes

| Method | Route                        |Description                             |
|--------|------------------------------|----------------------------------------|
| GET    | `/contacts`                  | Fetch all contacts                     |
| GET    | `/contacts/:id`              | Fetch a single contact                 |
| POST   | `/contacts/new`              | Create a contact                       |
| PUT    | `/contacts/:id`              | Update a contact                       |
| DELETE | `/contacts/:id`              | Delete a contact                       |
| GET    | `/contacts/export`           | Export contacts as JSON                |
| GET    | `/contacts/export/:filename` | Download a previously generated export |
| POST   | `/contacts/import`           | Import contacts from JSON              |

`GET /contacts` accepts `?search=`, `?page=`, and `?limit=` query params.

## Testing

The backend has an integration test suite (Vitest + Supertest) covering contact creation, validation, search, and deletion. Tests run against a real MongoDB — either a temporary local instance or an online one — never against your dev database.

```bash
cd Backend
npm test            # if TEST_MONGO_URI is set in .env, it will use online DB otherwise fallback to local DB.
```

To use an online test database (e.g. a free MongoDB Atlas cluster), add this to `Backend/.env`:

```
TEST_MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/contacts_test
```
