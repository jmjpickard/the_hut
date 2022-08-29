import { useState, useEffect } from "react";
import { NavBar } from "../components/NavBar";
import { HomePage } from "../components/HomePage";
import { CalendarCard } from "../components/Calendar";
import { BottomBar } from "../components/BottomBar";
import { CalendarEvent } from "../App";
import { useWindowSize } from "../hooks/window";
import { getBookings } from "../http/bookings";

export interface ViewProps {
  view: "home" | "calendar";
  width: number;
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

export const MainPage = () => {
  const [events, setEvents] = useState<CalendarEvent[] | undefined>();
  const token = localStorage.getItem("token");
  const view = token ? "calendar" : "home";
  const [width] = useWindowSize();

  useEffect(() => {
    getBookings().then((res: ApiCalendarEvent[]) => {
      const eventData = convertToCalendarEvents(res);
      setEvents(eventData);
    });
  }, []);

  return (
    <>
      <NavBar view={view} width={width} />
      <HomePage view={view} width={width} />
      {token && (
        <>
          <CalendarCard events={events} width={width} />
          <BottomBar width={width} />
        </>
      )}
    </>
  );
};
