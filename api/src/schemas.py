from datetime import datetime
from pydantic import BaseModel


class BookingBase(BaseModel):
    owner: str
    title: str
    description: str
    start_date: datetime
    end_date: datetime
    approved: bool

    class Config:
        orm_mode = True


class BookingCreate(BookingBase):
    pass


class LoginBody(BaseModel):
    email: str
    password: str
