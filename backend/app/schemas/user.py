from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.user import UserRole


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str
    role: UserRole
    coach_id: Optional[int] = None


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None
    coach_id: Optional[int] = None
    role: Optional[UserRole] = None


class UserInDB(UserBase):
    id: int
    role: UserRole
    is_active: bool
    coach_id: Optional[int] = None

    class Config:
        from_attributes = True


class User(UserInDB):
    pass


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[UserRole] = None


class PasswordReset(BaseModel):
    email: EmailStr


class PasswordUpdate(BaseModel):
    token: str
    new_password: str
