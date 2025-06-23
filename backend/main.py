from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from login.router import router as login_router            
from analysis.routes import router as analysis_router    

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",       
        "http://13.239.184.39:5173"     
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
