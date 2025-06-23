from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from login.router import router as login_router            
from analysis.routes import router as analysis_router    

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8506",       
        "http://13.239.184.39:8506"     
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(login_router, prefix="/auth")           
app.include_router(analysis_router, prefix="/analysis")   

@app.get("/")
def health_check():
    return {"status": "Emotion FastAPI Server Running!"}
