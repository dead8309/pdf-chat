from langchain.chains.combine_documents.base import BaseCombineDocumentsChain
from langchain.chains.question_answering import load_qa_chain
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os
from pydantic import SecretStr

load_dotenv()

def get_gemini_chain() -> BaseCombineDocumentsChain:
    prompt_template = """
You are an expert at extracting relevant information based on specific questions. Your task is to carefully analyze the context provided from a PDF and answer as accurately as possible, using only the details in the context.

Respond to the following question based on the provided context below:
- Limit your answer to a maximum of 200 words.
- If the information necessary to answer the question is missing or unclear, respond with, "The information is not provided in the given PDF."

Context:
{context}

Question:
{question}

Answer:
        """

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set")

    model = ChatGoogleGenerativeAI(model="gemini-pro", api_key=SecretStr(api_key), temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(model,chain_type="stuff", prompt=prompt)
    return chain

