from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import User
from schemas import UserCreate, UserLogin
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB 테이블 생성
Base.metadata.create_all(bind=engine)

# DB 세션 관리
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 회원가입 API
@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_username = db.query(User).filter(User.username == user.username).first()
    db_email = db.query(User).filter(User.email == user.email).first()

    if db_username:
        raise HTTPException(status_code=400, detail="Username already exists")
    if db_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        username=user.username,
        name=user.name,
        email=user.email,
        password=user.password  # ✅ password 컬럼 사용
    )
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}

# 로그인 API
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "Login successful"}

# 헬스 체크
@app.get("/")
def health_check():
    return {"status": "Emotion FastAPI Server Running!"}

# 로컬 실행
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
