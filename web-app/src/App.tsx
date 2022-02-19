import { useState, useEffect } from "react";
import "./App.css";
import { MainPage } from "./pages/MainPage";
import { BookingPage } from "./pages/BookingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ModalProvider from "mui-modal-provider";

export interface CalendarEvent {
  allDay?: boolean | undefined;
  title?: React.ReactNode | undefined;
  start?: Date | undefined;
  end?: Date | undefined;
  resource?: any;
  owner: "Jack" | "Charlie" | "Lily" | "M & D" | "Other";
  description: string;
  approved: boolean;
}

export interface ApiCalendarEvent {
  start_date: Date;
  end_date: Date;
  title: string;
  description: string;
  owner: "Jack" | "Charlie" | "Lily" | "M & D" | "Other";
  approved: boolean;
}

const convertToCalendarEvents = (events: ApiCalendarEvent[]) => {
  if (events.length > 0) {
    return events.map((event) => {
      return {
        start: event.start_date,
        end: event.end_date,
        owner: event.owner,
        title: event.title,
        description: event.description,
        approved: event.approved,
      };
    });
  }
};

function App() {
  const [events, setEvents] = useState<CalendarEvent[] | undefined>(undefined);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL!}/readBookings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data: ApiCalendarEvent[]) => {
        const events = convertToCalendarEvents(data);
        setEvents(events);
      });
  }, []);

  return (
    <BrowserRouter>
      <ModalProvider>
        <Routes>
          <Route path="/" element={<MainPage events={events} />} />
          <Route path="/bookings" element={<BookingPage />} />
        </Routes>
      </ModalProvider>
    </BrowserRouter>
  );
}

export default App;
