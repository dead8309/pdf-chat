from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .models import Document, Question
from langchain.schema import Document as DocumentSchema
from .database import get_db
from .utils import extract_text_from_pdf
import shutil
from pydantic import BaseModel
from dotenv import load_dotenv
from .ai import get_gemini_chain

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

qa_chain = get_gemini_chain()

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
    print(file.filename)
    file_location = f"uploaded_files/{file.filename}"

    # Save the uploaded file
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text from PDF
    text_content = extract_text_from_pdf(file_location)

    # Save document metadata and extracted text in the database
    new_document = Document(filename=file.filename, text_content=text_content)
    db.add(new_document)
    db.commit()
    db.refresh(new_document)

    return {"document_id": new_document.id, "filename": new_document.filename}

class RequestBody(BaseModel):
    document_id: int
    question: str

@app.post("/ask")
async def ask_question(body: RequestBody, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == body.document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    try:
        documents = [DocumentSchema(page_content=str(document.text_content), metadata={"filename": document.filename})]
        response = qa_chain.run(input_documents=documents, question=body.question)
        answer = response

        new_question = Question(document_id=body.document_id, question_text=body.question, answer_text=answer)
        db.add(new_question)
        db.commit()
        db.refresh(new_question)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Failed to answer the question {e}")

    return {"answer": answer}
