import { useState, useEffect } from "react";
import { NavBar } from "../components/NavBar";
import { CalendarEvent } from "../App";
import { useWindowSize } from "../hooks/window";
import { getBookings } from "../http/bookings";
import styles from "../components/styles.module.scss";
import { NewCalendar } from "../components/NewCalendar/newCalendar";
import { UpcomingEvents } from "../components/UpcomingEvents/UpcomingEvents";
import { Login } from "../components/Login";

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
  const view = token ? "calendar" : "calendar";
  const [width] = useWindowSize();
  useEffect(() => {
    getBookings().then((res: ApiCalendarEvent[]) => {
      const eventData = convertToCalendarEvents(res);
      setEvents(eventData);
    });
  }, []);

  return (
    <div className={styles.container}>
      <NavBar view={view} width={width} />
      {token ? (
        <div className={styles.card}>
          <div className={styles.calendar}>
            <NewCalendar events={events} />
          </div>
          <UpcomingEvents />
        </div>
      ) : (
        <Login message="" />
      )}
    </div>
  );
};
