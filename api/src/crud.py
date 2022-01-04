from sqlalchemy.orm import Session
from sqlalchemy.util.langhelpers import md5_hex

from src import models, schemas


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


def read_bookings(db: Session):
    return db.query(models.Bookings).all()


def update_booking(db: Session, old_booking: schemas.BookingCreate, new_booking: schemas.BookingCreate):
    find_booking = db.query(models.Bookings).filter(
        models.Bookings.owner == old_booking.owner,
        models.Bookings.start_date == old_booking.start_date,
        models.Bookings.end_date == old_booking.end_date
    ).first()

    find_booking.owner = new_booking.owner
    find_booking.title = new_booking.title
    find_booking.description = new_booking.description
    find_booking.start_date = new_booking.start_date
    find_booking.end_date = new_booking.end_date
    find_booking.approved = new_booking.approved

    db.commit()
    return new_booking


def delete_booking(db: Session, booking: schemas.BookingCreate):
    db.query(models.Bookings).filter(
        models.Bookings.owner == booking.owner,
        models.Bookings.start_date == booking.start_date,
        models.Bookings.end_date == booking.end_date,
        models.Bookings.description == booking.description
    ).delete()

    db.commit()
    return booking
