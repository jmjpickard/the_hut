import requests
from typing import List

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from src.config import get_config
from src.logger import logger

from src import crud, models, schemas
from src.database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(host='0.0.0.0', port=80, debug=True)

# Dependency


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    logger.info('app runnning')
    return {"message": "pong"}


@app.post("/createBooking", response_model=schemas.BookingBase)
async def create_user(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    logger.info({"message": f"creating booking {booking}"})
    return crud.create_booking(db=db, booking=booking)


@app.get("/readBookings", response_model=List[schemas.BookingBase])
async def read_bookings(db: Session = Depends(get_db)):
    logger.info('reading bookings')
    bookings = crud.read_bookings(db=db)
    return bookings


@app.put("/updateBooking", response_model=schemas.BookingBase)
async def update_booking(old_booking: schemas.BookingCreate,
                         new_booking: schemas.BookingCreate,
                         db: Session = Depends(get_db)):
    logger.info('update booking')
    return crud.update_booking(db=db, old_booking=old_booking, new_booking=new_booking)


@app.delete("/deleteBooking", response_model=schemas.BookingBase)
async def delete_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    logger.info('delete booking')
    return crud.delete_booking(db=db, booking=booking)


@app.post("/login")
async def resolve_login(login: schemas.LoginBody):
    logger.info(f'User {login.email} logged in')
    config = get_config()

    headers = {
        "content-type": "application/x-www-form-urlencoded",
    }

    data = {
        "grant_type": "password",
        "username": login.email,
        "password": login.password,
        "audience": config['auth_audience'],
        "scope": "openid",
        "client_id": config["auth_client_id"],
        "client_secret": config["auth_client_secret"],
    }

    url = f'{config["auth_domain"]}/oauth/token'
    res = requests.post(url, headers=headers, data=data)

    json_response = res.json()

    if res.status_code == 200 and json_response["access_token"]:
        return {
            "accessToken": json_response["access_token"],
            "idToken": json_response["id_token"],
        }

    raise Exception(f"Failed login: {json_response['error_description']}")
