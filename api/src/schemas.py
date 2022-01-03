from datetime import datetime
from pydantic import BaseModel


class BookingBase(BaseModel):
    owner: str
    title: str
    description: str
    start_date: datetime
    end_date: datetime
    approved: bool


class BookingCreate(BookingBase):
    pass
