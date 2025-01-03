import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
import requests
import dotenv
import groq

dotenv.load_dotenv()

app = FastAPI(debug=True)

groq_api_key = os.getenv('GROQ_API_KEY')
if not groq_api_key:
    raise Exception("GROQ_API_KEY not configured")

client = groq.Groq(api_key=groq_api_key)

origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UrlRequest(BaseModel):
    url: str

class ProcessedContent(BaseModel):
    markdownContent: str
    # quick_notes: List[str]
    # quiz_questions: List[dict]
    
def query_llama_model(prompt: str) -> str:
    """
    Query the Llama model via QROQ API with a given prompt.
    """


    response = client.chat.completions.create(
        model="llama-3.1-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=3000,
        temperature=0.7
    )
    
    return response.choices[0].message.content


def summarize_url(url_to_summarize):
    """
    Summarize content from a given URL using Jina AI's API
    """
    jina_url = f"https://r.jina.ai/{url_to_summarize}"
    
    headers = {
        "Authorization": f"Bearer {os.getenv('JINA_API_KEY')}"
    }
    
    response = requests.get(jina_url, headers=headers)
    
    if response.status_code == 200:
        return response.text
    else:
        return f"Error: {response.status_code}, {response.text}"

@app.post("/process-url", response_model=ProcessedContent)
async def process_url(request: UrlRequest):
    try:
        raw_content = summarize_url(request.url)
        prompt = f"""
        You are a content formatting assistant. Convert the following raw text into clean, well-structured HTML for a tutorial page. Use:
        - `<h1>` for the main title.
        - `<h2>` for subtitles.
        - `<p>` for paragraphs.
        - `<a>` for links.
        - `<img>` for images (if URLs are present).
        Ensure the HTML is semantic and visually appealing.

        Raw text:
        {raw_content}

        Output:
        """
        
        formatted_html = query_llama_model(prompt)

        return ProcessedContent(markdownContent=formatted_html)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)