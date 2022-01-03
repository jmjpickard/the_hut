from sqlalchemy.orm import Session

from . import models, schemas


def create_booking(db: Session, booking: schemas.BookingCreate):
    new_booking = models.Bookings(
        owner=booking.owner,
        title=booking.title,
        description=booking.description,
        start_date=booking.start_date,
        end_date=booking.end_date,
        approved=booking.approved)
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking
