import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
import requests
import dotenv
import groq
import json

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
    quiz_questions: List[dict] = []
    
def query_llm_model(prompt: str, model: str = "llama-3.1-70b-versatile") -> str:
    """
    Query the Llama model via QROQ API with a given prompt.
    """

    response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=4000,
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

def truncate_text(text: str, max_tokens: int = 4000) -> str:
    """
    Truncate text to approximately stay within token limit.
    Rough estimate: 1 token ≈ 4 characters for English text
    """
    # Estimate: 4 characters per token
    char_limit = max_tokens * 5
    if len(text) > char_limit:
        # Truncate to the last complete sentence before the limit
        truncated = text[:char_limit]
        last_period = truncated.rfind('.')
        if last_period > 0:
            truncated = truncated[:last_period + 1]
        return truncated + "\n\n[Content truncated due to length...]"
    return text

@app.post("/process-url", response_model=ProcessedContent)
async def process_url(request: UrlRequest):
    try:
        raw_content = summarize_url(request.url)
        
        # Truncate content for each prompt
        truncated_content_markdown = truncate_text(raw_content, max_tokens=4000)
        truncated_content_quiz = truncate_text(raw_content, max_tokens=2000)

        markdown_prompt = f"""
        You are a content formatting assistant. Convert the following raw text into clean, well-structured HTML for a tutorial page. Use:
        - `<h1>` for the main title.
        - `<h2>` for subtitles.
        - `<p>` for paragraphs.
        - `<a>` for links.
        - `<img>` for images (if URLs are present).
        Ensure the HTML is semantic and visually appealing.

        Raw text:
        {truncated_content_markdown}

        Output:
        """
        
        try:
            formatted_html = query_llm_model(markdown_prompt)
        except Exception as e:
            if "rate_limit_exceeded" in str(e):
                truncated_content_markdown = truncate_text(raw_content, max_tokens=3000)
                formatted_html = query_llm_model(markdown_prompt)
            else:
                raise e
        
        quiz_prompt = f"""
        You are an educational content creator. Generate exactly 3 multiple-choice questions based on the provided text. Each question should have four options with only one correct answer.

        Guidelines:
        1. Create exactly 3 questions
        2. Make questions concise and focused on key concepts
        3. Each question must have exactly 4 options
        4. Mark the correct answer using its index (0-3)

        Content for questions:
        {truncated_content_quiz}

        Required format (follow this exactly):
        [
          {{
            "question": "First question text here",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correctAnswer": 0
          }},
          {{
            "question": "Second question text here",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 1
          }}
        ]

        Important: Return only the JSON array with exactly 3 questions. Do not include any additional text or explanations.
        """

        try:
            quiz_questions_str = query_llm_model(quiz_prompt)
            quiz_questions = json.loads(quiz_questions_str)
        except Exception as e:
            print(f"Quiz generation error: {str(e)}")
            quiz_questions = []

        return ProcessedContent(
            markdownContent=formatted_html,
            quiz_questions=quiz_questions
        )
    
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
        
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)