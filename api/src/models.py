from sqlalchemy import Boolean, Column, DateTime, Integer, String

from .database import Base


class Bookings(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    owner = Column(String)
    title = Column(String)
    description = Column(String, default=True)
    start_date = Column(DateTime, default=True)
    end_date = Column(DateTime, default=True)
    approved = Column(Boolean, default=True)
