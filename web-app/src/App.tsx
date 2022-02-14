// import { useState } from "react";
import { useState, useEffect } from "react";
import { NavBar } from "./components/NavBar";
import { HomePage } from "./components/HomePage";
import { CalendarCard } from "./components/Calendar";
import { BottomBar } from "./components/BottomBar";
import ModalProvider from "mui-modal-provider";

export interface ViewProps {
  view: string;
}

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
  const token = localStorage.getItem("token");
  const view = token ? "calendar" : "home";

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
    <>
      <ModalProvider>
        <NavBar view={view} />
        <HomePage view={view} />
        {token && (
          <>
            <CalendarCard events={events} />
            <BottomBar />
          </>
        )}
      </ModalProvider>
    </>
  );
}

export default App;
