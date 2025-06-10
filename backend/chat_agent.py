from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
import pandas as pd

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Set your OpenAI API key here or via environment variable

app = FastAPI()

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

def get_dashboard_data_summary():
    try:
        df = pd.read_excel('data.xlsx')
        summary = df.describe(include='all').to_string()
        return summary
    except Exception as e:
        return f"[Error reading data: {e}]"

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    dashboard_summary = get_dashboard_data_summary()
    system_prompt = (
        "You are an AI assistant for a business dashboard. Here is the current dashboard data from Excel:\n"
        f"{dashboard_summary}\n"
        "Answer user questions using only this data. If the question is outside this data, reply that the information is not available."
    )
    user_message = request.message
    response = client.chat.completions.create(model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message}
    ])
    answer = response.choices[0].message.content.strip()
    return {"answer": answer} 