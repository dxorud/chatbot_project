from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str
