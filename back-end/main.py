import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
import requests
import dotenv
import groq
import json
from fpdf import FPDF
import io
from fastapi.responses import StreamingResponse
from datetime import datetime, timedelta

dotenv.load_dotenv()

app = FastAPI(debug=True)

groq_api_key = os.getenv('GROQ_API_KEY')
if not groq_api_key:
    raise Exception("GROQ_API_KEY not configured")

client = groq.Groq(api_key=groq_api_key)

origins = [
    "http://localhost:3000",
    "https://studylore.vercel.app"
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
    
def query_llm_model(prompt: str, model: str = "llama-3.3-70b-versatile") -> str:
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



def scrape_url(url_to_scrape):
    """
    Scrape content from a given URL using Jina AI's API
    """
    jina_url = f"https://r.jina.ai/{url_to_scrape}"
    
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
    Rough estimate: 1 token ≈ 5 characters for English text
    """
    
    char_limit = max_tokens * 5
    if len(text) > char_limit:
        # Truncate to the last complete sentence before the limit
        truncated = text[:char_limit]
        last_period = truncated.rfind('.')
        if last_period > 0:
            truncated = truncated[:last_period + 1]
        return truncated + "\n\n[Content truncated due to length...]"
    return text

class ContentStore:
    def __init__(self):
        self.last_content: Optional[str] = None
        self.formatted_html: Optional[str] = None

content_store = ContentStore()

class CacheEntry:
    def __init__(self, formatted_html: str, quiz_questions: list, timestamp: datetime):
        self.formatted_html = formatted_html
        self.quiz_questions = quiz_questions
        self.timestamp = timestamp

class URLCache:
    def __init__(self, expiry_hours: int = 24):
        self.cache: Dict[str, CacheEntry] = {}
        self.expiry_hours = expiry_hours

    def get(self, url: str) -> Optional[CacheEntry]:
        if url not in self.cache:
            return None
        
        entry = self.cache[url]
        # Check if cache has expired
        if datetime.now() - entry.timestamp > timedelta(hours=self.expiry_hours):
            del self.cache[url]
            return None
            
        return entry

    def set(self, url: str, formatted_html: str, quiz_questions: list):
        self.cache[url] = CacheEntry(
            formatted_html=formatted_html,
            quiz_questions=quiz_questions,
            timestamp=datetime.now()
        )

url_cache = URLCache()

@app.post("/process-url", response_model=ProcessedContent)
async def process_url(request: UrlRequest):
    try:
        cached_content = url_cache.get(request.url)
        if cached_content:
            print(f"Cache hit for URL: {request.url}")
            content_store.last_content = cached_content.formatted_html  # For PDF generation
            content_store.formatted_html = cached_content.formatted_html
            return ProcessedContent(
                markdownContent=cached_content.formatted_html,
                quiz_questions=cached_content.quiz_questions
            )

        print(f"Cache miss for URL: {request.url}")
        raw_content = scrape_url(request.url)
        content_store.last_content = raw_content
        
        truncated_content_markdown = truncate_text(raw_content, max_tokens=4000)
        truncated_content_quiz = truncate_text(raw_content, max_tokens=2000)
        
        markdown_prompt = f"""
        You are a content formatting assistant. Convert the following raw text into clean, well-structured HTML for a tutorial page. 

        **Instructions**:
        - Extract only the tutorial-related content while ignoring irrelevant elements such as login prompts, navigation bars, or advertisements.
        - Use semantic HTML tags:
        - `<h1>` for the main title.
        - `<h2>` for subtitles.
        - `<p>` for paragraphs.
        - `<a>` for links (retain meaningful labels and URLs).
        - `<img>` for images (if relevant to the tutorial content).
        
        Ensure the HTML is semantic and visually appealing.

        **Raw text**:
        {truncated_content_markdown}

        **Output**:
        """

        
        try:
            formatted_html = query_llm_model(markdown_prompt)
        except Exception as e:
            if "rate_limit_exceeded" in str(e):
                truncated_content_markdown = truncate_text(raw_content, max_tokens=3000)
                formatted_html = query_llm_model(markdown_prompt)
            else:
                raise e
        
        content_store.formatted_html = formatted_html
        
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

        # Store in cache before returning
        url_cache.set(
            url=request.url,
            formatted_html=formatted_html,
            quiz_questions=quiz_questions
        )

        return ProcessedContent(
            markdownContent=formatted_html,
            quiz_questions=quiz_questions
        )
    
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
        
class PDF(FPDF):
    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, align='C')

def clean_text(text: str) -> str:
    """Clean text by replacing special characters with ASCII equivalents"""
    replacements = {
        '—': '-',  # em dash
        '–': '-',  # en dash
        '"': '"',  # curly quotes
        '"': '"',
        ''': "'",
        ''': "'",
        '…': '...',
        '•': '-',
        '→': '->',
        '←': '<-',
        '≈': '~',
        '≤': '<=',
        '≥': '>=',
        '×': 'x',
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

@app.get("/generate-pdf")
async def generate_pdf():
    try:
        if not content_store.formatted_html:
            raise HTTPException(status_code=404, detail="No content found. Please process a URL first.")
        
        summary_prompt = f"""
        Create a concise study summary of the following content. Include:
        1. Main topic and brief overview
        2. Key points and concepts (3-5 bullet points)
        3. Important details and explanations
        4. Conclusion or main takeaways

        Format the output with clear section headers and bullet points.
        Use only ASCII characters (no special characters).

        Content to summarize:
        {content_store.formatted_html}

        Keep the summary focused and highlight the most important information.
        Use simple bullet points (-) instead of special characters.
        """

        try:
            summary_content = query_llm_model(summary_prompt)
        except Exception as e:
            print(f"Summary generation error: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to generate summary")

        # Clean the summary content
        summary_content = clean_text(summary_content)
        summary_content = ''.join(char for char in summary_content if ord(char) < 128)

        # Create PDF
        pdf = PDF()
        pdf.add_page()
        pdf.set_margins(20, 20, 20)
        
        # Add content
        pdf.set_font('Helvetica', '', 12)
        
        # Process content line by line
        for line in summary_content.split('\n'):
            line = line.strip()
            if not line:
                pdf.ln(5)
                continue
                
            if line.startswith('#'):
                pdf.set_font('Helvetica', 'B', 14)
                pdf.write(8, line.replace('#', '').strip() + '\n')
                pdf.ln(5)
            elif line.startswith('•') or line.startswith('-'):
                pdf.set_font('Helvetica', '', 12)
                pdf.set_x(30)
                pdf.write(8, '- ' + line.strip('•- ').strip() + '\n')
            else:
                pdf.set_font('Helvetica', '', 12)
                pdf.set_x(20)
                pdf.write(8, line + '\n')

        # Get PDF as bytes
        try:
            pdf_content = pdf.output(dest='S').encode('latin-1')
            pdf_buffer = io.BytesIO(pdf_content)
        except Exception as e:
            print(f"PDF encoding error: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to generate PDF")

        filename = f"studylore_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
        
    except Exception as e:
        print(f"PDF generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
        
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)