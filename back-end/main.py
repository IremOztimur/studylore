import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
import requests
import dotenv

dotenv.load_dotenv()

app = FastAPI(debug=True)

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
    main_content: str
    # quick_notes: List[str]
    # quiz_questions: List[dict]
    

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
        content = summarize_url(request.url)
        return ProcessedContent(main_content=content)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)