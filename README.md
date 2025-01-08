# studylore

Studylore is a web application designed to transform online tutorials and articles into distraction-free, interactive study materials. It helps learners maintain flow state by removing advertisements and poor design elements while providing active learning features.

## Features

- **Clean Interface**: Converts web content into a distraction-free reading experience
- **Interactive Learning**: 
  - Automatically generated quiz questions
  - Note-taking functionality
  - PDF summary generation
- **Dark/Light Mode**: Comfortable reading experience in any lighting condition
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python
- **AI Integration**: GROQ API for fast LLM inference (llama-3.1-70b)
- **Content Processing**: Jina Reader API for intelligent web content extraction

## Prerequisites

Before setting up the project, you'll need:

1. [GROQ API Key](https://console.groq.com/)
2. [JINA AI API Key](https://jina.ai/)
3. Node.js (v18 or higher)
4. Python 3.11 or higher
5. Docker and Docker Compose (optional)

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/IremOztimur/studylore.git
cd studylore
```

### 2. Environment Configuration

Create a `.env` file in the root directory: 
```
GROQ_API_KEY=your_groq_api_key_here
JINA_API_KEY=your_jina_api_key_here
```

### 3. Choose Your Setup Method

#### Option A: Using Docker (Recommended)

1. Build and run the containers:
```bash
docker-compose up --build
```

2. Access the application at `http://localhost:3000`

#### Option B: Manual Setup

1. Frontend Setup:
```bash
cd front-end
npm install
npm run dev
```

2. Backend Setup:
```bash
cd back-end
make virtual # creates virtual environment and installs all python packages
python main.py
```

## Usage

1. Visit `http://localhost:3000`
2. Paste a tutorial URL into the input field
3. Wait for the content to be processed
4. Enjoy your distraction-free study experience with:
   - Clean, formatted content
   - Auto-generated quiz questions
   - Note-taking capability
   - Downloadable PDF summary

## API Endpoints

- `POST /process-url`: Processes a URL and returns formatted content with quiz questions
- `GET /generate-pdf`: Generates and returns a PDF summary

## Quick Demo
https://github.com/user-attachments/assets/f3121166-3268-4af6-b052-b76391c22634


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- GROQ for providing the LLM API
- JINA AI for content processing capabilities
- All contributors and users of StudyLore 
