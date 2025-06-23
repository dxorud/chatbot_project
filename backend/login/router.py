from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from login.models import User
from login.schemas import UserCreate, UserLogin

router = APIRouter()

# ✅ 회원가입
@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # 아이디 중복 확인
    db_username = db.query(User).filter(User.username == user.username).first()
    if db_username:
        raise HTTPException(status_code=400, detail="이미 존재하는 아이디입니다.")

    # 이메일 중복 확인
    db_email = db.query(User).filter(User.email == user.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="이미 등록된 이메일입니다.")

    # 유저 생성 (실제 서비스에서는 비밀번호를 hash 처리해야 함)
    new_user = User(
        username=user.username,
        name=user.name,
        email=user.email,
        password=user.password  # ⚠️ 보안상 실제로는 해시처리 필요
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "회원가입이 완료되었습니다."}

# ✅ 로그인
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()

    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=401, detail="아이디 또는 비밀번호가 잘못되었습니다.")

    return {
        "token": "dummy_token",  
        "user": {
            "name": db_user.name,
            "username": db_user.username
        }
    }
