# Frontend

This is the frontend for the PDF Chat application, built with Vite and designed to interact with the FastAPI backend.

## Prerequisites

- Ensure the **backend** is running before starting the frontend.
- The backend server should be available at `http://localhost:8000` (or update the frontend if you’re using a different backend URL).

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/dead8309/pdf-chat
cd frontend
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start the Backend

Make sure the FastAPI backend server is running:

```bash
cd ../backend
uvicorn src.main:app --reload
```

The backend should now be accessible at `http://localhost:8000`.

### 4. Run the Frontend

In a new terminal window, go back to the `frontend` directory and start the Vite development server:

```bash
pnpm dev
```

This will start the frontend server at `http://localhost:5173` (default Vite port). Open your browser and go to `http://localhost:5173` to view the app.

---

## Build for Production

To create an optimized build of the frontend for production:

```bash
pnpm build
```

The production-ready files will be output to the `dist` directory.
