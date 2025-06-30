from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import json
import os

app = FastAPI()

# CORS settings - allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory to save resumes
SAVE_DIR = "saved_resumes"
os.makedirs(SAVE_DIR, exist_ok=True)

# ------------------------------
# Pydantic Models
# ------------------------------

class AIEnhanceRequest(BaseModel):
    section: str
    content: str

class SaveResumeRequest(BaseModel):
    resume: dict

# ------------------------------
# Routes
# ------------------------------

@app.post("/ai-enhance")
async def enhance_with_ai(req: AIEnhanceRequest):
    # Simulate AI-enhanced content
    improved = f"{req.content.strip()} (Enhanced ✨)"
    return {"improved": improved}

@app.post("/save-resume")
async def save_resume(req: SaveResumeRequest):
    filename = f"{uuid.uuid4()}.json"
    filepath = os.path.join(SAVE_DIR, filename)
    try:
        with open(filepath, "w") as f:
            json.dump(req.resume, f, indent=2)
        return {"message": "Resume saved successfully", "filename": filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download-resume/{filename}")
async def download_resume(filename: str):
    filepath = os.path.join(SAVE_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")
    with open(filepath, "r") as f:
        content = json.load(f)
    return content