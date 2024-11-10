# Backend

This backend service, built with FastAPI, enables users to upload PDF documents and ask questions about their content. It processes the documents, extracts text, and uses Google Gemini AI to provide natural language answers based on document content.

## Features

- **PDF Upload:** Users can upload PDF documents.
- **Text Extraction:** Extracts text from PDFs for processing.
- **Question Answering:** Users can ask questions about uploaded PDFs and receive relevant answers based on document content.
- **Database Storage:** Stores metadata and extracted text in a SQLite database.

---

## Requirements

- **Python 3.8+**
- **FastAPI**
- **SQLite Database**
- **Google Gemini AI API Key**

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/dead8309/pdf-chat
cd backend
```

### 2. Create and Activate a Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

### 3. Install Dependencies

Install the required dependencies using the `requirements.txt` file:

```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables

Rename `.env.example` file to `.env` in the project root directory and add your environment variables:

```plaintext
GEMINI_API_KEY=your_google_gemini_api_key
```

### 5. Initialize the Database

Create databse tables by running

```python
 python -m src.init_db
```

### 6. Run the Application

To start the FastAPI server:

```bash
uvicorn src.main:app --reload
```

This will run the server at `http://localhost:8000`.

### 7. Test the API

Use an API client like Postman or cURL to test the endpoints:

- **Upload PDF**: `POST /upload` - Upload a PDF file.
- **Ask Questions**: `POST /ask` - Ask questions related to a specific PDF document.

---

## Database Management

To view and manage your SQLite database, you can use the SQLite CLI or a GUI like **DB Browser for SQLite**.

### Viewing and Querying the Database

To explore data stored in `test.db`:

1. Use the SQLite CLI:

   ```bash
   sqlite3 test.db
   ```

2. View tables:

   ```sql
   .tables
   ```

3. Query data:

   ```sql
   SELECT * FROM documents;
   ```

Or, open `test.db` in **DB Browser for SQLite** for an easier GUI experience.
